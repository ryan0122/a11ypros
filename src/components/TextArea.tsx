import { InputHTMLAttributes, useRef } from "react";
import { createId } from "@/utils/createId";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  errorText?: string;
  id?: string;
  label: string;
}

const TextArea = ({ className = "", errorText, id, label, ...props }: InputProps) => {

const inputId = id || useRef(createId()).current;
const errorId = useRef(createId()).current;

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
