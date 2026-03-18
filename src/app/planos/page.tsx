"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Select from "@/components/ui/Select";
import Loading from "@/components/ui/Loading";
import subjects from "@/data/subjects.json";

export default function BibliotecaPlanosPage() {
  const [selectedMateria, setSelectedMateria] = useState("Todas");
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/proxy/lessons");
        if (res.ok) {
          const data = await res.json();
          setPlans(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (isLoading) {
    return <Loading text="Carregando biblioteca..." />;
  }

  const filteredPlans = plans.filter(plan => 
    selectedMateria === "Todas" || 
    plan.discipline?.toLowerCase() === selectedMateria.toLowerCase()
  );

  return (
    <div className="bg-background-light font-display text-accent-purple min-h-screen relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="blob -top-20 -left-20" />
      <div
        className="blob top-1/2 -right-40"
        style={{
          background:
            "radial-gradient(circle, rgba(136, 99, 125, 0.1) 0%, rgba(248, 249, 254, 0) 70%)",
        }}
      />

      <div className="relative z-10">
        <Navbar />

        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
          <div className="flex flex-col max-w-[1200px] flex-1">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Biblioteca de Planos
                </h2>
                <p className="text-primary/70 text-sm">
                  Gerencie e crie materiais educacionais inclusivos
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  variant="inline"
                  inlineLabel="Matéria"
                  value={selectedMateria}
                  onChange={setSelectedMateria}
                  options={[
                    { value: "Todas", label: "Todas" },
                    { value: "Matemática", label: "Matemática" },
                    { value: "Português", label: "Português" },
                    { value: "Ciências", label: "Ciências" },
                    { value: "História", label: "História" },
                  ]}
                />
                <Link
                  href="/turmas/criar"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Novo Plano</span>
                </Link>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredPlans.map((plan) => {
                const subjectDetails = subjects.find(
                  (s) => s.label.toLowerCase() === plan.discipline?.toLowerCase()
                ) || {
                  icon: "menu_book",
                  color: "bg-primary/10",
                  textColor: "text-primary",
                };

                const adaptedCount = plan.adaptedStudentsCount ?? 0;

                return (
                  <Link
                    key={plan.id}
                    href={`/planos/${plan.id}`}
                    className="glass-card group p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col gap-4"
                  >
                    <div
                      className={`size-16 rounded-2xl ${subjectDetails.color} flex items-center justify-center ${subjectDetails.textColor} mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-4xl">
                        {subjectDetails.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                        {plan.lessonTitle || plan.title}
                      </h3>
                      <p className="text-primary/60 text-sm font-medium">
                        {plan.discipline}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {adaptedCount} {adaptedCount === 1 ? "Aluno Adaptado" : "Alunos Adaptados"}
                      </span>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </Link>
                );
              })}

              {/* Add New */}
              <Link
                href="/turmas/criar"
                className="border-2 border-dashed border-primary/20 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div className="size-14 rounded-full bg-white glass-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-3xl">
                    add_circle
                  </span>
                </div>
                <p className="font-bold text-slate-400">
                  Adicionar Nova Aula
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
