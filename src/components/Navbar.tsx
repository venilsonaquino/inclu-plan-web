"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold flex items-center gap-2 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Avatar */}
        <div
          className="h-10 w-10 rounded-full border-2 border-primary bg-cover bg-center bg-gradient-to-br from-primary/30 to-secondary/30"
          title="Perfil do Usuário"
        >
          <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            VP
          </div>
        </div>
      </div>
    </header>
  );
}
