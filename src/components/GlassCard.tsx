import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  borderLeft?: string;
}

export default function GlassCard({
  children,
  className = "",
  borderLeft,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-xl shadow-sm ${
        borderLeft ? `border-l-4 ${borderLeft}` : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
