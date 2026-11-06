
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Wallet,
  PiggyBank,
  Landmark,
  CreditCard,
  Globe2,
  LockKeyhole,
  Headphones,
  Smartphone,
  TrendingUp,
  Users,
  CircleHelp,
  Building2,
  HandCoins,
  BadgeCheck,
  CheckCircle2,
  UserPlus,
  FileText,
  MonitorSmartphone,
  Target,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  Eye,
  HeartHandshake,
  Lightbulb,
  BriefcaseBusiness,
  CalendarDays,
  ArrowUpRight,
  Menu as MenuIcon,
} from "lucide-react";

const BANK_NAME = "The Chaplaincy Savings and Credit Union";
const BANK_SHORT = "TCSCU";

const INSTITUTION_ADDRESS =
  "Our Lady of the Caribbean Chapel Centre, Bayswater, Birchfield, Birmingham, B20 3AE, UK.";

const DIRECTOR_NAME = "O'may Neil Donald Edward";

const navigation = [
  {
    label: "Personal",
    items: [
      { label: "Everyday banking", href: "#banking" },
      { label: "Savings", href: "#savings" },
      { label: "Cards and payments", href: "#cards" },
      { label: "Membership benefits", href: "#membership" },
    ],
  },
  {
    label: "Borrow",
    items: [
      { label: "Loan services", href: "#loans" },
      { label: "Financial planning", href: "#planning" },
      { label: "Financial wellness", href: "#wellness" },
    ],
  },
  {
    label: "Digital banking",
    items: [
      { label: "Online banking", href: "/login", route: true },
      { label: "Account access", href: "/login", route: true },
      { label: "Become a member", href: "/register", route: true },
    ],
  },
  {
    label: "About TCSCU",
    items: [
      { label: "About our institution", href: "#about" },
      { label: "Our approach", href: "#approach" },
      { label: "Security", href: "#security" },
      { label: "Help and support", href: "#support" },
    ],
  },
];

const services = [
  {
    icon: Wallet,
    number: "01",
    title: "Everyday banking",
    description:
      "Explore account services and convenient ways to manage your everyday finances.",
    link: "/register",
    label: "Explore banking",
  },
  {
    icon: PiggyBank,
    number: "02",
    title: "Savings",
    description:
      "Explore savings options and plan towards your financial goals.",
    link: "/register",
    label: "Explore savings",
  },
  {
    icon: Landmark,
    number: "03",
    title: "Loans",
    description:
      "Discover financing options and learn about the application process.",
    link: "/register",
    label: "Explore loans",
  },
  {
    icon: CreditCard,
    number: "04",
    title: "Cards and payments",
    description:
      "Explore available card services and convenient payment management.",
    link: "/register",
    label: "Learn more",
  },
];

const quickLinks = [
  {
    icon: Wallet,
    title: "Online banking",
    description: "Access your member account",
    link: "/login",
    route: true,
  },
  {
    icon: PiggyBank,
    title: "Savings",
    description: "Explore savings services",
    link: "#savings",
  },
  {
    icon: HandCoins,
    title: "Loans",
    description: "Explore financing options",
    link: "#loans",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Find help and assistance",
    link: "#support",
  },
];

const benefits = [
  {
    icon: Smartphone,
    title: "Convenient digital access",
    description:
      "Access your member account through the TCSCU online banking platform.",
  },
  {
    icon: Users,
    title: "Member-focused approach",
    description:
      "Explore services and account features with membership at the centre of the experience.",
  },
  {
    icon: Target,
    title: "Financial goal planning",
    description:
      "Explore savings and financial planning options that support your personal goals.",
  },
  {
    icon: Headphones,
    title: "Member assistance",
    description:
      "Find guidance and support when navigating your account and available services.",
  },
];

const membershipSteps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Begin by completing the membership registration process on our digital platform.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Provide your details",
    description:
      "Submit the requested information and any applicable documentation for review.",
  },
  {
    number: "03",
    icon: MonitorSmartphone,
    title: "Access your account",
    description:
      "After the applicable registration and verification process, access your member account.",
  },
];

