
import { Outlet, Link } from "react-router-dom";

import {
  ShieldCheck,
  LockKeyhole,
  Globe2,
  ArrowLeft,
} from "lucide-react";

import { APP_CONFIG, ROUTES } from "../utils/constants.js";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">

        {/* =====================================================
            BRAND PANEL - DESKTOP
        ====================================================== */}

        <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.28),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.16),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col px-8 pb-8 pt-7 xl:px-12 xl:pb-10 xl:pt-9">

            {/* Desktop Logo - Goes to Homepage */}
            <Link
              to="/"
              className="flex w-fit shrink-0 items-center gap-3"
              aria-label={`${APP_CONFIG.name} home`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg xl:h-16 xl:w-16">
                <img
                  src="/logom.png"
                  alt={`${APP_CONFIG.name} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold tracking-tight text-white xl:text-xl">
                  {APP_CONFIG.name}
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-400 xl:text-sm">
                  Banking, built around you
                </p>
              </div>
            </Link>

            {/* Desktop Brand Message */}
            <div className="mt-12 w-full max-w-xl min-w-0 xl:mt-14">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 backdrop-blur sm:text-sm">
                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Secure digital banking</span>
              </div>

              <h1 className="max-w-lg text-4xl font-bold leading-[1.12] tracking-tight text-white xl:text-5xl 2xl:text-6xl">
                Your money.
                <br />
                <span className="text-blue-400">
                  Your future.
                </span>
                <br />
                One secure place.
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:mt-6 xl:text-base 2xl:text-lg">
                Manage your accounts, move money, save, invest and
                access financial products through one modern banking
                experience.
              </p>

              {/* Desktop Features */}
              <div className="mt-7 grid w-full max-w-lg grid-cols-1 gap-3 min-[1100px]:grid-cols-3 xl:mt-9 xl:gap-4">

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition duration-200 hover:border-blue-400/30 hover:bg-white/10 min-[1100px]:block min-[1100px]:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 min-[1100px]:mb-3">
                    <LockKeyhole className="h-5 w-5 text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      Secure
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Security-first account access
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition duration-200 hover:border-cyan-400/30 hover:bg-white/10 min-[1100px]:block min-[1100px]:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 min-[1100px]:mb-3">
                    <Globe2 className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      Global
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Designed for modern international banking
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition duration-200 hover:border-emerald-400/30 hover:bg-white/10 min-[1100px]:block min-[1100px]:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 min-[1100px]:mb-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      Protected
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Built around account security
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Desktop Footer */}
            <div className="mt-auto pt-8">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} {APP_CONFIG.name}. All rights
                reserved.
              </p>
            </div>

          </div>
        </aside>

        {/* =====================================================
            FORM PANEL - MOBILE AND DESKTOP
        ====================================================== */}

        <main className="flex min-h-screen min-w-0 w-full flex-col bg-slate-50">

          {/* MOBILE HEADER */}

          <div className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5 lg:justify-end lg:px-10">

            {/* Mobile Back Link - Remains on Login */}
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            {/* Mobile Institution Branding - Goes to Homepage */}
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2.5 lg:hidden"
              aria-label={`${APP_CONFIG.name} home`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                <img
                  src="/logom.png"
                  alt={`${APP_CONFIG.name} Logo`}
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="max-w-[150px] truncate text-sm font-bold tracking-tight text-slate-900 sm:max-w-none">
                {APP_CONFIG.name}
              </span>
            </Link>

            {/* Desktop Institution Name - Goes to Homepage */}
            <Link
              to="/"
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-blue-700 lg:block"
            >
              {APP_CONFIG.name}
            </Link>

          </div>

          {/* Authentication Content */}
          <div className="flex w-full flex-1 items-start justify-center px-4 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6 lg:items-center lg:px-10 lg:py-8 xl:px-12">

            <div className="w-full min-w-0 max-w-md">
              <Outlet />
            </div>

          </div>

        </main>

      </div>
    </div>
  );
};

export default AuthLayout;