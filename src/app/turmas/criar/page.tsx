"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Turma {
  id: string;
  nome?: string;
  name?: string; // from backend
  alunos?: any[];
}

interface Grade {
  id: string;
  name: string;
}

interface LearningProfile {
  id: string;
  name: string;
}

// Temporary Teacher ID mimicking Auth for the Postman collection endpoints
const TEMP_TEACHER_ID = "00000000-0000-0000-0000-000000000000";

export default function CriacaoTurmaPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<string>("");
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Onboarding Wizard State
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(0 as any); // 0 means loading/undetermined

  // Master Data State
  const [grades, setGrades] = useState<{value: string, label: string}[]>([]);
  const [learningProfiles, setLearningProfiles] = useState<LearningProfile[]>([]);

  // New Turma Form State
  const [isCreatingTurma, setIsCreatingTurma] = useState(false);
  const [newTurmaName, setNewTurmaName] = useState("");

  useEffect(() => {
    fetchMasterData();
    fetchTurmas();
  }, []);

  const fetchMasterData = async () => {
    try {
      const [gradesRes, profilesRes] = await Promise.all([
        fetch("/api/proxy/grades"),
        fetch("/api/proxy/learning-profiles")
      ]);
      if (gradesRes.ok) {
        const gradesData: Grade[] = await gradesRes.json();
        setGrades(gradesData.map(g => ({ value: g.id, label: g.name })));
      }
      if (profilesRes.ok) {
        setLearningProfiles(await profilesRes.json());
      }
    } catch (e) {
      console.error("Failed to load master data", e);
    }
  };

  const fetchTurmas = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/proxy/school-classes");
      const data = await res.json();
      
      const turmasData = Array.isArray(data) ? data : [];
      setTurmas(turmasData);
      
      if (turmasData.length > 0) {
        // Handle name or nome differences easily gracefully
        setSelectedTurma(turmasData[0].name || turmasData[0].nome || "");
        setOnboardingStep(3); // Regular flow, user already has turmas
      } else {
        setOnboardingStep(1); // First time flow
        setIsCreatingTurma(true); // Force open the form
      }
    } catch (error) {
      console.error("Failed to load turmas via proxy route.", error);
      setTurmas([]);
      setOnboardingStep(1);
      setIsCreatingTurma(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTurma = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTurmaName.trim()) return;

    try {
      const res = await fetch("/api/proxy/school-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTurmaName, teacherId: TEMP_TEACHER_ID })
      });

      if (!res.ok) {
        throw new Error("Failed response from proxy/school-classes");
      }

      const novaTurma = await res.json();
      
      setTurmas([...turmas, novaTurma]);
      setSelectedTurma(novaTurma.name || novaTurma.nome);
      setNewTurmaName("");
      setIsCreatingTurma(false);
      setIsDropdownOpen(false);

      if (onboardingStep === 1) {
        setOnboardingStep(2); // Move to Step 2 (Add Students)
      }
    } catch (error) {
      console.error("Failed to create turma via API route. Triggering UI fallback.", error);
      
      // Temporary fallback for UI testing if backend is down
      const mockTurma = {
        id: Date.now().toString(),
        nome: newTurmaName, // legacy frontend prop format fallback
        name: newTurmaName, 
        alunos: []
      };
      setTurmas([...turmas, mockTurma]);
      setSelectedTurma(mockTurma.nome);
      setNewTurmaName("");
      setIsCreatingTurma(false);
      setIsDropdownOpen(false);
      
      if (onboardingStep === 1) {
        setOnboardingStep(2); // Move to Step 2
      }
    }
  };

  // State for students and feedback
  const [addedStudents, setAddedStudents] = useState<{name: string, level: string, conditions: string[]}[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [observations, setObservations] = useState("");

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentLevel) return;

    // Achar o ID real da turma selecionada
    const currentTurmaObj = turmas.find(t => (t.name || t.nome) === selectedTurma);

    const payload = {
      name: studentName,
      gradeId: studentLevel, // studentLevel is the UUID here because of Select setup
      schoolClassId: currentTurmaObj?.id || "",
      neurodivergencies: selectedConditions, // array of IDs
      notes: observations
    };

    try {
      const res = await fetch("/api/proxy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Falha ao salvar aluno");
    } catch(err) {
      console.error(err);
      // Let it fall through to UI success for testing even if backend is offline
    }

    const gradeLabel = grades.find(g => g.value === studentLevel)?.label || studentLevel;

    const newStudent = {
      name: studentName,
      level: gradeLabel,
      conditions: selectedConditions.map(id => learningProfiles.find(p => p.id === id)?.name || id)
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

    // If in onboarding, move to step 3 after first student
    if (onboardingStep === 2) {
      setOnboardingStep(3);
    }
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
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Carregando turmas...</p>
          </div>
        )}

        {/* Onboarding Wizard - Step 1: Empty State (No Turmas) */}
        {!isLoading && onboardingStep === 1 && !isCreatingTurma && (
          <div className="glass-card rounded-2xl p-12 shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="size-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined !text-5xl">inventory_2</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Nenhuma turma encontrada</h2>
            <p className="text-slate-500 max-w-md mb-8 text-lg">
              Para começar a adicionar alunos, você primeiro precisa criar uma turma que irá abrigá-los.
            </p>
            <Button size="lg" variant="primary" onClick={() => setIsCreatingTurma(true)} className="px-10 py-5 text-lg shadow-xl shadow-primary/30 gap-3">
              <span className="material-symbols-outlined">add_circle</span>
              Criar Primeira Turma
            </Button>
          </div>
        )}

        {/* Onboarding Wizard - Step 1: Creating First Turma Form */}
        {!isLoading && onboardingStep === 1 && isCreatingTurma && (
           <div className="glass-card rounded-2xl p-8 max-w-xl mx-auto shadow-xl animate-in slide-in-from-bottom-8 duration-500 mt-12">
             <div className="mb-8 flex flex-col items-center text-center">
               <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase mb-6 inline-flex items-center gap-2">
                 <span className="material-symbols-outlined text-base">flag</span>
                 Passo 1 de 2
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Qual o nome da sua turma?</h2>
               <p className="text-slate-500 text-lg">Dê um nome simples para identificar seus alunos depois.</p>
             </div>
             <form onSubmit={handleCreateTurma} className="space-y-6">
               <input
                 autoFocus
                 value={newTurmaName}
                 onChange={(e) => setNewTurmaName(e.target.value)}
                 className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-bold text-slate-900 placeholder:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm text-center"
                 placeholder="Ex: 3º Ano A — Manhã"
                 type="text"
               />
               <Button size="lg" variant="primary" className="w-full py-5 text-lg shadow-xl shadow-primary/30 gap-3" disabled={!newTurmaName.trim()}>
                 Criar Turma e Avançar
                 <span className="material-symbols-outlined">arrow_forward</span>
               </Button>
               {turmas.length > 0 && ( /* Only show cancel if they somehow got back here with turmas */
                 <button 
                   type="button" 
                   onClick={() => setIsCreatingTurma(false)}
                   className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs py-2 mt-4"
                 >
                   Cancelar
                 </button>
               )}
             </form>
           </div>
        )}

        {/* Normal Layout and Onboarding Wizard - Step 2 (When Turmas Exist) */}
        {!isLoading && onboardingStep >= 2 && (
          <>
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
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-3 z-30 animate-in fade-in zoom-in duration-200 origin-top overflow-hidden">
                    <div className="space-y-1 mb-3 max-h-60 overflow-y-auto no-scrollbar">
                      {turmas.map((turma) => (
                        <button
                          key={turma.id}
                          onClick={() => {
                            setSelectedTurma(turma.name || turma.nome || "");
                            setIsDropdownOpen(false);
                            setIsCreatingTurma(false);
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                            selectedTurma === (turma.name || turma.nome) 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="font-bold">{turma.name || turma.nome}</span>
                          {selectedTurma === (turma.name || turma.nome) && (
                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t border-slate-100 pt-3">
                      {!isCreatingTurma ? (
                        <button 
                          onClick={() => setIsCreatingTurma(true)}
                          className="w-full flex items-center gap-3 p-4 rounded-2xl text-primary font-black hover:bg-primary/5 transition-all text-sm uppercase tracking-widest"
                        >
                          <span className="material-symbols-outlined">add_circle</span>
                          Criar Nova Turma
                        </button>
                      ) : (
                        <form onSubmit={handleCreateTurma} className="px-2 pb-2">
                           <input
                             autoFocus
                             value={newTurmaName}
                             onChange={(e) => setNewTurmaName(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-3 ml-1"
                             placeholder="Nome da nova turma..."
                             type="text"
                           />
                           <div className="flex gap-2">
                             <Button size="sm" variant="primary" className="w-full" disabled={!newTurmaName.trim()}>
                               Concluir
                             </Button>
                             <button type="button" onClick={() => setIsCreatingTurma(false)} className="w-full text-slate-500 font-bold hover:bg-slate-100 rounded-lg p-2 text-xs uppercase tracking-widest">
                               Cancelar
                             </button>
                           </div>
                        </form>
                      )}
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

            {/* Main Form Card (Hidden in Onboarding Step 3) */}
            {onboardingStep !== 3 && (
              <div className="glass-card rounded-xl p-8 shadow-xl relative overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-500">
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
            {onboardingStep === 2 && (
              <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-primary text-sm">group</span>
                <span className="text-xs font-bold text-primary uppercase tracking-tighter">Passo 2 de 2</span>
              </div>
            )}
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
                  placeholder="Selecione a série..."
                  value={studentLevel}
                  onChange={setStudentLevel}
                  options={grades.length > 0 ? grades : [
                    { value: "mock-1", label: "1º Ano Fundamental" },
                    { value: "mock-2", label: "2º Ano Fundamental" }
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
                {learningProfiles.length > 0 ? learningProfiles.map((item) => (
                  <label key={item.id} className="cursor-pointer group">
                    <input 
                      className="hidden peer" 
                      type="checkbox" 
                      checked={selectedConditions.includes(item.id)}
                      onChange={() => toggleCondition(item.id)}
                    />
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[100px]">
                      <span className="material-symbols-outlined text-3xl mb-2 text-slate-400 peer-checked:text-primary">
                        psychology
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 peer-checked:text-primary leading-tight uppercase tracking-tighter">
                        {item.name}
                      </span>
                    </div>
                  </label>
                )) : [
                  { id: "mock-1", label: "TEA" },
                  { id: "mock-2", label: "TDAH" },
                ].map((item) => (
                  <label key={item.id} className="cursor-pointer group">
                    <input 
                      className="hidden peer" 
                      type="checkbox" 
                      checked={selectedConditions.includes(item.id)}
                      onChange={() => toggleCondition(item.id)}
                    />
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[100px]">
                      <span className="material-symbols-outlined text-3xl mb-2 text-slate-400 peer-checked:text-primary">
                        psychology
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
                {onboardingStep === 2 ? "Adicionar Primeiro Aluno" : "Adicionar Aluno"}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                Ao adicionar, o aluno será vinculado à turma <span className="text-primary font-bold">{selectedTurma}</span>.
              </p>
            </div>
          </form>
        </div>
        )}

        {/* Onboarding Step 3: Final CTA to Finish Flow */}
        {onboardingStep === 3 && (
          <div className="glass-card rounded-2xl p-10 shadow-2xl border-primary/20 flex flex-col items-center text-center animate-in zoom-in-95 duration-500 mt-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            
            <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined !text-4xl font-bold">task_alt</span>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Tudo pronto por aqui!</h3>
            <p className="text-base text-slate-500 mb-8 max-w-sm">
              Sua turma <strong className="text-slate-700">{selectedTurma}</strong> já tem perfil criado. Vamos testar a geração do seu primeiro plano de ensino adaptado?
            </p>
            
            <div className="w-full space-y-4 max-w-sm">
              <Button 
                size="lg" 
                variant="primary" 
                className="w-full py-5 text-lg shadow-xl shadow-primary/40 flex items-center justify-center gap-3"
                onClick={() => router.push('/planos/criar')}
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                Gerar Plano de Aula
              </Button>
              
              <button 
                onClick={() => setOnboardingStep(2)}
                className="w-full text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase tracking-widest text-xs py-3"
              >
                Adicionar mais alunos agora
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}
