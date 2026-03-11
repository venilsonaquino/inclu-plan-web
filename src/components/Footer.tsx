export default function Footer() {
  return (
    <footer className="px-6 lg:px-20 py-8 bg-white/30 backdrop-blur-sm border-t border-primary/5 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm font-medium">
          © 2024 incluPlan — Educação Inclusiva Potencializada por IA
        </p>
        <div className="flex gap-6 text-sm font-semibold text-slate-400">
          <a className="hover:text-primary transition-colors" href="#">
            Termos
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Privacidade
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
}
