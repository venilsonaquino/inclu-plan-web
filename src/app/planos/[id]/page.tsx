"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import subjects from "@/data/subjects.json";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

export default function DetalhesPlanoPage() {
  const { id } = useParams<{ id: string }>();

  const [planData, setPlanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/proxy/lessons/${id}`);
        if (!res.ok) {
          if (res.status === 503) {
            setApiError("Serviço indisponível. Não foi possível carregar o plano.");
          }
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setPlanData(data);
        
        // Auto-expand first adaptation if available
        if (data?.adaptations?.length > 0) {
          setExpandedStudentId(data.adaptations[0].id || data.adaptations[0].studentId);
        }
      } catch (error) {
        console.error("[DetalhesPlano] Erro ao buscar plano:", error);
        setApiError("Falha de conexão com o servidor.");
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (isLoading) {
    return <Loading text="Carregando plano de aula..." />;
  }

  if (notFound || !planData) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f7] text-slate-900 font-display">
        <Navbar />
        {apiError && <Toast message={apiError} onClose={() => setApiError(null)} />}
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 font-medium pb-20">Plano de aula não encontrado.</p>
        </main>
      </div>
    );
  }

  const subjectDetails = subjects.find(
    (s) => s.label.toLowerCase() === planData.discipline?.toLowerCase()
  ) || {
    icon: "menu_book",
    color: "bg-primary/10",
    textColor: "text-primary",
  };

  const toggleAccordion = (studentId: string) => {
    setExpandedStudentId(prev => prev === studentId ? null : studentId);
  };

  return (
    <div className="bg-[#f8f6f7] min-h-screen text-slate-900 overflow-x-hidden font-display">
      <Navbar />
      {apiError && <Toast message={apiError} onClose={() => setApiError(null)} />}

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Link className="hover:text-primary transition-colors" href="/planos">
               Planos de Aula
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 line-clamp-1">{planData.lessonTitle}</span>
          </div>

          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                {planData.bnccCode && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 border border-purple-200 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {planData.bnccCode}
                  </span>
                )}
                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined !text-xs">schedule</span>
                  {planData.duration || "N/A"}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">
                {planData.lessonTitle}
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Assunto: {planData.discipline}
                {planData.targetAudience ? ` • ${planData.targetAudience}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* <button className="flex-1 md:flex-none justify-center px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">edit</span>
                Editar Plano
              </button> */}
              <button className="flex-1 md:flex-none justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                Exportar PDF
              </button>
            </div>
          </section>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Main Content) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Objective */}
              <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span 
                      className="material-symbols-outlined text-primary text-2xl" 
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      target
                    </span>
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Objetivo Geral</h2>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {planData.objective || "Objetivo não definido para esta aula."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lesson Steps */}
              {planData.activitySteps && planData.activitySteps.length > 0 && (
                <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-xl font-black tracking-tight text-slate-900">Roteiro da Aula</h2>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      {planData.activitySteps.length} Etapas Sugeridas
                    </span>
                  </div>

                  <div className="space-y-6">
                    {planData.activitySteps.map((step: string, index: number) => {
                      const parts = step.split(":");
                      const title = parts[0]?.trim();
                      const description = parts.slice(1).join(":")?.trim();
                      const isLast = index === planData.activitySteps.length - 1;

                      // Icons matching the vibe (optional)
                      const icons = ["chat_bubble", "science", "brush", "photo_library", "assignment", "check"];
                      const icon = icons[index % icons.length];

                      return (
                        <div key={index} className="flex gap-6 group">
                          <div className="relative flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center z-10 font-bold shadow-md shrink-0">
                              {index + 1}
                            </div>
                            {!isLast && (
                              <div className="w-0.5 h-full bg-slate-200 absolute top-10" />
                            )}
                          </div>
                          <div className={!isLast ? "pb-6" : ""}>
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                              {title}
                              <span className="material-symbols-outlined text-slate-300 text-lg">
                                {icon}
                              </span>
                            </h3>
                            {description && (
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extras (Resources, Assessment etc) */}
              {(planData.resources || planData.evaluation || planData.learningObjects) && (
                <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-white space-y-6">
                   {planData.resources && (
                     <div>
                       <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Recursos Necessários</h2>
                       <p className="text-slate-600 text-sm leading-relaxed">{planData.resources}</p>
                     </div>
                   )}
                   {planData.evaluation && (
                     <div className="pt-4 border-t border-slate-100">
                       <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Avaliação</h2>
                       <p className="text-slate-600 text-sm leading-relaxed">{planData.evaluation}</p>
                     </div>
                   )}
                   {planData.learningObjects && (
                     <div className="pt-4 border-t border-slate-100">
                       <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Objetos de Aprendizagem</h2>
                       <p className="text-slate-600 text-sm leading-relaxed">{planData.learningObjects}</p>
                     </div>
                   )}
                </div>
              )}

              {/* UDL Strategies (Moved down to main content like in Stitch mock) */}
              <div className="space-y-4 pt-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2 lg:px-0">
                  Estratégias UDL (Dua)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Representation */}
                  <div className="p-6 bg-purple-50 border border-purple-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-purple-600">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Representação</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {planData.udlRepresentation || "Estratégia não definida visualmente."}
                    </p>
                  </div>

                  {/* Action & Expression */}
                  <div className="p-6 bg-pink-50 border border-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-pink-600">
                      <span className="material-symbols-outlined text-[20px]">gesture</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Ação e Expressão</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {planData.udlActionExpression || "Estratégia não definida para ação."}
                    </p>
                  </div>

                  {/* Engagement */}
                  <div className="p-6 bg-blue-50 border border-blue-50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-blue-500">
                      <span className="material-symbols-outlined">favorite</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Engajamento</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {planData.udlEngagement || "Estratégia não definida para engajamento."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (Sidebar Adaptações) */}
            <aside className="xl:col-span-4 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Adaptações</h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  {planData.adaptations?.length || 0} Aluno{planData.adaptations?.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4">
                {planData.adaptations?.map((student: any) => {
                  const sId = student.id || student.studentId;
                  const isExpanded = expandedStudentId === sId;

                  const initials = student.studentName
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  
                  const isSupportHigh = student.supportLevel === "Alto";

                  return (
                    <div 
                      key={sId}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? "bg-white shadow-xl border-primary/20 ring-4 ring-primary/5" 
                          : "bg-white/60 shadow-sm border-slate-200 hover:bg-white cursor-pointer"
                      }`}
                      onClick={() => !isExpanded && toggleAccordion(sId)}
                    >
                      {/* Accordion Header */}
                      <div 
                        className={`p-4 flex items-center justify-between transition-colors ${
                          isExpanded ? "bg-primary text-white" : ""
                        }`}
                        onClick={(e) => {
                          if (isExpanded) {
                            e.stopPropagation();
                            toggleAccordion(sId);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                            isExpanded ? "bg-white/20 text-white border-2 border-white/30" : "bg-primary/10 text-primary border-2 border-primary/20"
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-tight">
                              {student.studentName} {student.studentNeurodivergencies ? `(${student.studentNeurodivergencies})` : ""}
                            </p>
                            <p className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${
                              isExpanded ? "text-white/80" : "text-slate-500"
                            }`}>
                              Nível {student.supportLevel || "de suporte não definido"}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined">
                          {isExpanded ? "expand_less" : "expand_more"}
                        </span>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="p-5 space-y-5 bg-white text-slate-800 animate-in slide-in-from-top-2 duration-200">
                          
                          {/* Main Strategy */}
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                              Estratégia Principal
                            </h4>
                            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {student.strategy}
                              </p>
                            </div>
                          </div>

                          {/* Behavioral Tips */}
                          {student.behavioralTips && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                Dicas Comportamentais
                              </h4>
                              <ul className="space-y-3">
                                {student.behavioralTips.split(";").map((tip: string, idx: number) => {
                                  if (!tip.trim()) return null;
                                  return (
                                    <li key={idx} className="flex gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                      <span className="material-symbols-outlined text-primary text-lg translate-y-px">task</span>
                                      <span className="leading-snug">{tip.trim()}</span>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Success Indicators */}
                          {student.successIndicators && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                Indicadores de Sucesso
                              </h4>
                              <div className="flex gap-2 text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                <span className="material-symbols-outlined text-green-500 text-lg">workspace_premium</span>
                                <span className="leading-snug">{student.successIndicators}</span>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}

                {(!planData.adaptations || planData.adaptations.length === 0) && (
                  <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl opacity-70">
                     <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">group_off</span>
                     <p className="text-sm text-slate-500 font-bold">Nenhuma adaptação solicitada.</p>
                  </div>
                )}
              </div>

            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
