import { InputHTMLAttributes, useId, useRef } from "react";

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

  return (
	<div className={`${className} mb-5 flex flex-col`}>
		<label htmlFor={inputId} className="block mb-2">
			{label}
		</label>
		<textarea id={inputId} className={`p-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2`} {...props}/>
		{errorText && <span className="mt-2" id={errorId}>{errorText}</span>}
	</div>
  )
};

export default TextArea;
