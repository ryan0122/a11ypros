"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Settings, X, ShieldCheck } from "lucide-react";

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  timestamp: string;
}

export const COOKIE_CONSENT_STORAGE_KEY = "a11ypros_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Helper function to update Google Consent Mode v2
const updateGtagConsent = (analyticsGranted: boolean) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analyticsGranted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
};

export default function CookieConsent() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const bannerRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!stored) {
        // No decision has been made yet
        setIsVisible(true);
      } else {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsEnabled(!!parsed.analytics);
        updateGtagConsent(!!parsed.analytics);
      }
    } catch {
      setIsVisible(true);
    }

    // Allow user to re-open settings at any time (e.g. from footer)
    const handleOpenSettings = () => {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      setIsVisible(true);
      setIsPreferencesOpen(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  // Trap keyboard focus inside preferences modal when open
  useEffect(() => {
    if (isPreferencesOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsPreferencesOpen(false);
          lastActiveElementRef.current?.focus();
          return;
        }

        if (e.key === "Tab") {
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isPreferencesOpen]);

  const saveConsent = (analytics: boolean) => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    } catch (err) {
      console.error("Unable to save cookie preferences to localStorage", err);
    }

    setAnalyticsEnabled(analytics);
    updateGtagConsent(analytics);
    setIsPreferencesOpen(false);
    setIsVisible(false);

    if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
    }
  };

  const handleAcceptAll = () => saveConsent(true);
  const handleRejectAll = () => saveConsent(false);
  const handleSavePreferences = () => saveConsent(analyticsEnabled);

  if (!hasMounted || !isVisible) return null;

  return (
    <>
      {/* 1. Main Cookie Banner Notice */}
      {!isPreferencesOpen ? (
        <aside
          ref={bannerRef}
          role="region"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-[#001d2f] text-white shadow-2xl border-t-4 border-[#0E8168]"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4e300] flex-shrink-0" aria-hidden="true" />
                <h2 id="cookie-banner-title" className="text-base sm:text-lg font-bold text-white tracking-wide mt-0">
                  Your Privacy &amp; Cookie Preferences
                </h2>
              </div>
              <p id="cookie-banner-desc" className="mt-1.5 text-sm text-slate-200 leading-relaxed">
                We use cookies and Google Analytics to measure website traffic and improve user experience. You
                can choose to accept all, reject non-essential analytics, or customize your preferences. Learn
                more in our{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#d4e300] font-semibold underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => {
                  lastActiveElementRef.current = document.activeElement as HTMLElement;
                  setIsPreferencesOpen(true);
                }}
                className="px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border border-slate-300 bg-transparent text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-colors"
              >
                Customize
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border border-slate-300 bg-transparent text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-colors"
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 min-h-[44px] text-sm font-bold rounded-lg bg-[#0E8168] text-white hover:bg-[#0a6b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-colors shadow-md"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      ) : (
        /* 2. Accessible Granular Preferences Modal */
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          aria-describedby="cookie-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div
            ref={modalRef}
            className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 id="cookie-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#0E8168]" aria-hidden="true" />
                Customize Cookie Preferences
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsPreferencesOpen(false);
                  lastActiveElementRef.current?.focus();
                }}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E8168] focus-visible:outline-offset-2"
                aria-label="Close cookie preferences dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
              <p id="cookie-modal-desc" className="text-slate-600 leading-relaxed">
                Configure your cookie preferences below. Essential cookies cannot be deactivated because they are
                necessary for the core functionality of the website.
              </p>

              {/* Item 1: Strictly Necessary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Strictly Necessary Cookies</span>
                    <span className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold">
                      Always Active
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Essential for site security, navigation, and recording your privacy preferences.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  aria-disabled="true"
                  className="mt-1 w-5 h-5 accent-[#0E8168] cursor-not-allowed opacity-75"
                  aria-label="Strictly Necessary Cookies (Always active and required)"
                />
              </div>

              {/* Item 2: Google Analytics */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="analytics-consent-checkbox" className="font-bold text-slate-900 cursor-pointer">
                    Google Analytics (Performance &amp; Usage)
                  </label>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Helps us understand how visitors interact with our site by gathering non-identifying telemetry
                    and metrics.
                  </p>
                </div>
                <input
                  id="analytics-consent-checkbox"
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="mt-1 w-5 h-5 min-h-[22px] min-w-[22px] accent-[#0E8168] rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E8168] focus-visible:outline-offset-2"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E8168] focus-visible:outline-offset-2"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2.5 min-h-[44px] text-sm font-bold rounded-lg bg-[#0E8168] text-white hover:bg-[#0a6b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E8168] focus-visible:outline-offset-2 shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
