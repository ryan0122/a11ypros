import { FieldsetHTMLAttributes, ReactNode, useId, useRef } from "react";

interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  className?: string;
  legendClassName?: string;
  legend: string;
  children: ReactNode;
}

const FieldSet = ({ children, className = "", legend, legendClassName, ...props }: FieldsetProps) => {
  const styles = `py-2 ${className}`;
  const fieldSetId = useRef(useId()).current;


  return (
    <fieldset id={fieldSetId} className={styles} {...props}>
		<legend className={legendClassName}>{legend}</legend>
      	{children}
    </fieldset>
  );
};

export default FieldSet;
