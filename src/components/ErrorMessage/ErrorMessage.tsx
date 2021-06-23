import cn from "classnames";
import React from "react";

import classes from "./ErrorMessage.module.css";

export interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const ErrorMessage = ({ children, className }: ErrorMessageProps) => {
  if (!children) return null;
  return <p className={cn(classes.errorMessage, className)}>{children}</p>;
};
