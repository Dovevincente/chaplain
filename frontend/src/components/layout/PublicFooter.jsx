
import { Link } from "react-router-dom";

const BANK_NAME = "The Chaplaincy Savings and Credit Union";
const BANK_SHORT = "TCSCU";

const PublicFooter = () => {
  return (
    <footer className="bg-[#0a2038] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        {/* BRAND */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logom.png"
              alt={`${BANK_NAME} logo`}
              className="h-14 w-14 object-contain"
            />

            <div>
              <h3 className="max-w-[270px] text-sm font-bold leading-5">
                {BANK_NAME}
              </h3>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                {BANK_SHORT}
              </p>
            </div>
          </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
            Explore the TCSCU digital platform and learn about
            the financial services available to members.
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h4 className="font-bold">Explore</h4>

          <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
            <a href="#banking" className="transition hover:text-white">
              Banking services
            </a>

            <a href="#loans" className="transition hover:text-white">
              Loans
            </a>

            <a href="#about" className="transition hover:text-white">
              About TCSCU
            </a>

            <a href="#security" className="transition hover:text-white">
              Security
            </a>
          </div>
        </div>

        {/* MEMBER SERVICES */}
        <div>
          <h4 className="font-bold">Member services</h4>

          <div className="mt-5 flex flex-col gap-4 text-sm text-slate-400">
            <Link to="/login" className="transition hover:text-white">
              Online banking
            </Link>

            <Link to="/register" className="transition hover:text-white">
              Become a member
            </Link>

            <Link to="/login" className="transition hover:text-white">
              Member support
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-6 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>
            © {new Date().getFullYear()} {BANK_NAME}. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <a href="#security" className="transition hover:text-white">
              Security
            </a>

            <a href="#support" className="transition hover:text-white">
              Support
            </a>

            <a href="#about" className="transition hover:text-white">
              About us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
