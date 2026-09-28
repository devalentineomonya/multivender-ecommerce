"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BiHide, BiShow } from "react-icons/bi";
import { useI18nStore } from "@/lib/i18n/store";

interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: React.ReactNode;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      type = "text",
      name,
      label,
      icon,
      className,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const { t } = useI18nStore();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col mt-4">
        <div className="relative flex items-center group">
          <input
            ref={ref}
            type={inputType}
            name={name}
            id={name}
            placeholder=" "
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            className={cn(
              "peer w-full h-14 pt-5 pb-1.5 pl-4 pr-11 text-sm sm:text-base text-slate-900 bg-tint-blue border border-gray-200 rounded-lg outline-none transition-[border-color,background-color,box-shadow]",
              "focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white",
              className
            )}
            {...props}
          />
          <label
            htmlFor={name}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none transition-[top,transform,color] duration-200 ease-out origin-[0]",
              "peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium",
              "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-600 peer-[:not(:placeholder-shown)]:font-medium"
            )}
          >
            {label}
          </label>

          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 text-gray-400 hover:text-slate-700 transition-colors cursor-pointer text-xl p-1"
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
          ) : icon ? (
            <span className="absolute right-4 text-gray-400 peer-focus:text-primary peer-[:not(:placeholder-shown)]:text-slate-700 transition-colors pointer-events-none text-xl">
              {icon}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
