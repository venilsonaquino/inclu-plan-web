"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const subjects = [
  { icon: "menu_book", label: "Português" },
  { icon: "calculate", label: "Matemática" },
  { icon: "science", label: "Ciências" },
  { icon: "history_edu", label: "História" },
  { icon: "public", label: "Geografia" },
  { icon: "palette", label: "Arte" },
  { icon: "fitness_center", label: "Ed. Física" },
  { icon: "translate", label: "Inglês" },
  { icon: "church", label: "Religião" },
];

// Initial mock data, moved inside component to allow state updates
const initialStudents = [
  { id: "1", initials: "LA", name: "Lucas A.", color: "bg-blue-100 text-blue-500", selected: false },
  { id: "2", initials: "MS", name: "Maria S.", color: "bg-purple-100 text-purple-500", selected: false },
  { id: "3", initials: "JP", name: "João P.", color: "bg-emerald-100 text-emerald-500", selected: false },
  { id: "4", initials: "PA", name: "Pedro A.", color: "bg-orange-100 text-orange-500", selected: false },
  { id: "5", initials: "CC", name: "Clara C.", color: "bg-pink-100 text-pink-500", selected: false },
];

const lessonPlans = [
  {
    title: "Interpretação de Textos",
    description: "Plano focado em gêneros textuais e compreensão de crônicas contemporâneas.",
    subject: "Português",
    icon: "menu_book",
    iconBg: "bg-primary/10 text-primary",
    borderColor: "border-l-primary",
    level: "Ensino Fundamental II",
    time: "Há 2 dias",
  },
  {
    title: "Geometria Espacial",
    description: "Introdução aos volumes de prismas e pirâmides com atividades lúdicas.",
    subject: "Matemática",
    icon: "explore",
    iconBg: "bg-orange-100 text-orange-500",
    borderColor: "border-l-orange-400",
    level: "Ensino Médio",
    time: "Há 1 semana",
  },
  {
    title: "Fotossíntese",
    description: "Processos biológicos da luz e clorofila com experiência prática de laboratório.",
    subject: "Ciências",
    icon: "science",
    iconBg: "bg-emerald-100 text-emerald-500",
    borderColor: "border-l-emerald-400",
    level: "Ensino Fundamental I",
    time: "Ontem",
  },
];

