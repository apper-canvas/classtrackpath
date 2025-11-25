import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  type = "input", 
  options = [], 
  readOnly = false,
  isSystemField = false,
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

if (isSystemField) {
    return (
      <div className={props.className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {props.label}
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-sm">
          {props.value || "System managed"}
          {props.label?.includes("On") && props.value ? (
            <span className="text-xs text-gray-500 block">
              {new Date(props.value).toLocaleString()}
            </span>
          ) : null}
        </div>
        {props.label?.includes("By") && props.value && (
          <span className="text-xs text-gray-500 mt-1 block">
            User: {props.value.Name || props.value}
          </span>
        )}
      </div>
    );
  }

  return <Input type={type} readOnly={readOnly} {...props} />;
};

export default FormField;