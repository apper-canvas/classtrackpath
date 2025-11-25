import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "medium",
  className = "",
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md hover:shadow-lg focus:ring-primary",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-md",
    medium: "px-4 py-2 text-sm rounded-lg",
    large: "px-6 py-3 text-base rounded-lg"
  };
  
  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    !disabled && "hover:scale-[1.02] active:scale-[0.98]",
    className
  );

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;