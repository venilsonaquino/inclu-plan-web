import Navbar from "@/components/Navbar";

const lessonSteps = [
  {
    title: "Acolhimento",
    description: "Com música suave e luzes coloridas para ambientação sensorial.",
  },
  {
    title: "Apresentação da 'Caixa das Cores'",
    description: "Exploração de objetos com diferentes texturas e cores primárias.",
  },
  {
    title: "Atividade Prática",
    description: "Pintura livre com mãos ou pincéis, escolhendo cores que representam o 'sentimento do dia'.",
  },
  {
    title: "Roda de Conversa",
    description: "Momento de compartilhamento e validação das criações e sentimentos.",
  },
];

const adaptations = [
  {
    name: "Joana (TEA)",
    initials: "JO",
    color: "bg-blue-100 text-blue-500",
    items: [
      "Uso de cartões de alto contraste",
      "Cantinho calmo em caso de sobrecarga",
    ],
  },
  {
    name: "Pedro (TEA/TOD)",
    initials: "PE",
    color: "bg-orange-100 text-orange-500",
    items: [
      "Fragmentação de tarefas",
      "Timer visual para atividades",
      "Feedback positivo imediato",
    ],
  },
];

export default function DetalhesPlanoPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light gradient-bg text-slate-900 font-display">
      <Navbar />

      <main className="flex-1 px-6 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <a className="hover:text-primary" href="/planos">
              Planos de Aula
            </a>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900">Cores e Sentimentos</span>
          </div>

          {/* Hero Card */}
          <div className="glass-card p-8 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="material-symbols-outlined text-sm">
                    palette
                  </span>
                  Educação Artística (Artes)
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">
                  Cores e Sentimentos
                </h1>
                <div className="flex items-center gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    60 minutos
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      book
                    </span>
                    BNCC: EF15AR02
                  </span>
                </div>
              </div>

              <button className="btn-primary-gradient text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">edit</span>
                Editar Plano
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-6">
                {/* Objective */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">
                      target
                    </span>
                    Objetivo
                  </h3>
                  <p className="text-slate-600 leading-relaxed bg-white/40 p-4 rounded-lg border border-white/50">
                    Identificar a relação entre cores e emoções através da
                    expressão artística e exploração sensorial.
                  </p>
                </section>

                {/* Lesson Steps */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">
                      format_list_numbered
                    </span>
                    Etapas da Aula
                  </h3>
                  <div className="space-y-4">
                    {lessonSteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="flex gap-4 p-4 rounded-lg hover:bg-white/60 transition-colors border border-transparent hover:border-white/50"
                      >
                        <span className="flex-shrink-0 size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">
                            {step.title}
                          </p>
                          <p className="text-slate-600 text-sm">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="col-span-1 space-y-6">
                {/* UDL Strategies */}
                <section className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      extension
                    </span>
                    Estratégias UDL
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Representação
                      </p>
                      <p className="text-sm text-slate-700">
                        Materiais visuais e táteis, cartões de emoções codificados por cores.
                      </p>
                    </div>
                    <div className="h-px bg-primary/10" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Ação/Expressão
                      </p>
                      <p className="text-sm text-slate-700">
                        Escolha de ferramentas de pintura, expressão oral ou gestual.
                      </p>
                    </div>
                    <div className="h-px bg-primary/10" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Engajamento
                      </p>
                      <p className="text-sm text-slate-700">
                        Conexão de cores com sentimentos pessoais, compartilhamento colaborativo.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Image Placeholder */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-white/50 bg-gradient-to-br from-amber-100 to-orange-100 h-40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-amber-300">
                    brush
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Adaptations) */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-xl shadow-sm border border-white/40">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                diversity_3
              </span>
              Adaptações
            </h2>

            <div className="space-y-6">
              {adaptations.map((student) => (
                <div key={student.name} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`size-10 rounded-full ${student.color} flex items-center justify-center overflow-hidden border-2 border-white group-hover:scale-105 transition-transform font-bold text-sm`}
                    >
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500">Perfil do Aluno</p>
                    </div>
                  </div>

                  <div className="bg-white/40 border border-white/60 p-4 rounded-lg space-y-2">
                    {student.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="material-symbols-outlined text-primary text-xs mt-1">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tips Section */}
              <div className="bg-gradient-to-br from-primary/20 to-purple-100 p-5 rounded-xl border border-primary/20 relative overflow-hidden">
                <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl text-primary/10">
                  lightbulb
                </span>
                <h4 className="text-primary font-bold text-sm mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    tips_and_updates
                  </span>
                  Dica do incluPlan
                </h4>
                <p className="text-slate-800 text-sm leading-snug relative z-10">
                  Considere a regulação sensorial durante a pintura. Alunos que
                  evitam texturas molhadas podem usar esponjas em cabos ou luvas
                  descartáveis.
                </p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="glass-card p-6 rounded-xl text-center space-y-4">
            <p className="text-sm font-medium text-slate-600">
              Precisa de uma versão impressa para a aula?
            </p>
            <button className="w-full py-3 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir PDF da Aula
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
