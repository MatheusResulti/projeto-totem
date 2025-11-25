import type { ReactNode, ChangeEvent, InputHTMLAttributes } from "react";

type InputExtraProps = InputHTMLAttributes<HTMLInputElement> & {
  [key: `data-${string}`]: string | undefined;
};

type InputFieldProps = {
  inputType: string;
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  inputProps?: InputExtraProps;
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
    <div className="border border-border-color rounded-md w-full h-12 p-3 gap-4 flex flex-row items-center">
      {icon && <span>{icon}</span>}
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
