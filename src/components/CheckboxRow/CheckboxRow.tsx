import cn from "classnames";
import React from "react";

import classes from "./CheckboxRow.module.css";

export interface CheckboxRowProps {
  children: React.ReactNode;
  onChange: (checked: boolean) => void;
  checked: boolean;
  className?: string;
}

export const CheckboxRow = ({
  children,
  onChange,
  checked,
  className,
}: CheckboxRowProps) => {
  return (
    <label className={cn(classes.checkboxRow, className)}>
      <input
        type="checkbox"
        onChange={(e) => onChange(e.currentTarget.checked)}
        checked={checked}
      />
      {children}
    </label>
  );
};
