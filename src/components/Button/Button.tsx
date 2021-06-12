import React from "react";

import classes from "./Button.module.css";

export interface ButtonProps {
  loading: boolean;
}

export const Button = ({
  loading,
  children,
  className = "",
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`${classes.button} ${className}`} {...props}>
      {loading ? "Loading ..." : children}
    </button>
  );
};
