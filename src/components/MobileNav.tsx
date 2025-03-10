"use client";

import Link from "next/link";

import IconAccessibility from "@/components/icons/IconAccessibility";
import { useEffect, useRef } from "react";
import TopNav from "./TopNav";

interface MobileNavProps {
  isOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function MobileNav({ isOpen, setMobileMenuOpen }: MobileNavProps) {

	// Reference to the first focusable element
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	// Set focus on the first element when the menu opens
	useEffect(() => {
	  if (isOpen && closeButtonRef.current) {
		// Set focus to the close button when menu opens
		closeButtonRef.current.focus();
	  }
	}, [isOpen]);


  return (
    <div id="mobileMenu" className={`${isOpen ? "" : "hidden"}`} role="dialog" aria-modal="true" aria-label="Main Menu">
      <div className="fixed inset-0 z-10"></div>
      <div className="mobile-menu-container fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 bg-white">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">A11Y Pros</span>
            <IconAccessibility color="#0F866C" size={30} aria-hidden="true" />
          </Link>
          {/* Close button now correctly updates the state in the parent */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
			ref={closeButtonRef}
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              <div className="-mx-3">
				<TopNav 
					isMobile={true}
					onLinkClick={() => setMobileMenuOpen(false)} 
				/>
			  </div>	
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
