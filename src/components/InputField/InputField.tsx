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
    <div className="flex flex-row items-center w-full border text-sm text-text-color border-border-color rounded-lg pl-4 h-12 gap-4">
      {icon && <span>{icon}</span>}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`bg-transparent flex w-full h-full outline-none ${extraClass ?? ""}`}
        maxLength={maxLength}
        {...restProps}
      />
    </div>
  );
}