const wellnessItems = [
  {
    icon: PiggyBank,
    title: "Build a savings habit",
    description:
      "Set realistic targets and develop consistent saving habits over time.",
  },
  {
    icon: HandCoins,
    title: "Understand borrowing",
    description:
      "Consider your financial circumstances and repayment responsibilities before borrowing.",
  },
  {
    icon: TrendingUp,
    title: "Plan for tomorrow",
    description:
      "Think ahead about your priorities and make informed financial decisions.",
  },
];

const faqs = [
  {
    question: "What is TCSCU?",
    answer:
      "The Chaplaincy Savings and Credit Union (TCSCU) is an institution with a digital platform through which members can explore account access and available financial services.",
  },
  {
    question: "How can I become a member?",
    answer:
      "You can begin by selecting the Become a Member or Join TCSCU option on this website. Complete the registration process and provide the information requested.",
  },
  {
    question: "How do I access online banking?",
    answer:
      "Select Sign In or Access Online Banking to open the member login page. Enter your registered credentials to access your account.",
  },
  {
    question: "Can I access my account on a mobile device?",
    answer:
      "The TCSCU website is designed to work across desktop, tablet and mobile screens. You can access the website using a supported mobile browser.",
  },
  {
    question: "How can I learn about savings and loan services?",
    answer:
      "Visit the Savings and Loans sections of this website to explore the information currently available. Specific eligibility, terms and conditions should be confirmed through the institution's official channels.",
  },
  {
    question: "What should I do if I have a login problem?",
    answer:
      "Use the support options available through the member platform. Never share your password, verification codes or other confidential account information with anyone.",
  },
];

