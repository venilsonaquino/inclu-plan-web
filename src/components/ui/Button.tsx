import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "btn-primary-gradient text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all",
  secondary:
    "bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform",
  outline:
    "border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors",
  ghost:
    "text-slate-600 font-medium hover:text-primary hover:bg-slate-100 transition-colors",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-base rounded-xl gap-2",
  lg: "px-10 py-5 text-lg rounded-xl gap-3",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
}
