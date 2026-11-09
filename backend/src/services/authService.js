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

const normalizeOptionalText = (value) =>
  String(value || "").trim() || null;

const normalizeAccountType = (value) =>
  String(value || "").trim().toUpperCase();

const normalizeCurrency = (value) =>
  String(value || ACCOUNT.DEFAULT_CURRENCY)
    .trim()
    .toUpperCase();

const ALLOWED_ACCOUNT_TYPES = new Set([
  "SAVINGS",
  "CURRENT",
  "NON_RESIDENT",
  "DOMICILIARY",
  "BUSINESS",
  "ESCROW",
]);

const getRefreshExpiry = () =>
  new Date(
    Date.now() +
      AUTH.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

/*
 * ============================================================
 * DATE OF BIRTH VALIDATION
 * ============================================================
 */

const normalizeDateOfBirth = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createServiceError(
      "Please provide a valid date of birth.",
      400,
    );
  }

  if (date >= new Date()) {
    throw createServiceError(
      "Date of birth must be in the past.",
      400,
    );
  }

  return date;
};

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

  // Personal information
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  nationality,

  // Residential address
  country,
  state,
  stateProvince,
  city,
  address,
  addressLine2,
  postalCode,

  // Account configuration
  accountType,
  currency,

  // Request metadata
  ipAddress,
  userAgent,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  const normalizedFirstName = normalizeName(firstName);
  const normalizedMiddleName = normalizeOptionalText(middleName);
  const normalizedLastName = normalizeName(lastName);

  const normalizedDateOfBirth =
    normalizeDateOfBirth(dateOfBirth);

  const normalizedNationality =
    normalizeOptionalText(nationality);

  const normalizedCountry =
    normalizeOptionalText(country);

  const normalizedState =
    normalizeOptionalText(state || stateProvince);

  const normalizedCity =
    normalizeOptionalText(city);

  const normalizedAddress =
    normalizeOptionalText(address);

  const normalizedAddressLine2 =
    normalizeOptionalText(addressLine2);

  const normalizedPostalCode =
    normalizeOptionalText(postalCode);

  const normalizedAccountType =
    normalizeAccountType(accountType);

  const normalizedCurrency =
    normalizeCurrency(currency);

  /*
   * ----------------------------------------------------------
   * REQUIRED FIELD VALIDATION
   * ----------------------------------------------------------
   */

  if (!normalizedEmail) {
    throw createServiceError(
      "Email address is required.",
      400,
    );
  }

  if (!normalizedFirstName) {
    throw createServiceError(
      "First name is required.",
      400,
    );
  }

  if (!normalizedLastName) {
    throw createServiceError(
      "Last name is required.",
      400,
    );
  }

  if (!password) {
    throw createServiceError(
      "Password is required.",
      400,
    );
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

  if (!normalizedCurrency) {
    throw createServiceError(
      "Please select an account currency.",
      400,
    );
  }

  /*
   * ----------------------------------------------------------
   * CHECK EXISTING EMAIL
   * ----------------------------------------------------------
   */

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

  /*
   * ----------------------------------------------------------
   * CHECK EXISTING PHONE
   * ----------------------------------------------------------
   */

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

  /*
   * ----------------------------------------------------------
   * PASSWORD AND REFRESH TOKEN
   * ----------------------------------------------------------
   */

  const passwordHash = await hashPassword(password);
  const refreshToken = generateRefreshToken();

  try {
    const result = await prisma.$transaction(async (tx) => {
      /*
       * ------------------------------------------------------
       * CREATE USER
       * ------------------------------------------------------
       */

      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          phone: normalizedPhone,
          passwordHash,
          status: "ACTIVE",
          role: "CUSTOMER",
        },
      });

      /*
       * ------------------------------------------------------
       * CREATE CUSTOMER PROFILE
       * ------------------------------------------------------
       */

      await tx.profile.create({
        data: {
          userId: user.id,

          firstName: normalizedFirstName,
          middleName: normalizedMiddleName,
          lastName: normalizedLastName,

          dateOfBirth: normalizedDateOfBirth,
          nationality: normalizedNationality,

          country: normalizedCountry,
          state: normalizedState,
          city: normalizedCity,

          address: normalizedAddress,
          addressLine2: normalizedAddressLine2,
          postalCode: normalizedPostalCode,

          // Record the customer's residency classification.
          residencyStatus:
            normalizedAccountType === "NON_RESIDENT"
              ? "NON_RESIDENT"
              : "RESIDENT",
        },
      });

      /*
       * ------------------------------------------------------
       * CREATE KYC RECORD
       * ------------------------------------------------------
       */

      await tx.kyc.create({
        data: {
          userId: user.id,
          status: "NOT_STARTED",
        },
      });

      /*
       * ------------------------------------------------------
       * VALIDATE SELECTED CURRENCY
       * ------------------------------------------------------
       *
       * The selected currency must already exist in the
       * Currency table and must be active.
       *
       * Do not silently create unsupported currencies.
       * ------------------------------------------------------
       */

      const selectedCurrency = await tx.currency.findUnique({
        where: {
          code: normalizedCurrency,
        },
      });

      if (!selectedCurrency) {
        throw createServiceError(
          `The selected currency (${normalizedCurrency}) is not configured. Please select an available currency.`,
          400,
        );
      }

      if (!selectedCurrency.isActive) {
        throw createServiceError(
          `The selected currency (${normalizedCurrency}) is currently unavailable.`,
          400,
        );
      }

      /*
       * ------------------------------------------------------
       * GENERATE ACCOUNT NUMBER
       * ------------------------------------------------------
       */

      const accountNumber = await generateAccountNumber(tx);

      /*
       * ------------------------------------------------------
       * CREATE BANK ACCOUNT
       * ------------------------------------------------------
       */

      const account = await tx.account.create({
        data: {
          accountNumber,

          // Account type selected during registration.
          type: normalizedAccountType,

          status: "ACTIVE",
          userId: user.id,

          // Use the selected currency.
          currencyId: selectedCurrency.id,

          balance: 0,
          availableBalance: 0,
          ledgerBalance: 0,
        },
        include: {
          currency: true,
        },
      });

      /*
       * ------------------------------------------------------
       * CREATE CUSTOMER WALLET
       * ------------------------------------------------------
       */

      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          currencyId: selectedCurrency.id,
          type: "FIAT",
          balance: 0,
        },
        include: {
          currency: true,
        },
      });

      /*
       * ------------------------------------------------------
       * CREATE INVESTMENT ACCOUNT
       * ------------------------------------------------------
       */

      await tx.investmentAccount.create({
        data: {
          userId: user.id,
          cashBalance: 0,
          totalValue: 0,
          profitLoss: 0,
        },
      });

      /*
       * ------------------------------------------------------
       * CREATE REFRESH SESSION
       * ------------------------------------------------------
       */

      await createRefreshSession({
        tx,
        userId: user.id,
        refreshToken,
        ipAddress,
        userAgent,
      });

      /*
       * ------------------------------------------------------
       * CREATE AUDIT LOG
       * ------------------------------------------------------
       */

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "CREATE",
          entity: "User",
          entityId: user.id,
          description:
            `Customer account created with ${normalizedAccountType} account type and ${normalizedCurrency} currency`,
          ipAddress: ipAddress || null,
        },
      });

      return {
        user,
        account,
        wallet,
      };
    });

    return {
      accessToken: generateAccessToken(result.user),
      refreshToken,

      user: sanitizeUser(result.user),
      account: result.account,
      wallet: result.wallet,
    };
  } catch (error) {
    /*
     * --------------------------------------------------------
     * PRISMA UNIQUE CONSTRAINT ERRORS
     * --------------------------------------------------------
     */

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

    if (error?.statusCode) {
      throw error;
    }

    console.error(
      "registerUser transaction failed:",
      error,
    );

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
    throw createServiceError(
      "Email address is required.",
      400,
    );
  }

  if (!password) {
    throw createServiceError(
      "Password is required.",
      400,
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw createServiceError(
      "Invalid email or password.",
      401,
    );
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createServiceError(
      "Invalid email or password.",
      401,
    );
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
      data: {
        lastLoginAt: new Date(),
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
 *
 * ============================================================
 */

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createServiceError(
      "Refresh token required.",
      401,
    );
  }

  const tokenHash = hashToken(refreshToken);

  const session = await prisma.securitySession.findUnique({
    where: { tokenHash },
    include: {
      user: true,
    },
  });

  if (!session) {
    throw createServiceError(
      "Invalid refresh session.",
      401,
    );
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
    throw createServiceError(
      "Account is not active.",
      403,
    );
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
        expiresAt: {
          gt: now,
        },
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