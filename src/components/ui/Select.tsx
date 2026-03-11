"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  icon?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  variant?: "inline" | "form";
  inlineLabel?: string;
}

export default function Select({
  label,
  icon,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  className = "",
  triggerClassName = "",
  variant = "form",
  inlineLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseTriggerClasses = variant === "form" 
    ? `w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 ${icon ? "pl-12" : "pl-4"} pr-4 py-4`
    : `flex items-center gap-2 bg-white px-4 py-2 rounded-xl glass-card shadow-sm border border-slate-100 hover:border-slate-200 transition-all text-slate-800`;

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      {label && variant === "form" && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseTriggerClasses} ${triggerClassName}`}
        >
          {icon && variant === "form" && (
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          
          {variant === "inline" && inlineLabel && (
            <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">
              {inlineLabel}
            </span>
          )}

          <div className="flex flex-1 items-center justify-between gap-4 truncate">
            <span className={`truncate ${!selectedOption && variant === "form" ? "text-slate-400" : "font-medium text-sm"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span
              className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            >
              expand_more
            </span>
          </div>
        </button>

        {isOpen && (
          <div className={`absolute ${variant === "inline" ? "top-full right-0 mt-2 min-w-[160px]" : "top-full left-0 right-0 mt-2"} bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top`}>
            <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    value === option.value
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <span className="truncate text-sm">{option.label}</span>
                  {value === option.value && (
                    <span className="material-symbols-outlined text-sm shrink-0">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
