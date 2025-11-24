import type { ReactNode, ChangeEvent, InputHTMLAttributes } from "react";

type InputFieldProps = {
  inputType: string;
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export default function InputField({
  inputType,
  placeholder,
  icon,
  value,
  onChange,
  maxLength,
  inputProps,
}: InputFieldProps) {
  const { className: extraClass, ...restProps } = inputProps ?? {};

  return (
    <div className="border-2 border-border-color rounded-lg w-full h-12 p-3 gap-4 flex flex-row items-center text-sm mb-1">
      {icon && <span className="text-primary">{icon}</span>}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`flex-1 h-full outline-none focus:outline-none focus:ring-0 placeholder:text-placeholder-color ${extraClass ?? ""}`}
        maxLength={maxLength}
        {...restProps}
      />
    </div>
  );
}
