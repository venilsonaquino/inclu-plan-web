import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "error", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    error: "bg-red-500 border-red-600 text-white",
    success: "bg-green-500 border-green-600 text-white",
    warning: "bg-yellow-500 border-yellow-600 text-white",
  };

  const icons = {
    error: "error",
    success: "check_circle",
    warning: "warning",
  };

  return (
    <div
      className={`fixed top-24 right-4 z-[100] transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${styles[type]}`}
      >
        <span className="material-symbols-outlined font-bold text-2xl">
          {icons[type]}
        </span>
        <div>
          <p className="font-bold">{type === "error" ? "Ops! Algo deu errado." : type === "success" ? "Sucesso!" : "Atenção"}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
