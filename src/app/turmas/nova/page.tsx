import Link from "next/link";

export default function NovaTurmaPage() {
  return (
    <div className="bg-background-light min-h-screen flex items-center justify-center font-display relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <main className="relative z-10 w-full max-w-xl px-6 py-12 flex flex-col items-center text-center">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-12">
          <div className="h-2 w-12 rounded-full bg-primary" />
          <div className="h-2 w-4 rounded-full bg-slate-200" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Qual o nome da sua <span className="text-primary">turma</span>?
        </h1>
        <p className="text-lg text-slate-500 mb-12 font-medium">
          Dê um nome simples para identificar seus alunos depois.
        </p>

        <div className="w-full space-y-8">
          <div className="relative">
            <input
              autoFocus
              className="w-full bg-white border-2 border-slate-100 rounded-3xl px-8 py-8 text-2xl md:text-3xl font-bold text-slate-900 placeholder:text-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl shadow-slate-200/50"
              placeholder="Ex: 3º Ano A — Manhã"
              type="text"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
              <span className="material-symbols-outlined text-4xl text-slate-200">
                edit_note
              </span>
            </div>
          </div>

          <Link href="/turmas/criar" className="block w-full">
            <button className="w-full py-6 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Próximo Passo
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </Link>
          
          <button className="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs">
            Pular por enquanto
          </button>
        </div>
      </main>
    </div>
  );
}
