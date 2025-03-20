"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Loader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When the pathname changes, show the loader immediately.
    setLoading(true);

    // Hide the loader after a short delay (adjust as needed)
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  );
}