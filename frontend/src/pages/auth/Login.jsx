
import { useEffect, useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";

import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";

import { getApiErrorMessage } from "../../utils/error.js";

import { ROUTES } from "../../utils/constants.js";

// Full institution name
const BANK_NAME =
  "The Chaplaincy Savings and Credit Union (TCSCU)";

const ADMIN_ROLES = [
  "ADMIN",
  "SUPERADMIN",
  "SUPER_ADMIN",
  "STAFF",
  "MANAGER",
];

const normalizeRole = (role) => {
  return String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

const isAdminRole = (role) => {
  return ADMIN_ROLES.includes(normalizeRole(role));
};

const getUserFromStorage = () => {
  const storageKeys = [
    "user",
    "currentUser",
    "authUser",
    "profile",
  ];

  for (const key of storageKeys) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        continue;
      }

      const parsed = JSON.parse(value);

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      // Ignore malformed storage values.
    }
  }

  return null;
};

const getDestination = (user, location) => {
  const role = normalizeRole(user?.role);

  // Administrators go directly to the admin dashboard.
  if (isAdminRole(role)) {
    return "/admin";
  }

  // Customers can return to the page they originally tried to access.
  const requestedPath = location.state?.from?.pathname;

  if (
    requestedPath &&
    requestedPath !== "/admin" &&
    !requestedPath.startsWith("/admin/")
  ) {
    return requestedPath;
  }

  return ROUTES.DASHBOARD;
};

const Login = () => {
  const {
    login,
    isAuthenticated,
    loading: authLoading,
    user,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setSubmitError("");
  }, [form.email, form.password]);

  // Redirect already authenticated users.
  if (!authLoading && isAuthenticated) {
    const storedUser = user || getUserFromStorage();

    return (
      <Navigate
        to={getDestination(storedUser, location)}
        replace
      />
    );
  }

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};
    const email = form.email.trim();

    if (!email) {
      nextErrors.email =
        "Enter the email address associated with your account.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const loggedInUser = await login(
        form.email.trim().toLowerCase(),
        form.password
      );

      const authenticatedUser =
        loggedInUser || user || getUserFromStorage();

      const destination = getDestination(
        authenticatedUser,
        location
      );

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "We couldn't sign you in. Please verify your details and try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-md px-1 sm:px-0">
      {/* BRAND LOGO AND FULL BANK NAME */}
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <img
          src="/logom.png"
          alt={`${BANK_NAME} Logo`}
          className="mb-4 h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
        />

        <h2 className="max-w-full text-sm font-bold leading-6 tracking-tight text-slate-900 sm:text-base">
          {BANK_NAME}
        </h2>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Digital Banking
        </p>
      </div>

      {/* HEADER */}
      <div className="mb-7 sm:mb-8">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Welcome back
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          Sign in to your account
        </h1>

        <p className="mt-3 max-w-full text-sm leading-6 text-slate-500">
          Access your accounts, transfers, cards, savings and
          investments securely.
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {submitError && (
        <div
          role="alert"
          className="mb-5 break-words rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium leading-6 text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* LOGIN FORM */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full space-y-5"
      >
        <Input
          id="login-email"
          name="email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <div className="min-w-0">
          <Input
            id="login-password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(event) =>
              updateField("password", event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            error={errors.password}
            leftIcon={<LockKeyhole className="h-4 w-4" />}
            rightElement={
              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="rounded-lg p-1 text-slate-400 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          <div className="mt-3 flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="inline-block py-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 sm:text-sm"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* SIGN IN BUTTON */}
        <div className="w-full pt-1">
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            rightIcon={
              !submitting && <ArrowRight className="h-4 w-4" />
            }
          >
            Sign in securely
          </Button>
        </div>
      </form>

      {/* REGISTRATION */}
      <div className="mt-7 border-t border-slate-100 pt-6 text-center sm:mt-8">
        <p className="text-sm leading-6 text-slate-500">
          Don't have a TCSCU account?
        </p>

        <Link
          to={ROUTES.REGISTER}
          className="mt-2 inline-flex min-h-10 items-center justify-center gap-1 text-sm font-bold text-slate-950 transition hover:text-blue-600"
        >
          Open an account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* SECURITY NOTICE */}
      <div className="mt-7 flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 sm:mt-8 sm:p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

        <p className="min-w-0 break-words text-xs leading-5 text-slate-500">
          {BANK_NAME} will never ask you to share your password
          or one-time security codes with another person.
        </p>
      </div>
    </div>
  );
};

export default Login;
