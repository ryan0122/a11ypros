"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import TopNav from "@/components/TopNav";
import LogoHorizontal from "@/components/LogoHorizontal";

interface MobileNavProps {
  isOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function MobileNav({ isOpen, setMobileMenuOpen }: MobileNavProps) {
  // Reference to the container for focus trapping
  const navRef = useRef<HTMLDivElement>(null);
  // Reference to the first focusable element (close button)
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  // Reference to store the element that had focus before the mobile menu was opened
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save the current active element when the menu opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (firstFocusableRef.current) {
        firstFocusableRef.current.focus();
      }
    } else if (previousFocusRef.current) {
      // Restore focus when the menu closes
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard events for closing the menu with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setMobileMenuOpen]);

  // Implement focus trap
  useEffect(() => {
    if (!isOpen || !navRef.current) return;

    const container = navRef.current;
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      // Find all focusable elements within the container
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If tab is pressed on the last element, cycle to the first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } 
      // If shift+tab is pressed on the first element, cycle to the last
      else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return (
    <div
      ref={navRef}
      className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Main Menu"
	  id="mobileMenu"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="mobile-menu-container fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 p-1.5">
            <LogoHorizontal color="#0F866C"/>
            <span className="sr-only">A11Y Pros</span>
          </Link>
          <button
            ref={firstFocusableRef}
            onClick={() => setMobileMenuOpen(false)}
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            aria-label="Close menu"
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
              <TopNav 
                isMobile={true} 
                onLinkClick={() => setMobileMenuOpen(false)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}