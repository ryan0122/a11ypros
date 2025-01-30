import { InputHTMLAttributes, useRef } from "react";
import { createId } from "@/utils/createId";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label: string;
}

const TextArea = ({ className = "", label, ...props }: InputProps) => {

  const inputId = useRef(createId()).current;

  return (
	<div className={className}>
		<label htmlFor={inputId}>
			{label}
		</label>
		<textarea id={inputId} className={``} {...props}/>
	</div>
  )
};

export default TextArea;
