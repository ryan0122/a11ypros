import { InputHTMLAttributes, useId, useRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  id?: string;
  label: string;
}

const Input = ({ className = "", errorText, id, label, type = "text", ...props }: InputProps) => {

  const inputIdRef = useRef(useId());
  const inputId = id || inputIdRef.current;
  const errorId = useRef(useId()).current;

  return (  
	<div className={`${className} mb-5 flex flex-col`}>
		<label htmlFor={inputId} className="block mb-2">
			{label} {props.required && <span className="text-[#da3940]">*</span>}
		</label>
		<input {...props} id={inputId} type={type} className={errorText && "error"} aria-describedby={errorText ? errorId : undefined}/>
		{errorText && <span className="mt-2 text-[#da3940]" id={errorId}>{errorText}</span>}
	</div>
  )
};

export default Input;
