
import crypto from "crypto";

import prisma from "../config/database.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/jwt.js";

import {
  AUTH,
  ACCOUNT,
} from "../utils/constants.js";

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

const createServiceError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  if (!user) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const normalizePhone = (phone) => {
  const value = String(phone || "").trim();
  return value || null;
};

const normalizeName = (value) =>
  String(value || "").trim();

const normalizeAccountType = (value) =>
  String(value || "").trim().toUpperCase();

const ALLOWED_ACCOUNT_TYPES = new Set([
  "SAVINGS",
  "CURRENT",
  "NON_RESIDENT",
  "DOMICILIARY",
  "BUSINESS",
]);

const getRefreshExpiry = () =>
  new Date(
    Date.now() +
      AUTH.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

/*
 * ============================================================
 * ACCOUNT NUMBER
 * ============================================================
 */

const generateAccountNumber = async (tx) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const accountNumber = crypto
      .randomInt(100000000000, 999999999999)
      .toString();

    const existing = await tx.account.findUnique({
      where: { accountNumber },
      select: { id: true },
    });

    if (!existing) return accountNumber;
  }

  throw createServiceError(
    "Unable to generate a unique account number. Please try again.",
    500,
  );
};

/*
 * ============================================================
 * REFRESH SESSION CREATION
 * ============================================================
 */

const createRefreshSession = async ({
  tx,
  userId,
  refreshToken,
  ipAddress,
  userAgent,
}) => {
  return tx.securitySession.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt: getRefreshExpiry(),
    },
  });
};

/*
 * ============================================================
 * REGISTER USER
 * ============================================================
 */

export const registerUser = async ({
  email,
  phone,
  password,
  firstName,
  lastName,
  country,
  accountType,
  ipAddress,
  userAgent,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const normalizedFirstName = normalizeName(firstName);
  const normalizedLastName = normalizeName(lastName);
  const normalizedCountry = String(country || "").trim() || null;
  const normalizedAccountType = normalizeAccountType(accountType);

  if (!normalizedEmail) {
    throw createServiceError("Email address is required.", 400);
  }

  if (!normalizedFirstName) {
    throw createServiceError("First name is required.", 400);
  }

  if (!normalizedLastName) {
    throw createServiceError("Last name is required.", 400);
  }

  if (!password) {
    throw createServiceError("Password is required.", 400);
  }

  if (String(password).length < 10) {
    throw createServiceError(
      "Password must be at least 10 characters long.",
      400,
    );
  }

  if (!normalizedAccountType) {
    throw createServiceError(
      "Please select an account type.",
      400,
    );
  }

  if (!ALLOWED_ACCOUNT_TYPES.has(normalizedAccountType)) {
    throw createServiceError(
      "The selected account type is invalid.",
      400,
    );
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingEmail) {
    throw createServiceError(
      "An account with this email address already exists.",
      409,
    );
  }

  if (normalizedPhone) {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
      select: { id: true },
    });

    if (existingPhone) {
      throw createServiceError(
        "An account with this phone number already exists.",
        409,
      );
    }
  }

  const passwordHash = await hashPassword(password);
  const refreshToken = generateRefreshToken();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          phone: normalizedPhone,
          passwordHash,
          status: "ACTIVE",
          role: "CUSTOMER",
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
          country: normalizedCountry,

          // Record the customer's residency classification.
          residencyStatus:
            normalizedAccountType === "NON_RESIDENT"
              ? "NON_RESIDENT"
              : "RESIDENT",
        },
      });

      await tx.kyc.create({
        data: {
          userId: user.id,
          status: "NOT_STARTED",
        },
      });

      const currency = await tx.currency.upsert({
        where: { code: ACCOUNT.DEFAULT_CURRENCY },
        update: {},
        create: {
          code: ACCOUNT.DEFAULT_CURRENCY,
          name: "US Dollar",
          symbol: "$",
          decimals: 2,
          isActive: true,
        },
      });

      const accountNumber = await generateAccountNumber(tx);

      const account = await tx.account.create({
        data: {
          accountNumber,

          // Use the account type selected during registration.
          type: normalizedAccountType,

          status: "ACTIVE",
          userId: user.id,
          currencyId: currency.id,
          balance: 0,
          availableBalance: 0,
          ledgerBalance: 0,
        },
        include: { currency: true },
      });

      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          currencyId: currency.id,
          type: "FIAT",
          balance: 0,
        },
        include: { currency: true },
      });

      await tx.investmentAccount.create({
        data: {
          userId: user.id,
          cashBalance: 0,
          totalValue: 0,
          profitLoss: 0,
        },
      });

      await createRefreshSession({
        tx,
        userId: user.id,
        refreshToken,
        ipAddress,
        userAgent,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE",
          entity: "User",
          entityId: user.id,
          description: `Customer account created with ${normalizedAccountType} account type`,
          ipAddress: ipAddress || null,
        },
      });

      return { user, account, wallet };
    });

    return {
      accessToken: generateAccessToken(result.user),
      refreshToken,
      user: sanitizeUser(result.user),
      account: result.account,
      wallet: result.wallet,
    };
  } catch (error) {
    if (error?.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.map(String)
        : [String(error.meta?.target || "")];

      if (target.some((field) => field.includes("email"))) {
        throw createServiceError(
          "An account with this email address already exists.",
          409,
        );
      }

      if (target.some((field) => field.includes("phone"))) {
        throw createServiceError(
          "An account with this phone number already exists.",
          409,
        );
      }

      if (target.some((field) => field.includes("accountNumber"))) {
        throw createServiceError(
          "Unable to create a unique bank account number. Please try again.",
          500,
        );
      }

      throw createServiceError(
        "Some of the supplied account information is already in use.",
        409,
      );
    }

    if (error?.statusCode) throw error;

    console.error("registerUser transaction failed:", error);

    throw createServiceError(
      "Unable to create your account right now. Please try again.",
      500,
    );
  }
};

