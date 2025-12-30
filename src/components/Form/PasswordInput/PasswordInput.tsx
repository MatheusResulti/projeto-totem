import { Eye, EyeOff } from "lucide-react";
import {
  useState,
  type ReactNode,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

type InputExtraProps = InputHTMLAttributes<HTMLInputElement> & {
  [key: `data-${string}`]: string | undefined;
};

type PasswordInputProps = {
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  inputProps?: InputExtraProps;
};

export default function PasswordInput({
  placeholder,
  icon,
  value,
  onChange,
  inputProps,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { className: extraClass, ...restProps } = inputProps ?? {};

  return (
    <div className="flex flex-row items-center w-full border text-sm text-text-color border-border-color rounded-lg pl-4 h-12 gap-4">
      {icon && <span>{icon}</span>}
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`bg-transparent flex w-full h-full outline-none ${extraClass ?? ""}`}
        {...restProps}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="h-full px-4 touchable"
      >
        {showPassword ? (
          <Eye size={22} color="#FFF" />
        ) : (
          <EyeOff size={22} color="#a3a3a3" />
        )}
      </button>
    </div>
  );
}
