"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Select from "@/components/ui/Select";

const lessonPlans = [
  {
    title: "Desvendando Palavras",
    subject: "Portuguese",
    icon: "translate",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    adapted: "3 Alunos Adaptados",
  },
  {
    title: "Números Mágicos",
    subject: "Mathematics",
    icon: "calculate",
    iconBg: "bg-[#52D1DC]/10",
    iconColor: "text-[#2BA9B5]",
    adapted: "5 Alunos Adaptados",
  },
  {
    title: "Ecossistemas Vivos",
    subject: "Science",
    icon: "eco",
    iconBg: "bg-[#FFB347]/10",
    iconColor: "text-[#E68A00]",
    adapted: "2 Alunos Adaptados",
  },
  {
    title: "Era dos Impérios",
    subject: "History",
    icon: "history_edu",
    iconBg: "bg-[#7D5BA6]/10",
    iconColor: "text-[#7D5BA6]",
    adapted: "4 Alunos Adaptados",
  },
  {
    title: "Climas do Mundo",
    subject: "Geography",
    icon: "public",
    iconBg: "bg-[#4CAF50]/10",
    iconColor: "text-[#4CAF50]",
    adapted: "1 Aluno Adaptado",
  },
  {
    title: "Cores e Sentimentos",
    subject: "Art Education",
    icon: "palette",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    adapted: "6 Alunos Adaptados",
  },
  {
    title: "Geometria Básica",
    subject: "Mathematics",
    icon: "functions",
    iconBg: "bg-[#52D1DC]/10",
    iconColor: "text-[#2BA9B5]",
    adapted: "3 Alunos Adaptados",
  },
];

export default function BibliotecaPlanosPage() {
  const [selectedMateria, setSelectedMateria] = useState("Todas");

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
              {lessonPlans.map((plan) => (
                <Link
                  key={plan.title}
                  href="/planos/cores-e-sentimentos"
                  className="glass-card group p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex flex-col gap-4"
                >
                  <div
                    className={`size-16 rounded-2xl ${plan.iconBg} flex items-center justify-center ${plan.iconColor} mb-2 group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-4xl">
                      {plan.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                      {plan.title}
                    </h3>
                    <p className="text-primary/60 text-sm font-medium">
                      {plan.subject}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {plan.adapted}
                    </span>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </div>
                </Link>
              ))}

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
