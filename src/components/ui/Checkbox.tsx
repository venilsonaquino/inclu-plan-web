import { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxCardProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  label: ReactNode;
}

export function CheckboxCard({
  icon,
  label,
  className = "",
  ...props
}: CheckboxCardProps) {
  return (
    <label className="cursor-pointer group">
      <input className="hidden peer" type="checkbox" {...props} />
      <div
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 ${className}`}
      >
        {icon && (
          <span className="material-symbols-outlined text-3xl mb-2 text-slate-400 group-[:has(.peer:checked)]:text-primary">
            {icon}
          </span>
        )}
        <span className="text-xs font-bold text-slate-600 group-[:has(.peer:checked)]:text-primary text-center">
          {label}
        </span>
      </div>
    </label>
  );
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20 transition-colors"
        {...props}
      />
      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
        {label}
      </span>
    </label>
  );
}
