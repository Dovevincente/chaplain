
import { Resend } from "resend";
import logger from "../utils/logger.js";

/*
 * ============================================================
 * THE CHAPLAINCY SAVINGS AND CREDIT UNION EMAIL SERVICE
 * ============================================================
 *
 * Centralized email service using Resend.
 *
 * Never log passwords, OTP codes, card PINs, CVVs,
 * JWT tokens, database credentials, or API keys.
 */

// ============================================================
// EMAIL CONFIGURATION
// ============================================================

const emailConfig = {
  enabled:
    String(process.env.EMAIL_ENABLED || "false").toLowerCase() ===
    "true",

  from:
    process.env.EMAIL_FROM ||
    "The Chaplaincy Savings and Credit Union <onboarding@resend.dev>",

  support:
    process.env.SUPPORT_EMAIL ||
    "moylisa716@gmail.com",

  resendApiKey: String(process.env.RESEND_API_KEY || "").trim(),
};

// ============================================================
// RESEND CLIENT
// ============================================================

const resend = emailConfig.resendApiKey
  ? new Resend(emailConfig.resendApiKey)
  : null;

// ============================================================
// VALIDATION
// ============================================================

const validateEmailAddress = (email) => {
  const value = String(email || "").trim();

  if (!value) {
    const error = new Error("Recipient email address is required");
    error.statusCode = 400;
    throw error;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    const error = new Error("Invalid recipient email address");
    error.statusCode = 400;
    throw error;
  }

  return value;
};

// ============================================================
// NORMALIZE EMAIL CONTENT
// ============================================================

