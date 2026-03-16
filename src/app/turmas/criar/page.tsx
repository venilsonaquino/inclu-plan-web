"use client";

import { useState, useEffect } from "react";
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

interface Neurodivergency {
  id: string;
  name: string;
  position?: number;
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
  const [grades, setGrades] = useState<{ value: string, label: string }[]>([]);
  const [neurodivergencies, setNeurodivergencies] = useState<Neurodivergency[]>([]);

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
        fetch("/api/proxy/neurodivergencies")
      ]);
      if (gradesRes.ok) {
        const gradesData: Grade[] = await gradesRes.json();
        setGrades(gradesData.map(g => ({ value: g.id, label: g.name })));
      }
      if (profilesRes.ok) {
        const data: Neurodivergency[] = await profilesRes.json();
        // Ordenar pelo campo position vindo da API
        const sortedData = [...data].sort((a, b) => (a.position || 0) - (b.position || 0));
        setNeurodivergencies(sortedData);
      }
    } catch (e) {
      console.error("Failed to load master data", e);
    }
  };

  const fetchTurmas = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch("/api/proxy/school-classes");
      const data = await res.json();

      const turmasData = Array.isArray(data) ? data : [];
      setTurmas(turmasData);

      if (turmasData.length > 0) {
        if (!selectedTurma) {
          setSelectedTurma(turmasData[0].name || turmasData[0].nome || "");
        }
        setOnboardingStep(2); 
      } else {
        setOnboardingStep(1); 
        setIsCreatingTurma(true); 
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchTurmaDetails = async (turmaId: string) => {
    try {
      const res = await fetch(`/api/proxy/school-classes/${turmaId}`);
      if (!res.ok) return;

      const data = await res.json();
      setSelectedTurma(data.name || data.nome || "");

      if (Array.isArray(data.students)) {
        setAddedStudents(data.students.map((s: any) => ({
          name: s.name,
          level: s.grade?.name || "Nível não definido",
          conditions: Array.isArray(s.neurodivergencies)
            ? s.neurodivergencies.map((n: any) => n.name)
            : []
        })));
      } else {
        setAddedStudents([]);
      }
    } catch (error) {
      console.error("Failed to fetch turma details", error);
    }
  };

  useEffect(() => {
    if (turmas.length > 0 && selectedTurma) {
      const current = turmas.find(t => (t.name || t.nome) === selectedTurma);
      if (current) fetchTurmaDetails(current.id);
    }
  }, [turmas, selectedTurma === ""]); 

  const handleCreateTurma = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTurmaName.trim()) return;

    try {
      const res = await fetch("/api/proxy/school-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTurmaName, teacherId: TEMP_TEACHER_ID })
      });

      if (!res.ok) throw new Error("Failed response from proxy/school-classes");

      const novaTurma = await res.json();
      setTurmas([...turmas, novaTurma]);
      setSelectedTurma(novaTurma.name || novaTurma.nome);
      setNewTurmaName("");
      setIsCreatingTurma(false);
      setIsDropdownOpen(false);

      if (onboardingStep === 1) {
        setOnboardingStep(2);
      }
      setAddedStudents([]);
    } catch (error) {
      console.error("Failed to create turma via API route.", error);
      const mockTurma = {
        id: Date.now().toString(),
        nome: newTurmaName,
        name: newTurmaName,
        alunos: []
      };
      setTurmas([...turmas, mockTurma]);
      setSelectedTurma(mockTurma.nome);
      setNewTurmaName("");
      setIsCreatingTurma(false);
      setIsDropdownOpen(false);
      if (onboardingStep === 1) setOnboardingStep(2);
    }
  };

  const [addedStudents, setAddedStudents] = useState<{ name: string, level: string, conditions: string[] }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [observations, setObservations] = useState("");
  const [showExtraConditions, setShowExtraConditions] = useState(false);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentLevel) return;

    const currentTurmaObj = turmas.find(t => (t.name || t.nome) === selectedTurma);

    const payload = {
      name: studentName,
      gradeId: studentLevel,
      schoolClassId: currentTurmaObj?.id || "",
      neurodivergencies: selectedConditions,
      notes: observations
    };

    try {
      const res = await fetch("/api/proxy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Falha ao salvar aluno");
    } catch (err) {
      console.error(err);
    }

    const gradeLabel = grades.find(g => g.value === studentLevel)?.label || studentLevel;

    const newStudent = {
      name: studentName,
      level: gradeLabel,
      conditions: selectedConditions.map(id => neurodivergencies.find((p: Neurodivergency) => p.id === id)?.name || id)
    };

    setAddedStudents([newStudent, ...addedStudents]);
    setShowSuccess(true);
    setStudentName("");
    setStudentLevel("");
    setSelectedConditions([]);
    setObservations("");
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
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Carregando turmas...</p>
          </div>
        )}

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
              {turmas.length > 0 && (
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

        {!isLoading && onboardingStep >= 2 && (
          <>
            <div className="relative">
              <button
                onClick={toggleDropdown}
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

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-3 z-30 animate-in fade-in zoom-in duration-200 origin-top overflow-hidden">
                    <div className="space-y-1 mb-3 max-h-60 overflow-y-auto no-scrollbar">
                      {turmas.map((turma) => (
                        <button
                          key={turma.id}
                          onClick={() => {
                            fetchTurmaDetails(turma.id);
                            setIsDropdownOpen(false);
                            setIsCreatingTurma(false);
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedTurma === (turma.name || turma.nome)
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

            {addedStudents.length > 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
                    Alunos na Turma ({addedStudents.length})
                  </h4>
                  <button 
                    onClick={() => window.location.href = '/planos/criar'}
                    className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-full transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    Gerar Plano
                  </button>
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

            {onboardingStep !== 3 && (
              <div className="glass-card rounded-xl p-8 shadow-xl relative overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-3xl" />
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Adicionar Aluno</h3>
                    <p className="text-slate-500">Preencha os dados do estudante para personalizar o plano de ensino.</p>
                  </div>
                  {onboardingStep === 2 && (
                    <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2 animate-pulse">
                      <span className="material-symbols-outlined text-primary text-sm">group</span>
                      <span className="text-xs font-bold text-primary uppercase tracking-tighter">Passo 2 de 2</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddStudent} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
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
                      <label className="text-sm font-semibold text-slate-700 ml-1">Ano de Aprendizagem</label>
                      <Select
                        icon="school"
                        placeholder="Selecione a série..."
                        value={studentLevel}
                        onChange={setStudentLevel}
                        options={grades}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <label className="text-sm font-semibold text-slate-700 ml-1 block">Condição ou Neurodivergência</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: "TEA", label: "TEA", icon: "extension" },
                        { key: "TDAH", label: "TDAH", icon: "bolt" },
                        { key: "TOD", label: "TOD", icon: "warning" },
                        { key: "Deficiência Intelectual", label: "Deficiência Intelectual", icon: "psychology" },
                      ].map((mainItem) => {
                        const apiMatch = neurodivergencies.find((n: Neurodivergency) => n.name.toUpperCase().trim() === mainItem.label.toUpperCase());
                        const idToToggle = apiMatch?.id || mainItem.key;
                        const isSelected = selectedConditions.includes(idToToggle);
                        return (
                          <label key={mainItem.key} className="cursor-pointer group">
                            <input className="hidden peer" type="checkbox" checked={isSelected} onChange={() => toggleCondition(idToToggle)} />
                            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[120px] shadow-sm">
                              <span className={`material-symbols-outlined text-3xl mb-3 transition-colors ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'}`}>{mainItem.icon}</span>
                              <span className={`text-[10px] font-black leading-tight uppercase tracking-tight transition-colors ${isSelected ? 'text-primary' : 'text-slate-500'}`}>{mainItem.label}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowExtraConditions(!showExtraConditions)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white/50 text-slate-500 text-[11px] font-bold hover:bg-white hover:text-primary hover:border-primary/30 transition-all shadow-sm ${showExtraConditions ? 'text-primary border-primary/20 bg-primary/5' : ''}`}
                      >
                        <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${showExtraConditions ? 'rotate-45' : ''}`}>add</span>
                        <span>{showExtraConditions ? 'Ocultar' : 'Outros'}</span>
                      </button>
                    </div>

                    {showExtraConditions && (
                      <div className="p-5 bg-slate-50/80 rounded-[2rem] border border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {[
                            { key: "Dislexia", label: "Dislexia", icon: "menu_book" },
                            { key: "Disgrafia", label: "Disgrafia", icon: "edit_note" },
                            { key: "Discalculia", label: "Discalculia", icon: "calculate" },
                            { key: "DLD / TEL", label: "DLD / TEL", icon: "campaign" },
                            { key: "Dispraxia / TDC", label: "Dispraxia / TDC", icon: "directions_run" },
                          ].map((subItem) => {
                            const apiMatch = neurodivergencies.find((n: Neurodivergency) => n.name.toUpperCase().trim() === subItem.label.toUpperCase());
                            const idToToggle = apiMatch?.id || subItem.key;
                            const isSelected = selectedConditions.includes(idToToggle);
                            return (
                              <label key={subItem.key} className="cursor-pointer group">
                                <input className="hidden peer" type="checkbox" checked={isSelected} onChange={() => toggleCondition(idToToggle)} />
                                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[100px] shadow-sm">
                                  <span className={`material-symbols-outlined text-2xl mb-2 transition-colors ${isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'}`}>{subItem.icon}</span>
                                  <span className={`text-[9px] font-bold leading-tight uppercase tracking-tight transition-colors ${isSelected ? 'text-primary' : 'text-slate-500'}`}>{subItem.label}</span>
                                </div>
                              </label>
                            );
                          })}
                          {neurodivergencies.filter((n: Neurodivergency) => {
                            const coreNames = ["TEA", "TDAH", "TOD", "DEFICIÊNCIA INTELECTUAL", "DISLEXIA", "DISGRAFIA", "DISCALCULIA", "DLD / TEL", "DISPRAXIA / TDC"];
                            return !coreNames.includes(n.name.toUpperCase().trim());
                          }).map((extraItem) => (
                            <label key={extraItem.id} className="cursor-pointer group">
                              <input className="hidden peer" type="checkbox" checked={selectedConditions.includes(extraItem.id)} onChange={() => toggleCondition(extraItem.id)} />
                              <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center min-h-[100px] shadow-sm">
                                <span className={`material-symbols-outlined text-2xl mb-2 transition-colors ${selectedConditions.includes(extraItem.id) ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'}`}>psychology</span>
                                <span className={`text-[9px] font-bold leading-tight uppercase tracking-tight transition-colors ${selectedConditions.includes(extraItem.id) ? 'text-primary' : 'text-slate-500'}`}>{extraItem.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Observações Adicionais (Opcional)</label>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 resize-none"
                      placeholder="Informações relevantes sobre o comportamento ou necessidades específicas..."
                      rows={3}
                    />
                  </div>

                  <div className="pt-6">
                    <button className="btn-primary-gradient w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
                      <span className="material-symbols-outlined">person_add</span>
                      Adicionar Aluno
                    </button>
                  </div>
                </form>
              </div>
            )}

            {addedStudents.length > 0 && (
              <div className="glass-card rounded-2xl p-6 shadow-lg border-2 border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500 mt-6 bg-gradient-to-br from-white to-primary/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined font-bold">celebration</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Turma pronta para o plano!</h4>
                    <p className="text-xs text-slate-500">Você já pode gerar o plano de aula para estes alunos.</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="px-8 py-4 shadow-xl shadow-primary/20 gap-2 group whitespace-nowrap"
                  onClick={() => window.location.href = '/planos/criar'}
                >
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
                  Gerar Plano de Aula
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
