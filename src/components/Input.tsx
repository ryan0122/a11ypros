import { InputHTMLAttributes, useRef } from "react";
import { createId } from "@/utils/createId";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
}

const Input = ({ className = "", label, type = "text", ...props }: InputProps) => {

  const inputId = useRef(createId()).current;

  return (
	<div className={className}>
		<label htmlFor={inputId}>
			{label}
		</label>
		<input id={inputId} type={type} className={``} {...props}/>
	</div>
  )
};

export default Input;
