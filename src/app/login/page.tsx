import Link from "next/link";

export default function LoginPage() {
  return (
    <body className="font-display bg-background-light min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Organic Gradient Background */}
      <div className="absolute inset-0 organic-gradient pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Login Card */}
        <div className="glass-card-light rounded-xl p-8 shadow-2xl flex flex-col items-center">
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center gap-3">
            <div className="size-12 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              incluPlan
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              Bem-vindo de volta
            </p>
          </div>

          {/* Form */}
          <form className="w-full space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                E-mail
              </label>
              <input
                className="w-full h-14 bg-white/60 border border-white/40 rounded-xl px-5 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Digite seu e-mail"
                type="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Senha
                </label>
                <a
                  className="text-xs font-medium text-primary hover:underline"
                  href="#"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  className="w-full h-14 bg-white/60 border border-white/40 rounded-xl px-5 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  placeholder="Digite sua senha"
                  type="password"
                />
                <button
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Link href="/turmas/nova">
                <button
                  className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:shadow-primary/30 transition-shadow active:scale-[0.98]"
                  type="button"
                >
                  Entrar
                </button>
              </Link>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Ainda não tem uma conta?{" "}
              <a className="font-bold text-primary hover:underline" href="#">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-slate-400 text-xs font-medium">
          <a className="hover:text-primary transition-colors" href="#">
            Termos de Uso
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Privacidade
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Ajuda
          </a>
        </div>
      </div>
    </body>
  );
}