const normalizeEmailContent = ({ subject, text, html }) => {
  const normalizedSubject = String(subject || "").trim();

  if (!normalizedSubject) {
    const error = new Error("Email subject is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedText = text ? String(text) : "";
  const normalizedHtml = html ? String(html) : "";

  if (!normalizedText && !normalizedHtml) {
    const error = new Error("Email content is required");
    error.statusCode = 400;
    throw error;
  }

  return {
    subject: normalizedSubject,
    text: normalizedText,
    html: normalizedHtml,
  };
};

// ============================================================
// HTML ESCAPING
// ============================================================

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ============================================================
// BASE EMAIL TEMPLATE
// ============================================================

const createEmailTemplate = ({ title, preheader, content }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:Arial,Helvetica,sans-serif;
  color:#172033;
">
  <div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
  ">
    ${escapeHtml(preheader || "")}
  </div>

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background:#f5f7fb;"
  >
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width:620px;
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:16px;
            overflow:hidden;
          "
        >
          <tr>
            <td style="
              background:#0f2742;
              padding:24px 28px;
              color:#ffffff;
            ">
              <div style="
                font-size:20px;
                font-weight:700;
                letter-spacing:-0.3px;
              ">
                The Chaplaincy Savings and Credit Union
              </div>

              <div style="
                margin-top:6px;
                font-size:12px;
                color:#cbd5e1;
              ">
                TCSCU · Secure digital banking
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px;">
              <h1 style="
                margin:0 0 18px;
                font-size:24px;
                line-height:1.3;
                color:#172033;
              ">
                ${escapeHtml(title)}
              </h1>

              ${content}
            </td>
          </tr>

          <tr>
            <td style="
              padding:20px 28px;
              border-top:1px solid #eef0f4;
              background:#fafbfc;
            ">
              <p style="
                margin:0;
                font-size:12px;
                line-height:1.6;
                color:#64748b;
              ">
                This is an automated message from The Chaplaincy
                Savings and Credit Union (TCSCU).
                Please do not reply to this email.
              </p>

              <p style="
                margin:8px 0 0;
                font-size:12px;
                line-height:1.6;
                color:#64748b;
              ">
                For assistance, contact
                ${escapeHtml(emailConfig.support)}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// ============================================================
// EMAIL TRANSPORT - RESEND
// ============================================================

const deliverEmail = async ({ to, subject, text, html }) => {
  if (!emailConfig.enabled) {
    logger.warn("Email delivery is disabled", {
      to,
      subject,
    });

    return {
      delivered: false,
      disabled: true,
      message: "Email delivery is not configured",
    };
  }

  if (!emailConfig.resendApiKey || !resend) {
    logger.error(
      "Email delivery is enabled but RESEND_API_KEY is missing",
    );

    const error = new Error(
      "Email delivery is enabled but RESEND_API_KEY is not configured",
    );

    error.statusCode = 503;
    throw error;
  }

  try {
    const payload = {
      from: emailConfig.from,
      to: [to],
      subject,
      text: text || undefined,
      html: html || undefined,
    };

    const result = await resend.emails.send(payload);

    if (result?.error) {
      logger.error("Resend rejected email delivery", {
        to,
        subject,
        error: result.error?.message || "Unknown Resend error",
        name: result.error?.name || undefined,
      });

      const error = new Error(
        result.error?.message ||
          "Email provider rejected the message",
      );

      error.statusCode = 502;
      throw error;
    }

    const emailId = result?.data?.id ?? null;

    logger.info("Email delivered successfully", {
      to,
      subject,
      provider: "resend",
      id: emailId,
    });

    return {
      delivered: true,
      disabled: false,
      provider: "resend",
      id: emailId,
      message: "Email delivered successfully",
    };
  } catch (error) {
    logger.error("Email delivery failed", {
      to,
      subject,
      error: error?.message || "Unknown email delivery error",
    });

    if (error?.statusCode) {
      throw error;
    }

    const deliveryError = new Error(
      error?.message || "Email delivery failed",
    );

    deliveryError.statusCode = 502;
    throw deliveryError;
  }
};

// ============================================================
// SEND EMAIL
// ============================================================

export const sendEmail = async ({ to, subject, text, html }) => {
  const recipient = validateEmailAddress(to);

  const content = normalizeEmailContent({
    subject,
    text,
    html,
  });

  return deliverEmail({
    to: recipient,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
};

// ============================================================
// ACCOUNT WELCOME EMAIL
// ============================================================

export const sendWelcomeEmail = async ({ to, firstName }) => {
  const name = String(firstName || "Customer").trim();
  const safeName = escapeHtml(name);

  const text = [
    `Hello ${name},`,
    "",
    "Welcome to The Chaplaincy Savings and Credit Union (TCSCU).",
    "",
    "Your account has been created successfully.",
    "Please complete any required verification steps before using restricted banking services.",
    "",
    "The Chaplaincy Savings and Credit Union",
  ].join("\n");

  const html = createEmailTemplate({
    title: "Welcome to The Chaplaincy Savings and Credit Union",
    preheader:
      "Your account with The Chaplaincy Savings and Credit Union has been created.",
    content: `
      <p style="
        margin:0 0 16px;
        font-size:16px;
        line-height:1.7;
        color:#334155;
      ">
        Hello ${safeName},
      </p>

      <p style="
        margin:0 0 16px;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        Welcome to The Chaplaincy Savings and Credit Union (TCSCU).
        Your account has been created successfully.
      </p>

      <p style="
        margin:0;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        Please complete any required verification steps
        before using restricted banking services.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject: "Welcome to The Chaplaincy Savings and Credit Union",
    text,
    html,
  });
};

// ============================================================
// SECURITY ALERT EMAIL
// ============================================================

export const sendSecurityAlertEmail = async ({
  to,
  title = "Security alert",
  message,
}) => {
  const safeTitle = String(title || "Security alert").trim();
  const safeMessage = String(message || "").trim();

  if (!safeMessage) {
    const error = new Error("Security alert message is required");
    error.statusCode = 400;
    throw error;
  }

  const text = [
    "The Chaplaincy Savings and Credit Union (TCSCU) security alert",
    "",
    safeTitle,
    "",
    safeMessage,
    "",
    "If you did not perform this activity, contact TCSCU support immediately.",
  ].join("\n");

  const html = createEmailTemplate({
    title: safeTitle,
    preheader:
      "Important security activity was detected on your TCSCU account.",
    content: `
      <div style="
        padding:16px;
        border:1px solid #fecaca;
        border-radius:12px;
        background:#fef2f2;
      ">
        <p style="
          margin:0;
          font-size:15px;
          line-height:1.7;
          color:#991b1b;
        ">
          ${escapeHtml(safeMessage)}
        </p>
      </div>

      <p style="
        margin:20px 0 0;
        font-size:14px;
        line-height:1.7;
        color:#475569;
      ">
        If you did not perform this activity, contact
        TCSCU support immediately.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject: `TCSCU: ${safeTitle}`,
    text,
    html,
  });
};

// ============================================================
// TRANSACTION EMAIL
// ============================================================

export const sendTransactionEmail = async ({
  to,
  transactionType,
  amount,
  currencyCode,
  reference,
  status,
}) => {
  const safeType = String(transactionType || "Transaction").trim();
  const safeAmount = String(amount ?? "0.00");
  const safeCurrency = String(currencyCode || "USD").trim();
  const safeReference = String(reference || "").trim();
  const safeStatus = String(status || "PENDING").trim().toUpperCase();

  const text = [
    "The Chaplaincy Savings and Credit Union (TCSCU) transaction notification",
    "",
    `Type: ${safeType}`,
    `Amount: ${safeCurrency} ${safeAmount}`,
    `Status: ${safeStatus}`,
    `Reference: ${safeReference || "Unavailable"}`,
    "",
    "Please review your account if you do not recognize this transaction.",
  ].join("\n");

  const html = createEmailTemplate({
    title: "Transaction notification",
    preheader: `Your TCSCU ${safeType.toLowerCase()} has been updated.`,
    content: `
      <p style="
        margin:0 0 18px;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        Your TCSCU transaction has been updated.
      </p>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:13px;">
            Type
          </td>
          <td align="right" style="
            padding:10px 0;
            color:#172033;
            font-size:13px;
            font-weight:700;
          ">
            ${escapeHtml(safeType)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:13px;">
            Amount
          </td>
          <td align="right" style="
            padding:10px 0;
            color:#172033;
            font-size:13px;
            font-weight:700;
          ">
            ${escapeHtml(safeCurrency)} ${escapeHtml(safeAmount)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:13px;">
            Status
          </td>
          <td align="right" style="
            padding:10px 0;
            color:#172033;
            font-size:13px;
            font-weight:700;
          ">
            ${escapeHtml(safeStatus)}
          </td>
        </tr>

        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:13px;">
            Reference
          </td>
          <td align="right" style="
            padding:10px 0;
            color:#172033;
            font-size:13px;
            font-weight:700;
            word-break:break-all;
          ">
            ${escapeHtml(safeReference || "Unavailable")}
          </td>
        </tr>
      </table>

      <p style="
        margin:20px 0 0;
        font-size:13px;
        line-height:1.7;
        color:#64748b;
      ">
        Please review your account if you do not recognize
        this transaction.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject: `TCSCU transaction: ${safeStatus}`,
    text,
    html,
  });
};

// ============================================================
// CARD ALERT EMAIL
// ============================================================

export const sendCardAlertEmail = async ({
  to,
  cardLastFour,
  action,
}) => {
  const lastFour = String(cardLastFour || "").slice(-4);
  const safeAction = String(action || "updated").trim();

  const maskedCard = lastFour ? `•••• ${lastFour}` : "your card";

  const text = [
    "The Chaplaincy Savings and Credit Union (TCSCU) card notification",
    "",
    `${maskedCard} was ${safeAction}.`,
    "",
    "If you did not perform this action, contact TCSCU support immediately.",
  ].join("\n");

  const html = createEmailTemplate({
    title: "Card security notification",
    preheader: `Your TCSCU card ${safeAction}.`,
    content: `
      <p style="
        margin:0 0 16px;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        Your card
        <strong>${escapeHtml(maskedCard)}</strong>
        was
        <strong>${escapeHtml(safeAction)}</strong>.
      </p>

      <p style="
        margin:0;
        font-size:14px;
        line-height:1.7;
        color:#475569;
      ">
        If you did not perform this action, contact
        TCSCU support immediately.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject: "TCSCU card security notification",
    text,
    html,
  });
};

// ============================================================
// BANK TRANSFER OTP EMAIL
// ============================================================

export const sendTransferOtpEmail = async ({
  to,
  firstName,
  otpCode,
  expiresInMinutes = 10,
}) => {
  const name = String(firstName || "Customer").trim();
  const safeName = escapeHtml(name);
  const safeOtp = String(otpCode || "").trim();
  const expiry = Number(expiresInMinutes);

  if (!/^\d{6}$/.test(safeOtp)) {
    const error = new Error(
      "A valid six-digit transfer OTP is required",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isFinite(expiry) || expiry <= 0) {
    const error = new Error("A valid OTP expiry period is required");
    error.statusCode = 400;
    throw error;
  }

  const text = [
    `Hello ${name},`,
    "",
    "A bank transfer verification code has been requested for your TCSCU account.",
    "",
    `Your verification code is: ${safeOtp}`,
    "",
    `This code expires in ${expiry} minutes.`,
    "",
    "For your security:",
    "- Never share this code with anyone.",
    "- TCSCU staff will never ask you to disclose this code.",
    "- If you did not request this code, do not use it and contact support.",
    "",
    "The Chaplaincy Savings and Credit Union",
  ].join("\n");

  const html = createEmailTemplate({
    title: "Bank transfer verification",
    preheader: "Your secure TCSCU bank transfer verification code.",
    content: `
      <p style="
        margin:0 0 16px;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        Hello ${safeName},
      </p>

      <p style="
        margin:0 0 20px;
        font-size:15px;
        line-height:1.7;
        color:#475569;
      ">
        A bank transfer verification code has been requested
        for your TCSCU account.
      </p>

      <div style="
        margin:0 0 20px;
        padding:24px 16px;
        background:#f1f5f9;
        border:1px solid #e2e8f0;
        border-radius:12px;
        text-align:center;
      ">
        <p style="
          margin:0 0 10px;
          color:#64748b;
          font-size:12px;
          font-weight:700;
          letter-spacing:1px;
          text-transform:uppercase;
        ">
          Your verification code
        </p>

        <div style="
          color:#0f2742;
          font-size:32px;
          font-weight:700;
          letter-spacing:8px;
        ">
          ${safeOtp}
        </div>

        <p style="
          margin:12px 0 0;
          color:#64748b;
          font-size:13px;
        ">
          Expires in ${expiry} minutes
        </p>
      </div>

      <p style="
        margin:0 0 12px;
        font-size:14px;
        line-height:1.7;
        color:#475569;
      ">
        <strong>Security notice:</strong> Never share this code
        with anyone, including anyone claiming to be a TCSCU employee.
      </p>

      <p style="
        margin:0;
        font-size:14px;
        line-height:1.7;
        color:#475569;
      ">
        If you did not request this code, do not use it and
        contact TCSCU support immediately.
      </p>
    `,
  });

  return sendEmail({
    to,
    subject: "TCSCU: Bank transfer verification code",
    text,
    html,
  });
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const emailService = {
  sendEmail,
  sendWelcomeEmail,
  sendSecurityAlertEmail,
  sendTransactionEmail,
  sendCardAlertEmail,
  sendTransferOtpEmail,
};

export default emailService;
