"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const colors = [
  { name: "Primary", value: "#ea3eb9", tw: "bg-primary" },
  { name: "Secondary", value: "#a24af1", tw: "bg-secondary" },
  { name: "Background Light", value: "#f8f6f7", tw: "bg-background-light" },
  { name: "Background Dark", value: "#21111d", tw: "bg-background-dark" },
  { name: "Accent Purple", value: "#2E0F42", tw: "bg-accent-purple" },
];

const slateColors = [
  { name: "slate-50", value: "#f8fafc" },
  { name: "slate-100", value: "#f1f5f9" },
  { name: "slate-200", value: "#e2e8f0" },
  { name: "slate-300", value: "#cbd5e1" },
  { name: "slate-400", value: "#94a3b8" },
  { name: "slate-500", value: "#64748b" },
  { name: "slate-600", value: "#475569" },
  { name: "slate-700", value: "#334155" },
  { name: "slate-800", value: "#1e293b" },
  { name: "slate-900", value: "#0f172a" },
];

const accentColors = [
  { name: "Emerald", value: "#10b981", tw: "bg-emerald-500" },
  { name: "Orange", value: "#f97316", tw: "bg-orange-500" },
  { name: "Blue", value: "#3b82f6", tw: "bg-blue-500" },
  { name: "Purple", value: "#7D5BA6", tw: "bg-[#7D5BA6]" },
  { name: "Teal", value: "#2BA9B5", tw: "bg-[#2BA9B5]" },
  { name: "Green", value: "#4CAF50", tw: "bg-[#4CAF50]" },
  { name: "Amber", value: "#E68A00", tw: "bg-[#E68A00]" },
];

