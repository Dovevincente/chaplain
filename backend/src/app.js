
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

/*
 * ============================================================
 * ROUTES
 * ============================================================
 */

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import beneficiaryRoutes from "./routes/beneficiaryRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import savingsRoutes from "./routes/savingsRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";

import transactionRoutes, {
  accountTransactionRouter,
} from "./routes/transactionRoutes.js";

import transferRoutes from "./routes/transferRoutes.js";
import bankTransferRoutes from "./routes/bankTransferRoutes.js";
import bankTransferProcessingRoutes from "./routes/bankTransferProcessingRoutes.js";
import bankTransferDetailsRoutes from "./routes/bankTransferDetailsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

/*
 * ============================================================
 * MIDDLEWARE
 * ============================================================
 */

import notFound from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import env from "./config/env.js";

/*
 * ============================================================
 * APP INITIALIZATION
 * ============================================================
 */

const app = express();

app.set("trust proxy", 1);

/*
 * ============================================================
 * FILE PATHS
 * ============================================================
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDirectory = path.join(__dirname, "../uploads");

/*
 * ============================================================
 * CORS CONFIGURATION
 * ============================================================
 */

const allowedOrigins = new Set([
  "https://tcscu.co.uk",
  "https://www.tcscu.co.uk",
]);

// Allow local development origins only in development mode.
if (env.nodeEnv === "development") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:3000");
}

const corsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header, such as server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked this origin: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  optionsSuccessStatus: 204,
  maxAge: 86400,
};

// CORS must run before routes and API rate limiting.
// This middleware also handles browser OPTIONS preflight requests.
app.use(cors(corsOptions));

/*
 * ============================================================
 * SECURITY HEADERS
 * ============================================================
 */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/*
 * ============================================================
 * STATIC UPLOADS
 * ============================================================
 */

app.use("/uploads", express.static(uploadsDirectory));

/*
 * ============================================================
 * REQUEST BODY PARSING
 * ============================================================
 */

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

/*
 * ============================================================
 * COOKIES
 * ============================================================
 */

app.use(cookieParser());

/*
 * ============================================================
 * HTTP REQUEST LOGGING
 * ============================================================
 */

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

/*
 * ============================================================
 * GLOBAL API RATE LIMIT
 * ============================================================
 */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/*
 * ============================================================
 * ROOT
 * ============================================================
 */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to The Chaplaincy Savings And Credit Union API",
    version: "1.0.0",
    environment: env.nodeEnv,
  });
});

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

const healthHandler = (req, res) => {
  return res.status(200).json({
    success: true,
    service: "The Chaplaincy Savings And Credit Union API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

/*
 * ============================================================
 * API ROUTES
 * ============================================================
 */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountTransactionRouter);
app.use("/api/transfers", transferRoutes);
app.use("/api/bank-transfers", bankTransferRoutes);
app.use("/api/bank-transfers", bankTransferDetailsRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/bank-transfers", bankTransferProcessingRoutes);
app.use("/api/admin", adminRoutes);

/*
 * ============================================================
 * 404 + ERROR HANDLER
 * ============================================================
 */

app.use(notFound);
app.use(errorHandler);

export default app;