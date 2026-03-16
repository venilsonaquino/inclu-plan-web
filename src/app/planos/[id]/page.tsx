import Navbar from "@/components/Navbar";
import { serverApiFetch } from "@/lib/server-api";
import { cookies } from "next/headers";
import subjects from "@/data/subjects.json";
import mockData from "@/data/lesson-plan-detail-mock.json";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/date-utils";

export default async function DetalhesPlanoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let planData: any = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const res = await serverApiFetch<any>(`/lessons/${id}`, { method: 'GET' }, token);
    
    if (res.ok) {
        planData = await res.json();
    }
  } catch (error) {
     console.error("Error fetching plan:", error);
  }

  // Fallback to mock data for demonstration if fetch fails or looks like example ID
  if (!planData || id === "bc14a3da-cb5d-4f97-a182-aaa8c2c9156c") {
      planData = mockData;
  }

  const subjectDetails = subjects.find(s => s.label.toLowerCase() === planData.discipline.toLowerCase()) || {
    icon: "menu_book",
    color: "bg-primary/10",
    textColor: "text-primary"
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light gradient-bg text-slate-900 font-display">
      <Navbar />

      <main className="flex-1 px-6 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link className="hover:text-primary" href="/planos">
              Planos de Aula
            </Link>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 line-clamp-1">{planData.lessonTitle}</span>
          </div>

          {/* Hero Card */}
          <div className="glass-card p-8 rounded-2xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${subjectDetails.color} ${subjectDetails.textColor} text-xs font-bold uppercase tracking-wider mb-4`}>
                  <span className="material-symbols-outlined text-sm">
                    {subjectDetails.icon}
                  </span>
                  {planData.discipline}
                </div>
                <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                  {planData.lessonTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    {planData.duration}
                  </span>
                  {planData.bnccCode && (
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                      <span className="material-symbols-outlined text-sm">
                        book
                      </span>
                      {planData.bnccCode}
                    </span>
                  )}
                  {planData.estimatedPrepTime && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        timer
                      </span>
                      Preparo: {planData.estimatedPrepTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary-gradient text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Editar
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 space-y-6">
                {/* Objective */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">
                      track_changes
                    </span>
                    Objetivo
                  </h3>
                  <p className="text-slate-600 leading-relaxed bg-white/40 p-5 rounded-2xl border border-white/60 text-sm">
                    {planData.objective}
                  </p>
                </section>

                {/* Learning Objects */}
                {planData.learningObjects && (
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-primary">
                        psychology
                      </span>
                      Objetivos de Aprendizagem
                    </h3>
                    <p className="text-slate-600 leading-relaxed bg-white/40 p-5 rounded-2xl border border-white/60 text-sm">
                      {planData.learningObjects}
                    </p>
                  </section>
                )}

                {/* BNCC Description */}
                {planData.bnccDescription && (
                  <section className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1">
                       <span className="material-symbols-outlined text-sm text-slate-500">menu_book</span>
                       Descrição BNCC
                    </h4>
                    <p className="text-slate-600 text-sm">{planData.bnccDescription}</p>
                  </section>
                )}

                {/* Lesson Steps */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">
                      format_list_numbered
                    </span>
                    Etapas da Aula
                  </h3>
                  <div className="space-y-4">
                    {planData.activitySteps.map((step: string, index: number) => {
                      const parts = step.split(":");
                      const title = parts[0];
                      const description = parts.slice(1).join(":");

                      return (
                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-white/50"
                        >
                          <span className="flex-shrink-0 size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">
                              {title}
                            </p>
                            {description && (
                              <p className="text-slate-600 text-sm mt-1">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Resources */}
                {planData.resources && (
                  <section>
                     <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary">backpack</span>
                        Recursos Necessários
                     </h3>
                     <p className="text-slate-600 bg-white/40 p-4 rounded-2xl border border-white/60 text-sm">{planData.resources}</p>
                  </section>
                )}

                 {/* Evaluation */}
                 {planData.evaluation && (
                  <section>
                     <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary">task</span>
                        Avaliação
                     </h3>
                     <p className="text-slate-600 bg-white/40 p-4 rounded-2xl border border-white/60 text-sm">{planData.evaluation}</p>
                  </section>
                )}
              </div>

              {/* Right Column */}
              <div className="col-span-1 space-y-6">
                {/* UDL Strategies */}
                <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      extension
                    </span>
                    Estratégias UDL
                  </h3>
                  <div className="space-y-4">
                    {planData.udlRepresentation && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Representação
                        </p>
                        <p className="text-sm text-slate-700">
                          {planData.udlRepresentation}
                        </p>
                      </div>
                    )}
                    {planData.udlActionExpression && <div className="h-px bg-primary/10" />}
                    {planData.udlActionExpression && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Ação/Expressão
                        </p>
                        <p className="text-sm text-slate-700">
                          {planData.udlActionExpression}
                        </p>
                      </div>
                    )}
                    {planData.udlEngagement && <div className="h-px bg-primary/10" />}
                    {planData.udlEngagement && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Engajamento
                        </p>
                        <p className="text-sm text-slate-700">
                          {planData.udlEngagement}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Date created */}
                <div className="text-xs text-slate-400 text-center">
                    Criado em {new Date(planData.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Adaptations) */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl shadow-sm border border-white/40">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                diversity_3
              </span>
              Adaptações
            </h2>

            <div className="space-y-6">
              {planData.adaptations && planData.adaptations.map((student: any) => {
                const initials = student.studentName
                  .split(" ")
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div key={student.id || student.studentId} className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`size-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center overflow-hidden border-2 border-white group-hover:scale-105 transition-transform font-bold text-sm`}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {student.studentName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">#{student.studentGrade} - {student.studentNeurodivergencies}</p>
                      </div>
                    </div>

                    <div className="bg-white/40 border border-white/60 p-4 rounded-2xl space-y-3">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">analytics</span> Estágia
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">{student.strategy}</p>
                      </div>
                      
                      {student.behavioralTips && (
                         <div className="border-t border-slate-100 pt-2">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">recommend</span> Dicas de Comportamento
                            </p>
                            <p className="text-xs text-slate-700 leading-relaxed">{student.behavioralTips}</p>
                         </div>
                      )}

                      {student.successIndicators && (
                         <div className="border-t border-slate-100 pt-2">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">check_circle</span> Indicadores de Sucesso
                            </p>
                            <p className="text-xs text-slate-700 leading-relaxed">{student.successIndicators}</p>
                         </div>
                      )}

                       <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px]">
                           <span className="font-bold text-slate-400">Suporte:</span>
                           <span className={`font-bold px-2 py-0.5 rounded-full ${student.supportLevel === 'Alto' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{student.supportLevel}</span>
                       </div>
                    </div>
                  </div>
                );
              })}

              {(!planData.adaptations || planData.adaptations.length === 0) && (
                <p className="text-center text-sm text-slate-400 font-medium py-4">Nenhuma adaptação necessária.</p>
              )}
            </div>
          </div>

          {/* Action Card */}
          <div className="glass-card p-6 rounded-2xl text-center space-y-4">
            <p className="text-sm font-medium text-slate-600">
              Precisa de uma versão impressa para a aula?
            </p>
            <button className="w-full py-3 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir PDF
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
