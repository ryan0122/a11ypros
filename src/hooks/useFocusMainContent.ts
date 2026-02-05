"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useFocusMainContent() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Only run if pathname actually changed (skip initial mount)
    if (previousPathname.current !== null && previousPathname.current !== pathname) {
      const focusMainContent = () => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          // Make the element focusable if it isn't already
          if (!mainContent.hasAttribute("tabindex")) {
            mainContent.setAttribute("tabindex", "-1");
          }
          
          // Use requestAnimationFrame to ensure DOM has updated
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              mainContent.focus({ preventScroll: false });
            });
          });
          return true;
        }
        return false;
      };

      // Try multiple times with increasing delays
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryFocus = () => {
        if (focusMainContent()) {
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryFocus, 50 * attempts);
        }
      };

      tryFocus();
    }

    previousPathname.current = pathname;
  }, [pathname]);
}
