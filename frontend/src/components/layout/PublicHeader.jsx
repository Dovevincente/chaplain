
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Globe2,
} from "lucide-react";

const BANK_NAME = "The Chaplaincy Savings and Credit Union";
const BANK_SHORT = "TCSCU";

const navigation = [
  { label: "Personal", href: "#personal" },
  { label: "Banking", href: "#banking" },
  { label: "Loans", href: "#loans" },
  { label: "About us", href: "#about" },
  { label: "Help & support", href: "#support" },
];

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* UTILITY BAR */}
      <div className="hidden border-b border-slate-200 bg-[#f5f6f7] md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-xs text-slate-600 lg:px-10">
          <div className="flex items-center gap-6">
            <a href="#support" className="transition hover:text-[#123b65]">
              Help and support
            </a>

            <a href="#about" className="transition hover:text-[#123b65]">
              About TCSCU
            </a>

            <a href="#security" className="transition hover:text-[#123b65]">
              Security centre
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Digital banking</span>
          </div>
        </div>
      </div>

      {/* MAIN PUBLIC HEADER */}
      <header className="relative z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <img
              src="/logom.png"
              alt={`${BANK_NAME} logo`}
              className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
            />

            <div className="min-w-0">
              <h1 className="max-w-[230px] text-sm font-extrabold leading-5 tracking-tight text-[#123b65] sm:max-w-none sm:text-base">
                {BANK_NAME}
              </h1>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b42332]">
                {BANK_SHORT}
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-7 xl:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center gap-1 py-3 text-sm font-semibold text-slate-700 transition hover:text-[#145da0]"
              >
                {item.label}

                <ChevronDown className="h-3.5 w-3.5 opacity-50 transition group-hover:rotate-180" />
              </a>
            ))}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-md border border-[#145da0] px-5 py-3 text-sm font-bold text-[#145da0] transition hover:bg-blue-50"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-[#145da0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d3d6c]"
            >
              Become a member
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-[#123b65] lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="public-mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div
            id="public-mobile-navigation"
            className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden"
          >
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-slate-100 py-4 text-sm font-semibold text-slate-700 transition hover:text-[#145da0]"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-md border border-[#145da0] px-3 py-3 text-center text-sm font-bold text-[#145da0]"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-md bg-[#145da0] px-3 py-3 text-center text-sm font-bold text-white"
                >
                  Join TCSCU
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default PublicHeader;
