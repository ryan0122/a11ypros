import { InputHTMLAttributes, useId, useRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  errorText?: string;
  id?: string;
  label: string;
}

const TextArea = ({ className = "", errorText, id, label, ...props }: InputProps) => {

	const inputIdRef = useRef(useId());
	const inputId = id || inputIdRef.current;
	const errorId = useRef(useId()).current;
	const inputClasses = clsx(
		"p-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2 border rounded-md",
		errorText ? "border-red-500 focus-visible:outline-red-500" : "border-gray-300 focus-visible:outline-blue-500"
	  );

  return (
	<div className={`${className} mb-5 flex flex-col`}>
		<label htmlFor={inputId} className="block mb-2">
			{label} {props.required && <span className="text-red-500">*</span>}
		</label>
		<textarea id={inputId} className={inputClasses} {...props}/>
		{errorText && <span className="mt-2 text-red-500" id={errorId}>{errorText}</span>}
	</div>
  )
};

export default TextArea;
