// components/UI/Form.tsx
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required,
  icon: Icon,
  children
}) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">
      {Icon && <Icon size={16} />}
      {label}
      {required && <span className="required">*</span>}
    </label>
    {children}
    {error && <span className="error-message">{error}</span>}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ error, className = '', ...props }) => (
  <input
    className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
    {...props}
  />
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ error, className = '', ...props }) => (
  <textarea
    className={`form-textarea ${error ? 'error' : ''} ${className}`.trim()}
    {...props}
  />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  options, 
  placeholder, 
  className = '', 
  ...props 
}) => (
  <select className={`form-select ${className}`.trim()} {...props}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);