import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  type = "input", 
  options = [], 
  ...props 
}) => {
  if (type === "select") {
    return (
      <Select {...props}>
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  return <Input type={type} {...props} />;
};

export default FormField;