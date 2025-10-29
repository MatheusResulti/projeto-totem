import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode, type ChangeEvent } from "react";

type PasswordInputProps = {
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({
  placeholder,
  icon,
  value,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="border-2 border-border-color relative rounded-lg w-full h-12 p-3 gap-4 flex flex-row items-center text-sm mb-1">
      {icon && <span className="text-primary">{icon}</span>}
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 h-full outline-none focus:outline-none focus:ring-0 placeholder:text-placeholder-color"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 text-gray-400 touchable"
      >
        {showPassword ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