export default function GeradorPlanosPage() {
  const [activeSubject, setActiveSubject] = useState("Português");
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const router = useRouter();

  // Generator Form State
  const [theme, setTheme] = useState("");
  const [observations, setObservations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentLevel, setNewStudentLevel] = useState("");

  const handleToggleStudent = (id: string) => {
    setStudentsList((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, selected: !student.selected } : student
      )
    );
  };

  const handleSaveNewStudent = () => {
    if (!newStudentName) return;

    const initials = newStudentName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newStudent = {
      id: Date.now().toString(),
      initials,
      name: newStudentName,
      color: "bg-indigo-100 text-indigo-500", // Default color for new students
      selected: true, // Auto-select for the current plan
    };

    setStudentsList((prev) => [...prev, newStudent]);
    setIsCreatingNew(false);
    setNewStudentName("");
    setNewStudentLevel("");
  };

  const filteredStudents = studentsList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStudents = studentsList.filter((s) => s.selected);

  const handleGeneratePlan = async () => {
    if (!theme || selectedStudents.length === 0) {
      alert("Por favor, selecione os alunos e defina um tema para a aula.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        teacherId: "00000000-0000-0000-0000-000000000000",
        lessons: [
          {
            discipline: {
              name: activeSubject,
              theme: theme,
              observations: observations
            },
            students: selectedStudents.map(s => s.id) // passing selected student IDs
          }
        ],
        imagePart: ""
      };

      const res = await fetch("/api/proxy/ai/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao gerar plano");
      
      const generatedPlan = await res.json();
      console.log("Plan Generated", generatedPlan);
      
      alert("Plano gerado com sucesso! (Navegando para o detalhe simulado...)");
      router.push("/planos/cores-e-sentimentos"); // Fake navigation to the pre-built details view for now
      
    } catch(err) {
      console.error(err);
      alert("Houve um erro de conexão com o AI Backend. Simulação prosseguindo.");
      router.push("/planos/cores-e-sentimentos");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-slate-900">
      <Navbar />

      <main className="flex-1 px-6 lg:px-20 py-10 max-w-7xl mx-auto w-full space-y-12">
        {/* Create Plan Section */}
        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Criar Novo Plano de Aula
            </h1>
            <p className="text-slate-500 font-medium">
              Preencha os dados abaixo para gerar um plano personalizado com IA.
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 shadow-sm space-y-8">
            {/* Subject Selection */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Selecione a Matéria
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {subjects.map((subject) => {
                  const isActive = activeSubject === subject.label;
                  return (
                    <button
                      key={subject.label}
                      onClick={() => setActiveSubject(subject.label)}
                      className="subject-tab flex flex-col items-center justify-center p-4 rounded-lg border-2 border-transparent transition-all hover:bg-white/80 group"
                      data-active={isActive ? "true" : "false"}
                    >
                      <div
                        className={`size-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-2 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <span className="material-symbols-outlined">
                          {subject.icon}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? "text-primary font-black" : "text-slate-500"
                        }`}
                      >
                        {subject.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Assignment */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Atribuir Alunos
              </p>
              <div className="flex items-center gap-4 overflow-x-auto pt-2 pb-4 no-scrollbar">
                {/* Fixed "Todos" Option */}
                <div className="flex-none flex flex-col items-center gap-2">
                  <label className="relative cursor-pointer group">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={selectedStudents.length === studentsList.length && studentsList.length > 0}
                      onChange={() => {
                        const allSelected = selectedStudents.length === studentsList.length;
                        setStudentsList(prev => prev.map(s => ({ ...s, selected: !allSelected })));
                      }}
                    />
                    <div className="size-14 rounded-full border-2 border-transparent peer-checked:border-primary transition-all p-0.5 overflow-hidden bg-slate-200">
                      <div className="w-full h-full rounded-full bg-cover bg-center flex items-center justify-center font-bold text-lg">
                        👥
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined !text-sm">check</span>
                    </div>
                  </label>
                  <span className="text-xs font-bold text-slate-600">Todos</span>
                </div>

                {/* Selected Students Only */}
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex-none flex flex-col items-center gap-2"
                  >
                    <label className="relative cursor-pointer group">
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={student.selected}
                        onChange={() => handleToggleStudent(student.id)}
                      />
                      <div className="size-14 rounded-full border-2 border-transparent peer-checked:border-primary transition-all p-0.5 overflow-hidden bg-slate-200">
                        <div
                          className={`w-full h-full rounded-full ${student.color} flex items-center justify-center font-bold text-lg`}
                        >
                          {student.initials}
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined !text-sm">
                          check
                        </span>
                      </div>
                    </label>
                    <span className="text-xs font-bold text-slate-600">
                      {student.name}
                    </span>
                  </div>
                ))}

                {/* Add/Manage Button */}
                <button 
                  onClick={() => setIsStudentModalOpen(true)}
                  className="flex-none size-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            {/* Theme & Observations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Tema da Aula
                </label>
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                  placeholder="Ex: O Ciclo da Água, Orações Subordinadas..."
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Observações do Professor
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800 placeholder:text-slate-400 outline-none transition-all resize-none"
                  placeholder="Ex: Focar em acessibilidade para alunos com TDAH..."
                  rows={2}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <button 
                onClick={handleGeneratePlan}
                disabled={isGenerating || !theme || selectedStudents.length === 0}
                className="w-full lg:w-auto px-10 py-5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isGenerating ? (
                   <span className="animate-spin size-6 border-4 border-white/20 border-t-white rounded-full"></span>
                ) : (
                  <span className="material-symbols-outlined">auto_fix_high</span>
                )}
                {isGenerating ? "Gerando com IA..." : "Gerar Plano de Aula"}
              </button>
            </div>
          </div>
        </section>

        {/* My Lesson Plans Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Meus Planos de Aula
            </h2>
            <Link
              href="/planos"
              className="text-primary font-bold hover:underline flex items-center gap-1"
            >
              Ver tudo{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {lessonPlans.map((plan) => (
              <Link
                key={plan.title}
                href="/planos/cores-e-sentimentos"
                className={`glass-card rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group border-l-4 ${plan.borderColor}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${plan.iconBg}`}>
                    <span className="material-symbols-outlined">
                      {plan.icon}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                      title="Visualizar"
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                      title="Baixar PDF"
                    >
                      <span className="material-symbols-outlined">
                        picture_as_pdf
                      </span>
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {plan.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {plan.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{plan.level}</span>
                  <span>{plan.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 
        Inline Student Management Modal 
        Provides "0% cognitive effort" by allowing student addition 
        without breaking the lesson plan flow.
      */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsStudentModalOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {isCreatingNew ? "Cadastrar Novo Aluno" : "Alunos na Turma"}
              </h3>
              <button 
                onClick={() => {
                  if (isCreatingNew) {
                    setIsCreatingNew(false);
                  } else {
                    setIsStudentModalOpen(false);
                  }
                }}
                className="p-2 -mr-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">
                  {isCreatingNew ? "arrow_back" : "close"}
                </span>
              </button>
            </div>

            <div className="p-6">
              {!isCreatingNew ? (
                /* --- LIST & SELECT MODE --- */
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary">
                      search
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 rounded-full border-none shadow-sm focus:ring-2 focus:ring-primary/20 bg-slate-50 text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                      placeholder="Buscar aluno da turma..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                    />
                  </div>

                  {/* Student List */}
                  <div className="max-h-60 overflow-y-auto no-scrollbar space-y-2">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <label 
                          key={student.id} 
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${student.selected ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-slate-50'}`}
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                            checked={student.selected}
                            onChange={() => handleToggleStudent(student.id)}
                          />
                          <div className={`size-10 rounded-full ${student.color} flex items-center justify-center font-bold text-sm shrink-0`}>
                            {student.initials}
                          </div>
                          <span className={`text-sm font-medium ${student.selected ? 'text-primary font-bold' : 'text-slate-700'}`}>
                            {student.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-sm font-bold text-slate-400 py-4">Nenhum aluno encontrado e selecionado.</p>
                    )}
                  </div>

                  {/* Add New Action */}
                  <button 
                    onClick={() => setIsCreatingNew(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 mt-2 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold hover:bg-primary/5 hover:border-primary transition-all"
                  >
                    <span className="material-symbols-outlined">person_add</span>
                    Cadastrar Aluno Inédito
                  </button>
                </div>
              ) : (
                /* --- CREATE MODE --- */
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-semibold text-slate-700 ml-1">
                        Nome do Aluno
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          person
                        </span>
                        <input
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 font-medium"
                          placeholder="Nome compl. do aluno"
                          autoFocus
                          type="text"
                        />
                      </div>
                    </div>
                    
                    <Select
                      icon="school"
                      label="Ano de Aprendizagem"
                      placeholder="Selecione o ano"
                      value={newStudentLevel}
                      onChange={setNewStudentLevel}
                      options={[
                        { value: "1º Ano Fundamental", label: "1º Ano Fundamental" },
                        { value: "2º Ano Fundamental", label: "2º Ano Fundamental" },
                        { value: "3º Ano Fundamental", label: "3º Ano Fundamental" }
                      ]}
                    />

                    {/* Quick Conditions Mock */}
                    <div>
                      <p className="text-sm font-semibold text-slate-700 ml-1 mb-2 mt-2">Condição Principal</p>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {["TDAH", "TEA", "Def. Intelectual", "TOD"].map(cond => (
                          <label key={cond} className="shrink-0 cursor-pointer">
                            <input type="radio" name="condition" className="hidden peer" />
                            <div className="px-4 py-3 rounded-xl border-2 border-slate-100 peer-checked:border-primary peer-checked:bg-primary/10 text-sm font-bold text-slate-500 peer-checked:text-primary transition-all hover:bg-slate-50">
                              {cond}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="primary"
                    className="w-full flex justify-center py-4" 
                    size="lg" 
                    onClick={handleSaveNewStudent}
                    disabled={!newStudentName}
                  >
                    Salvar Aluno na Turma
                  </Button>
                </div>
              )}
            </div>
            
            {!isCreatingNew && (
              <div className="p-6 pt-0">
                <Button variant="primary" className="w-full flex justify-center py-4 text-base" size="lg" onClick={() => setIsStudentModalOpen(false)}>
                  Feito
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

