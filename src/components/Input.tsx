import { InputHTMLAttributes, useId, useRef } from "react";
import { createId } from "@/utils/createId";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  id?: string;
  label: string;
}

const Input = ({ className = "", errorText, id, label, type = "text", ...props }: InputProps) => {

  const inputIdRef = useRef(useId());
  const inputId = id || inputIdRef.current;
  const errorId = useRef(createId()).current;

  return (  
	<div className={`${className} mb-5 flex flex-col`}>
		<label htmlFor={inputId} className="block mb-2">
			{label}
		</label>
		<input {...props} id={inputId} type={type} className={`p-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2`} aria-describedby={errorText ? errorId : undefined}/>
		{errorText && <span className="mt-2"  id={errorId}>{errorText}</span>}
	</div>
  )
};

export default Input;
