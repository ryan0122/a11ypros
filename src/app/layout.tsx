import {Inter} from "next/font/google";
import Script from "next/script"; 
import "./styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./styles/main.scss";

const inter = Inter({ variable: "--font-inter",subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
        {/* Google Analytics */}
        <Script 
          strategy="afterInteractive" 
          src="https://www.googletagmanager.com/gtag/js?id=G-W8QRH1S6R6"
        />
        <Script 
          id="google-analytics" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W8QRH1S6R6');
            `,
          }}
        />
      <body
        className={`${inter.variable} antialiased h-full`}
      >
        <div className="min-h-full">
        <Header/>
          {children}
        <Footer />
        </div>
      </body>
    </html>
  );
}
