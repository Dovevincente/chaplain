

import { useMemo, useState } from "react";



import {

  ArrowRight,

  Check,

  CheckCircle2,

  Eye,

  EyeOff,

  Globe2,

  LockKeyhole,

  Mail,

  Phone,

  ShieldCheck,

  UserRound,

  CalendarDays,

  Wallet,

  Landmark,

  CreditCard,

  BriefcaseBusiness,

  Sparkles,

  ChevronDown,
  MapPin,

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



const ACCOUNT_TYPES = [

  {

    value: "SAVINGS",

    label: "Savings Account",

    description: "Save money and build towards your financial goals.",

    icon: Wallet,

  },

  {

    value: "CURRENT",

    label: "Current Account",

    description: "For everyday banking and regular transactions.",

    icon: Landmark,

  },

  {

    value: "NON_RESIDENT",

    label: "Non-Resident Account",

    description: "For customers who reside outside their home country.",

    icon: Globe2,

  },

  {

    value: "DOMICILIARY",

    label: "Domiciliary Account",

    description: "For holding and managing foreign currencies.",

    icon: CreditCard,

  },

  {

    value: "BUSINESS",

    label: "Business Account",

    description: "For business and organizational banking needs.",

    icon: BriefcaseBusiness,

  },

  {
    value: "ESCROW",
    label: "Escrow Account",
    description: "For holding funds securely until agreed transaction conditions are fulfilled. Availability may require additional review and approval.",
    icon: ShieldCheck,
  },
];



const getToday = () => {

  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");



  return `${year}-${month}-${day}`;

};



const Register = () => {

  const {

    register,

    isAuthenticated,

    loading: authLoading,

  } = useAuth();



  const navigate = useNavigate();

  const location = useLocation();



  const [form, setForm] = useState({

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    country: "",
    address: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    dateOfBirth: "",
    accountType: "SAVINGS",
    currency: "USD",

    password: "",

    confirmPassword: "",

  });



  const [errors, setErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =

    useState(false);



  const passwordRules = useMemo(

    () => [

      {

        label: "At least 10 characters",

        valid: form.password.length >= 10,

      },

      {

        label: "One uppercase letter",

        valid: /[A-Z]/.test(form.password),

      },

      {

        label: "One lowercase letter",

        valid: /[a-z]/.test(form.password),

      },

      {

        label: "One number",

        valid: /[0-9]/.test(form.password),

      },

      {

        label: "One special character",

        valid: /[^A-Za-z0-9]/.test(form.password),

      },

    ],

    [form.password]

  );



  const selectedAccount = ACCOUNT_TYPES.find(

    (account) => account.value === form.accountType

  );



  const completedPasswordRules = passwordRules.filter(

    (rule) => rule.valid

  ).length;



  const passwordStrength =

    form.password.length === 0

      ? "Not started"

      : completedPasswordRules <= 2

        ? "Weak"

        : completedPasswordRules <= 4

          ? "Moderate"

          : "Strong";



  const passwordStrengthColor =

    completedPasswordRules <= 2

      ? "bg-red-500"

      : completedPasswordRules <= 4

        ? "bg-amber-500"

        : "bg-emerald-500";



  if (!authLoading && isAuthenticated) {

    return <Navigate to={ROUTES.DASHBOARD} replace />;

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



    setSubmitError("");

  };



  const validate = () => {

    const nextErrors = {};



    const firstName = form.firstName.trim();

    const lastName = form.lastName.trim();

    const email = form.email.trim();



    if (firstName.length < 2) {

      nextErrors.firstName = "Enter your first name.";

    }



    if (lastName.length < 2) {

      nextErrors.lastName = "Enter your last name.";

    }



    if (!email) {

      nextErrors.email = "Email address is required.";

    } else if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      nextErrors.email = "Enter a valid email address.";

    }



    if (

      form.phone.trim() &&

      form.phone.trim().replace(/[^\d]/g, "").length < 7

    ) {

      nextErrors.phone = "Enter a valid phone number.";

    }



    if (!form.country.trim()) {
      nextErrors.country = "Enter your country.";
    }
    if (!form.address.trim()) nextErrors.address = "Enter your street address.";
    if (!form.city.trim()) nextErrors.city = "Enter your city.";
    if (!form.stateProvince.trim()) nextErrors.stateProvince = "Enter your state, province or region.";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Enter your postal or ZIP code.";
    if (!["USD", "EUR", "GBP", "CAD", "AUD", "CHF"].includes(form.currency)) {
      nextErrors.currency = "Please select a valid preferred currency.";
    }



    if (!form.dateOfBirth) {

      nextErrors.dateOfBirth = "Please enter your date of birth.";

    } else if (form.dateOfBirth > getToday()) {

      nextErrors.dateOfBirth =

        "Date of birth cannot be in the future.";

    }



    if (

      !ACCOUNT_TYPES.some(

        (account) => account.value === form.accountType

      )

    ) {

      nextErrors.accountType = "Please select a valid account type.";

    }



    if (passwordRules.some((rule) => !rule.valid)) {

      nextErrors.password =

        "Your password does not meet the security requirements.";

    }



    if (!form.confirmPassword) {

      nextErrors.confirmPassword = "Please confirm your password.";

    } else if (form.password !== form.confirmPassword) {

      nextErrors.confirmPassword = "Passwords do not match.";

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

      await register({

        firstName: form.firstName.trim(),

        lastName: form.lastName.trim(),

        email: form.email.trim().toLowerCase(),

        phone: form.phone.trim(),

        country: form.country.trim(),
        address: form.address.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        stateProvince: form.stateProvince.trim(),
        postalCode: form.postalCode.trim(),
        dateOfBirth: form.dateOfBirth,
        accountType: form.accountType,
        currency: form.currency,
        password: form.password,

      });



      const requestedPath = location.state?.from?.pathname;



      const destination =

        requestedPath &&

        requestedPath !== "/admin" &&

        !requestedPath.startsWith("/admin/")

          ? requestedPath

          : ROUTES.DASHBOARD;



      navigate(destination, {

        replace: true,

      });

    } catch (error) {

      setSubmitError(

        getApiErrorMessage(

          error,

          "We couldn't create your account. Please review your information and try again."

        )

      );

    } finally {

      setSubmitting(false);

    }

  };



  const sectionHeading = (number, title, description) => (

    <div className="mb-6 flex items-start gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#123b65] text-xs font-bold text-white shadow-sm">

        {number}

      </div>



      <div>

        <h2 className="text-base font-bold tracking-tight text-slate-900">

          {title}

        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">

          {description}

        </p>

      </div>

    </div>

  );



  return (

    <div className="mx-auto w-full min-w-0 max-w-3xl pb-8">

      {/* BRAND AND INTRODUCTION */}

      <div className="mb-9">

        <div className="mb-6 flex items-center gap-3">

          <img

            src="/logom.png"

            alt={`${BANK_SHORT_NAME} logo`}

            className="h-12 w-12 object-contain"

          />



          <div>

            <p className="text-sm font-extrabold leading-5 text-[#123b65]">

              {BANK_NAME}

            </p>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c72c3b]">

              {BANK_SHORT_NAME}

            </p>

          </div>

        </div>



        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

          <Sparkles className="h-3.5 w-3.5 text-[#145da0]" />

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#145da0]">

            Membership registration

          </span>

        </div>



        <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#102f50] sm:text-4xl">

          Begin your financial journey.

        </h1>



        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">

          Create your TCSCU member account by providing the details

          below. Complete each section carefully to begin the

          registration process.

        </p>



        <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">

          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#145da0]">

              <ShieldCheck className="h-4 w-4" />

            </div>

            <div>

              <p className="text-xs font-bold text-slate-800">

                Account security

              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">

                Protect your access

              </p>

            </div>

          </div>



          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">

              <Globe2 className="h-4 w-4" />

            </div>

            <div>

              <p className="text-xs font-bold text-slate-800">

                Digital access

              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">

                Online account portal

              </p>

            </div>

          </div>



          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">

              <LockKeyhole className="h-4 w-4" />

            </div>

            <div>

              <p className="text-xs font-bold text-slate-800">

                Private details

              </p>

              <p className="mt-0.5 text-[10px] text-slate-500">

                Handle with care

              </p>

            </div>

          </div>

        </div>

      </div>



      {/* REGISTRATION ERROR */}

      {submitError && (

        <div

          role="alert"

          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"

        >

          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />

          <p className="break-words">{submitError}</p>

        </div>

      )}



      {/* REGISTRATION FORM */}

      <form

        onSubmit={handleSubmit}

        noValidate

        className="space-y-6"

      >

        {/* PERSONAL INFORMATION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {sectionHeading(

            "01",

            "Personal information",

            "Tell us a little about yourself."

          )}



          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

            <Input

              id="register-first-name"

              name="firstName"

              label="First name"

              value={form.firstName}

              onChange={(event) =>

                updateField("firstName", event.target.value)

              }

              placeholder="Enter your first name"

              autoComplete="given-name"

              required

              error={errors.firstName}

              leftIcon={<UserRound className="h-4 w-4" />}

            />



            <Input

              id="register-last-name"

              name="lastName"

              label="Last name"

              value={form.lastName}

              onChange={(event) =>

                updateField("lastName", event.target.value)

              }

              placeholder="Enter your last name"

              autoComplete="family-name"

              required

              error={errors.lastName}

            />



            <div className="sm:col-span-2">

              <Input

                id="register-email"

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

            </div>



            <Input

              id="register-phone"

              name="phone"

              label="Phone number"

              type="tel"

              value={form.phone}

              onChange={(event) =>

                updateField("phone", event.target.value)

              }

              placeholder="+44 0000 000000"

              autoComplete="tel"

              error={errors.phone}

              leftIcon={<Phone className="h-4 w-4" />}

              hint="Optional. Include your country code."

            />



            <Input

              id="register-country"

              name="country"

              label="Country of residence"

              value={form.country}

              onChange={(event) =>

                updateField("country", event.target.value)

              }

              placeholder="Enter your country"

              autoComplete="country-name"

              required

              error={errors.country}

              leftIcon={<Globe2 className="h-4 w-4" />}

            />



            
            <div className="sm:col-span-2 border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#145da0]" />
                <h3 className="text-sm font-bold text-slate-800">Residential address</h3>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input id="register-address" name="address" label="Street address"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="House number and street name" autoComplete="address-line1"
                    required error={errors.address}
                    leftIcon={<MapPin className="h-4 w-4" />} />
                </div>
                <div className="sm:col-span-2">
                  <Input id="register-address-line-2" name="addressLine2"
                    label="Apartment, suite or unit (optional)" value={form.addressLine2}
                    onChange={(event) => updateField("addressLine2", event.target.value)}
                    placeholder="Apartment, suite, unit or building" autoComplete="address-line2" />
                </div>
                <Input id="register-city" name="city" label="City" value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Enter your city" autoComplete="address-level2"
                  required error={errors.city} />
                <Input id="register-state-province" name="stateProvince"
                  label="State / Province / Region" value={form.stateProvince}
                  onChange={(event) => updateField("stateProvince", event.target.value)}
                  placeholder="Enter state or region" autoComplete="address-level1"
                  required error={errors.stateProvince} />
                <Input id="register-postal-code" name="postalCode" label="Postal / ZIP code"
                  value={form.postalCode}
                  onChange={(event) => updateField("postalCode", event.target.value)}
                  placeholder="Enter postal or ZIP code" autoComplete="postal-code"
                  required error={errors.postalCode} />
              </div>
            </div>

{/* DATE OF BIRTH */}

            <div className="sm:col-span-2">

              <label

                htmlFor="register-date-of-birth"

                className="mb-2 block text-sm font-semibold text-slate-700"

              >

                Date of birth

                <span className="ml-1 text-red-500">*</span>

              </label>



              <div

                className={[

                  "relative w-full rounded-xl border bg-white transition",

                  "focus-within:border-[#145da0] focus-within:ring-4 focus-within:ring-blue-50",

                  errors.dateOfBirth

                    ? "border-red-300"

                    : "border-slate-200",

                ].join(" ")}

              >

                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />



                <input

                  id="register-date-of-birth"

                  name="dateOfBirth"

                  type="date"

                  value={form.dateOfBirth}

                  onChange={(event) =>

                    updateField("dateOfBirth", event.target.value)

                  }

                  onClick={(event) => {

                    if (

                      typeof event.currentTarget.showPicker === "function"

                    ) {

                      event.currentTarget.showPicker();

                    }

                  }}

                  max={getToday()}

                  autoComplete="bday"

                  required

                  aria-invalid={Boolean(errors.dateOfBirth)}

                  className="relative z-0 block min-h-[50px] w-full cursor-pointer rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none"

                />

              </div>



              {errors.dateOfBirth && (

                <p className="mt-2 text-xs text-red-600" role="alert">

                  {errors.dateOfBirth}

                </p>

              )}

            </div>

          </div>

        </section>



        {/* ACCOUNT PREFERENCES */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {sectionHeading(

            "02",

            "Account preferences",

            "Choose the account category you would like to explore."

          )}



          <label

            htmlFor="register-account-type"

            className="mb-2 block text-sm font-semibold text-slate-700"

          >

            Preferred account type

            <span className="ml-1 text-red-500">*</span>

          </label>



          <div className="relative">

            <select

              id="register-account-type"

              name="accountType"

              value={form.accountType}

              onChange={(event) =>

                updateField("accountType", event.target.value)

              }

              required

              aria-invalid={Boolean(errors.accountType)}

              className={[

                "block w-full appearance-none rounded-xl border bg-white px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:ring-4",

                errors.accountType

                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"

                  : "border-slate-200 focus:border-[#145da0] focus:ring-blue-50",

              ].join(" ")}

            >

              {ACCOUNT_TYPES.map((account) => (

                <option key={account.value} value={account.value}>

                  {account.label}

                </option>

              ))}

            </select>



            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          </div>



          {selectedAccount && (

            <div className="mt-4 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#145da0] shadow-sm">

                {(() => {

                  const Icon = selectedAccount.icon;

                  return <Icon className="h-5 w-5" />;

                })()}

              </div>



              <div>

                <p className="text-sm font-bold text-[#123b65]">

                  {selectedAccount.label}

                </p>

                <p className="mt-1 text-xs leading-6 text-slate-600">

                  {selectedAccount.description}

                </p>

              </div>

            </div>

          )}



          {errors.accountType && (

            <p className="mt-2 text-xs text-red-600" role="alert">

              {errors.accountType}

            </p>

          )}



                    <div className="mt-6">
            <label htmlFor="register-currency" className="mb-2 block text-sm font-semibold text-slate-700">
              Preferred account currency <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <select id="register-currency" name="currency" value={form.currency}
                onChange={(event) => updateField("currency", event.target.value)}
                required aria-invalid={Boolean(errors.currency)}
                className="block w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-[#145da0] focus:ring-4 focus:ring-blue-50">
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.currency && <p className="mt-2 text-xs text-red-600" role="alert">{errors.currency}</p>}
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Select your preferred account currency. Availability, conversion and settlement are subject to account eligibility and applicable terms.
            </p>
          </div>

<p className="mt-4 text-xs leading-5 text-slate-500">

            Your selection is a registration preference. Account

            availability and eligibility may be subject to the

            institution's applicable requirements.

          </p>

        </section>



        {/* ACCOUNT SECURITY */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {sectionHeading(

            "03",

            "Account security",

            "Create a strong password to protect your account."

          )}



          <div className="space-y-5">

            <div>

              <Input

                id="register-password"

                name="password"

                label="Create password"

                type={showPassword ? "text" : "password"}

                value={form.password}

                onChange={(event) =>

                  updateField("password", event.target.value)

                }

                placeholder="Create a strong password"

                autoComplete="new-password"

                required

                error={errors.password}

                leftIcon={<LockKeyhole className="h-4 w-4" />}

                rightElement={

                  <button

                    type="button"

                    onClick={() =>

                      setShowPassword((value) => !value)

                    }

                    className="rounded-lg p-1 text-slate-400 transition hover:text-[#145da0]"

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



              {/* PASSWORD STRENGTH */}

              <div className="mt-4">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-semibold text-slate-600">

                    Password strength

                  </span>



                  <span

                    className={[

                      "text-xs font-bold",

                      completedPasswordRules === 5

                        ? "text-emerald-600"

                        : completedPasswordRules >= 3

                          ? "text-amber-600"

                          : "text-slate-400",

                    ].join(" ")}

                  >

                    {passwordStrength}

                  </span>

                </div>



                <div className="grid grid-cols-5 gap-1.5">

                  {passwordRules.map((rule, index) => (

                    <div

                      key={rule.label}

                      className={[

                        "h-1.5 rounded-full transition-colors",

                        index < completedPasswordRules

                          ? passwordStrengthColor

                          : "bg-slate-100",

                      ].join(" ")}

                    />

                  ))}

                </div>

              </div>



              {/* PASSWORD REQUIREMENTS */}

              <div className="mt-4 rounded-xl bg-slate-50 p-4">

                <p className="mb-3 text-xs font-bold text-slate-700">

                  Password requirements

                </p>



                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">

                  {passwordRules.map((rule) => (

                    <div

                      key={rule.label}

                      className="flex items-center gap-2"

                    >

                      <span

                        className={[

                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",

                          rule.valid

                            ? "bg-emerald-100 text-emerald-700"

                            : "bg-slate-200 text-slate-400",

                        ].join(" ")}

                      >

                        <Check className="h-3 w-3" />

                      </span>



                      <span

                        className={[

                          "text-xs",

                          rule.valid

                            ? "font-semibold text-emerald-700"

                            : "text-slate-500",

                        ].join(" ")}

                      >

                        {rule.label}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>



            <Input

              id="register-confirm-password"

              name="confirmPassword"

              label="Confirm password"

              type={showConfirmPassword ? "text" : "password"}

              value={form.confirmPassword}

              onChange={(event) =>

                updateField("confirmPassword", event.target.value)

              }

              placeholder="Enter your password again"

              autoComplete="new-password"

              required

              error={errors.confirmPassword}

              leftIcon={<LockKeyhole className="h-4 w-4" />}

              rightElement={

                <button

                  type="button"

                  onClick={() =>

                    setShowConfirmPassword((value) => !value)

                  }

                  className="rounded-lg p-1 text-slate-400 transition hover:text-[#145da0]"

                  aria-label={

                    showConfirmPassword

                      ? "Hide password"

                      : "Show password"

                  }

                >

                  {showConfirmPassword ? (

                    <EyeOff className="h-4 w-4" />

                  ) : (

                    <Eye className="h-4 w-4" />

                  )}

                </button>

              }

            />



            {form.confirmPassword.length > 0 &&

              form.password === form.confirmPassword && (

                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">

                  <CheckCircle2 className="h-4 w-4" />

                  Passwords match.

                </div>

              )}

          </div>

        </section>



        {/* SECURITY INFORMATION */}

        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#145da0] shadow-sm">

              <ShieldCheck className="h-5 w-5" />

            </div>



            <div>

              <h3 className="text-sm font-bold text-[#123b65]">

                Protect your personal information

              </h3>



              <p className="mt-1 text-xs leading-6 text-slate-600">

                Provide accurate information and keep your login

                credentials private. Never share your password or

                verification codes with anyone.

              </p>

            </div>

          </div>

        </div>



        {/* SUBMIT */}

        <div className="space-y-4">

          <Button

            type="submit"

            fullWidth

            size="lg"

            loading={submitting}

            rightIcon={

              !submitting && <ArrowRight className="h-4 w-4" />

            }

          >

            {submitting

              ? "Creating your account..."

              : "Create your TCSCU account"}

          </Button>


          <p className="text-center text-xs leading-5 text-slate-500">

            By submitting your registration, you confirm that the

            information provided is accurate and that you have

            reviewed the applicable membership requirements.

          </p>

        </div>

      </form>

      {/* LOGIN LINK */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

        <p className="text-sm text-slate-500">

          Already have a TCSCU account?

        </p>



        <Link

          to={ROUTES.LOGIN}

          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#145da0] transition hover:text-[#c72c3b]"
        >

          Sign in to your account

          <ArrowRight className="h-4 w-4" />

        </Link>

      </div>
      {/* FOOTER NOTE */}

      <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">

        <LockKeyhole className="h-3.5 w-3.5" />

        <span>{BANK_SHORT_NAME} · Member registration portal</span>

      </div>

    </div>

  );
};
export default Register;