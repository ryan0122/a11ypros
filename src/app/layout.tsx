import {Inter } from "next/font/google";
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
