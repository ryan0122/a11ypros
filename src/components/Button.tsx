import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  href?: string;
  children: ReactNode;
}

const Button = ({ children, href, className = "", type = "button", ...props }: ButtonProps) => {
  const styles = `py-2 ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;
