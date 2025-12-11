import { forwardRef, InputHTMLAttributes, useId, useRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
	errorText?: string;
	id?: string;
	label: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(({ className = "", errorText, id, label, ...props }, ref) => {
	const inputIdRef = useRef(useId());
	const inputId = id || inputIdRef.current;
	const errorId = useRef(useId()).current;
	const inputClasses = clsx(
		"p-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2 border-2 rounded-md",
		errorText ? "border-red-500 focus-visible:outline-red-500" : "border-gray-800 focus-visible:outline-white"
	);

	return (
		
		<div className={`${className} mb-5 flex flex-col`}>
			<label htmlFor={inputId} className="block mb-2">
				{label} {props.required && <span className="text-[#da3940]">*</span>}
			</label>
			<textarea id={inputId} className={inputClasses} ref={ref} {...props} />
			{errorText && <span className="mt-2 text-[#da3940]" id={errorId}>{errorText}</span>}
		</div>
	);
});

TextArea.displayName = "TextArea"

export default TextArea;