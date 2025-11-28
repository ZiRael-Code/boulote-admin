"use client";

import { forwardRef, useState } from "react";
import Input, { InputProps } from "./index";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "rightIcon">
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
