import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ---------- Global background & graphical expressions ---------- */
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background-color: #f8fafc;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background-image:
        radial-gradient(circle at 12% 18%, rgba(20, 93, 160, 0.10), transparent 38%),
        radial-gradient(circle at 88% 72%, rgba(199, 44, 59, 0.07), transparent 42%),
        radial-gradient(circle at 50% 110%, rgba(18, 59, 101, 0.08), transparent 50%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Ccircle cx='2' cy='2' r='1.1' fill='%23145da0' fill-opacity='0.14'/%3E%3C/svg%3E");
      background-size: auto, auto, auto, 48px 48px;
    }

    /* ---------- SPA page visibility ---------- */
    [data-page] { display: none; }
    [data-page].active { display: block; }

    /* ---------- Reusable visual utilities ---------- */
    .glass {
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }
    .card-hover {
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 22px 55px -20px rgba(9, 43, 77, 0.28);
      border-color: #145da0;
    }
    .gradient-text {
      background: linear-gradient(92deg, #145da0 0%, #123b65 55%, #c72c3b 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: .55rem;
      border-radius: .375rem; background: #c72c3b; color: #fff;
      padding: .95rem 1.75rem; font-size: .875rem; font-weight: 700;
      box-shadow: 0 14px 28px -14px rgba(199, 44, 59, .65);
      transition: all .2s ease; text-align: center;
    }
    .btn-primary:hover { background: #a91f2e; transform: translateY(-1px); }
    .btn-secondary {
      display: inline-flex; align-items: center; justify-content: center; gap: .55rem;
      border-radius: .375rem; border: 1px solid rgba(255,255,255,.7);
      background: rgba(255,255,255,.06); color: #fff;
      padding: .95rem 1.75rem; font-size: .875rem; font-weight: 700;
      transition: all .2s ease; text-align: center;
    }
    .btn-secondary:hover { background: rgba(255,255,255,.16); }
    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: .55rem;
      border-radius: .375rem; border: 1px solid #145da0; color: #145da0;
      padding: .95rem 1.75rem; font-size: .875rem; font-weight: 700;
      transition: all .2s ease; text-align: center;
    }
    .btn-outline:hover { background: #eff6ff; }
    .section-pad { padding-top: 4.5rem; padding-bottom: 4.5rem; }
    @media (min-width: 640px) { .section-pad { padding-top: 5.5rem; padding-bottom: 5.5rem; } }

    /* ---------- Weather / FX / Loan app polish ---------- */
    .app-input, .app-select {
      width: 100%; border-radius: .5rem; border: 1px solid #cbd5e1;
      background: #fff; padding: .7rem .85rem; font-size: .875rem;
      color: #0f172a; outline: none; transition: border .2s, box-shadow .2s;
    }
    .app-input:focus, .app-select:focus {
      border-color: #145da0; box-shadow: 0 0 0 3px rgba(20, 93, 160, .15);
    }
    .app-result {
      background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 70%);
      border: 1px solid #dbeafe; border-radius: .75rem;
    }

    /* ---------- Accessibility panel ---------- */
    .access-panel {
      position: fixed; bottom: 88px; right: 18px; z-index: 90;
      width: min(340px, calc(100vw - 36px)); max-height: 75vh; overflow-y: auto;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem;
      box-shadow: 0 25px 65px -15px rgba(9, 43, 77, .45);
      padding: 1.15rem; transition: opacity .2s, transform .2s;
    }
    .access-panel.hidden { opacity: 0; transform: translateY(10px); pointer-events: none; }
    .access-fab {
      position: fixed; bottom: 20px; right: 18px; z-index: 95;
      display: flex; align-items: center; justify-content: center;
      width: 56px; height: 56px; border-radius: 9999px;
      background: #123b65; color: #fff; border: 2px solid rgba(255,255,255,.35);
      box-shadow: 0 12px 30px -8px rgba(9, 43, 77, .6);
      cursor: pointer; transition: transform .2s, background .2s;
    }
    .access-fab:hover { transform: translateY(-2px); background: #145da0; }

    /* High contrast mode */
    body.high-contrast {
      background: #000 !important;
      color: #fff !important;
    }
    body.high-contrast::before { display: none; }
    body.high-contrast .bg-white,
    body.high-contrast .bg-slate-50,
    body.high-contrast .bg-slate-100,
    body.high-contrast .bg-\[\#f5f6f7\],
    body.high-contrast .glass {
      background: #111 !important;
      color: #fff !important;
    }
    body.high-contrast .text-slate-800,
    body.high-contrast .text-slate-700,
    body.high-contrast .text-slate-600,
    body.high-contrast .text-slate-500,
    body.high-contrast .text-\[\#123b65\],
    body.high-contrast .text-slate-900 {
      color: #f8fafc !important;
    }
    body.high-contrast .border-slate-200,
    body.high-contrast .border-slate-300 {
      border-color: #475569 !important;
    }
    body.high-contrast .btn-outline { border-color: #93c5fd; color: #93c5fd; }
    body.high-contrast .btn-primary { background: #f43f5e; }
    body.high-contrast .app-input,
    body.high-contrast .app-select {
      background: #1e293b; color: #fff; border-color: #475569;
    }

    /* Responsive logo guard */
    .site-logo { height: 2.75rem; width: auto; max-width: 3rem; object-fit: contain; }
    @media (min-width: 640px) { .site-logo { height: 3.25rem; max-width: 3.75rem; } }

    /* Smooth focus rings */
    a:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible {
      outline: 3px solid rgba(20, 93, 160, .55);
      outline-offset: 2px;
    }

    /* Google translate widget tightening */
    #google_translate_element .goog-te-gadget { font-size: 0 !important; }
    #google_translate_element .goog-te-gadget .goog-te-combo,
    #google_translate_element_mobile .goog-te-gadget .goog-te-combo {
      font-size: 12px !important; padding: 5px 8px; border-radius: 6px;
      border: 1px solid #cbd5e1; background: #fff; color: #0f172a; max-width: 170px;
    }
    #google_translate_element .goog-logo-link,
    #google_translate_element_mobile .goog-logo-link { display: none !important; }
    #google_translate_element .goog-te-gadget span,
    #google_translate_element_mobile .goog-te-gadget span { display: none !important; }
    .goog-te-banner-frame { display: none !important; }
    body { top: 0 !important; }

    /* Hide scrollbar on the accessibility panel only */
    .access-panel::-webkit-scrollbar { width: 6px; }
    .access-panel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  `;

const routeMap = {
  "/": "home", "/about": "about", "/leadership": "leadership",
  "/services": "services", "/privacy": "privacy", "/membership": "benefits",
  "/benefits": "benefits", "/terms": "terms", "/fraud": "fraud",
  "/accessibility": "accessibility",
};

export default function Home() {
  const location = useLocation();
  const activePage = routeMap[location.pathname.replace(/\/$/, "") || "/"] || "home";

  useEffect(() => {
    document.body.classList.add("min-h-screen", "overflow-x-hidden", "bg-slate-50", "text-slate-800", "antialiased");
    const styleId = "tcscu-react-global-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId; style.textContent = pageStyles; document.head.appendChild(style);
    }
    const initializeTCSCU = () => {

    /* React Router controls page visibility. */
    /* ---------- Mobile menu ---------- */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    function closeMobileMenu() {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function () {
        const isHidden = mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', String(!isHidden));
      });
    }
    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    /* ---------- Year ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- Loan calculator ---------- */
    function formatGBP(num) {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(num);
    }
    function calculateLoan() {
      const amount = parseFloat(document.getElementById('loanAmount').value);
      const annualRate = parseFloat(document.getElementById('loanRate').value);
      const months = parseInt(document.getElementById('loanTerm').value, 10);
      const errorEl = document.getElementById('loanError');
      const resultEl = document.getElementById('loanResult');
      errorEl.classList.add('hidden');
      resultEl.classList.add('hidden');

      if (!amount || amount <= 0 || isNaN(annualRate) || annualRate < 0 || !months || months <= 0) {
        errorEl.textContent = 'Please enter a valid loan amount, interest rate and term.';
        errorEl.classList.remove('hidden');
        return;
      }

      const monthlyRate = annualRate / 100 / 12;
      let monthlyPayment;
      if (monthlyRate === 0) {
        monthlyPayment = amount / months;
      } else {
        monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
      }
      const totalRepayment = monthlyPayment * months;
      const totalInterest = totalRepayment - amount;

      document.getElementById('loanMonthly').textContent = formatGBP(monthlyPayment);
      document.getElementById('loanInterest').textContent = formatGBP(totalInterest);
      document.getElementById('loanTotal').textContent = formatGBP(totalRepayment);
      resultEl.classList.remove('hidden');
    }
    document.getElementById('loanBtn').addEventListener('click', calculateLoan);

    /* ---------- Weather app (Open-Meteo) ---------- */
    const weatherBtn = document.getElementById('weatherBtn');
    const weatherCityInput = document.getElementById('weatherCity');
    const weatherResult = document.getElementById('weatherResult');
    const weatherError = document.getElementById('weatherError');

    const weatherCodes = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      66: 'Light freezing rain', 67: 'Heavy freezing rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
      82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };

    async function getWeather() {
      const city = weatherCityInput.value.trim();
      weatherError.classList.add('hidden');
      weatherResult.classList.add('hidden');
      if (!city) {
        weatherError.textContent = 'Please enter a city name.';
        weatherError.classList.remove('hidden');
        return;
      }
      weatherBtn.disabled = true;
      weatherBtn.textContent = 'Loading…';
      try {
        const geoRes = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json');
        if (!geoRes.ok) throw new Error('Geocoding failed');
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found');
        }
        const place = geoData.results[0];
        const lat = place.latitude;
        const lon = place.longitude;
        const label = [place.name, place.admin1, place.country].filter(Boolean).join(', ');

        const wxRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto');
        if (!wxRes.ok) throw new Error('Weather fetch failed');
        const wxData = await wxRes.json();
        const current = wxData.current;
        const desc = weatherCodes[current.weather_code] || 'Weather data';

        weatherResult.innerHTML =
          '<div class="flex flex-col gap-1">' +
            '<p class="text-xs font-semibold uppercase tracking-wider text-slate-500">' + label + '</p>' +
            '<p class="text-2xl font-extrabold text-[#123b65]">' + Math.round(current.temperature_2m) + '°C</p>' +
            '<p class="text-sm text-slate-700">' + desc + ' · Feels like ' + Math.round(current.apparent_temperature) + '°C</p>' +
            '<p class="text-xs text-slate-500">Humidity: ' + current.relative_humidity_2m + '% · Wind: ' + current.wind_speed_10m + ' km/h</p>' +
          '</div>';
        weatherResult.classList.remove('hidden');
      } catch (err) {
        weatherError.textContent = err.message === 'City not found'
          ? 'City not found. Please try another location.'
          : 'Unable to load weather data. Please try again later.';
        weatherError.classList.remove('hidden');
      } finally {
        weatherBtn.disabled = false;
        weatherBtn.textContent = 'Get weather';
      }
    }
    weatherBtn.addEventListener('click', getWeather);
    weatherCityInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') getWeather(); });

    /* ---------- FX calculator (ExchangeRate-API) ---------- */
    const fxBtn = document.getElementById('fxBtn');
    const fxAmount = document.getElementById('fxAmount');
    const fxFrom = document.getElementById('fxFrom');
    const fxTo = document.getElementById('fxTo');
    const fxResult = document.getElementById('fxResult');
    const fxError = document.getElementById('fxError');
    let fxRates = null;
    let fxBase = 'GBP';

    async function loadRates(base) {
      const res = await fetch('https://open.er-api.com/v6/latest/' + base);
      if (!res.ok) throw new Error('Rate fetch failed');
      const data = await res.json();
      if (data.result !== 'success' || !data.rates) throw new Error('Invalid rate data');
      return data.rates;
    }

    function populateCurrencySelects(rates) {
      const currencies = Object.keys(rates).sort();
      fxFrom.innerHTML = currencies.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
      fxTo.innerHTML = currencies.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
      fxFrom.value = 'GBP';
      fxTo.value = 'USD';
    }

    async function convertFX() {
      const amount = parseFloat(fxAmount.value);
      const from = fxFrom.value;
      const to = fxTo.value;
      fxError.classList.add('hidden');
      fxResult.classList.add('hidden');

      if (isNaN(amount) || amount < 0) {
        fxError.textContent = 'Please enter a valid amount.';
        fxError.classList.remove('hidden');
        return;
      }
      if (from === to) {
        fxResult.innerHTML = '<p class="text-sm font-bold text-[#123b65]">' + amount.toFixed(2) + ' ' + from + ' = ' + amount.toFixed(2) + ' ' + to + '</p>';
        fxResult.classList.remove('hidden');
        return;
      }
      fxBtn.disabled = true;
      fxBtn.textContent = 'Converting…';
      try {
        if (!fxRates || fxBase !== from) {
          fxRates = await loadRates(from);
          fxBase = from;
        }
        const rate = fxRates[to];
        if (!rate) throw new Error('Rate unavailable');
        const converted = amount * rate;
        fxResult.innerHTML =
          '<div class="flex flex-col gap-1">' +
            '<p class="text-xs font-semibold uppercase tracking-wider text-slate-500">' + from + ' → ' + to + '</p>' +
            '<p class="text-2xl font-extrabold text-[#123b65]">' + converted.toFixed(2) + ' ' + to + '</p>' +
            '<p class="text-xs text-slate-500">1 ' + from + ' = ' + rate.toFixed(6) + ' ' + to + '</p>' +
            '<p class="text-xs text-slate-500">Rate source: ExchangeRate-API · For indication only</p>' +
          '</div>';
        fxResult.classList.remove('hidden');
      } catch (err) {
        fxError.textContent = 'Unable to load exchange rates. Please try again later.';
        fxError.classList.remove('hidden');
      } finally {
        fxBtn.disabled = false;
        fxBtn.textContent = 'Convert';
      }
    }

    async function initFX() {
      try {
        const rates = await loadRates('GBP');
        fxRates = rates;
        fxBase = 'GBP';
        populateCurrencySelects(rates);
      } catch (err) {
        fxError.textContent = 'Exchange rates could not be loaded.';
        fxError.classList.remove('hidden');
      }
    }
    fxBtn.addEventListener('click', convertFX);
    initFX();

    /* ---------- Google Translate ---------- */
    function googleTranslateElementInit() {
      var langs = 'en,fr,es,de,it,pt,ar,zh-CN,ja,ko,hi,ur,pl,ro,tr,ru,nl,yo,ig,ha,sw';
      if (document.getElementById('google_translate_element')) {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: langs,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
      if (document.getElementById('google_translate_element_mobile')) {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: langs,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element_mobile');
      }
    }

    /* Programmatic translation from the accessibility dropdowns */
    function translatePage(lang) {
      if (!lang) return;
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        return;
      }
      /* Retry once the widget has finished rendering */
      setTimeout(function () {
        var retry = document.querySelector('.goog-te-combo');
        if (retry) {
          retry.value = lang;
          retry.dispatchEvent(new Event('change'));
        }
      }, 900);
    }

    /* ---------- Accessibility ---------- */
    const accessFab = document.getElementById('accessFab');
    const accessPanel = document.getElementById('accessPanel');
    const closeAccessPanelBtn = document.getElementById('closeAccessPanel');

    function openAccessPanel() {
      accessPanel.classList.remove('hidden');
      accessFab.setAttribute('aria-expanded', 'true');
    }
    function closeAccessPanel() {
      accessPanel.classList.add('hidden');
      accessFab.setAttribute('aria-expanded', 'false');
    }
    accessFab.addEventListener('click', function () {
      if (accessPanel.classList.contains('hidden')) openAccessPanel();
      else closeAccessPanel();
    });
    closeAccessPanelBtn.addEventListener('click', closeAccessPanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAccessPanel();
    });

    let currentTextSize = 100;
    function setTextSize(percent) {
      currentTextSize = Number(percent);
      document.documentElement.style.fontSize = currentTextSize + '%';
      var sel = document.getElementById('accessTextSize');
      if (sel) sel.value = String(currentTextSize);
    }
    function changeTextSize(direction) {
      const sizes = [100, 112, 125, 140];
      let idx = sizes.indexOf(currentTextSize);
      if (idx === -1) idx = 0;
      idx = Math.min(sizes.length - 1, Math.max(0, idx + direction));
      currentTextSize = sizes[idx];
      document.documentElement.style.fontSize = currentTextSize + '%';
      const sel = document.getElementById('accessTextSize');
      if (sel) sel.value = String(currentTextSize);
    }
    function toggleContrast() {
      document.body.classList.toggle('high-contrast');
    }
    function resetAccessibility() {
      currentTextSize = 100;
      document.documentElement.style.fontSize = '100%';
      document.body.classList.remove('high-contrast');
      const sel = document.getElementById('accessTextSize');
      if (sel) sel.value = '100';
    }

    /* ---------- Close mobile menu on resize ---------- */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1280) closeMobileMenu();
    });
    window.googleTranslateElementInit = googleTranslateElementInit;
  
    window.changeTextSize = changeTextSize;
    window.toggleContrast = toggleContrast;
    window.resetAccessibility = resetAccessibility;
    window.closeAccessPanel = closeAccessPanel;
    window.translatePage = translatePage;
    window.setTextSize = setTextSize;

    };
    initializeTCSCU();
    const translateScript = document.createElement("script");
    translateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    translateScript.async = true; document.body.appendChild(translateScript);
    return () => { translateScript.remove(); };
  }, []);

  return (
    <>
      <style>{pageStyles}</style>
      <div className="tcscu-site">


<div className="border-b border-slate-200 bg-[#f5f6f7]">
<div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-10">
<div className="hidden flex-wrap items-center gap-5 md:flex lg:gap-6">
<a href="/" className="font-medium transition hover:text-[#145da0]">Home</a>
<a href="/about" className="transition hover:text-[#145da0]">About TCSCU</a>
<a href="/leadership" className="transition hover:text-[#145da0]">Leadership</a>
<a href="/services" className="transition hover:text-[#145da0]">Core services</a>
<a href="/membership" className="transition hover:text-[#145da0]">Membership benefits</a>
<a href="/fraud" className="transition hover:text-[#145da0]">Security centre</a>
</div>
<div className="ml-auto flex items-center gap-3 sm:gap-4">
<div className="hidden items-center gap-2 sm:flex">
<svg className="h-3.5 w-3.5 text-[#145da0]" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
<span className="hidden lg:inline">Digital banking access</span>
</div>

<div className="flex items-center gap-2">
<svg className="h-3.5 w-3.5 shrink-0 text-[#145da0]" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
<div id="google_translate_element" className="shrink-0" aria-label="Google Translate language selector"></div>
</div>
</div>
</div>
</div>

<header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
<div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">

<a href="/" className="flex min-w-0 items-center gap-3" aria-label="The Chaplaincy Savings and Credit Union homepage">
<img src="https://www.tcscu.co.uk/logom.png" alt="The Chaplaincy Savings and Credit Union logo: a stylised circular mark with the letters TCSCU and the full institution name displayed alongside." className="site-logo shrink-0 object-contain" loading="eager" />
<div className="min-w-0">
<p className="max-w-[190px] text-[13px] font-extrabold leading-4 tracking-tight text-[#123b65] sm:max-w-none sm:text-base sm:leading-5">The Chaplaincy Savings and Credit Union</p>
<p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c72c3b]">TCSCU</p>
</div>
</a>

<nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
<a href="/" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Home</a>
<a href="/about" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">About us</a>
<a href="/leadership" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Leadership</a>
<a href="/services" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Core services</a>
<a href="/membership" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Membership</a>
<a href="/privacy" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Privacy</a>
<a href="/terms" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Terms</a>
<a href="/fraud" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Fraud warning</a>
<a href="/accessibility" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#145da0]">Accessibility</a>
</nav>

<div className="hidden items-center gap-3 lg:flex">
<a className="btn-outline !px-5 !py-3 text-sm" href="https://tcscu.co.uk/login">Online banking</a>
<a className="btn-primary !px-5 !py-3 text-sm" href="https://tcscu.co.uk/register">Become a member</a>
</div>

<button id="mobileMenuBtn" type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 text-[#123b65] xl:hidden" aria-label="Open menu" aria-expanded="false">
<svg className="h-6 w-6" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>
</button>
</div>

<div id="mobileMenu" className="hidden border-t border-slate-200 bg-white px-4 pb-5 pt-3 xl:hidden">
<nav className="grid gap-1" aria-label="Mobile navigation">
<a href="/" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Home</a>
<a href="/about" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">About us</a>
<a href="/leadership" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Leadership & team</a>
<a href="/services" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Core services</a>
<a href="/membership" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Membership benefits</a>
<a href="/privacy" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Privacy policy</a>
<a href="/terms" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Terms of service</a>
<a href="/fraud" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Web fraud & phishing</a>
<a href="/accessibility" className="mobile-link rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Accessibility statement</a>
</nav>
<div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
<a className="btn-outline w-full" href="https://tcscu.co.uk/login">Online banking</a>
<a className="btn-primary w-full" href="https://tcscu.co.uk/register">Become a member</a>
</div>
<div className="mt-3 border-t border-slate-200 pt-3">
<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Translate this page</p>
<div id="google_translate_element_mobile"></div>
</div>
</div>
</header>


        <main id="app">
<section data-page="home" id="home" className={activePage === "home" ? "active" : ""}>

<section className="relative min-h-[620px] overflow-hidden bg-[#102f50] lg:min-h-[680px]">
<img alt="Pictorial description: a modern financial district at dusk with glass-fronted office towers and warm interior lighting, representing institutional banking, global portfolio management and secure digital account access." className="absolute inset-0 h-full w-full object-cover object-center" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85" loading="eager" />
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 via-[#092b4d]/85 to-[#092b4d]/35"></div>
<div className="absolute inset-0 bg-gradient-to-t from-[#092b4d]/60 via-transparent to-transparent"></div>
<div className="relative mx-auto grid min-h-[620px] max-w-[1400px] items-center gap-12 px-5 py-16 sm:px-8 lg:min-h-[680px] lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
<div className="max-w-2xl text-white">
<p className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
<span className="h-0.5 w-9 bg-[#c72c3b]"></span>Welcome to TCSCU
            </p>
<h1 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-[66px]">Banking that puts your future first.</h1>
<p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">Discover a convenient digital banking experience. Explore financial services, manage your account and take the next step towards your financial goals.</p>
<div className="mt-9 flex flex-col gap-3 sm:flex-row">
<a className="btn-primary" href="https://tcscu.co.uk/register">
                Become a member
                <svg className="h-4 w-4" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</a>
<a className="btn-secondary" href="https://tcscu.co.uk/login">Online banking</a>
</div>
<div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-blue-100">
<span className="flex items-center gap-2">
<svg className="h-4 w-4 text-blue-200" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                Security awareness
              </span>
<span className="flex items-center gap-2">
<svg className="h-4 w-4 text-blue-200" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                Digital account access
              </span>
</div>
</div>

<div className="mx-auto w-full max-w-[420px] lg:ml-auto">
<div className="overflow-hidden rounded-xl bg-white shadow-2xl">
<div className="border-b border-slate-200 px-6 py-5">
<div className="flex items-center gap-3">
<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#145da0]">
<svg className="h-6 w-6" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
</div>
<div>
<h3 className="text-lg font-bold text-[#123b65]">Online Banking</h3>
<p className="mt-0.5 text-xs text-slate-500">Member account access</p>
</div>
</div>
</div>
<div className="p-6 sm:p-7">
<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c72c3b]">Member portal</p>
<h4 className="mt-3 text-2xl font-bold text-slate-900">Welcome back.</h4>
<p className="mt-2 text-sm leading-6 text-slate-500">Sign in to access your TCSCU member account and explore available banking features.</p>
<a className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#145da0] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#0d3d6c]" href="https://tcscu.co.uk/login">
                  Sign in to online banking
                  <svg className="h-4 w-4" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</a>
<div className="my-5 flex items-center gap-3">
<div className="h-px flex-1 bg-slate-200"></div>
<span className="text-xs font-semibold text-slate-400">NEW TO TCSCU?</span>
<div className="h-px flex-1 bg-slate-200"></div>
</div>
<a className="flex w-full items-center justify-center rounded-md border border-[#145da0] px-5 py-4 text-sm font-bold text-[#145da0] transition hover:bg-blue-50" href="https://tcscu.co.uk/register">Create a member account</a>
<div className="mt-5 flex items-start gap-2 rounded-md bg-slate-50 p-3">
<svg className="mt-0.5 h-4 w-4 shrink-0 text-[#145da0]" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
<p className="text-xs leading-5 text-slate-500">Protect your password and verification codes. Only sign in through the official TCSCU website.</p>
</div>
</div>
</div>
<div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-100">
<svg className="h-3.5 w-3.5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
<span>Use secure account access practices</span>
</div>
</div>
</div>
</section>

<section className="relative z-10 border-b border-slate-200 bg-white shadow-sm">
<div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-slate-200 px-4 sm:grid-cols-4 sm:divide-y-0 lg:px-10">
<a className="group flex items-center gap-3 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7" href="/services">
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
</div>
<div className="min-w-0"><h3 className="text-sm font-bold text-[#123b65]">Everyday banking</h3><p className="mt-1 text-xs text-slate-500">Access your member account</p></div>
</a>
<a className="group flex items-center gap-3 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7" href="/services">
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.5-11 5 0 2.5 1.5 4.5 4 4.5h1"></path><path d="M2 9v1c0 1.1.9 2 2 2h1"></path><path d="M16 11h.01"></path><path d="M22 11h.01"></path></svg>
</div>
<div className="min-w-0"><h3 className="text-sm font-bold text-[#123b65]">Savings</h3><p className="mt-1 text-xs text-slate-500">Plan towards your goals</p></div>
</a>
<a className="group flex items-center gap-3 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7" href="/services">
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 7h20v10H2z"></path><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path><circle cx="12" cy="12" r="2"></circle></svg>
</div>
<div className="min-w-0"><h3 className="text-sm font-bold text-[#123b65]">Loans & credit</h3><p className="mt-1 text-xs text-slate-500">Explore financing options</p></div>
</a>
<a className="group flex items-center gap-3 px-4 py-6 transition hover:bg-slate-50 sm:px-5 lg:px-7" href="/services">
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0] transition group-hover:bg-[#145da0] group-hover:text-white">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path></svg>
</div>
<div className="min-w-0"><h3 className="text-sm font-bold text-[#123b65]">Cards & payments</h3><p className="mt-1 text-xs text-slate-500">Manage payments conveniently</p></div>
</a>
</div>
</section>

<section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="mb-12 max-w-3xl">
<p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]"><span className="h-0.5 w-9 bg-[#c72c3b]"></span>Banking with TCSCU</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Explore our financial services</h2>
<p className="mt-4 text-slate-600">Find the services you need and explore the possibilities available through our digital platform.</p>
</div>
<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#145da0]">
<svg className="h-7 w-7" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18"></path><path d="M5 21V7l8-4 8 4v14"></path><path d="M9 21v-6h6v6"></path></svg>
</div>
<p className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">01</p>
<h3 className="mt-2 text-xl font-bold text-[#123b65]">Everyday banking</h3>
<p className="mt-3 text-sm leading-6 text-slate-600">Explore account services and convenient ways to manage your everyday finances.</p>
<a href="https://tcscu.co.uk/register" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#145da0] hover:underline">Explore banking →</a>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#145da0]">
<svg className="h-7 w-7" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.5-11 5 0 2.5 1.5 4.5 4 4.5h1"></path><path d="M2 9v1c0 1.1.9 2 2 2h1"></path><path d="M16 11h.01"></path><path d="M22 11h.01"></path></svg>
</div>
<p className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">02</p>
<h3 className="mt-2 text-xl font-bold text-[#123b65]">Savings</h3>
<p className="mt-3 text-sm leading-6 text-slate-600">Explore savings options and plan towards your financial goals.</p>
<a href="https://tcscu.co.uk/register" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#145da0] hover:underline">Explore savings →</a>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#145da0]">
<svg className="h-7 w-7" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="10" rx="2"></rect><path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path><circle cx="12" cy="12" r="2"></circle></svg>
</div>
<p className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">03</p>
<h3 className="mt-2 text-xl font-bold text-[#123b65]">Loans</h3>
<p className="mt-3 text-sm leading-6 text-slate-600">Discover financing options and learn about the application process.</p>
<a href="https://tcscu.co.uk/register" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#145da0] hover:underline">Explore loans →</a>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#145da0]">
<svg className="h-7 w-7" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M2 10h20"></path></svg>
</div>
<p className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">04</p>
<h3 className="mt-2 text-xl font-bold text-[#123b65]">Cards & payments</h3>
<p className="mt-3 text-sm leading-6 text-slate-600">Explore available card services and convenient payment management.</p>
<a href="https://tcscu.co.uk/register" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#145da0] hover:underline">Learn more →</a>
</article>
</div>
</section>

<section className="border-y border-slate-200 bg-white">
<div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-10">
<div className="group relative min-h-[380px] overflow-hidden rounded-xl bg-[#123b65] shadow-xl">
<img alt="Pictorial description: a person reviewing financial documents and planning finances, representing the Plan ahead section. The image supports the surrounding text about financial planning and informed decision-making." loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85" />
<div className="absolute inset-0 bg-gradient-to-t from-[#092b4d]/90 via-[#092b4d]/15 to-transparent"></div>
<div className="absolute bottom-8 left-8 right-8 text-white">
<p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Plan ahead</p>
<h3 className="mt-3 max-w-md text-2xl font-bold sm:text-3xl">Make your next move with confidence.</h3>
</div>
</div>
<div>
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Financial opportunities</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Financial solutions for the things that matter.</h2>
<p className="mt-5 text-slate-600">Whether you are planning your savings, exploring financing options or managing your everyday finances, discover the services available through TCSCU.</p>
<ul className="mt-7 space-y-4 text-sm text-slate-700">
<li className="flex items-start gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">✓</span>Explore available savings services</li>
<li className="flex items-start gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">✓</span>Learn about financing options</li>
<li className="flex items-start gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">✓</span>Make informed financial decisions</li>
</ul>
<a className="btn-primary mt-8" href="/services">Explore our services</a>
</div>
</div>
</section>

<section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="grid items-center gap-12 lg:grid-cols-2">
<div>
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Digital banking</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Your banking experience, accessible online.</h2>
<p className="mt-4 text-slate-600">Access your member account through the TCSCU digital platform. Explore account information, available services and your banking activities.</p>
<a className="btn-outline mt-6" href="https://tcscu.co.uk/login">Sign in to online banking</a>
<div className="mt-8 grid gap-5 sm:grid-cols-1">
<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-[#123b65]">Convenient online access</h3><p className="mt-2 text-sm leading-6 text-slate-600">Access your member account through the online platform.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-[#123b65]">Account security awareness</h3><p className="mt-2 text-sm leading-6 text-slate-600">Follow recommended practices to protect your account.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-[#123b65]">Manage your financial activities</h3><p className="mt-2 text-sm leading-6 text-slate-600">View available banking features from your account.</p></div>
</div>
</div>
<div className="relative">
<img alt="Pictorial description: a person using a laptop for digital services, representing convenient online account access and member-focused digital banking." loading="lazy" className="h-[390px] w-full rounded-xl object-cover shadow-xl" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85" />
<div className="absolute -bottom-6 left-5 right-5 rounded-lg border border-slate-100 bg-white p-5 shadow-xl sm:left-10 sm:right-10">
<div className="flex items-center gap-4">
<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
<svg className="h-6 w-6" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
</div>
<div>
<h3 className="font-bold text-[#123b65]">Your account. Your access.</h3>
<p className="mt-1 text-xs leading-5 text-slate-500">Use the official member portal to access your account.</p>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="border-y border-slate-200 bg-white">
<div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
<div className="mb-12 max-w-2xl">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Getting started</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Your membership journey, made clear.</h2>
<p className="mt-4 text-slate-600">Follow the steps below to begin exploring membership and accessing the TCSCU digital platform.</p>
</div>
<div className="grid gap-6 md:grid-cols-3">
<div className="relative rounded-xl border border-slate-200 bg-slate-50 p-7"><span className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">Step 01</span><h3 className="mt-2 text-lg font-bold text-[#123b65]">Create your account</h3><p className="mt-2 text-sm leading-6 text-slate-600">Begin by completing the membership registration process on our digital platform.</p></div>
<div className="relative rounded-xl border border-slate-200 bg-slate-50 p-7"><span className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">Step 02</span><h3 className="mt-2 text-lg font-bold text-[#123b65]">Provide your details</h3><p className="mt-2 text-sm leading-6 text-slate-600">Submit the requested information and any applicable documentation for review.</p></div>
<div className="relative rounded-xl border border-slate-200 bg-slate-50 p-7"><span className="text-xs font-bold uppercase tracking-wider text-[#c72c3b]">Step 03</span><h3 className="mt-2 text-lg font-bold text-[#123b65]">Access your account</h3><p className="mt-2 text-sm leading-6 text-slate-600">After the applicable registration and verification process, access your member account.</p></div>
</div>
</div>
</section>

<section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="grid items-start gap-12 lg:grid-cols-2">
<div>
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">About our institution</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">The Chaplaincy Savings and Credit Union</h2>
<p className="mt-5 text-slate-600">TCSCU specializes in delivering tailored financial solutions to our members, high-net-worth individuals, institutional investors, and corporate clients. With a commitment to excellence, innovation, and client-centric strategies, we provide expert guidance in finance, investment, global portfolio management and advisory services, respectively.</p>
<p className="mt-4 text-slate-600">We're authorized by the Prudential Regulation Authority and regulated by the Financial Conduct Authority. We're a member of All Together Money (formerly known as the Association of British Credit Unions Limited or ABCUL), we're also a member of the Financial Services Compensation Scheme (FSCS) which pays compensation to consumers if a financial services firm is unable, or likely to be unable to pay claims against it in the UK.</p>
<p className="mt-4 text-slate-600">TCSCU brings member account access and financial services together through a digital platform.</p>
<a className="btn-outline mt-7" href="/about">Discover TCSCU</a>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h3 className="text-lg font-bold text-[#123b65]">Our Mission</h3>
<p className="mt-3 text-sm leading-7 text-slate-600">To provide accessible savings, local and cross-border loans and credit facilities while promoting financial management, investment, global portfolio management and advisory services through the support of our seasoned financial experts, analysts, and advisors dedicated to maximizing operational services while managing risk effectively by leveraging deep market insights, cutting-edge technology, and a disciplined approach to financial growth. We strive to build long-term partnerships based on trust, transparency, and sustainable financial success.</p>
<div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
<p className="font-bold text-[#123b65]">Registered office</p>
<p className="mt-1">Our Lady of the Caribbean Chapel Centre, Bayswater, Birchfield, Birmingham, B20 3AE, UK.</p>
<p className="mt-2"><span className="font-semibold">Director:</span> O'may Neil Donald Edward</p>
</div>
</div>
</div>
</section>

<section className="border-y border-slate-200 bg-[#0d2f52]">
<div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
<div className="mb-10 max-w-2xl text-white">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Your security matters</p>
<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Stay informed. Protect your account.</h2>
<p className="mt-4 text-blue-100">Good security habits help protect your personal information and online banking access.</p>
</div>
<div className="grid gap-6 sm:grid-cols-3">
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white"><h3 className="font-bold">Protect your credentials</h3><p className="mt-2 text-sm leading-6 text-blue-100">Never share your password or private security information with another person.</p></div>
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white"><h3 className="font-bold">Verify requests</h3><p className="mt-2 text-sm leading-6 text-blue-100">Be careful with unexpected messages, links and requests for verification codes.</p></div>
<div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white"><h3 className="font-bold">Use verified support</h3><p className="mt-2 text-sm leading-6 text-blue-100">Contact the institution through verified support channels when you need assistance.</p></div>
</div>
<a className="btn-secondary mt-8" href="/fraud">Visit the security centre</a>
</div>
</section>

<section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="mb-12 max-w-2xl">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Live global tools</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Plan with purpose, wherever you are.</h2>
<p className="mt-4 text-slate-600">Use our live weather, foreign exchange and loan calculators to stay informed about the world around you and to estimate your monthly repayments.</p>
</div>
<div className="grid gap-8 lg:grid-cols-3">

<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
<div className="mb-4 flex items-center gap-3">
<div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"></path></svg>
</div>
<div><h3 className="text-lg font-bold text-[#123b65]">Live world weather</h3><p className="text-xs text-slate-500">Search any city, powered by Open-Meteo</p></div>
</div>
<div className="flex flex-col gap-2 sm:flex-row">
<input id="weatherCity" className="app-input" type="text" placeholder="Enter a city (e.g. Birmingham)" aria-label="City for weather search" />
<button id="weatherBtn" className="btn-primary !px-5 !py-3 text-sm whitespace-nowrap" type="button">Get weather</button>
</div>
<div id="weatherResult" className="mt-4 hidden app-result p-4 text-sm"></div>
<p id="weatherError" className="mt-3 hidden text-sm text-red-600"></p>
</div>

<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
<div className="mb-4 flex items-center gap-3">
<div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
</div>
<div><h3 className="text-lg font-bold text-[#123b65]">Live FX calculator</h3><p className="text-xs text-slate-500">Live exchange rates, powered by ExchangeRate-API</p></div>
</div>
<div className="grid gap-3 sm:grid-cols-3">
<div className="sm:col-span-3">
<label htmlFor="fxAmount" className="mb-1 block text-xs font-semibold text-slate-600">Amount</label>
<input id="fxAmount" className="app-input" type="number" min="0" step="0.01" value="100" aria-label="Amount to convert" />
</div>
<div>
<label htmlFor="fxFrom" className="mb-1 block text-xs font-semibold text-slate-600">From</label>
<select id="fxFrom" className="app-select" aria-label="Convert from currency"><option value="GBP">GBP</option></select>
</div>
<div>
<label htmlFor="fxTo" className="mb-1 block text-xs font-semibold text-slate-600">To</label>
<select id="fxTo" className="app-select" aria-label="Convert to currency"><option value="USD">USD</option></select>
</div>
<div className="flex items-end">
<button id="fxBtn" className="btn-primary w-full !px-4 !py-3 text-sm" type="button">Convert</button>
</div>
</div>
<div id="fxResult" className="mt-4 hidden app-result p-4 text-sm"></div>
<p id="fxError" className="mt-3 hidden text-sm text-red-600"></p>
</div>

<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
<div className="mb-4 flex items-center gap-3">
<div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#145da0]">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><path d="M8 2v4"></path><path d="M16 2v4"></path></svg>
</div>
<div><h3 className="text-lg font-bold text-[#123b65]">Loan calculator</h3><p className="text-xs text-slate-500">Estimate your monthly repayments</p></div>
</div>
<div className="space-y-4">
<div>
<label htmlFor="loanAmount" className="mb-1 block text-xs font-semibold text-slate-600">Loan amount (£)</label>
<input id="loanAmount" className="app-input" type="number" min="100" step="100" value="5000" aria-label="Loan amount in pounds" />
</div>
<div className="grid gap-3 sm:grid-cols-2">
<div>
<label htmlFor="loanRate" className="mb-1 block text-xs font-semibold text-slate-600">Annual rate (%)</label>
<input id="loanRate" className="app-input" type="number" min="0" step="0.1" value="5.5" aria-label="Annual interest rate" />
</div>
<div>
<label htmlFor="loanTerm" className="mb-1 block text-xs font-semibold text-slate-600">Term (months)</label>
<input id="loanTerm" className="app-input" type="number" min="1" step="1" value="36" aria-label="Loan term in months" />
</div>
</div>
<button id="loanBtn" className="btn-primary w-full" type="button">Calculate repayments</button>
</div>
<div id="loanError" className="mt-3 hidden text-sm text-red-600"></div>
<div id="loanResult" className="mt-4 hidden rounded-xl border border-blue-100 bg-blue-50/60 p-4">
<h4 className="text-sm font-bold text-[#123b65]">Estimated repayment</h4>
<div className="mt-3 space-y-2 text-sm">
<div className="flex items-center justify-between border-b border-blue-100 pb-2"><span className="text-slate-600">Monthly payment</span><span id="loanMonthly" className="font-extrabold text-[#123b65]">—</span></div>
<div className="flex items-center justify-between border-b border-blue-100 pb-2"><span className="text-slate-600">Total interest</span><span id="loanInterest" className="font-bold text-slate-800">—</span></div>
<div className="flex items-center justify-between"><span className="text-slate-600">Total repayment</span><span id="loanTotal" className="font-bold text-slate-800">—</span></div>
</div>
<p className="mt-3 text-xs leading-5 text-slate-500">Estimate only. Actual rates and repayments may vary and are subject to status and approval.</p>
</div>
</div>
</div>
</section>

<section className="border-y border-slate-200 bg-white">
<div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-10">
<div className="mb-10 max-w-2xl">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Frequently asked questions</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">Helpful answers to get you started.</h2>
<p className="mt-4 text-slate-600">Find answers to common questions about membership, online account access and the services available through TCSCU.</p>
</div>
<div className="space-y-3">
<details className="group rounded-lg border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm">
<summary className="cursor-pointer list-none text-sm font-bold text-[#123b65] marker:hidden">How do I become a member of TCSCU?</summary>
<p className="mt-3 text-sm leading-6 text-slate-600">Begin by completing the membership registration process on our digital platform. You will then submit the requested information and any applicable documentation for review. Once verified, you can access your member account.</p>
</details>
<details className="group rounded-lg border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm">
<summary className="cursor-pointer list-none text-sm font-bold text-[#123b65] marker:hidden">How do I access online banking?</summary>
<p className="mt-3 text-sm leading-6 text-slate-600">Sign in through the official TCSCU website using your member credentials. Only sign in through the official website and never share your password or verification codes with anyone.</p>
</details>
<details className="group rounded-lg border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm">
<summary className="cursor-pointer list-none text-sm font-bold text-[#123b65] marker:hidden">What services does TCSCU offer?</summary>
<p className="mt-3 text-sm leading-6 text-slate-600">TCSCU offers savings, loans and credit, finance management, investment and global portfolio management, and institutional and corporate advisory services. Explore our Core Services page for more detail.</p>
</details>
<details className="group rounded-lg border border-slate-200 bg-slate-50 p-5 open:bg-white open:shadow-sm">
<summary className="cursor-pointer list-none text-sm font-bold text-[#123b65] marker:hidden">Still need assistance?</summary>
<p className="mt-3 text-sm leading-6 text-slate-600">Visit the member support section or email <a className="font-semibold text-[#145da0] underline" href="mailto:support@tcscu.co.uk">support@tcscu.co.uk</a>. Phone support is provided on demand.</p>
</details>
</div>
</div>
</section>

<section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="grid gap-10 lg:grid-cols-2">
<div>
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#c72c3b]">Contact and support</p>
<h2 className="text-3xl font-bold tracking-tight text-[#123b65] sm:text-4xl">We're here to help you navigate your account.</h2>
<p className="mt-4 text-slate-600">For assistance with account access or available services, use the appropriate TCSCU member support channel.</p>
<div className="mt-8 space-y-5">
<div className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="text-sm font-bold text-[#123b65]">Institutional address</h3><p className="mt-1 text-sm text-slate-600">Our Lady of the Caribbean Chapel Centre, Bayswater, Birchfield, Birmingham, B20 3AE, UK.</p></div>
<div className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="text-sm font-bold text-[#123b65]">For enquiries and support</h3><p className="mt-1 text-sm text-slate-600">Email: <a className="font-semibold text-[#145da0] underline" href="mailto:support@tcscu.co.uk">support@tcscu.co.uk</a></p><p className="text-sm text-slate-600">Phone: Provided on demand.</p></div>
<div className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="text-sm font-bold text-[#123b65]">Member assistance</h3><p className="mt-1 text-sm text-slate-600">Sign in to explore available member support services.</p><a className="mt-2 inline-block text-sm font-bold text-[#145da0] underline" href="https://tcscu.co.uk/login">Access member support</a></div>
</div>
</div>
<div className="relative overflow-hidden rounded-xl bg-[#102f50] p-8 text-white sm:p-10">
<div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl"></div>
<div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-red-400/10 blur-3xl"></div>
<div className="relative">
<p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Become part of TCSCU</p>
<h3 className="mt-3 text-3xl font-bold">Take your next step with us.</h3>
<p className="mt-4 text-sm leading-7 text-blue-100">Explore the membership registration process and discover the services available through the TCSCU digital platform.</p>
<div className="mt-8 flex flex-col gap-3 sm:flex-row">
<a className="btn-primary" href="https://tcscu.co.uk/register">Get started today</a>
<a className="btn-secondary" href="https://tcscu.co.uk/login">Online banking</a>
</div>
</div>
</div>
</div>
</section>
</section><section data-page="about" id="about" className={activePage === "about" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">About us</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">The Chaplaincy Savings and Credit Union</h1>
<p className="mt-5 max-w-2xl text-blue-100">A UK credit union delivering tailored financial solutions with integrity, agility and partnership at its core.</p>
</div>
</div>
<div className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
<div className="space-y-6 text-slate-700">
<p className="text-lg leading-8">TCSCU specializes in delivering tailored financial solutions to our members, high-net-worth individuals, institutional investors, and corporate clients. With a commitment to excellence, innovation, and client-centric strategies, we provide expert guidance in finance, investment, global portfolio management and advisory services, respectively.</p>
<p className="leading-7">We're authorized by the Prudential Regulation Authority and regulated by the Financial Conduct Authority. We're a member of All Together Money (formerly known as the Association of British Credit Unions Limited or ABCUL), we're also a member of the Financial Services Compensation Scheme (FSCS) which pays compensation to consumers if a financial services firm is unable, or likely to be unable to pay claims against it in the UK.</p>
<p className="leading-7">TCSCU brings member account access and financial services together through a digital platform.</p>
<p className="leading-7">Explore our platform, learn about available services and discover how to get started.</p>
</div>
<aside className="space-y-5">
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
<h3 className="text-sm font-bold uppercase tracking-wider text-[#c72c3b]">Registered details</h3>
<dl className="mt-4 space-y-3 text-sm">
<div><dt className="font-semibold text-[#123b65]">Registered Address</dt><dd className="text-slate-600">Our Lady of the Caribbean Chapel Centre, Bayswater, Birchfield, Birmingham, B20 3AE, UK.</dd></div>
<div><dt className="font-semibold text-[#123b65]">Registration Number</dt><dd className="text-slate-600">IP00059C</dd></div>
<div><dt className="font-semibold text-[#123b65]">Mutual Society Number</dt><dd className="text-slate-600">59C</dd></div>
<div><dt className="font-semibold text-[#123b65]">FCA Firm Reference Number</dt><dd className="text-slate-600">213234</dd></div>
<div><dt className="font-semibold text-[#123b65]">PRA Number</dt><dd className="text-slate-600">26533</dd></div>
<div><dt className="font-semibold text-[#123b65]">Date of Registration</dt><dd className="text-slate-600">05 April 1982</dd></div>
<div><dt className="font-semibold text-[#123b65]">Enquiries and Support</dt><dd className="text-slate-600">support@tcscu.co.uk · Phone provided on demand</dd></div>
</dl>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
<h3 className="text-sm font-bold uppercase tracking-wider text-[#c72c3b]">Managing Director</h3>
<p className="mt-2 text-lg font-bold text-[#123b65]">O'may Neil Donald Edward</p>
</div>
</aside>
</div>
<div className="mt-16 grid gap-8 md:grid-cols-2">
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Our Values</h2>
<ul className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
<li><strong className="text-[#123b65]">Integrity:</strong> We prioritize the members and client's needs above all, ensuring full transparency.</li>
<li><strong className="text-[#123b65]">Agility:</strong> The global financial market moves fast; our structure allows us to move faster.</li>
<li><strong className="text-[#123b65]">Partnership:</strong> We view ourselves as an extension of our member's and clients' teams, respectively.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Vision & Mission</h2>
<p className="mt-4 text-sm leading-7 text-slate-700"><strong className="text-[#123b65]">Vision:</strong> To be the most trusted bridge in the UK and Global Financial Ecosystem, known for integrity, efficiency, speed, and precision.</p>
<p className="mt-4 text-sm leading-7 text-slate-700"><strong className="text-[#123b65]">Mission:</strong> TCSCU specializes in delivering tailored financial solutions to our members, high-net-worth individuals, institutional investors, and corporate clients. With a commitment to excellence, innovation, and client-centric strategies, we provide expert guidance in finance, investment, global portfolio management and advisory services, respectively.</p>
</div>
</div>
<div className="mt-8 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Regulatory Compliance</h2>
<ul className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
<li className="flex gap-2"><span className="text-[#145da0]">✓</span>TCSCU maintains its statutory filings with Companies House.</li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span>TCSCU is authorized by the UK Prudential Regulation Authority.</li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span>TCSCU is regulated by the UK Financial Conduct Authority.</li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span>TCSCU is compliant with SEC Rule 506(c), FATF, AML/CFT, and GDPR Regulations.</li>
</ul>
</div>
<div className="mt-8 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Operational Philosophy</h2>
<p className="mt-2 text-sm text-slate-600">TCSCU adheres to a disciplined and research-driven philosophy:</p>
<ul className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
<li className="flex gap-2"><span className="text-[#145da0]">✓</span><span><strong>Long-Term Value Creation:</strong> Focus on sustainable growth over speculative gains.</span></li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span><span><strong>Risk-Adjusted Returns:</strong> Balanced portfolios tailored to client risk tolerance.</span></li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span><span><strong>Transparency & Integrity:</strong> Ethical practices with full regulatory compliance.</span></li>
<li className="flex gap-2"><span className="text-[#145da0]">✓</span><span><strong>Innovation & Adaptability:</strong> Leveraging fintech and AI-driven insights for smarter operation.</span></li>
</ul>
</div>
</div>
</section><section data-page="leadership" id="leadership" className={activePage === "leadership" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Leadership & Team</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Experience, insight and disciplined governance.</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="max-w-4xl space-y-6 text-slate-700">
<p className="text-lg leading-8">Our leadership comprises industry veterans with deep expertise in finance, investment, global portfolio management and advisory services. The team is supported by a robust research division ensuring data-driven decision-making.</p>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<p className="text-sm font-semibold uppercase tracking-wider text-[#c72c3b]">Directorship</p>
<p className="mt-2 text-xl font-bold text-[#123b65]">TCSCU is under the directorship of Mr. O'may Neil Donald Edward.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Corporate Social Responsibility</h2>
<p className="mt-3 leading-7">TCSCU is committed to ethical financial, investment, global portfolio management and advisory services, supporting ESG (Environmental, Social, and Governance) initiatives, and contributing to sustainable economic growth.</p>
</div>
</div>
<div className="mt-12">
<h2 className="text-2xl font-bold text-[#123b65]">Why Choose The Chaplaincy Savings and Credit Union?</h2>
<div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Expertise</p><p className="mt-2 text-sm leading-6 text-slate-600">Decades of combined experience in global financial markets.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Custom Solutions</p><p className="mt-2 text-sm leading-6 text-slate-600">Bespoke strategies aligned with client objectives.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Regulated</p><p className="mt-2 text-sm leading-6 text-slate-600">Fully compliant with UK financial regulations.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Proven Track Record</p><p className="mt-2 text-sm leading-6 text-slate-600">Consistent performance across market cycles.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Client-Centric Approach</p><p className="mt-2 text-sm leading-6 text-slate-600">Dedicated relationship managers for personalized service.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Security</p><p className="mt-2 text-sm leading-6 text-slate-600">When it comes to account security, we have your back! We stay as proactive as possible to limit fraudulent activity through technology and human oversight.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Technology</p><p className="mt-2 text-sm leading-6 text-slate-600">We provide services that are carried and processed via the same technology you'd find at large banks; plus, we'll help you learn how to use it!</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Education</p><p className="mt-2 text-sm leading-6 text-slate-600">At TCSCU, we empower you with knowledge. If you're not a seasoned borrower or saver, don't worry! We'll devote time to you until you're ready to make a decision.</p></div>
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold text-[#123b65]">✔ Community</p><p className="mt-2 text-sm leading-6 text-slate-600">Our community is where our heart is. We focus our EdiFi Cares outreach efforts on the educational, healthcare, and broader community.</p></div>
</div>
</div>
</div>
</section><section data-page="services" id="services" className={activePage === "services" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Core services</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Financial services built around your journey.</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Savings</h2>
<p className="mt-3 text-sm leading-7 text-slate-600">Member savings accounts and global portfolios form the pool of funds from which loans and credits are made. We typically offer secure, dividend-earning savings accounts and portfolio management designed to build financial security.</p>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Loans & Credit</h2>
<p className="mt-3 text-sm leading-7 text-slate-600">Affordable, local and cross-border loans and credit facility for provident or productive purposes. Our interest rates are generally capped to protect members, public and cross-border clients from usurious lending.</p>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Finance Management</h2>
<p className="mt-3 text-sm leading-7 text-slate-600">Guidance and support to help members and clients manage finance, budgets, understand credit, and develop sound financial habits.</p>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Investment & Global Portfolio Management</h2>
<p className="mt-3 text-sm leading-7 text-slate-600">Our structure allows members and clients to collectively invest their savings and proceeds from their local and global portfolios under our management and control, with surpluses returned to members and clients as dividends or reinvested for community and public benefit.</p>
</article>
<article className="card-hover rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Institutional & Corporate Advisory</h2>
<p className="mt-3 text-sm leading-7 text-slate-600">We provide comprehensive strategic advisory services, including mergers and acquisitions (M&A) support, capital raising and corporate restructuring, as well as risk management consulting, helping members and clients navigate complex business decisions and achieve sustainable growth.</p>
</article>
</div>
</div>
</section><section data-page="privacy" id="privacy" className={activePage === "privacy" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Privacy policy</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Our Commitment to Data Privacy</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10">
<div className="space-y-8 text-slate-700">
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<p className="leading-7">At The Chaplaincy Savings and Credit Union (TCSCU), we take our responsibility to protect your personal data seriously. In an era where data privacy is of utmost importance, we are committed to safeguarding your information with the highest standards of security, transparency, and ethical practices.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Core Principles</h2>
<ul className="mt-4 space-y-3 text-sm leading-6">
<li><strong className="text-[#123b65]">Transparency:</strong> We ensure you are fully informed about how your personal data is collected, processed, and shared.</li>
<li><strong className="text-[#123b65]">Security:</strong> We implement advanced security measures to prevent unauthorized access, misuse, or breaches of your data.</li>
<li><strong className="text-[#123b65]">Compliance:</strong> TCSCU adheres to all applicable data protection laws and regulations, including the General Data Protection Regulation (GDPR).</li>
<li><strong className="text-[#123b65]">Ethical Use:</strong> Your data is used responsibly, only for legitimate business purposes, and always in alignment with your rights.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Information We Collect</h2>
<p className="mt-3 text-sm leading-6">To provide you with our services and enhance your experience with TCSCU, we may collect the following types of personal information:</p>
<h3 className="mt-5 font-bold text-[#123b65]">Information You Provide Directly</h3>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Contact Details:</strong> Name, email address, phone number, and mailing address.</li>
<li><strong>Business Information:</strong> Company name, job title, and professional details including documents.</li>
<li><strong>Financial Information:</strong> Financial Statements, Bank account details and/or information (if applicable).</li>
</ul>
<h3 className="mt-5 font-bold text-[#123b65]">Automatically Collected Information</h3>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Device Information:</strong> Your IP address, browser type, operating system.</li>
<li><strong>Usage Data:</strong> Pages visited, time spent on our website.</li>
<li><strong>Cookies:</strong> Information collected through cookies to improve site functionality.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">How We Use Your Information</h2>
<p className="mt-3 text-sm leading-6">TCSCU collects and processes your data for specific, legitimate purposes including:</p>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Service Provision:</strong> Facilitating transactions and services you request.</li>
<li><strong>Communication:</strong> Responding to inquiries and sending important updates.</li>
<li><strong>Improvement:</strong> Enhancing our website functionality and user experience.</li>
<li><strong>Legal Compliance:</strong> Meeting regulatory and contractual requirements.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Data Protection Measures</h2>
<p className="mt-3 text-sm leading-6">We employ robust security measures to ensure your information remains confidential and protected:</p>
<h3 className="mt-5 font-bold text-[#123b65]">Technical Safeguards</h3>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Encryption:</strong> All sensitive data is encrypted both in transit and at rest.</li>
<li><strong>Access Controls:</strong> Strict authorization protocols for data access.</li>
<li><strong>Monitoring:</strong> Advanced firewalls and intrusion detection systems.</li>
</ul>
<h3 className="mt-5 font-bold text-[#123b65]">Organizational Measures</h3>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Employee Training:</strong> Regular data privacy training for all staff.</li>
<li><strong>Data Retention:</strong> We only retain data as long as necessary.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Your Privacy Rights</h2>
<p className="mt-3 text-sm leading-6">Depending on your jurisdiction, you may have the following rights regarding your information:</p>
<ul className="mt-3 space-y-2 text-sm leading-6">
<li><strong>Right to Access:</strong> Request details about data we hold.</li>
<li><strong>Right to Rectification:</strong> Correct inaccurate information.</li>
<li><strong>Right to Erasure:</strong> Request deletion of your data.</li>
<li><strong>Right to Restrict Processing:</strong> Limit how we use your data.</li>
<li><strong>Right to Data Portability:</strong> Receive your data in usable format.</li>
<li><strong>Right to Object:</strong> Object to certain processing activities.</li>
</ul>
<p className="mt-5 text-sm leading-6">To exercise any of these rights, please contact us at: <a className="font-semibold text-[#145da0] underline" href="mailto:privacy@tcscu.co.uk">privacy@tcscu.co.uk</a>. We will respond to your request promptly and in compliance with applicable laws.</p>
</div>
</div>
</div>
</section><section data-page="benefits" id="benefits" className={activePage === "benefits" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Membership benefits</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">More than access to finance.</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
<div className="max-w-3xl">
<h2 className="text-2xl font-bold text-[#123b65]">Membership Benefit</h2>
<p className="mt-3 text-slate-700">Aside special access to loans and credit facilities, our members also benefit the following:</p>
</div>
<div className="mt-8 grid gap-6 md:grid-cols-3">
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h3 className="text-lg font-bold text-[#123b65]">Free Credit Report</h3>
<p className="mt-3 text-sm leading-7 text-slate-600">TCSCU provides members with a secure means to request and obtain a free credit report from each of the three nationwide consumer credit reporting companies once every 12 months.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h3 className="text-lg font-bold text-[#123b65]">Overdraft Protection</h3>
<p className="mt-3 text-sm leading-7 text-slate-600">TCSCU understands mistakes can happen when balancing your account. That's why we offer Overdraft Protection for checks, payments, and card purchases.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h3 className="text-lg font-bold text-[#123b65]">Debt Protection</h3>
<p className="mt-3 text-sm leading-7 text-slate-600">TCSCU provides Debt Protection that can help prevent financial distress for you and your family by canceling all or part of your protected loan payment or balance if a protected life event occurs.</p>
</div>
</div>
</div>
</section><section data-page="terms" id="terms" className={activePage === "terms" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Legal</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Terms of Service</h1>
<p className="mt-4 text-sm text-blue-200">Last Updated: November 2026</p>
</div>
</div>
<div className="section-pad mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10">
<div className="space-y-7 text-sm leading-7 text-slate-700">
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">1. Acceptance of Terms</h2>
<p className="mt-3">By accessing or using TCSCU website or any of our services, you agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using our website.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">2. User Responsibilities</h2>
<p className="mt-3">As a user of our website, you agree to:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>Comply with all applicable laws and regulations</li>
<li>Provide accurate and current information</li>
<li>Maintain the confidentiality of your account credentials</li>
</ul>
<p className="mt-4">Prohibited activities include but are not limited to:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>Unauthorized access to our systems</li>
<li>Distribution of malware or harmful code</li>
<li>Violation of intellectual property rights</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">3. Intellectual Property</h2>
<p className="mt-3">All content on this website, including text, graphics, logos, and images, is the property of The Chaplaincy Savings and Credit Union or its content suppliers and protected by international copyright laws.</p>
<p className="mt-3">You may not:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>Reproduce, distribute, or modify any content without our express written permission</li>
<li>Use our trademarks or logos without prior authorization</li>
<li>Remove any copyright or proprietary notices</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">4. Disclaimer of Warranties</h2>
<p className="mt-3">This website and its content are provided "as is" without warranty of any kind. TCSCU does not warrant that:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>The website will be uninterrupted or error-free</li>
<li>The content is accurate, complete, or current</li>
<li>The website will meet your requirements</li>
</ul>
<p className="mt-3">We reserve the right to modify or discontinue the website at any time without notice.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">5. Limitation of Liability</h2>
<p className="mt-3">TCSCU shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>The use or inability to use the website</li>
<li>Unauthorized access to or alteration of your data</li>
<li>Any other matter relating to the website</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">6. Third-Party Links</h2>
<p className="mt-3">Our website may contain links to third-party websites. These links are provided for your convenience only and do not signify our endorsement. We have no control over and assume no responsibility for:</p>
<ul className="mt-2 list-disc space-y-1 pl-5">
<li>The content of linked sites</li>
<li>The privacy practices of third parties</li>
<li>Any damages resulting from use of third-party sites</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">7. Modifications to Terms</h2>
<p className="mt-3">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">8. Governing Law</h2>
<p className="mt-3">These Terms of Service shall be governed by and construed in accordance with the laws of the UK. Any disputes shall be subject to the exclusive jurisdiction of the UK courts.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-xl font-bold text-[#123b65]">Contact Information</h2>
<p className="mt-3">For questions about these Terms of Service, please contact us at <a className="font-semibold text-[#145da0] underline" href="mailto:support@tcscu.co.uk">support@tcscu.co.uk</a>.</p>
</div>
</div>
</div>
</section><section data-page="fraud" id="fraud" className={activePage === "fraud" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Security centre</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Web Fraud & Phishing Warning</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10">
<div className="rounded-xl border border-red-100 bg-red-50/60 p-7">
<p className="text-sm leading-7 text-slate-700">An unfortunate consequence of our size and global reputation is the misuse of our name, brands and reputation by imposters and frauds publishing fake websites and engaging in "phishing" scams seeking personal or confidential information.</p>
<p className="mt-4 text-sm font-bold text-[#123b65]">When communicating with TCSCU through digital media, please:</p>
<ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-7 text-slate-700">
<li>Confirm you are visiting the TCSCU's authorized website. TCSCU's only authorized website is <strong>www.tcscu.co.uk</strong>. No other website domain is authorized by TCSCU to communicate (including requesting or receiving) information through websites.</li>
<li>Do not share your password and login ID with anyone, including anyone from TCSCU. Certain TCSCU's online environments are private, available only to members and clients through secure login procedures. Apart from allowing you to use your password and login to enter an authorized site, TCSCU will never ask you for your password or login information. (If you forget your password or login, we will issue you new ones.)</li>
<li>Do not send e-mails to anyone with an address other than authorized TCSCU e-mail addresses. TCSCU does not permit our employees and authorized representatives to send or receive work related e-mails from personal accounts or any other address. If you are or become suspicious of potential fraudulent activity when communicating through email, please contact <a className="font-semibold text-[#145da0] underline" href="mailto:fraud@tcscu.co.uk">fraud@tcscu.co.uk</a> for assistance.</li>
</ol>
<p className="mt-5 text-sm leading-7 text-slate-700">Imposters can use the TCSCU name in furtherance of a variety of criminal activities. In particular, beware of scams purportedly affiliated with TCSCU that promise extraordinary returns on your services at little to no risk.</p>
<p className="mt-4 text-sm leading-7 text-slate-700">If you have any questions about the above, the security of any TCSCU communication, or have concerns about a website or e-mail communication that you suspect may be fraudulent, please contact us at <a className="font-semibold text-[#145da0] underline" href="mailto:fraud@tcscu.co.uk">fraud@tcscu.co.uk</a>.</p>
</div>
</div>
</section><section data-page="accessibility" id="accessibility" className={activePage === "accessibility" ? "active" : ""}>
<div className="relative overflow-hidden bg-[#102f50] py-20">
<div className="absolute inset-0 bg-gradient-to-r from-[#092b4d]/95 to-[#092b4d]/60"></div>
<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
<p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Accessibility</p>
<h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Accessibility Statement</h1>
</div>
</div>
<div className="section-pad mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-10">
<div className="space-y-7 text-sm leading-7 text-slate-700">
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<p>We are actively working to increase the accessibility and usability of our website and in doing so adhere to many of the available standards and guidelines.</p>
<p className="mt-4">TCSCU does not discriminate on the basis of religion, age, race, color, national origin, gender, marital or parental status, or disability.</p>
<p className="mt-4">TCSCU has invested a significant number of resources to help ensure that its website is made easier to use and more accessible for people with disabilities, with the strong belief that every person has the right to live with dignity, equality, comfort, and independence.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Accessibility on www.tcscu.co.uk</h2>
<p className="mt-3">In order to further our commitment to nondiscrimination, we are working to ensure <strong>www.tcscu.co.uk</strong> conforms to level Double-A World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1. Such guidelines detail best practices for ensuring assistive technology users can access the site. The guidelines also make the site more user friendly for all people.</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Enabling accessibility menu</h2>
<p className="mt-3"><strong>www.tcscu.co.uk</strong> accessibility menu can be enabled by clicking the accessibility menu icon that appears on the page. After triggering the accessibility menu, please wait a moment for the accessibility menu to load in its entirety.</p>
<p className="mt-3">Should anyone find information or functionality which is inaccessible, please contact us. We will make every reasonable effort to accommodate.</p>
</div>

<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Pictorial and graphical descriptions</h2>
<p className="mt-3">The following descriptions explain the visual and graphical elements used across the TCSCU website.</p>
<ul className="mt-4 space-y-3 text-sm leading-6">
<li><strong>Hero banner (Home):</strong> A pictorial description of a modern financial district at dusk — glass-fronted office towers with warm interior lighting — used to represent institutional banking, global portfolio management and secure digital account access.</li>
<li><strong>Plan-ahead image (Home):</strong> A photograph of a person reviewing financial documents and planning finances, used to illustrate the Plan ahead section and support the surrounding text about financial planning and informed decision-making.</li>
<li><strong>Digital-banking image (Home):</strong> A photograph of a person using a laptop for digital services, representing convenient online account access and member-focused digital banking.</li>
<li><strong>Financial solutions cards 01–04:</strong> Four graphical number markers (01–04) in a blue-to-red gradient, each paired with an icon representing digital banking, member-focused services, financial services and informed banking.</li>
<li><strong>Live global tools icons:</strong> A weather cloud icon, a globe icon and a calendar icon sit above the live weather, FX and loan calculator forms. Each icon is decorative and is accompanied by a clear heading and form labels.</li>
<li><strong>Background pattern:</strong> A fixed, subtle dot grid with soft radial blue and red glows provides a decorative layer behind the page content. It does not convey information and is not announced by assistive technology.</li>
<li><strong>Logo:</strong> The TCSCU logo mark and wordmark are rendered responsively, with the full institution name provided as adjacent text for clarity at all screen sizes.</li>
</ul>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
<h2 className="text-2xl font-bold text-[#123b65]">Accessibility controls</h2>
<p className="mt-3">Use the controls below to adjust text size or enable high contrast mode. You can also navigate directly to any page using the dropdown menu.</p>
<div className="mt-5 flex flex-wrap gap-3">
<button type="button" onClick={() => window.changeTextSize(1)} className="btn-outline !px-4 !py-2 text-xs">A+ Increase text</button>
<button type="button" onClick={() => window.changeTextSize(-1)} className="btn-outline !px-4 !py-2 text-xs">A− Decrease text</button>
<button type="button" onClick={() => window.toggleContrast()} className="btn-outline !px-4 !py-2 text-xs">Toggle high contrast</button>
<button type="button" onClick={() => window.resetAccessibility()} className="btn-outline !px-4 !py-2 text-xs">Reset</button>
</div>
<div className="mt-5 grid gap-4 sm:grid-cols-2">
<div>
<label htmlFor="accessPageSelectInline" className="mb-1 block text-xs font-semibold text-slate-600">Navigate to a page</label>
<select id="accessPageSelectInline" className="app-select" onChange={(e) => { if (e.target.value) window.location.href = e.target.value.startsWith("#") ? "/" + e.target.value.slice(1) : e.target.value; }}>
<option value="">Select a page…</option>
<option value="#home">Home</option>
<option value="#about">About us</option>
<option value="#leadership">Leadership & Team</option>
<option value="#services">Core Services</option>
<option value="#benefits">Membership Benefits</option>
<option value="#privacy">Privacy Policy</option>
<option value="#terms">Terms of Service</option>
<option value="#fraud">Web Fraud & Phishing Warning</option>
<option value="#accessibility">Accessibility Statement</option>
</select>
</div>
<div>
<label htmlFor="accessLanguageInline" className="mb-1 block text-xs font-semibold text-slate-600">Translate this page</label>
<select id="accessLanguageInline" className="app-select" onChange={(e) => window.translatePage(e.target.value)}>
<option value="en">English (default)</option>
<option value="fr">Français</option>
<option value="es">Español</option>
<option value="de">Deutsch</option>
<option value="it">Italiano</option>
<option value="pt">Português</option>
<option value="ar">العربية</option>
<option value="zh-CN">中文（简体）</option>
<option value="ja">日本語</option>
<option value="ko">한국어</option>
<option value="hi">हिन्दी</option>
<option value="ur">اردو</option>
<option value="pl">Polski</option>
<option value="ro">Română</option>
<option value="tr">Türkçe</option>
<option value="ru">Русский</option>
<option value="nl">Nederlands</option>
<option value="yo">Yorùbá</option>
<option value="ig">Igbo</option>
<option value="ha">Hausa</option>
<option value="sw">Kiswahili</option>
</select>
</div>
</div>
</div>
</div>
</div>
</section>
        </main>


<footer className="border-t border-slate-200 bg-[#0d2f52] text-blue-100">
<div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-10">
<div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
<div>
<div className="flex items-center gap-3">
<img src="https://www.tcscu.co.uk/logom.png" alt="TCSCU logo mark and wordmark, shown in the footer alongside the full institution name." className="h-11 w-11 object-contain" />
<div>
<p className="text-sm font-bold text-white">The Chaplaincy Savings and Credit Union</p>
<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f08a94]">TCSCU</p>
</div>
</div>
<p className="mt-5 max-w-md text-sm leading-7">TCSCU specializes in delivering tailored financial solutions to our members, high-net-worth individuals, institutional investors, and corporate clients.</p>
<p className="mt-4 text-xs leading-6">Registered Address: Our Lady of the Caribbean Chapel Centre, Bayswater, Birchfield, Birmingham, B20 3AE, UK.</p>
<p className="mt-2 text-xs leading-6">Registration Number: IP00059C · Mutual Society Number: 59C · FCA Firm Reference Number: 213234 · PRA Number: 26533 · Date of Registration: 05 April 1982</p>
</div>
<div>
<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white">Pages</h3>
<ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
<li><a href="/" className="hover:text-white">Home</a></li>
<li><a href="/about" className="hover:text-white">About us</a></li>
<li><a href="/leadership" className="hover:text-white">Leadership</a></li>
<li><a href="/services" className="hover:text-white">Core services</a></li>
<li><a href="/membership" className="hover:text-white">Membership</a></li>
<li><a href="/privacy" className="hover:text-white">Privacy</a></li>
<li><a href="/terms" className="hover:text-white">Terms</a></li>
<li><a href="/fraud" className="hover:text-white">Fraud warning</a></li>
<li><a href="/accessibility" className="hover:text-white">Accessibility</a></li>
</ul>
</div>
<div>
<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white">Contact & support</h3>
<ul className="mt-4 space-y-3 text-sm">
<li>Email: <a className="underline hover:text-white" href="mailto:support@tcscu.co.uk">support@tcscu.co.uk</a></li>
<li>Phone: Provided on demand</li>
<li>Managing Director: O'may Neil Donald Edward</li>
<li><a className="underline hover:text-white" href="https://tcscu.co.uk/login">Online banking</a></li>
<li><a className="underline hover:text-white" href="https://tcscu.co.uk/register">Become a member</a></li>
</ul>
</div>
</div>
<div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-blue-200 sm:flex-row sm:items-center">
<p>© <span id="year"></span> The Chaplaincy Savings and Credit Union (TCSCU). All rights reserved.</p>
<p>Authorised by the Prudential Regulation Authority and regulated by the Financial Conduct Authority.</p>
</div>
</div>
</footer>

<button id="accessFab" className="access-fab" aria-label="Open accessibility menu" aria-expanded="false">
<svg className="h-7 w-7" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
<circle cx="12" cy="4" r="2"></circle><path d="M12 6v6"></path><path d="M6 9h12"></path><path d="M9 21l3-6 3 6"></path><path d="M9 9v6"></path><path d="M15 9v6"></path>
</svg>
</button>
<div id="accessPanel" className="access-panel hidden" role="dialog" aria-label="Accessibility menu">
<div className="flex items-start justify-between gap-3">
<div>
<h2 className="text-base font-bold text-[#123b65]">Accessibility</h2>
<p className="mt-0.5 text-xs text-slate-500">Adjust the site to your needs.</p>
</div>
<button id="closeAccessPanel" type="button" className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label="Close accessibility menu">
<svg className="h-5 w-5" viewbox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
</button>
</div>
<div className="mt-4">
<label htmlFor="accessPageSelect" className="mb-1 block text-xs font-semibold text-slate-600">Action: go to page</label>
<select id="accessPageSelect" className="app-select" onChange={(e) => { if (e.target.value) window.location.href = e.target.value.startsWith("#") ? "/" + e.target.value.slice(1) : e.target.value; }}>
<option value="">Select a page…</option>
<option value="#home">Home</option>
<option value="#about">About us</option>
<option value="#leadership">Leadership & Team</option>
<option value="#services">Core Services</option>
<option value="#benefits">Membership Benefits</option>
<option value="#privacy">Privacy Policy</option>
<option value="#terms">Terms of Service</option>
<option value="#fraud">Web Fraud & Phishing Warning</option>
<option value="#accessibility">Accessibility Statement</option>
</select>
</div>
<div className="mt-4">
<label htmlFor="accessLanguage" className="mb-1 block text-xs font-semibold text-slate-600">Page language (Google Translate)</label>
<select id="accessLanguage" className="app-select" onChange={(e) => window.translatePage(e.target.value)}>
<option value="en">English (default)</option>
<option value="fr">Français</option>
<option value="es">Español</option>
<option value="de">Deutsch</option>
<option value="it">Italiano</option>
<option value="pt">Português</option>
<option value="ar">العربية</option>
<option value="zh-CN">中文（简体）</option>
<option value="ja">日本語</option>
<option value="ko">한국어</option>
<option value="hi">हिन्दी</option>
<option value="ur">اردو</option>
<option value="pl">Polski</option>
<option value="ro">Română</option>
<option value="tr">Türkçe</option>
<option value="ru">Русский</option>
<option value="nl">Nederlands</option>
<option value="yo">Yorùbá</option>
<option value="ig">Igbo</option>
<option value="ha">Hausa</option>
<option value="sw">Kiswahili</option>
</select>
</div>
<div className="mt-4">
<label htmlFor="accessTextSize" className="mb-1 block text-xs font-semibold text-slate-600">Text size</label>
<select id="accessTextSize" className="app-select" onChange={(e) => window.setTextSize(e.target.value)}>
<option value="100">Default (100%)</option>
<option value="112">Large (112%)</option>
<option value="125">Larger (125%)</option>
<option value="140">Largest (140%)</option>
</select>
</div>
<div className="mt-4 flex flex-wrap gap-2">
<button type="button" onClick={() => window.toggleContrast()} className="btn-outline !px-3 !py-2 text-xs">High contrast</button>
<button type="button" onClick={() => window.resetAccessibility()} className="btn-outline !px-3 !py-2 text-xs">Reset</button>
</div>
<div className="mt-4 border-t border-slate-200 pt-3">
<a href="/accessibility" onClick={() => window.closeAccessPanel()} className="text-xs font-bold text-[#145da0] underline">Read the Accessibility Statement</a>
</div>
</div>


      </div>
    </>
  );
}
