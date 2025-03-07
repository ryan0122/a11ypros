import { Lexend } from "next/font/google";

// Load Lexend with specific weights
const lexend = Lexend({ subsets: ["latin"], weight: ["400", "600", "700"] });

import IconAccessibility from "@/components/icons/IconAccessibility";

export default function LogoHorizontal() {
  return (
    <div className={`${lexend.className} flex items-center space-x-2`}>
      <span className="text-white text-2xl font-bold"><span className="font-medium">&#123;</span> A11Y</span>
      <IconAccessibility size={22} />
      <span className="text-white text-2xl font-medium uppercase">Pros &#125;</span>
    </div>
  );
}
