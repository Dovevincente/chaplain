export const AUTH = {
  ACCESS_TOKEN_COOKIE: "TCSCU_access",
  REFRESH_TOKEN_COOKIE: "TCSCU_refresh",
  REFRESH_TOKEN_DAYS: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  PASSWORD_MIN_LENGTH: 10,
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,                 // Must be true when sameSite is "none"
  sameSite: "none",             // Required for Vercel ↔ Render
  path: "/",
  // Do NOT set domain while using vercel.app + onrender.com
};

export const ACCOUNT = {
  DEFAULT_CURRENCY: "USD",
  DEFAULT_ACCOUNT_TYPE: "CURRENT",
};

export const TRANSACTION = {
  MAX_AMOUNT: 1000000000,
};