/*
 * ============================================================
 * LOGIN USER
 * ============================================================
 */

export const loginUser = async ({
  email,
  password,
  ipAddress,
  userAgent,
}) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw createServiceError("Email address is required.", 400);
  }

  if (!password) {
    throw createServiceError("Password is required.", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw createServiceError("Invalid email or password.", 401);
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createServiceError("Invalid email or password.", 401);
  }

  if (user.status !== "ACTIVE") {
    throw createServiceError(
      "This account is unavailable or not active.",
      403,
    );
  }

  const refreshToken = generateRefreshToken();

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createRefreshSession({
      tx,
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
    });

    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        description: "Successful customer login",
        ipAddress: ipAddress || null,
      },
    });

    return updatedUser;
  });

  return {
    accessToken: generateAccessToken(result),
    refreshToken,
    user: sanitizeUser(result),
  };
};

/*
 * ============================================================
 * REFRESH ACCESS TOKEN
 * ============================================================
 *
 * Atomically claims the existing session before issuing a
 * replacement token. Only one concurrent request can claim
 * the same active session.
 * ============================================================
 */

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createServiceError("Refresh token required.", 401);
  }

  const tokenHash = hashToken(refreshToken);

  const session = await prisma.securitySession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) {
    throw createServiceError("Invalid refresh session.", 401);
  }

  if (session.revokedAt) {
    throw createServiceError(
      "Refresh session has been revoked.",
      401,
    );
  }

  if (session.expiresAt <= new Date()) {
    throw createServiceError(
      "Refresh session has expired.",
      401,
    );
  }

  if (session.user.status !== "ACTIVE") {
    throw createServiceError("Account is not active.", 403);
  }

  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashToken(newRefreshToken);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    // Conditional update: if another request already revoked
    // this session, count is zero and this request must fail.
    const claimed = await tx.securitySession.updateMany({
      where: {
        id: session.id,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: {
        revokedAt: now,
        lastUsedAt: now,
      },
    });

    if (claimed.count !== 1) {
      throw createServiceError(
        "Refresh session has already been used. Please sign in again.",
        401,
      );
    }

    await tx.securitySession.create({
      data: {
        userId: session.userId,
        tokenHash: newTokenHash,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        expiresAt: getRefreshExpiry(),
      },
    });

    return session.user;
  });

  return {
    accessToken: generateAccessToken(result),
    refreshToken: newRefreshToken,
    user: sanitizeUser(result),
  };
};

/*
 * ============================================================
 * LOGOUT USER
 * ============================================================
 */

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  const tokenHash = hashToken(refreshToken);

  await prisma.securitySession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};