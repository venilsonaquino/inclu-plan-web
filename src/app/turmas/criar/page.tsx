"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Select from "@/components/ui/Select";

export default function CriacaoTurmaPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState("3º Ano A — Manhã");
  const [turmas, setTurmas] = useState([
    "3º Ano A — Manhã",
    "4º Ano B — Tarde",
    "5º Ano C — Integral"
  ]);

  // State for students and feedback
  const [addedStudents, setAddedStudents] = useState<{name: string, level: string, conditions: string[]}[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [observations, setObservations] = useState("");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) return;

    const newStudent = {
      name: studentName,
      level: studentLevel,
      conditions: selectedConditions
    };

    setAddedStudents([newStudent, ...addedStudents]);
    setShowSuccess(true);
    
    // Reset form
    setStudentName("");
    setStudentLevel("");
    setSelectedConditions([]);
    setObservations("");

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  return (
    <div className="bg-background-light min-h-screen text-slate-900 font-display">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Class Selector Dropdown — 0% esforço cognitivo */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full glass-card rounded-2xl p-4 shadow-sm flex items-center gap-4 border-l-4 border-l-green-400 hover:bg-white/50 transition-all text-left group"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined font-bold">check_circle</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Lecionando para
              </p>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {selectedTurma}
              </h2>
            </div>
            <div className={`text-slate-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`}>
              <span className="material-symbols-outlined text-3xl">expand_more</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-3 z-30 animate-in fade-in zoom-in duration-200 origin-top">
                <div className="space-y-1 mb-3">
                  {turmas.map((turma) => (
                    <button
                      key={turma}
                      onClick={() => {
                        setSelectedTurma(turma);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        selectedTurma === turma 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="font-bold">{turma}</span>
                      {selectedTurma === turma && (
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="border-t border-slate-100 pt-3">
                  <Link href="/turmas/nova">
                    <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-primary font-black hover:bg-primary/5 transition-all text-sm uppercase tracking-widest">
                      <span className="material-symbols-outlined">add_circle</span>
                      Criar Nova Turma
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Success Feedback Toast */}
        {showSuccess && (
          <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="material-symbols-outlined font-bold">check_circle</span>
              <div>
                <p className="font-bold">Aluno Adicionado!</p>
                <p className="text-xs opacity-90 text-green-50">O perfil foi criado com sucesso.</p>
              </div>
            </div>
          </div>
        )}

        {/* Added Students List — Visual Progress */}
        {addedStudents.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Alunos na Turma ({addedStudents.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {addedStudents.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 p-2 pr-4 rounded-full shadow-sm animate-in zoom-in duration-300">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{s.conditions.join(', ') || 'Sem condições'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="glass-card rounded-xl p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background flair */}
          <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Adicionar Aluno
              </h3>
              <p className="text-slate-500">
                Preencha os dados do estudante para personalizar o plano de ensino.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">group</span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Passo 2 de 2</span>
            </div>
          </div>

          <form onSubmit={handleAddStudent} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    person
                  </span>
                  <input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800"
                    placeholder="Ex: Maria Oliveira Santos"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Ano de Aprendizagem
                </label>
                <Select
                  icon="school"
                  placeholder="Selecione o nível"
                  value={studentLevel}
                  onChange={setStudentLevel}
                  options={[
                    { value: "1º Ano Fundamental", label: "1º Ano Fundamental" },
                    { value: "2º Ano Fundamental", label: "2º Ano Fundamental" },
                    { value: "3º Ano Fundamental", label: "3º Ano Fundamental" }
                  ]}
                />
              </div>
            </div>

            {/* Neurodivergence Section */}
            <div className="pt-4">
              <label className="text-sm font-semibold text-slate-700 ml-1 mb-4 block">
                Condição ou Neurodivergência
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { icon: "extension", label: "TEA" },
                  { icon: "bolt", label: "TDAH" },
                  { icon: "warning", label: "TOD" },
                  { icon: "psychology", label: "Deficiência Intelectual" },
                  { icon: "add_circle", label: "Outros" },
                ].map((item) => (
                  <label key={item.label} className="cursor-pointer group">
                    <input 
                      className="hidden peer" 
                      type="checkbox" 
                      checked={selectedConditions.includes(item.label)}
                      onChange={() => toggleCondition(item.label)}
                    />
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[100px]">
                      <span className="material-symbols-outlined text-3xl mb-2 text-slate-400 peer-checked:text-primary">
                        {item.icon}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 peer-checked:text-primary leading-tight uppercase tracking-tighter">
                        {item.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Observações Adicionais (Opcional)
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 resize-none"
                placeholder="Informações relevantes sobre o comportamento ou necessidades específicas..."
                rows={3}
              />
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button
                className="btn-primary-gradient w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                type="submit"
              >
                <span className="material-symbols-outlined">person_add</span>
                Adicionar Aluno
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                Ao adicionar, o aluno será vinculado à turma <span className="text-primary font-bold">{selectedTurma}</span>.
              </p>
            </div>
          </form>
        </div>

        {/* Progress Footer */}
        <div className="flex items-center justify-between px-2 pt-4 border-t border-slate-200">
          <Link href="/turmas/nova" className="text-slate-500 font-medium flex items-center gap-1 hover:text-slate-700">
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Voltar
          </Link>
          <div className="flex gap-2">
            <div className="h-1.5 w-6 rounded-full bg-primary/20" />
            <div className="h-1.5 w-12 rounded-full bg-primary" />
            <div className="h-1.5 w-6 rounded-full bg-slate-200" />
          </div>
          <Link href="/planos/criar" className="text-primary font-bold hover:underline">
            Pular
          </Link>
        </div>
      </main>
    </div>
  );
}
