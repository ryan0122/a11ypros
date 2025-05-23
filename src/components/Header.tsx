"use client";

import TopNav from "./TopNav";
import Link from "next/link";
import IconLogo from "./icons/IconLogo";
import MobileNav from "@/components/MobileNav";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="header flex items-center w-full py-5 px-6 sticky top-0 z-10">
      {/* Mobile: Left-aligned Logo | Large Screens: Logo & Menu Centered */}
      <div className="flex lg:flex-1 gap-10 max-w-6xl mx-auto justify-between">
        <Link href="/" className="logo no-underline hover:no-underline lg:mr-14 w-36 sm:w-56">
          <IconLogo />
          <span className="sr-only">Home</span>
        </Link>
        <div className="hidden lg:flex">
          <TopNav />
        </div>
      </div>

      {/* Right-aligned Mobile Menu Button (Only visible on small screens) */}
      <div className="flex flex-1 justify-end lg:hidden">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Component */}
      <MobileNav isOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
    </div>
  );
}