const securityTips = [
  {
    icon: LockKeyhole,
    title: "Protect your credentials",
    description:
      "Never share your password or private security information with another person.",
  },
  {
    icon: ShieldCheck,
    title: "Verify requests",
    description:
      "Be careful with unexpected messages, links and requests for verification codes.",
  },
  {
    icon: CircleHelp,
    title: "Use verified support",
    description:
      "Contact the institution through verified support channels when you need assistance.",
  },
];

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFaq, setActiveFaq] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  };

  const renderNavigationLink = (subItem) => {
    if (subItem.route) {
      return (
        <Link
          key={subItem.label}
          to={subItem.href}
          onClick={closeMenu}
          className="flex items-center justify-between px-5 py-3 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-[#145da0]"
        >
          {subItem.label}
          <ChevronRight className="h-4 w-4" />
        </Link>
      );
    }

    return (
      <a
        key={subItem.label}
        href={subItem.href}
        onClick={closeMenu}
        className="flex items-center justify-between px-5 py-3 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-[#145da0]"
      >
        {subItem.label}
        <ChevronRight className="h-4 w-4" />
      </a>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800">
      {/* UTILITY BAR */}
      <div className="hidden border-b border-slate-200 bg-[#f5f6f7] md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-xs text-slate-600 lg:px-10">
          <div className="flex items-center gap-6">
            <a href="#support" className="transition hover:text-[#145da0]">
              Help and support
            </a>
            <a href="#about" className="transition hover:text-[#145da0]">
              About TCSCU
            </a>
            <a href="#security" className="transition hover:text-[#145da0]">
              Security centre
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5 text-[#145da0]" />
            <span>Digital banking access</span>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <a
            href="/"
            onClick={scrollToTop}
            className="flex min-w-0 items-center gap-3"
            aria-label={`${BANK_NAME} homepage`}
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
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c72c3b]">
                {BANK_SHORT}
              </p>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === item.label ? null : item.label
                    )
                  }
                  aria-expanded={activeDropdown === item.label}
                  className="flex items-center gap-2 rounded-md px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 w-64 border border-slate-200 bg-white py-3 shadow-xl">
                    {item.items.map(renderNavigationLink)}
                  </div>
                )}
              </div>
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
              className="rounded-md bg-[#145da0] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d3d6c]"
            >
              Become a member
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 text-[#123b65] lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-75px)] overflow-y-auto border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <div key={item.label} className="border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )
                    }
                    className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-[#123b65]"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === item.label && (
                    <div className="pb-3 pl-4">
                      {item.items.map((subItem) => {
                        if (subItem.route) {
                          return (
                            <Link
                              key={subItem.label}
                              to={subItem.href}
                              onClick={closeMenu}
                              className="block py-3 text-sm text-slate-600"
                            >
                              {subItem.label}
                            </Link>
                          );
                        }

                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={closeMenu}
                            className="block py-3 text-sm text-slate-600"
                          >
                            {subItem.label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
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

      <main>
        {/* HERO */}
        <section
          id="personal"
          className="relative min-h-[620px] overflow-hidden bg-[#102f50] lg:min-h-[680px]"
        >
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
            alt="Modern city architecture"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 via-[#092b4d]/85 to-[#092b4d]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092b4d]/50 via-transparent to-transparent" />

          <div className="relative mx-auto grid min-h-[620px] max-w-[1400px] items-center gap-12 px-5 py-16 sm:px-8 lg:min-h-[680px] lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
            <div className="max-w-2xl text-white">
              <p className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                <span className="h-0.5 w-9 bg-[#c72c3b]" />
                Welcome to {BANK_SHORT}
              </p>

              <h2 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[66px]">
                Banking that puts your future first.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
                Discover a convenient digital banking experience. Explore
                financial services, manage your account and take the next step
                towards your financial goals.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-md bg-[#c72c3b] px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#a91f2e]"
                >
                  Become a member
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md border border-white/70 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Access online banking
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-blue-100">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-200" />
                  Security awareness
                </span>
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-blue-200" />
                  Digital account access
                </span>
              </div>
            </div>

            {/* ONLINE BANKING PANEL */}
            <div className="mx-auto w-full max-w-[420px] lg:ml-auto">
              <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#145da0]">
                      <LockKeyhole className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#123b65]">
                        Online Banking
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Member account access
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c72c3b]">
                    Member portal
                  </p>

                  <h4 className="mt-3 text-2xl font-bold text-slate-900">
                    Welcome back.
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Sign in to access your TCSCU member account and explore
                    available banking features.
                  </p>

                  <Link
                    to="/login"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#145da0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0d3d6c]"
                  >
                    Sign in to online banking
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold text-slate-400">
                      NEW TO TCSCU?
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-md border border-[#145da0] px-5 py-4 text-sm font-bold text-[#145da0] transition hover:bg-blue-50"
                  >
                    Create a member account
                  </Link>

                  <div className="mt-5 flex items-start gap-2 rounded-md bg-slate-50 p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#145da0]" />
                    <p className="text-xs leading-5 text-slate-500">
                      Protect your password and verification codes. Only sign
                      in through the official TCSCU website.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-100">
                <LockKeyhole className="h-3.5 w-3.5" />
                <span>Use secure account access practices</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className="relative z-10 border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-slate-200 px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-10">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              const content = (
                <>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#123b65]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
                </>
              );

              return item.route ? (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group flex items-center gap-4 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7"
                >
                  {content}
                </Link>
              ) : (
                <a
                  key={item.title}
                  href={item.link}
                  className="group flex items-center gap-4 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>

        {/* SERVICES */}
        <section id="banking" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                  Banking with TCSCU
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">
                  Explore our financial services
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-500">
                  Find the services you need and explore the possibilities
                  available through our digital platform.
                </p>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#145da0] hover:text-[#c72c3b]"
              >
                Explore membership
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.title}
                    className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    <span className="absolute right-6 top-6 text-xs font-bold tracking-widest text-slate-200">
                      {service.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4fa] text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-[#123b65]">
                      {service.title}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>

                    <Link
                      to={service.link}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#145da0] transition group-hover:text-[#c72c3b]"
                    >
                      {service.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SAVINGS AND LOANS PROMOTION */}
        <section id="loans" className="bg-[#f3f6f9] py-20">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div className="group relative min-h-[380px] overflow-hidden rounded-xl bg-[#123b65] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85"
                alt="Person reviewing financial documents and planning finances"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#092b4d]/90 via-[#092b4d]/15 to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                  Plan ahead
                </p>
                <h3 className="mt-3 max-w-md text-2xl font-bold sm:text-3xl">
                  Make your next move with confidence.
                </h3>
              </div>
            </div>

            <div id="savings" className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Financial opportunities
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#123b65] sm:text-4xl">
                Financial solutions for the things that matter.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Whether you are planning your savings, exploring financing
                options or managing your everyday finances, discover the
                services available through TCSCU.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#145da0]" />
                  <span className="text-sm text-slate-600">
                    Explore available savings services
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#145da0]" />
                  <span className="text-sm text-slate-600">
                    Learn about financing options
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#145da0]" />
                  <span className="text-sm text-slate-600">
                    Make informed financial decisions
                  </span>
                </div>
              </div>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#145da0] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0d3d6c]"
              >
                Explore our services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* DIGITAL BANKING */}
        <section id="cards" className="bg-white py-20">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Digital banking
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#123b65] sm:text-4xl">
                Your banking experience, accessible online.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Access your member account through the TCSCU digital platform.
                Explore account information, available services and your
                banking activities.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123b65]">
                      Convenient online access
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Access your member account through the online platform.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123b65]">
                      Account security awareness
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Follow recommended practices to protect your account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123b65]">
                      Manage your financial activities
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      View available banking features from your account.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-9 inline-flex items-center gap-3 rounded-md bg-[#145da0] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0d3d6c]"
              >
                Sign in to online banking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
                alt="Person using a laptop for digital services"
                loading="lazy"
                className="h-[390px] w-full rounded-xl object-cover shadow-xl"
              />

              <div className="absolute -bottom-6 left-5 right-5 rounded-lg border border-slate-100 bg-white p-5 shadow-xl sm:left-10 sm:right-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                    <LockKeyhole className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123b65]">
                      Your account. Your access.
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Use the official member portal to access your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP BENEFITS */}
        <section id="membership" className="bg-[#102f50] py-20 text-white">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                The TCSCU experience
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Membership built around your financial journey.
              </h2>

              <p className="mt-5 text-base leading-8 text-blue-100/75">
                Explore a member-focused digital experience designed to make
                account access, financial information and service discovery
                easier to navigate.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-lg border border-white/10 bg-white/[0.05] p-7 transition hover:-translate-y-1 hover:bg-white/[0.09]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-blue-200">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-blue-100/70">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-md bg-[#c72c3b] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#a91f2e]"
              >
                Start your membership
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW MEMBERSHIP WORKS */}
        <section id="approach" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Getting started
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#123b65] sm:text-4xl">
                Your membership journey, made clear.
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-500">
                Follow the steps below to begin exploring membership and
                accessing the TCSCU digital platform.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {membershipSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.number} className="relative">
                    {index !== 2 && (
                      <div className="absolute left-[70px] top-9 hidden h-px w-[calc(100%-35px)] bg-slate-200 md:block" />
                    )}

                    <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[#145da0]">
                      <Icon className="h-8 w-8" />
                    </div>

                    <p className="mt-7 text-xs font-bold tracking-[0.2em] text-[#c72c3b]">
                      STEP {step.number}
                    </p>

                    <h3 className="mt-3 text-xl font-bold text-[#123b65]">
                      {step.title}
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-md bg-[#145da0] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#0d3d6c]"
              >
                Begin registration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FINANCIAL WELLNESS */}
        <section id="wellness" className="bg-[#f3f6f9] py-20">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div className="relative overflow-hidden rounded-xl bg-[#123b65]">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85"
                alt="Financial planning and analytics on a computer screen"
                loading="lazy"
                className="h-[360px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#092b4d]/70 to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                  Think ahead
                </p>
                <h3 className="mt-2 text-2xl font-bold">
                  Make informed financial decisions.
                </h3>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Financial wellness
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#123b65] sm:text-4xl">
                A thoughtful approach to your financial future.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Good financial decisions start with understanding your
                priorities. Build healthy financial habits and take time to
                consider the choices available to you.
              </p>

              <div className="mt-8 space-y-6">
                {wellnessItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#145da0] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#123b65]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/register"
                className="mt-9 inline-flex items-center gap-3 text-sm font-bold text-[#145da0] transition hover:text-[#c72c3b]"
              >
                Explore TCSCU services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* PLANNING CTA */}
        <section id="planning" className="bg-white py-16">
          <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Plan with purpose
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#123b65] sm:text-3xl">
                Take the next step in your financial journey.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Explore the available TCSCU services and learn how to get
                started as a member.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-3 rounded-md bg-[#c72c3b] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#a91f2e]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-[#102f50] py-20 text-white">
          <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                About our institution
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                The Chaplaincy Savings and Credit Union
              </h2>

              <p className="mt-6 text-base leading-8 text-blue-100/80">
                TCSCU brings member account access and financial services
                together through a digital platform.
              </p>

              <p className="mt-4 text-base leading-8 text-blue-100/80">
                Explore our platform, learn about available services and
                discover how to get started.
              </p>

              {/* INSTITUTIONAL DETAILS */}
              <div className="mt-8 space-y-6 border-t border-white/15 pt-7">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                      Address
                    </p>
                    <p className="mt-2 text-sm leading-7 text-blue-100/90">
                      {INSTITUTION_ADDRESS}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                      Director
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-white">
                      {DIRECTOR_NAME}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-3 rounded-md bg-white px-7 py-4 text-sm font-bold text-[#123b65] transition hover:bg-blue-50"
              >
                Discover TCSCU
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg border border-white/15 bg-white/5 p-7 transition hover:bg-white/10">
                <Users className="h-8 w-8 text-blue-300" />
                <h3 className="mt-5 text-lg font-bold">Member focused</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/70">
                  A platform designed around member access and financial
                  services.
                </p>
              </div>

              <div className="rounded-lg border border-white/15 bg-white/5 p-7 transition hover:bg-white/10">
                <Globe2 className="h-8 w-8 text-blue-300" />
                <h3 className="mt-5 text-lg font-bold">Digital access</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/70">
                  Convenient access to your member account online.
                </p>
              </div>

              <div className="rounded-lg border border-white/15 bg-white/5 p-7 transition hover:bg-white/10">
                <Building2 className="h-8 w-8 text-blue-300" />
                <h3 className="mt-5 text-lg font-bold">Financial services</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/70">
                  Explore available account and financial service options.
                </p>
              </div>

              <div className="rounded-lg border border-white/15 bg-white/5 p-7 transition hover:bg-white/10">
                <BadgeCheck className="h-8 w-8 text-blue-300" />
                <h3 className="mt-5 text-lg font-bold">Informed banking</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/70">
                  Find information to help you use the digital platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="bg-white py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-[#145da0]" />

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Your security matters
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#123b65] sm:text-4xl">
                Stay informed. Protect your account.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-500">
                Good security habits help protect your personal information
                and online banking access.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {securityTips.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-slate-200 p-7 text-center transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Icon className="mx-auto h-9 w-9 text-[#145da0]" />

                    <h3 className="mt-5 font-bold text-[#123b65]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-[#f3f6f9] py-20">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Frequently asked questions
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#123b65] sm:text-4xl">
                Helpful answers to get you started.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-500">
                Find answers to common questions about membership, online
                account access and the services available through TCSCU.
              </p>

              <div className="mt-8 rounded-lg bg-[#102f50] p-6 text-white">
                <div className="flex items-center gap-3">
                  <CircleHelp className="h-7 w-7 text-blue-300" />
                  <h3 className="font-bold">Still need assistance?</h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-blue-100/75">
                  Visit the member support section for further assistance.
                </p>

                <Link
                  to="/login"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-blue-200"
                >
                  Visit member support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFaq(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-sm font-bold leading-6 text-[#123b65] sm:text-base">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#145da0] transition ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
                        <p className="text-sm leading-7 text-slate-500">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT AND SUPPORT */}
        <section
          id="support"
          className="border-y border-slate-200 bg-white py-20"
        >
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                  Contact and support
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#123b65] sm:text-4xl">
                  We're here to help you navigate your account.
                </h2>

                <p className="mt-5 max-w-xl text-base leading-8 text-slate-500">
                  For assistance with account access or available services,
                  use the appropriate TCSCU member support channel.
                </p>

                <div className="mt-9 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#123b65]">
                        Institutional address
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                        {INSTITUTION_ADDRESS}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
                      <Headphones className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#123b65]">
                        Member assistance
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        Sign in to explore available member support services.
                      </p>
                      <Link
                        to="/login"
                        className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#145da0] hover:text-[#c72c3b]"
                      >
                        Access member support
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#102f50] p-7 text-white shadow-xl sm:p-9">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-blue-200">
                  <HeartHandshake className="h-7 w-7" />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                  Become part of TCSCU
                </p>

                <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Take your next step with us.
                </h3>

                <p className="mt-4 text-sm leading-7 text-blue-100/75">
                  Explore the membership registration process and discover
                  the services available through the TCSCU digital platform.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#c72c3b] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#a91f2e]"
                  >
                    Become a member
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="bg-[#f3f6f9] py-16">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 px-5 text-center sm:px-8 md:flex-row md:text-left lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c72c3b]">
                Your financial journey starts here
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#123b65] sm:text-3xl">
                Ready to explore TCSCU?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Create your account and discover the TCSCU digital platform.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-md bg-[#145da0] px-8 py-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0d3d6c]"
            >
              Get started today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0a2038] text-white">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr] lg:px-12">
          {/* BRAND */}
          <div>
            <a
              href="/"
              onClick={scrollToTop}
              className="flex items-center gap-3"
            >
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
            </a>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Explore the TCSCU digital platform and learn about the financial
              services available to members.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <Globe2 className="h-4 w-4 text-blue-300" />
              <span>Digital member access</span>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="font-bold">Explore</h4>
            <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400">
              <a href="#banking" className="transition hover:text-white">
                Banking services
              </a>
              <a href="#loans" className="transition hover:text-white">
                Savings and loans
              </a>
              <a href="#membership" className="transition hover:text-white">
                Membership benefits
              </a>
              <a href="#about" className="transition hover:text-white">
                About TCSCU
              </a>
              <a href="#faq" className="transition hover:text-white">
                FAQs
              </a>
            </div>
          </div>

          {/* MEMBER SERVICES */}
          <div>
            <h4 className="font-bold">Member services</h4>
            <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400">
              <Link to="/login" className="transition hover:text-white">
                Online banking
              </Link>
              <Link to="/register" className="transition hover:text-white">
                Become a member
              </Link>
              <Link to="/login" className="transition hover:text-white">
                Member support
              </Link>
              <a href="#security" className="transition hover:text-white">
                Security centre
              </a>
            </div>
          </div>

          {/* INSTITUTIONAL INFORMATION */}
          <div>
            <h4 className="font-bold">Institutional information</h4>

            <div className="mt-6 space-y-5 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                <p className="leading-6">{INSTITUTION_ADDRESS}</p>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Director
                  </p>
                  <p className="mt-1 text-slate-300">{DIRECTOR_NAME}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
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
              <a href="#faq" className="transition hover:text-white">
                FAQs
              </a>
              <a href="#about" className="transition hover:text-white">
                About us
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#145da0] text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#0d3d6c]"
        >
          <ArrowUpRight className="h-5 w-5 -rotate-45" />
        </button>
      )}
    </div>
  );
};

export default Home;
