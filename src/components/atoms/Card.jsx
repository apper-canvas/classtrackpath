import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "",
  hover = false,
  ...props 
}, ref) => {
  const classes = cn(
    "bg-white rounded-xl shadow-lg border border-gray-100",
    hover && "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
    className
  );

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;