
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

const BANK_NAME = "The Chaplaincy Savings and Credit Union";
const BANK_SHORT_NAME = "TCSCU";

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

  // Customers can return to the page they originally
  // tried to access.
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
    <div className="min-h-screen w-full bg-[#f5f7fa] text-slate-900">
      {/* TOP HEADER */}
      <header className="relative z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          {/* CLICKABLE LOGO - DIRECT HOMEPAGE NAVIGATION */}
          <button
            type="button"
            onClick={() => {
              window.location.assign("/");
            }}
            className="relative z-50 flex min-w-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left pointer-events-auto"
            aria-label={`${BANK_NAME} - Go to homepage`}
          >
            <img
              src="/logom.png"
              alt={`${BANK_NAME} logo`}
              className="pointer-events-none h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />

            <div className="pointer-events-none min-w-0">
              <h2 className="text-sm font-bold leading-5 tracking-tight text-[#123b65] sm:text-base">
                {BANK_NAME}
              </h2>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                {BANK_SHORT_NAME}
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm font-medium text-slate-600 sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Secure Online Banking
          </div>
        </div>
      </header>

      {/* MAIN LOGIN CONTENT */}
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:px-8">

        {/* LOGIN CARD */}
        <section className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Card top accent */}
          <div className="h-1.5 w-full bg-[#123b65]" />

          <div className="p-5 sm:p-8">

            {/* LOGIN HEADING */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <LockKeyhole className="h-4 w-4" />
                Secure Member Access
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#123b65] sm:text-3xl">
                Sign in
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Access your account to manage your finances,
                transfers, savings and investments.
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {submitError && (
              <div
                role="alert"
                className="mb-5 break-words rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm leading-6 text-red-700"
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
                placeholder="Enter your email address"
                autoComplete="email"
                required
                error={errors.email}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              {/* PASSWORD FIELD */}
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
                  leftIcon={
                    <LockKeyhole className="h-4 w-4" />
                  }
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="rounded-md p-1 text-slate-500 transition hover:text-[#123b65] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
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

                {/* FORGOT PASSWORD */}
                <div className="mt-3 flex justify-end">
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="py-1 text-sm font-semibold text-[#145da0] transition hover:text-[#123b65] hover:underline"
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
                    !submitting && (
                      <ArrowRight className="h-4 w-4" />
                    )
                  }
                >
                  Sign in
                </Button>
              </div>
            </form>

            {/* REGISTER */}
            <div className="mt-6 border-t border-slate-200 pt-5 text-center">
              <p className="text-sm text-slate-600">
                Not yet a member?
              </p>

              <Link
                to={ROUTES.REGISTER}
                className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#145da0] px-5 py-2 text-sm font-bold text-[#145da0] transition hover:bg-[#145da0] hover:text-white"
              >
                Open an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECURITY INFORMATION */}
        <div className="mt-6 flex w-full max-w-md items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your security matters
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              {BANK_NAME} will never ask you to share your
              password or one-time security codes with another
              person.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-10 w-full max-w-4xl border-t border-slate-200 pt-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-medium text-slate-500">
            <Link
              to="/"
              className="transition hover:text-[#145da0]"
            >
              Home
            </Link>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="transition hover:text-[#145da0]"
            >
              Password Assistance
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="transition hover:text-[#145da0]"
            >
              Open an Account
            </Link>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} {BANK_NAME}. All rights
            reserved.
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-400">
            Please protect your login credentials and use a
            secure device when accessing your account.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
