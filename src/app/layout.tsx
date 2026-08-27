import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import Footer from "@/components/layout/Footer";
import FocusManager from "@/components/layout/FocusManager";
import CookieConsent from "@/components/layout/CookieConsent";
import "@/styles/main.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://a11ypros.com"),
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google Consent Mode v2 Default Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Set defaults to denied for EU/GDPR compliance
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });

              // Pre-load saved consent if user previously opted in
              try {
                var stored = localStorage.getItem('a11ypros_cookie_consent');
                if (stored) {
                  var parsed = JSON.parse(stored);
                  if (parsed.analytics) {
                    gtag('consent', 'update', { 'analytics_storage': 'granted' });
                  }
                }
              } catch(e) {}
            `,
          }}
        />
        {/* eslint-disable-next-line */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W8QRH1S6R6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-W8QRH1S6R6');
            `,
          }}
        ></script>
      </head>
      <body className={`${inter.variable} antialiased h-full`}>
         {/* Skip to Content Link */}
         <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        
        <div className="min-h-full">
          <FocusManager />
          <ConditionalHeader />
          {children}
          <Footer />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
