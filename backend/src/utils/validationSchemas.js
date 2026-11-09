import { z } from "zod";

const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain a special character",
  );

const optionalText = (max = 100) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const dateOfBirthSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) return true;

    // Require a valid YYYY-MM-DD date.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    // Prevent invalid dates such as 2026-02-31.
    if (date.toISOString().slice(0, 10) !== value) {
      return false;
    }

    const today = new Date();
    const birthDate = new Date(`${value}T00:00:00.000Z`);

    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

    const monthDifference =
      today.getUTCMonth() - birthDate.getUTCMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getUTCDate() < birthDate.getUTCDate())
    ) {
      age--;
    }

    return age >= 18;
  }, {
    message: "You must be at least 18 years old and provide a valid date of birth",
  });

const accountTypeSchema = z.enum([
  "SAVINGS",
  "CURRENT",
  "BUSINESS",
  "INVESTMENT",
  "NON_RESIDENT",
  "DOMICILIARY",
  "ESCROW",
]);

const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^(USD|EUR|GBP)$/,
    "Please select a supported currency",
  )
  .optional()
  .default("USD");

export const registerSchema = z.object({
  body: z.object({
    // Personal information
    firstName: z
      .string()
      .trim()
      .min(2, "First name must contain at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),

    middleName: optionalText(50),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must contain at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),

    dateOfBirth: dateOfBirthSchema,

    nationality: optionalText(100),

    // Contact information
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address")
      .max(254),

    phone: z
      .string()
      .trim()
      .min(7, "Phone number must contain at least 7 characters")
      .max(30, "Phone number cannot exceed 30 characters")
      .optional()
      .or(z.literal("")),

    // Residential address
    country: optionalText(100),

    state: optionalText(100),

    stateProvince: optionalText(100),

    city: optionalText(100),

    address: optionalText(200),

    addressLine2: optionalText(150),

    postalCode: optionalText(20),

    // Account information
    accountType: accountTypeSchema,

    currency: currencySchema,

    // Authentication
    password: passwordSchema,
  }),

  params: z.object({}),

  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password cannot exceed 128 characters"),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const refreshSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({}),
});