import { FieldsetHTMLAttributes, ReactNode, useRef } from "react";
import { createId } from "@/utils/createId";

interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  className?: string;
  legend: string;
  children: ReactNode;
}

const FieldSet = ({ children, className = "", legend, ...props }: FieldsetProps) => {
  const styles = `py-2 ${className}`;
  const fieldSetId = useRef(createId()).current;


  return (
    <fieldset id={fieldSetId} className={styles} {...props}>
		<legend className="text-center">{legend}</legend>
      	{children}
    </fieldset>
  );
};

export default FieldSet;