const spacingScale = [0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

const typographySizes = [
  { name: "text-xs", size: "0.75rem", example: "Texto extra pequeno" },
  { name: "text-sm", size: "0.875rem", example: "Texto pequeno" },
  { name: "text-base", size: "1rem", example: "Texto base" },
  { name: "text-lg", size: "1.125rem", example: "Texto grande" },
  { name: "text-xl", size: "1.25rem", example: "Texto extra grande" },
  { name: "text-2xl", size: "1.5rem", example: "Título 2XL" },
  { name: "text-3xl", size: "1.875rem", example: "Título 3XL" },
  { name: "text-4xl", size: "2.25rem", example: "Título 4XL" },
];

const fontWeights = [
  { name: "Light", weight: "300", tw: "font-light" },
  { name: "Regular", weight: "400", tw: "font-normal" },
  { name: "Medium", weight: "500", tw: "font-medium" },
  { name: "Semibold", weight: "600", tw: "font-semibold" },
  { name: "Bold", weight: "700", tw: "font-bold" },
  { name: "Extrabold", weight: "800", tw: "font-extrabold" },
  { name: "Black", weight: "900", tw: "font-black" },
];

const radiusOptions = [
  { name: "rounded-none", value: "0px", tw: "rounded-none" },
  { name: "rounded-sm", value: "0.125rem", tw: "rounded-sm" },
  { name: "rounded-md", value: "0.375rem", tw: "rounded-md" },
  { name: "rounded (default)", value: "1rem", tw: "rounded" },
  { name: "rounded-lg", value: "2rem", tw: "rounded-lg" },
  { name: "rounded-xl", value: "3rem", tw: "rounded-xl" },
  { name: "rounded-full", value: "9999px", tw: "rounded-full" },
];

const iconSizes = [16, 20, 24, 32, 40];

const sampleIcons = [
  "home", "menu_book", "auto_awesome", "calculate", "science",
  "history_edu", "public", "palette", "person", "search",
  "add", "check_circle", "visibility", "edit", "delete",
  "auto_fix_high", "extension", "bolt", "psychology", "groups",
];

export default function DesignSystemPage() {
  const [selectedLevel, setSelectedLevel] = useState("");

  return (
    <div className="bg-background-light min-h-screen font-display text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-12 space-y-20">
        {/* Header */}
        <section>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
            IncluPlan Design System
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            Sistema de design completo baseado em Tailwind CSS, extraído das referências visuais do Google Stitch. Utiliza a fonte Inter e ícones Material Symbols.
          </p>
          <div className="mt-6 flex gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold">
              Tailwind CSS v4
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold">
              Next.js 15
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              Material Symbols
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            DESIGN PRINCIPLES
            ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Princípios de Design
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "accessibility_new",
                title: "Acessibilidade",
                desc: "Interfaces inclusivas e acessíveis para todos os educadores, com contraste adequado e interações claras.",
              },
              {
                icon: "auto_awesome",
                title: "Glassmorphism",
                desc: "Cards translúcidos com blur para criar profundidade e hierarquia visual elegante.",
              },
              {
                icon: "gradient",
                title: "Gradientes Orgânicos",
                desc: "Uso de gradientes suaves de pink para purple, criando uma identidade visual calorosa e moderna.",
              },
            ].map((principle) => (
              <div key={principle.title} className="glass-card p-6 rounded-xl">
                <span className="material-symbols-outlined text-3xl text-primary mb-3 block">
                  {principle.icon}
                </span>
                <h3 className="text-lg font-bold mb-2">{principle.title}</h3>
                <p className="text-sm text-slate-500">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            COLORS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Cores
          </h2>

          {/* Brand Colors */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Cores da Marca</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {colors.map((color) => (
                <div key={color.name} className="flex flex-col gap-2">
                  <div
                    className="h-24 rounded-xl shadow-sm border border-white/30"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-sm font-bold">{color.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{color.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Gradiente Primário</h3>
            <div className="h-20 rounded-xl btn-primary-gradient shadow-lg shadow-primary/20" />
            <p className="text-xs text-slate-500 font-mono mt-2">
              linear-gradient(135deg, #ea3eb9 0%, #a24af1 100%)
            </p>
          </div>

          {/* Slate Scale */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Escala Slate (Neutros)</h3>
            <div className="grid grid-cols-5 lg:grid-cols-10 gap-2">
              {slateColors.map((color) => (
                <div key={color.name} className="flex flex-col gap-1.5">
                  <div
                    className="h-14 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-[10px] font-bold text-slate-600">{color.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{color.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Cores de Destaque (por Matéria)</h3>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
              {accentColors.map((color) => (
                <div key={color.name} className="flex flex-col gap-1.5">
                  <div
                    className="h-14 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs font-bold text-slate-600">{color.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{color.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TYPOGRAPHY
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Tipografia
          </h2>

          <div className="glass-card p-6 rounded-xl mb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Font Family</p>
            <p className="text-4xl font-bold">Inter</p>
            <p className="text-sm text-slate-500 mt-1">Google Fonts — Pesos: 300 a 900</p>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Tamanhos</h3>
            <div className="space-y-4">
              {typographySizes.map((t) => (
                <div key={t.name} className="flex items-baseline gap-4 border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono text-primary w-20 shrink-0">{t.name}</span>
                  <span className="text-xs text-slate-400 w-20 shrink-0">{t.size}</span>
                  <span className={t.name}>{t.example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weights */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Pesos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fontWeights.map((fw) => (
                <div key={fw.name} className="glass-card p-4 rounded-xl">
                  <p className={`text-2xl ${fw.tw} mb-1`}>Aa Bb Cc</p>
                  <p className="text-xs text-slate-500">
                    {fw.name} ({fw.weight})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SPACING
            ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Espaçamento
          </h2>
          <div className="space-y-3">
            {spacingScale.map((sp) => (
              <div key={sp} className="flex items-center gap-4">
                <span className="text-xs font-mono text-primary w-10 text-right">{sp}</span>
                <span className="text-xs text-slate-400 w-16">{sp * 0.25}rem</span>
                <div
                  className="h-4 bg-primary/30 rounded-sm"
                  style={{ width: `${Math.max(sp * 4, 2)}px` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BORDER RADIUS
            ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Border Radius
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {radiusOptions.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div className={`size-20 bg-primary/20 border-2 border-primary/40 ${r.tw}`} />
                <p className="text-xs font-bold text-slate-700">{r.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{r.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BUTTONS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Botões
          </h2>

          {/* Variants */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Variantes</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" icon="auto_fix_high">Primary</Button>
              <Button variant="secondary" icon="add">Secondary</Button>
              <Button variant="outline" icon="print">Outline</Button>
              <Button variant="ghost" icon="arrow_back">Ghost</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Tamanhos</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg" icon="auto_fix_high">Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Estados</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="outline">Outline Default</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
            </div>
          </div>

          {/* Full Width */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Largura Total</h3>
            <Button variant="primary" size="lg" icon="person_add" className="w-full">
              Adicionar Aluno
            </Button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ICONS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Ícones (Material Symbols Outlined)
          </h2>

          {/* Icon Sizes */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Tamanhos</h3>
            <div className="flex flex-wrap items-end gap-8">
              {iconSizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: `${size}px` }}
                  >
                    auto_awesome
                  </span>
                  <span className="text-xs font-bold text-slate-500">{size}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Icon Gallery */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Galeria</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
              {sampleIcons.map((icon) => (
                <div
                  key={icon}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                >
                  <span className="material-symbols-outlined text-2xl text-slate-500 group-hover:text-primary transition-colors">
                    {icon}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400 truncate w-full text-center">
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            INPUTS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Inputs
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Input */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Text Input</h3>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800"
                  placeholder="Ex: Maria Oliveira Santos"
                  type="text"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Search Input</h3>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary">
                  search
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-primary/40 glass-card"
                  placeholder="Buscar planos de aula..."
                  type="text"
                />
              </div>
            </div>

            {/* Select */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Select / Dropdown</h3>
              <Select
                icon="school"
                placeholder="Selecione o nível"
                value={selectedLevel}
                onChange={setSelectedLevel}
                options={[
                  { value: "1º Ano Fundamental", label: "1º Ano Fundamental" },
                  { value: "2º Ano Fundamental", label: "2º Ano Fundamental" },
                  { value: "3º Ano Fundamental", label: "3º Ano Fundamental" }
                ]}
              />
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700">Textarea</h3>
              <textarea
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-800 resize-none"
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CHECKBOXES & CARDS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Checkboxes & Radio Buttons
          </h2>

          {/* Card Checkboxes */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">
              Card Checkbox (Seleção de Neurodivergência)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { icon: "extension", label: "TEA" },
                { icon: "bolt", label: "TDAH" },
                { icon: "warning", label: "TOD" },
                { icon: "psychology", label: "Def. Intelectual" },
                { icon: "add_circle", label: "Outros" },
              ].map((item) => (
                <label key={item.label} className="cursor-pointer group">
                  <input className="hidden peer" type="checkbox" />
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/50 text-center">
                    <span className="material-symbols-outlined text-3xl mb-2 text-slate-400">
                      {item.icon}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {item.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Standard Checkboxes */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Checkbox Padrão</h3>
            <div className="flex flex-col gap-3">
              {["Opção A", "Opção B", "Opção C"].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Radio Buttons */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4">Radio Buttons</h3>
            <div className="flex flex-col gap-3">
              {["Ensino Fundamental I", "Ensino Fundamental II", "Ensino Médio"].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="level"
                    className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            GLASS CARDS
            ═══════════════════════════════════════════ */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Cards Glassmorphism
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-bold mb-2">Glass Card</h3>
              <p className="text-sm text-slate-500">
                background: rgba(255, 255, 255, 0.7)<br />
                backdrop-filter: blur(12px)
              </p>
            </div>
            <div className="glass-card-light p-6 rounded-xl">
              <h3 className="font-bold mb-2">Glass Card Light</h3>
              <p className="text-sm text-slate-500">
                background: rgba(255, 255, 255, 0.4)<br />
                backdrop-filter: blur(12px)
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl border-l-4 border-l-primary">
              <h3 className="font-bold mb-2">Glass Card + Borda</h3>
              <p className="text-sm text-slate-500">
                Com borda colorida à esquerda para indicar categoria/status.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            NAVBAR SPECIFICATION
            ═══════════════════════════════════════════ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-primary/10 pb-4">
            Navbar — Especificação Padrão
          </h2>

          <div className="glass-card p-8 rounded-xl space-y-6">
            <p className="text-sm text-slate-500">
              A navbar segue o padrão da tela <strong>Gerador de Plano de Aula Atualizado</strong> e é igual para todas as páginas autenticadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Estrutura</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Sticky top, z-50
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Glassmorphism: bg-white/50 + backdrop-blur-md
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Border bottom: border-primary/10
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Padding: px-6 lg:px-20, py-4
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Elementos</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Logo: ícone auto_awesome (bg-primary) + &quot;incluPlan&quot; (extrabold)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Nav links com ícones Material Symbols (hidden md:flex)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Link ativo: text-primary; Inativo: text-slate-600
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    Avatar circular com border-2 border-primary
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
