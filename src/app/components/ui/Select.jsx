"use client";
import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ 
  label,
  id,
  name,
  options = [],
  placeholder = 'Sélectionner...',
  error,
  required = false,
  helperText,
  className = '',
  ...props
}, ref) => {
  const inputId = id || name;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={inputId}
          name={name}
          ref={ref}
          className={`
            w-full px-3 py-2 bg-white border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;