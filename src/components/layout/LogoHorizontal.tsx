import { Lexend } from "next/font/google";

// Load Lexend with specific weights
const lexend = Lexend({ subsets: ["latin"], weight: ["400", "600", "700"] });

import IconAccessibility from "@/components/icons/IconAccessibility";

export default function LogoHorizontal({ color = '#fff' }: { color?: string }) {
  return (
    <div className={`${lexend.className} flex items-center space-x-2`} role="img" aria-label="A11Y Pros">
      <span aria-hidden="true" className={`text-[${color}] text-2xl font-bold`}><span className="font-medium">&#123;</span> A11Y</span>
      <IconAccessibility size={28} color={color} aria-hidden={true as never}/>
      <span aria-hidden="true" className={`text-[${color}] text-2xl font-medium uppercase`}>Pros &#125;</span>
    </div>
  );
}
