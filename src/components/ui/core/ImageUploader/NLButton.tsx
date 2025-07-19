import React, { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type TButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const NLButton = ({
  children,
  variant = "primary",
  className,
  disabled,
  ...otherProps
}: TButtonProps) => {
  const baseStyles =
    "px-3 py-2 rounded font-medium transition duration-300 text-sm cursor-pointer";

  const variantStyles = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "bg-transparent border border-gray-300 text-gray-600",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed hover:bg-inherit";

  return (
    <button
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        disabled && disabledStyles,
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default NLButton;
