import React, { forwardRef, InputHTMLAttributes, useId, useRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  id?: string;
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className = "",
    errorText,
    id,
    label,
    type = "text",
    required,
    ...rest
  } = props;

  const inputIdRef = useRef(useId());
  const inputId = id || inputIdRef.current;
  const errorId = useRef(useId()).current;

  return (
    <div className={`${className} mb-5 flex flex-col`}>
      <label htmlFor={inputId} className="block mb-2">
        {label} {required && <span className="text-[#da3940]">*</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        className={errorText ? "error" : ""}
        aria-describedby={errorText ? errorId : undefined}
        {...rest}
      />
      {errorText && (
        <span className="mt-2 text-[#da3940]" id={errorId}>
          {errorText}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;