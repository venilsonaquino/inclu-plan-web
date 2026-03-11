import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  variant?: "default" | "search";
}

export default function Input({
  label,
  icon,
  variant = "default",
  className = "",
  ...props
}: InputProps) {
  const baseClasses =
    "w-full bg-white/60 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  const variantClasses =
    variant === "search"
      ? "pl-12 pr-4 py-3 rounded-full shadow-sm"
      : `${icon ? "pl-12" : "px-5"} pr-5 py-4 rounded-xl`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-bold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input className={`${baseClasses} ${variantClasses} ${className}`} {...props} />
      </div>
    </div>
  );
}
