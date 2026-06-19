import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const RANKS = [
  { name: "CLASSE D", min: 1, max: 25, color: "#6b7280", glow: "#6b728040", label: "Iniciante", bg: "#111827" },
  { name: "CLASSE C", min: 26, max: 50, color: "#10b981", glow: "#10b98140", label: "Crescimento", bg: "#0d1f17" },
  { name: "CLASSE B", min: 51, max: 75, color: "#3b82f6", glow: "#3b82f640", label: "Acima da Média", bg: "#0d1530" },
  { name: "CLASSE A", min: 76, max: 90, color: "#f59e0b", glow: "#f59e0b40", label: "Elite", bg: "#1a1200" },
  { name: "SALA BRANCA", min: 91, max: 99, color: "#ffffff", glow: "#ffffff50", label: "Excelência Máxima", bg: "#0a0a0a" },
  { name: "GÊNIO", min: 100, max: 100, color: "#a855f7", glow: "#a855f760", label: "Gênio da Sala Branca", bg: "#0f0010" },
];

const CLASS_D_TITLES = [
  "Aluno Classe D", "Estudante Comum", "Novato Disciplinado", "Observador Silencioso",
  "Aprendiz Estratégico", "Mente Analítica", "Planejador Iniciante", "Discípulo da Disciplina",
  "Explorador Curioso", "Candidato Promissor", "Estudante Dedicado", "Buscador do Conhecimento",
  "Aprendiz Consistente", "Iniciado nos Estudos", "Candidato Disciplinado",
  "Estudante Metódico", "Buscador de Progresso", "Aprendiz Focado", "Candidato Resiliente",
  "Discípulo Aplicado", "Estudante Perseverante", "Analista Iniciante", "Estrategista Novato",
  "Aprendiz Determinado", "Estudante Evoluído"
];

const CLASS_C_TITLES = [
  "Estudante Disciplinado", "Aprendiz Avançado", "Praticante Consistente", "Pensador Estratégico",
  "Executor Disciplinado", "Analista Crescente", "Produtivo Emergente", "Mestre do Autocontrole",
  "Estrategista Intermediário", "Estudante de Alta Performance", "Pensador Produtivo",
  "Executor Consistente", "Analista Estratégico", "Disciplinado Avançado", "Produtivo Consistente",
  "Mestre da Rotina", "Estrategista Crescente", "Estudante Elite", "Executor de Alto Nível",
  "Analista Avançado", "Pensador de Elite", "Produtivo Avançado", "Mestre da Consistência",
  "Estrategista Avançado", "Disciplinado de Elite"
];

const CLASS_B_TITLES = [
  "Estrategista Avançado", "Inteligência Superior", "Executor de Alta Performance", "Mestre da Disciplina",
  "Analista de Elite", "Pensador Estratégico Superior", "Produtivo de Alto Nível", "Mestre do Foco",
  "Estrategista de Elite", "Inteligência Avançada", "Executor Superior", "Disciplinado Superior",
  "Analista Superior", "Pensador de Alta Performance", "Mestre da Execução",
  "Estrategista Superior", "Inteligência Estratégica", "Executor de Elite", "Disciplinado de Alta Performance",
  "Analista de Alta Performance", "Pensador Superior", "Mestre da Inteligência",
  "Estrategista de Alta Performance", "Inteligência de Elite", "Executor Mestre"
];

const CLASS_A_TITLES = [
  "Elite da Disciplina", "Mestre Estratégico", "Executivo de Alto Desempenho", "Controle Absoluto",
  "Inteligência de Elite", "Performance Máxima", "Disciplina Inabalável", "Estrategista Supremo",
  "Mestre da Consistência", "Elite da Inteligência", "Executivo Supremo", "Controle Emocional Avançado",
  "Inteligência Suprema", "Performance de Elite", "Mestre Absoluto"
];

const SALA_BRANCA_TITLES = [
  "Iniciado da Sala Branca", "Guardião do Silêncio", "Mestre do Foco Absoluto",
  "Senhor da Disciplina", "Arquiteto da Mente", "Mestre do Controle Absoluto",
  "Elite Suprema", "Guardião da Excelência", "Senhor da Performance"
];

const ATTRIBUTES = [
  { id: "discipline", name: "Disciplina", icon: "⚔️", color: "#ef4444" },
  { id: "intelligence", name: "Inteligência", icon: "🧠", color: "#3b82f6" },
  { id: "physical", name: "Condicionamento Físico", icon: "💪", color: "#10b981" },
  { id: "mental", name: "Controle Mental", icon: "🌀", color: "#8b5cf6" },
  { id: "social", name: "Habilidades Sociais", icon: "🤝", color: "#f59e0b" },
];

const ACHIEVEMENTS = [
  { id: "first_task", name: "Primeira Tarefa", desc: "Complete sua primeira tarefa", icon: "✅", xp: 50, condition: (s) => s.totalTasksDone >= 1 },
  { id: "week_one", name: "Primeira Semana", desc: "Complete 7 dias de uso", icon: "📅", xp: 200, condition: (s) => s.streak >= 7 },
  { id: "streak_7", name: "7 Dias Seguidos", desc: "Mantenha streak de 7 dias", icon: "🔥", xp: 150, condition: (s) => s.streak >= 7 },
  { id: "streak_30", name: "30 Dias Seguidos", desc: "Mantenha streak de 30 dias", icon: "🔥🔥", xp: 500, condition: (s) => s.streak >= 30 },
  { id: "streak_100", name: "100 Dias Seguidos", desc: "Mantenha streak de 100 dias", icon: "💎", xp: 2000, condition: (s) => s.streak >= 100 },
  { id: "xp_1000", name: "1.000 XP", desc: "Acumule 1.000 XP", icon: "⭐", xp: 100, condition: (s) => s.totalXP >= 1000 },
  { id: "xp_10000", name: "10.000 XP", desc: "Acumule 10.000 XP", icon: "🌟", xp: 500, condition: (s) => s.totalXP >= 10000 },
  { id: "rank_c", name: "Classe C", desc: "Alcance a Classe C", icon: "🥉", xp: 300, condition: (s) => s.level >= 26 },
  { id: "rank_b", name: "Classe B", desc: "Alcance a Classe B", icon: "🥈", xp: 500, condition: (s) => s.level >= 51 },
  { id: "rank_a", name: "Classe A", desc: "Alcance a Classe A", icon: "🥇", xp: 1000, condition: (s) => s.level >= 76 },
  { id: "sala_branca", name: "Sala Branca", desc: "Entre na Sala Branca", icon: "🤍", xp: 2000, condition: (s) => s.level >= 91 },
  { id: "genius", name: "Gênio", desc: "Alcance o Nível 100", icon: "👑", xp: 5000, condition: (s) => s.level >=
