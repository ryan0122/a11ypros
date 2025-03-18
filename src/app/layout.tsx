import { Inter } from "next/font/google";
import Head from "next/head";
import "./styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./styles/main.scss";

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
      <Head>
        {/* eslint-disable-next-line */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W8QRH1S6R6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W8QRH1S6R6');
            `,
          }}
        ></script>
      </Head>
      <body className={`${inter.variable} antialiased h-full`}>
         {/* Skip to Content Link */}
         <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        <div className="min-h-full">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
