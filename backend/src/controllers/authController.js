import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/authService.js";

import {
  AUTH,
  COOKIE_OPTIONS,
} from "../utils/constants.js";

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(AUTH.ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie(AUTH.REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge:
      AUTH.REFRESH_TOKEN_DAYS *
      24 *
      60 *
      60 *
      1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie(
    AUTH.ACCESS_TOKEN_COOKIE,
    COOKIE_OPTIONS,
  );

  res.clearCookie(
    AUTH.REFRESH_TOKEN_COOKIE,
    COOKIE_OPTIONS,
  );
};

/**
 * REGISTER
 */
export const register = async (req, res, next) => {
  try {
    const {
      email,
      phone,
      password,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      nationality,
      country,
      state,
      stateProvince,
      city,
      address,
      addressLine2,
      postalCode,
      accountType,
      currency,
    } = req.validated.body;

    const result = await registerUser({
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
      state: state || stateProvince,
      city,
      address,
      addressLine2,
      postalCode,

      // Account configuration
      accountType,
      currency,

      // Request metadata
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return res.status(201).json({
      success: true,
      message:
        "The Chaplaincy Savings And Credit Union account created successfully",
      data: {
        user: result.user,
        account: result.account,
        wallet: result.wallet,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * LOGIN
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;

    const result = await loginUser({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * REFRESH ACCESS TOKEN
 */
export const refresh = async (req, res) => {
  const refreshToken =
    req.cookies?.[AUTH.REFRESH_TOKEN_COOKIE];

  if (!refreshToken) {
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      code: "REFRESH_TOKEN_MISSING",
      message: "Refresh token cookie is missing.",
    });
  }

  try {
    const result = await refreshAccessToken(refreshToken);

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return res.status(200).json({
      success: true,
      message: "Authentication refreshed",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    // Never log the refresh token or cookie value.
    console.error(
      "The Chaplaincy Savings and Credit Union refresh failed:",
      {
        message: error?.message,
        statusCode: error?.statusCode,
        errorName: error?.name,
      },
    );

    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      code: "REFRESH_SESSION_INVALID",
      message:
        "Your session could not be refreshed. Please sign in again.",
    });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.[AUTH.REFRESH_TOKEN_COOKIE];

    await logoutUser(refreshToken);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
};