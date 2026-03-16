"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getInitials } from "@/lib/auth-utils";
import { useRouter, usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

const navLinks: NavLink[] = [
  { href: "/planos/criar", label: "Gerar Plano", icon: "auto_fix_high" },
  { href: "/turmas/criar", label: "Turmas", icon: "groups" },
  { href: "/planos", label: "Biblioteca", icon: "library_books" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user info from our BFF endpoint
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUser(data))
      .catch(() => setUser(null));

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/proxy/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-20 border-b border-primary/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined !text-3xl">
            auto_awesome
          </span>
        </div>
        <Link href="/planos/criar">
          <h2 className="text-slate-900 text-xl font-extrabold tracking-tight cursor-pointer">
            incluPlan
          </h2>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex gap-10 mr-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-bold flex items-center gap-2 transition-all relative py-1 ${
                  isActive
                    ? "text-primary"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined !text-xl">{link.icon}</span>
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary transition-all bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center overflow-hidden group shadow-sm"
          >
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm group-hover:bg-primary/20 transition-colors">
              {user ? getInitials(user.name) : <span className="material-symbols-outlined !text-xl animate-pulse">account_circle</span>}
            </div>
          </button>

          {/* Logout Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 flex flex-col">
                <span className="text-xs font-black text-primary uppercase tracking-widest mb-1">Logado como</span>
                <span className="text-sm font-bold text-slate-900 truncate">{user?.name || "Carregando..."}</span>
              </div>
              
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined !text-xl">logout</span>
                    <span>Deslogar</span>
                  </div>
                  <span className="material-symbols-outlined !text-sm translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
