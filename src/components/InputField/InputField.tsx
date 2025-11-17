import type { ReactNode, ChangeEvent } from "react";

type InputFieldProps = {
  inputType: string;
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
};

export default function InputField({
  inputType,
  placeholder,
  icon,
  value,
  onChange,
  maxLength,
}: InputFieldProps) {
  return (
    <div className="border-2 border-border-color rounded-lg w-full h-12 p-3 gap-4 flex flex-row items-center text-sm mb-1">
      {icon && <span className="text-primary">{icon}</span>}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 h-full outline-none focus:outline-none focus:ring-0 placeholder:text-placeholder-color"
        maxLength={maxLength}
      />
    </div>
  );
}
