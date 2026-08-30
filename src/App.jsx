import { useState, useEffect, useRef, useCallback } from "react";

// ─── TEMA CLARO / MINIMALISTA ───────────────────────────────────────────────────
const THEME = {
  bg: "#f4f4f7",
  bgCard: "#ffffff",
  bgElevated: "#eef0f3",
  border: "#e2e4ea",
  borderAccent: "#c7d7f5",
  text: "#15171c",
  textMuted: "#70747c",
  textDim: "#b0b3ba",
  accent: "#3b6bf5",
  accentGlow: "#3b6bf530",
  gold: "#c08a2e",
  goldGlow: "#c08a2e30",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#d97706",
  purple: "#7c3aed",
};

// ─── FRASES AYANOKOJI ──────────────────────────────────────────────────────────
const FRASES = [
  { frase: "Nao importa o quanto e genial um plano. Quando chega a hora de agir, voce deve agir.", autor: "Ayanokoji Kiyotaka" },
  { frase: "O ser humano e uma criatura que nunca pode ser satisfeita. E exatamente por isso que ele pode evoluir.", autor: "Ayanokoji Kiyotaka" },
  { frase: "O fraco nunca pode escolher a paz. A opcao esta sempre nas maos do forte.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Nao confunda bondade com fraqueza. Sao coisas completamente diferentes.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Pessoas que evitam o fracasso tambem evitam o sucesso.", autor: "Robert T. Kiyosaki" },
  { frase: "Disciplina e a ponte entre metas e realizacoes.", autor: "Jim Rohn" },
  { frase: "O sucesso e a soma de pequenos esforcos repetidos dia apos dia.", autor: "Robert Collier" },
  { frase: "A dor e temporaria. Desistir e para sempre.", autor: "Lance Armstrong" },
  { frase: "Nao conte os dias. Faca os dias contarem.", autor: "Muhammad Ali" },
  { frase: "Primeiro forme habitos, depois os habitos te formam.", autor: "Rob Gilbert" },
  { frase: "O segredo do sucesso e a constancia do proposito.", autor: "Benjamin Disraeli" },
  { frase: "Nao espere. O tempo nunca sera exatamente certo.", autor: "Napoleon Hill" },
  { frase: "Cada vez que voce para quando poderia continuar, ou continua quando deveria parar, esta construindo seu carater.", autor: "Ayanokoji Kiyotaka" },
  { frase: "A unica batalha que voce deve travar e contra a versao inferior de si mesmo.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Inteligencia sem disciplina e apenas potencial desperdicado.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Controle suas emocoes ou elas vao te controlar.", autor: "Ayanokoji Kiyotaka" },
  { frase: "A mente que e descansada e a mente que planeja com precisao.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Acredite que voce pode, e ja esta na metade do caminho.", autor: "Theodore Roosevelt" },
  { frase: "A qualidade de uma pessoa pode ser vista em seus padroes, naquilo que exige de si mesma.", autor: "Ayanokoji Kiyotaka" },
];

// ─── 100 HABILIDADES ───────────────────────────────────────────────────────────
const HABILIDADES = [
  "Oratoria","Digitacao rapida","Meditacao","Memorizacao","Calculo mental",
  "Leitura dinamica","Desenho","Xadrez","Escrita criativa","Alongamento",
  "Ciclismo","Futebol","Corrida","Programacao","Organizacao",
  "Caligrafia","Fotografia","Ingles","Espanhol","Japones",
  "Piano","Violao","Culinaria","Natacao","Musculacao",
  "Yoga","Box","Jiu-jitsu","Danca","Teatro",
  "Marketing digital","Design grafico","Edicao de video","Podcasting","Public speaking",
  "Filosofia","Psicologia","Economia","Historia","Matematica",
  "Fisica","Quimica","Biologia","Liderança","Negociacao",
  "Persuasao","Gestao de tempo","Planejamento","Foco profundo","Criatividade",
  "Pensamento critico","Resolucao de problemas","Tomada de decisao","Inteligencia emocional","Empatia",
  "Comunicacao assertiva","Escuta ativa","Gestao de conflitos","Trabalho em equipe","Networking",
  "Autoconhecimento","Controle emocional","Resiliencia","Paciencia","Disciplina",
  "Consistencia","Habitos saudaveis","Nutricao","Saude mental","Meditacao avancada",
  "Respiracao","Sono de qualidade","Hidratacao","Exercicio aerobico","Flexibilidade",
  "Equilibrio","Coordenacao motora","Agilidade","Forcafisica","Resistencia fisica",
  "Velocidade","Reflexo","Concentracao","Atencao aos detalhes","Observacao",
  "Analise de dados","Estatistica","Logica","Argumentacao","Debate",
  "Leitura de mapas","Navegacao","Sobrevivencia","Primeiros socorros","Seguranca digital",
  "Gerenciamento financeiro","Investimentos","Contabilidade basica","Empreendedorismo","Inovacao",
];

// ─── CONQUISTAS ────────────────────────────────────────────────────────────────
const ACHIEVEMENTS_DEF = [
  // Sequencia
  { id: "streak_3", name: "3 Dias Seguidos", desc: "Mantenha uma sequencia de 3 dias", icon: "🔥", xp: 50, condition: s => s.streak >= 3 },
  { id: "streak_7", name: "Semana Perfeita", desc: "7 dias consecutivos", icon: "🔥", xp: 150, condition: s => s.streak >= 7 },
  { id: "streak_14", name: "Duas Semanas", desc: "14 dias consecutivos", icon: "🔥", xp: 250, condition: s => s.streak >= 14 },
  { id: "streak_30", name: "Mes de Fogo", desc: "30 dias consecutivos", icon: "🔥", xp: 500, condition: s => s.streak >= 30 },
  { id: "streak_60", name: "Dois Meses", desc: "60 dias consecutivos", icon: "🔥", xp: 800, condition: s => s.streak >= 60 },
  { id: "streak_100", name: "Centenario", desc: "100 dias consecutivos", icon: "👑", xp: 2000, condition: s => s.streak >= 100 },
  // Tarefas
  { id: "tasks_1", name: "Primeira Tarefa", desc: "Complete sua primeira tarefa", icon: "✅", xp: 50, condition: s => s.totalTasksDone >= 1 },
  { id: "tasks_10", name: "Produtivo", desc: "Complete 10 tarefas", icon: "✅", xp: 100, condition: s => s.totalTasksDone >= 10 },
  { id: "tasks_50", name: "Executor", desc: "Complete 50 tarefas", icon: "⚡", xp: 200, condition: s => s.totalTasksDone >= 50 },
  { id: "tasks_100", name: "Maquina", desc: "Complete 100 tarefas", icon: "🤖", xp: 400, condition: s => s.totalTasksDone >= 100 },
  { id: "tasks_500", name: "Lendario", desc: "Complete 500 tarefas", icon: "💎", xp: 2000, condition: s => s.totalTasksDone >= 500 },
  // XP
  { id: "xp_100", name: "Iniciando", desc: "Acumule 100 XP", icon: "⭐", xp: 50, condition: s => s.totalXP >= 100 },
  { id: "xp_500", name: "Em Ascensao", desc: "Acumule 500 XP", icon: "⭐", xp: 100, condition: s => s.totalXP >= 500 },
  { id: "xp_1000", name: "1.000 XP", desc: "Acumule 1000 XP", icon: "⭐", xp: 200, condition: s => s.totalXP >= 1000 },
  { id: "xp_5000", name: "5.000 XP", desc: "Acumule 5000 XP", icon: "💫", xp: 500, condition: s => s.totalXP >= 5000 },
  { id: "xp_10000", name: "10.000 XP", desc: "Acumule 10000 XP", icon: "🌟", xp: 1000, condition: s => s.totalXP >= 10000 },
  // Nivel
  { id: "rank_c", name: "Classe C", desc: "Alcance a Classe C", icon: "🎖️", xp: 300, condition: s => s.totalXP >= 26 },
  { id: "rank_b", name: "Classe B", desc: "Alcance a Classe B", icon: "🏅", xp: 500, condition: s => s.totalXP >= 51 },
  { id: "rank_a", name: "Classe A", desc: "Alcance a Classe A", icon: "🏆", xp: 1000, condition: s => s.totalXP >= 76 },
  { id: "rank_branca", name: "Sala Branca", desc: "Entre na Sala Branca", icon: "🤍", xp: 2000, condition: s => s.totalXP >= 91 },
  // Habitos
  { id: "habits_create", name: "Primeiro Habito", desc: "Crie seu primeiro habito", icon: "🔁", xp: 50, condition: s => (s.habits||[]).length >= 1 },
  { id: "habits_5", name: "5 Habitos", desc: "Tenha 5 habitos ativos", icon: "🔁", xp: 150, condition: s => (s.habits||[]).length >= 5 },
  { id: "habits_master", name: "Mestre dos Habitos", desc: "Tenha 10 habitos ativos", icon: "👑", xp: 300, condition: s => (s.habits||[]).length >= 10 },
  // Especiais
  { id: "especiais_1", name: "Tarefa Especial", desc: "Crie sua primeira tarefa especial", icon: "🌟", xp: 100, condition: s => (s.especiais||[]).length >= 1 },
  { id: "especiais_5", name: "Explorador", desc: "Tenha 5 tarefas especiais", icon: "🌟", xp: 200, condition: s => (s.especiais||[]).length >= 5 },
  // Metas
  { id: "goals_1", name: "Primeira Meta", desc: "Crie sua primeira meta", icon: "🎯", xp: 50, condition: s => (s.goals||[]).length >= 1 },
  { id: "goals_complete", name: "Meta Cumprida", desc: "Conclua uma meta", icon: "🎯", xp: 200, condition: s => (s.goals||[]).filter(g=>g.done).length >= 1 },
  { id: "goals_5", name: "5 Metas", desc: "Conclua 5 metas", icon: "🎯", xp: 500, condition: s => (s.goals||[]).filter(g=>g.done).length >= 5 },
  // Maestria
  { id: "maestria_start", name: "Programa Iniciado", desc: "Inicie o Programa de Maestria", icon: "📚", xp: 100, condition: s => (s.maestria||[]).length >= 1 },
  { id: "maestria_30", name: "30 Dias de Maestria", desc: "Complete 30 dias de treinamento", icon: "📚", xp: 500, condition: s => (s.maestria||[]).some(m=>(m.registros||[]).length>=30) },
  // Relatorio
  { id: "relatorio_1", name: "Primeiro Relatorio", desc: "Complete seu primeiro relatorio noturno", icon: "🌙", xp: 50, condition: s => (s.relatoriosNoturnos||[]).length >= 1 },
  { id: "relatorio_7", name: "Uma Semana", desc: "7 relatorios noturnos", icon: "🌙", xp: 200, condition: s => (s.relatoriosNoturnos||[]).length >= 7 },
  { id: "relatorio_30", name: "Mes Reflexivo", desc: "30 relatorios noturnos", icon: "🌙", xp: 500, condition: s => (s.relatoriosNoturnos||[]).length >= 30 },
  // Cofre
  { id: "vault_1", name: "Primeiro Registro", desc: "Adicione ao cofre", icon: "📚", xp: 50, condition: s => (s.vault||[]).length >= 1 },
  { id: "vault_10", name: "Colecao", desc: "10 itens no cofre", icon: "📚", xp: 200, condition: s => (s.vault||[]).length >= 10 },
  // Disciplina
  { id: "disc_30", name: "Mestre Disciplinado", desc: "Atributo Disciplina nivel 30", icon: "⚔️", xp: 500, condition: s => (s.attributes?.discipline?.xp||0) >= 30 },
  { id: "disc_50", name: "Guerreiro", desc: "Atributo Disciplina nivel 50", icon: "⚔️", xp: 800, condition: s => (s.attributes?.discipline?.xp||0) >= 50 },
  // Missao
  { id: "missao_1", name: "Primeira Missao", desc: "Conclua sua primeira Missao do Dia", icon: "⚡", xp: 100, condition: s => (s.missoesCompletas||0) >= 1 },
  { id: "missao_7", name: "7 Missoes", desc: "7 Missoes do Dia concluidas", icon: "⚡", xp: 300, condition: s => (s.missoesCompletas||0) >= 7 },
  { id: "missao_30", name: "30 Missoes", desc: "30 Missoes do Dia concluidas", icon: "⚡", xp: 800, condition: s => (s.missoesCompletas||0) >= 30 },
  // White Room
  { id: "white_room", name: "Sala Branca", desc: "Acesse a Sala Branca", icon: "🤍", xp: 200, condition: s => (s.whiteRoomSessions||0) >= 1 },
  { id: "white_room_10", name: "Veterano da Sala Branca", desc: "10 sessoes na Sala Branca", icon: "🤍", xp: 500, condition: s => (s.whiteRoomSessions||0) >= 10 },
];

// ─── CONSTANTES DO APP ─────────────────────────────────────────────────────────
const RANKS = [
  { name: "CLASSE D", min: 0, max: 25, color: "#6b7280", glow: "#6b728030", label: "Iniciante", bg: "#080c10" },
  { name: "CLASSE C", min: 26, max: 50, color: "#10b981", glow: "#10b98130", label: "Crescimento", bg: "#041210" },
  { name: "CLASSE B", min: 51, max: 75, color: "#2563eb", glow: "#2563eb30", label: "Acima da Media", bg: "#040c1c" },
  { name: "CLASSE A", min: 76, max: 90, color: "#d4a853", glow: "#d4a85330", label: "Elite", bg: "#120e04" },
  { name: "SALA BRANCA", min: 91, max: 99, color: "#e2e8f0", glow: "#e2e8f020", label: "Excelencia Maxima", bg: "#080c10" },
  { name: "GENIO", min: 100, max: 100, color: "#8b5cf6", glow: "#8b5cf630", label: "Genio da Sala Branca", bg: "#0c0410" },
];

const WEEKDAYS = [
  { idx: 0, short: "Dom", full: "Domingo" },
  { idx: 1, short: "Seg", full: "Segunda" },
  { idx: 2, short: "Ter", full: "Terca" },
  { idx: 3, short: "Qua", full: "Quarta" },
  { idx: 4, short: "Qui", full: "Quinta" },
  { idx: 5, short: "Sex", full: "Sexta" },
  { idx: 6, short: "Sab", full: "Sabado" },
];

const DESAFIOS = [
  { id: "d1", nome: "Sequencia de 3", desc: "Complete todos os habitos por 3 dias seguidos", xp: 150, meta: 3, tipo: "streak" },
  { id: "d2", nome: "Semana Perfeita", desc: "Complete todos os habitos dos 7 dias desta semana", xp: 300, meta: 7, tipo: "semana" },
  { id: "d3", nome: "Madrugador", desc: "Complete um habito antes das 8h da manha", xp: 100, meta: 1, tipo: "cedo" },
  { id: "d4", nome: "Produtivo", desc: "Complete 5 habitos em um unico dia", xp: 200, meta: 5, tipo: "dia" },
  { id: "d5", nome: "Consistente", desc: "Use o app por 7 dias seguidos", xp: 250, meta: 7, tipo: "uso" },
];

function getRank(level) {
  return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0];
}

function getLevelFromXP(xp) {
  const safeXP = Math.max(0, xp);
  let level = 1;
  let total = 0;
  while (true) {
    const needed = Math.floor(100 * Math.pow(1.35, level - 1));
    if (total + needed > safeXP) {
      return { level, xpInLevel: safeXP - total, xpNeeded: needed };
    }
    total += needed;
    level++;
    if (level > 100) return { level: 100, xpInLevel: 0, xpNeeded: 1 };
  }
}

function getHabitDays(h) {
  if (Array.isArray(h.days)) return h.days;
  switch (h.freq) {
    case "weekdays": return [1, 2, 3, 4, 5];
    case "weekend": return [0, 6];
    default: return [0, 1, 2, 3, 4, 5, 6];
  }
}

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
const initialState = () => {
  try {
    const saved = localStorage.getItem("titinfocus_v2");
    if (saved) return { ...defaultState(), ...JSON.parse(saved) };
  } catch {}
  return defaultState();
};

function defaultState() {
  return {
    username: "Estudante",
    totalXP: 0,
    streak: 0,
    lastActiveDate: null,
    totalTasksDone: 0,
    attributes: {
      discipline: { xp: 0 },
      intelligence: { xp: 0 },
      physical: { xp: 0 },
      mental: { xp: 0 },
      social: { xp: 0 },
    },
    tasks: [],
    goals: [],
    evolutions: [],
    vault: [],
    achievements: [],
    whiteRoomSessions: 0,
    habits: [],
    habitExtras: [],
    habitPriority: [],
    taskPriority: [],
    especiais: [],
    desafiosCompletos: [],
    maestria: [],
    relatoriosNoturnos: [],
    missoesCompletas: 0,
    missaoHoje: null,
    rankingPessoal: {},
  };
}

// ─── STYLES ────────────────────────────────────────────────────────────────────
const T = THEME;

const styles = {
  card: {
    background: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 10,
    boxShadow: "0 1px 3px rgba(20,20,30,0.04)",
  },
  cardGlass: {
    background: `${T.bgElevated}cc`,
    border: `1px solid ${T.border}`,
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 10,
    backdropFilter: "blur(8px)",
    boxShadow: "0 1px 3px rgba(20,20,30,0.04)",
  },
  btn: (color) => ({
    background: `${color}20`,
    border: `1px solid ${color}40`,
    borderRadius: 8,
    padding: "8px 14px",
    color: color,
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  btnSolid: (color) => ({
    background: color,
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    color: color === T.gold ? "#000" : "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  input: {
    background: T.bgElevated,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    color: T.text,
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  },
  label: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  },
  navBtn: (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "8px 2px 6px",
    background: "none",
    border: "none",
    cursor: "pointer",
    opacity: active ? 1 : 0.4,
    transition: "opacity 0.2s",
  }),
  badge: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 8px",
    background: `${color}20`,
    border: `1px solid ${color}40`,
    borderRadius: 20,
    fontSize: 10,
    color: color,
    fontWeight: 700,
  }),
  progressBar: (pct, color) => ({
    height: 4,
    background: T.border,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  }),
};

// ─── AVATAR ────────────────────────────────────────────────────────────────────
function Avatar({ level, rank }) {
  const tier = level <= 25 ? 0 : level <= 50 ? 1 : level <= 75 ? 2 : level <= 90 ? 3 : level <= 99 ? 4 : 5;
  const colors = [
    { robe: "#1e2733", aura: "none" },
    { robe: "#064e3b", aura: "#10b98120" },
    { robe: "#1e3a8a", aura: "#2563eb20" },
    { robe: "#451a03", aura: "#d4a85320" },
    { robe: "#1c1c1c", aura: "#e2e8f020" },
    { robe: "#2e1065", aura: "#8b5cf620" },
  ];
  const c = colors[tier];
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" style={{ filter: tier >= 2 ? `drop-shadow(0 0 8px ${rank.color}60)` : "none" }}>
      {tier >= 1 && <ellipse cx="40" cy="70" rx="35" ry="20" fill={c.aura} />}
      <rect x="22" y="45" width="36" height="45" rx="4" fill={c.robe} />
      <circle cx="40" cy="35" r="18" fill={c.robe} />
      <circle cx="40" cy="33" r="13" fill="#1a2535" />
      <circle cx="35" cy="32" r="2.5" fill={rank.color} opacity="0.9" />
      <circle cx="45" cy="32" r="2.5" fill={rank.color} opacity="0.9" />
      <path d="M35 40 Q40 44 45 40" stroke={rank.color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {tier >= 3 && <polygon points="40,14 42,20 48,20 43,24 45,30 40,26 35,30 37,24 32,20 38,20" fill={T.gold} />}
      {tier >= 4 && (
        <>
          <line x1="10" y1="55" x2="30" y2="62" stroke={rank.color} strokeWidth="1.5" opacity="0.6" />
          <line x1="70" y1="55" x2="50" y2="62" stroke={rank.color} strokeWidth="1.5" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function TitinFocusApp() {
  const [state, setState] = useState(initialState);
  const [tab, setTab] = useState("home");
  const [whiteRoom, setWhiteRoom] = useState(false);
  const [whiteTask, setWhiteTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [modal, setModal] = useState(null);
  const [newAchievement, setNewAchievement] = useState(null);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const { level, xpInLevel, xpNeeded } = getLevelFromXP(state.totalXP);
  const rank = getRank(level);
  const xpPct = Math.min(100, (xpInLevel / xpNeeded) * 100);
  const today = new Date().toDateString();
  const todayIdx = new Date().getDay();
  const C = T;

  // Save to localStorage
  useEffect(() => {
    try { localStorage.setItem("titinfocus_v2", JSON.stringify(state)); } catch {}
  }, [state]);

  // Fix: garante que a pagina toda (fora do container do app) tambem fique
  // escura e ocupe 100% da tela, sem faixas brancas nas bordas.
  useEffect(() => {
    const prevHtml = document.documentElement.style.cssText;
    const prevBody = document.body.style.cssText;
    document.documentElement.style.cssText = `height:100%;margin:0;padding:0;background:${T.bg};`;
    document.body.style.cssText = `min-height:100%;margin:0;padding:0;background:${T.bg};`;
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
    return () => {
      document.documentElement.style.cssText = prevHtml;
      document.body.style.cssText = prevBody;
    };
  }, []);

  // Streak + notifications
  useEffect(() => {
    if (state.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = state.lastActiveDate === yesterday.toDateString() ? state.streak + 1 : 1;
      setState(s => ({ ...s, lastActiveDate: today, streak: newStreak }));
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Achievement check
  useEffect(() => {
    const unlocked = [...(state.achievements || [])];
    let changed = false;
    let bonusXP = 0;
    ACHIEVEMENTS_DEF.forEach(a => {
      if (!unlocked.includes(a.id) && a.condition(state)) {
        unlocked.push(a.id);
        changed = true;
        bonusXP += a.xp;
        setNewAchievement(a);
        setTimeout(() => setNewAchievement(null), 3000);
      }
    });
    if (changed) setState(s => ({ ...s, achievements: unlocked, totalXP: s.totalXP + bonusXP }));
  }, [state.totalXP, state.streak, state.totalTasksDone, state.habits, state.especiais, state.goals, state.maestria, state.relatoriosNoturnos]);

  // Toast helper
  const showToast = (msg, color = T.success) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  // XP helpers
  const addXP = (amount) => setState(s => ({ ...s, totalXP: s.totalXP + amount }));
  const removeXP = (amount) => setState(s => ({ ...s, totalXP: s.totalXP - amount }));

  // Habit toggle with 3 states: done / partial / failed
  const setHabitStatus = (habitId, status) => {
    const habit = (state.habits || []).find(h => h.id === habitId);
    if (!habit) return;
    const xp = habit.xp || 20;
    const penalty = Math.floor(xp * 0.5);
    const todayStr = today;

    setState(s => {
      const habits = s.habits.map(h => {
        if (h.id !== habitId) return h;
        const oldStatus = (h.dailyStatus || {})[todayStr];
        const newDailyStatus = { ...(h.dailyStatus || {}), [todayStr]: status };
        const doneDates = status === "done"
          ? [...new Set([...(h.doneDates || []), todayStr])]
          : (h.doneDates || []).filter(d => d !== todayStr);
        return { ...h, dailyStatus: newDailyStatus, doneDates };
      });

      // XP logic
      const oldStatus = (habit.dailyStatus || {})[todayStr];
      let xpDelta = 0;
      if (oldStatus === "done") xpDelta -= xp;
      if (oldStatus === "failed") xpDelta += penalty;
      if (status === "done") xpDelta += xp;
      if (status === "failed") xpDelta -= penalty;

      return { ...s, habits, totalXP: s.totalXP + xpDelta };
    });

    if (status === "done") showToast(`+${xp} XP`, T.success);
    if (status === "failed") showToast(`-${penalty} XP`, T.danger);
  };

  const deleteHabit = (id) => setState(s => ({ ...s, habits: s.habits.filter(h => h.id !== id) }));
  const deleteTask = (id) => setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));

  const toggleTaskDone = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
      totalTasksDone: !task.done ? s.totalTasksDone + 1 : s.totalTasksDone,
      totalXP: !task.done ? s.totalXP + (task.xp || 30) : s.totalXP - (task.xp || 30),
    }));
    if (!task.done) showToast(`+${task.xp || 30} XP`, T.success);
  };

  // White room timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ─── MODAL DE NOVO HABITO ─────────────────────────────────────────────────
  function NewHabitModal() {
    const [form, setForm] = useState({ name: "", icon: "🔁", startTime: "", endTime: "", days: [0,1,2,3,4,5,6], xp: 20, difficulty: 5 });
    const toggleDay = (idx) => setForm(f => ({ ...f, days: f.days.includes(idx) ? f.days.filter(d=>d!==idx) : [...f.days, idx] }));
    const save = () => {
      if (!form.name.trim()) return;
      setState(s => ({ ...s, habits: [...(s.habits||[]), { ...form, id: Date.now(), doneDates: [], dailyStatus: {}, streak: 0 }] }));
      setModal(null);
      showToast("Habito criado!");
    };
    return (
      <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
        <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",border:`1px solid ${T.border}` }}>
          <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:16 }}>Novo Habito</div>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome do habito" style={{ ...styles.input,marginBottom:8 }} />
          <div style={{ display:"flex",gap:8,marginBottom:8 }}>
            <input value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} type="time" style={{ ...styles.input,flex:1 }} />
            <input value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} type="time" style={{ ...styles.input,flex:1 }} />
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:8 }}>
            <input value={form.xp} onChange={e=>setForm(f=>({...f,xp:Number(e.target.value)}))} type="number" min="10" max="100" placeholder="XP" style={{ ...styles.input,flex:1 }} />
            <input value={form.difficulty} onChange={e=>setForm(f=>({...f,difficulty:Number(e.target.value)}))} type="number" min="1" max="10" placeholder="Dificuldade (1-10)" style={{ ...styles.input,flex:1 }} />
          </div>
          <div style={{ marginBottom:10 }}>
            <span style={styles.label}>Dias da semana</span>
            <div style={{ display:"flex",gap:4 }}>
              {WEEKDAYS.map(w => (
                <button key={w.idx} onClick={()=>toggleDay(w.idx)} style={{ flex:1,padding:"6px 0",borderRadius:8,border:"none",background:form.days.includes(w.idx)?T.accent:T.bgElevated,color:form.days.includes(w.idx)?"#fff":T.textMuted,fontWeight:700,fontSize:10,cursor:"pointer" }}>{w.short}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setModal(null)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
            <button onClick={save} style={{ ...styles.btnSolid(T.accent),flex:1 }}>Salvar</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MODAL DE NOVA TAREFA ─────────────────────────────────────────────────
  function NewTaskModal() {
    const [form, setForm] = useState({ name: "", startTime: "", endTime: "", xp: 30, priority: "normal" });
    const save = () => {
      if (!form.name.trim()) return;
      setState(s => ({ ...s, tasks: [...s.tasks, { ...form, id: Date.now(), done: false, date: today }] }));
      setModal(null);
      showToast("Tarefa criada!");
    };
    return (
      <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
        <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",border:`1px solid ${T.border}` }}>
          <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:16 }}>Nova Tarefa</div>
          <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome da tarefa" style={{ ...styles.input,marginBottom:8 }} />
          <div style={{ display:"flex",gap:8,marginBottom:8 }}>
            <input value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} type="time" style={{ ...styles.input,flex:1 }} />
            <input value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} type="time" style={{ ...styles.input,flex:1 }} />
          </div>
          <input value={form.xp} onChange={e=>setForm(f=>({...f,xp:Number(e.target.value)}))} type="number" min="10" placeholder="XP" style={{ ...styles.input,marginBottom:8 }} />
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setModal(null)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
            <button onClick={save} style={{ ...styles.btnSolid(T.accent),flex:1 }}>Salvar</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── IMPORTAR ROTINA (texto -> varias tarefas de uma vez) ─────────────────
  function parseRoutineText(text) {
    return text
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        let rest = line;
        let xp = 30;
        const xpMatch = rest.match(/(\d+)\s*(xp|pts|pontos)/i);
        if (xpMatch) { xp = Number(xpMatch[1]); rest = rest.replace(xpMatch[0], ""); }

        const timeMatches = [...rest.matchAll(/(\d{1,2})[:h](\d{2})?/g)];
        let startTime = "", endTime = "";
        if (timeMatches[0]) {
          startTime = `${timeMatches[0][1].padStart(2,"0")}:${timeMatches[0][2] || "00"}`;
          rest = rest.replace(timeMatches[0][0], "");
        }
        if (timeMatches[1]) {
          endTime = `${timeMatches[1][1].padStart(2,"0")}:${timeMatches[1][2] || "00"}`;
          rest = rest.replace(timeMatches[1][0], "");
        }

        const name = rest.replace(/[-–,]+/g, " ").replace(/\s+/g, " ").trim();
        return { name, startTime, endTime, xp, id: Date.now() + Math.random(), done: false, date: today };
      })
      .filter(t => t.name);
  }

  function ImportRoutineModal() {
    const [text, setText] = useState("");
    const [preview, setPreview] = useState([]);
    const doPreview = () => setPreview(parseRoutineText(text));
    const doImport = () => {
      const parsed = parseRoutineText(text);
      if (!parsed.length) return;
      setState(s => ({ ...s, tasks: [...s.tasks, ...parsed] }));
      setModal(null);
      showToast(`${parsed.length} tarefa(s) importada(s)!`);
    };
    return (
      <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
        <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",border:`1px solid ${T.border}`,maxHeight:"85vh",overflowY:"auto" }}>
          <div style={{ fontWeight:700,fontSize:16,color:T.text,marginBottom:8 }}>📋 Importar Rotina</div>
          <div style={{ color:T.textMuted,fontSize:11,marginBottom:12,lineHeight:1.5 }}>
            Uma tarefa por linha, no formato <b>nome - horario - XPxp</b>. Cole aqui o texto que eu te mandar no chat.
          </div>
          <textarea
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder={"Treino - 07:00 - 30xp\nEstudar - 09:00 - 50xp\nLer - 20:00 - 20xp"}
            style={{ ...styles.input,minHeight:140,resize:"none",marginBottom:10 }}
          />
          <button onClick={doPreview} style={{ ...styles.btn(T.accent),width:"100%",marginBottom:10 }}>Pre-visualizar</button>

          {preview.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:6 }}>{preview.length} TAREFA(S) ENCONTRADA(S)</div>
              {preview.map((t,i) => (
                <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:T.bgElevated,borderRadius:8,marginBottom:4 }}>
                  <span style={{ color:T.text,fontSize:12 }}>{t.name}</span>
                  <span style={{ color:T.textMuted,fontSize:11 }}>{t.startTime || "--:--"} · {t.xp}xp</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setModal(null)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
            <button onClick={doImport} style={{ ...styles.btnSolid(T.accent),flex:1 }}>Importar Tudo</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── HOME TAB ────────────────────────────────────────────────────────────
  function HomeTab() {
    const todayHabits = (state.habits||[]).filter(h => getHabitDays(h).includes(todayIdx));
    const habitsDone = todayHabits.filter(h => (h.doneDates||[]).includes(today)).length;
    const tasksDone = (state.tasks||[]).filter(t => t.done && t.date === today).length;
    const tasksTotal = (state.tasks||[]).filter(t => t.date === today || !t.date).length;
    const diaIdx = new Date().getDate() % FRASES.length;
    const frase = FRASES[diaIdx];

    // Missao do dia
    const missao = state.missaoHoje;
    const missaoCompleta = missao && (state.tasks||[]).find(t => t.id === missao.taskId && t.done);

    return (
      <div style={{ padding:16,paddingBottom:100 }}>

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <div>
            <div style={{ color:T.textMuted,fontSize:11,letterSpacing:2,marginBottom:2 }}>BEM-VINDO DE VOLTA</div>
            <div style={{ color:T.text,fontWeight:800,fontSize:20 }}>{state.username}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ ...styles.badge(rank.color),fontSize:12,padding:"4px 12px" }}>{rank.name}</div>
            <div style={{ color:T.textMuted,fontSize:10,marginTop:4 }}>Nv. {level} • {state.streak} dias</div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ ...styles.card,background:`linear-gradient(135deg, ${T.bgCard}, ${T.bgElevated})`,border:`1px solid ${rank.color}30`,marginBottom:12 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ color:T.textMuted,fontSize:11 }}>XP: {state.totalXP}</span>
            <span style={{ color:rank.color,fontSize:11 }}>{xpInLevel}/{xpNeeded}</span>
          </div>
          <div style={{ height:6,background:T.border,borderRadius:4,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${xpPct}%`,background:`linear-gradient(90deg, ${rank.color}, ${rank.color}cc)`,borderRadius:4,transition:"width 0.5s" }} />
          </div>
        </div>

        {/* Missao do Dia */}
        {missao && (
          <div style={{ ...styles.card,background:`linear-gradient(135deg, #0c1220, #111820)`,border:`1px solid ${T.accent}40`,marginBottom:12 }}>
            <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:6 }}>⚡ MISSAO DO DIA</div>
            <div style={{ color:T.text,fontSize:14,fontWeight:700 }}>{missao.nome}</div>
            {missaoCompleta ? (
              <div style={{ color:T.success,fontSize:12,marginTop:6 }}>✓ Missao concluida! Excelente trabalho.</div>
            ) : (
              <div style={{ color:T.textMuted,fontSize:12,marginTop:6 }}>Foque nessa tarefa acima de tudo hoje.</div>
            )}
          </div>
        )}

        {/* Resumo do dia */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12 }}>
          <div style={{ ...styles.card,textAlign:"center",padding:"12px 8px" }}>
            <div style={{ fontSize:22,fontWeight:800,color:T.accent }}>{habitsDone}/{todayHabits.length}</div>
            <div style={{ fontSize:10,color:T.textMuted,marginTop:2 }}>Habitos</div>
          </div>
          <div style={{ ...styles.card,textAlign:"center",padding:"12px 8px" }}>
            <div style={{ fontSize:22,fontWeight:800,color:T.success }}>{tasksDone}/{tasksTotal}</div>
            <div style={{ fontSize:10,color:T.textMuted,marginTop:2 }}>Tarefas</div>
          </div>
          <div style={{ ...styles.card,textAlign:"center",padding:"12px 8px" }}>
            <div style={{ fontSize:22,fontWeight:800,color:T.gold }}>{state.streak}</div>
            <div style={{ fontSize:10,color:T.textMuted,marginTop:2 }}>Sequencia</div>
          </div>
        </div>

        {/* Frase do dia */}
        <div style={{ ...styles.card,background:`linear-gradient(135deg, ${T.purple}12, ${T.bgCard})`,border:`1px solid ${T.purple}30` }}>
          <div style={{ color:T.purple,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:6 }}>FRASE DO DIA</div>
          <div style={{ color:T.text,fontSize:13,fontStyle:"italic",lineHeight:1.6 }}>"{frase.frase}"</div>
          <div style={{ color:T.purple,fontSize:11,marginTop:6,textAlign:"right" }}>— {frase.autor}</div>
        </div>

        {/* Habitos pendentes */}
        {todayHabits.filter(h => !(h.doneDates||[]).includes(today)).length > 0 && (
          <div style={{ ...styles.card }}>
            <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>HABITOS PENDENTES HOJE</div>
            {todayHabits.filter(h => !(h.doneDates||[]).includes(today)).slice(0,3).map(h => (
              <div key={h.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:13,color:T.text }}>{h.icon || "🔁"} {h.name}</span>
                <span style={{ ...styles.badge(T.warning) }}>+{h.xp||20} XP</span>
              </div>
            ))}
            <button onClick={()=>setTab("habits")} style={{ ...styles.btn(T.accent),width:"100%",marginTop:8,padding:"8px 0",textAlign:"center" }}>Ver todos os habitos</button>
          </div>
        )}
      </div>
    );
  }

  // ─── HABITS TAB ──────────────────────────────────────────────────────────
  function HabitsTab() {
    const habits = state.habits || [];
    const [selectedDay, setSelectedDay] = useState(todayIdx);
    const [showPriority, setShowPriority] = useState(false);
    const [extras, setExtras] = useState(state.habitExtras || []);
    const [newExtra, setNewExtra] = useState("");
    const [editingPriority, setEditingPriority] = useState(false);
    const [priorityOrder, setPriorityOrder] = useState(state.habitPriority || []);
    const [failReason, setFailReason] = useState({});
    const [showFailInput, setShowFailInput] = useState(null);
    const isViewingToday = selectedDay === todayIdx;

    const sorted = [...habits].sort((a,b) => (a.startTime||"").localeCompare(b.startTime||""));
    const todayHabits = sorted.filter(h => getHabitDays(h).includes(todayIdx));
    const dayHabits = sorted.filter(h => getHabitDays(h).includes(selectedDay));

    const saveExtras = (val) => { setExtras(val); setState(s => ({ ...s, habitExtras: val })); };
    const savePriority = (val) => { setPriorityOrder(val); setState(s => ({ ...s, habitPriority: val })); };

    const top5Dia = (() => {
      const pending = dayHabits.filter(h => !(h.doneDates||[]).includes(today));
      const ordered = priorityOrder.map(id => pending.find(h => h.id === id)).filter(Boolean);
      const rest = pending.filter(h => !priorityOrder.includes(h.id));
      return [...ordered, ...rest].slice(0, 5);
    })();

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        {/* Botao lateral */}
        <div style={{ position:"fixed",right:0,top:"40%",zIndex:30 }}>
          <button onClick={()=>setShowPriority(true)} style={{ background:T.gold,border:"none",borderRadius:"8px 0 0 8px",padding:"12px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,boxShadow:`-2px 0 10px ${T.goldGlow}` }}>
            <span style={{ fontSize:14 }}>⭐</span>
            <span style={{ color:"#000",fontSize:8,fontWeight:700,writingMode:"vertical-rl",transform:"rotate(180deg)" }}>PRIORIDADES</span>
          </button>
        </div>

        {/* Painel lateral */}
        {showPriority && (
          <div style={{ position:"fixed",inset:0,background:"#000b",zIndex:100 }} onClick={()=>setShowPriority(false)}>
            <div style={{ position:"absolute",right:0,top:0,bottom:0,width:300,background:T.bgCard,borderLeft:`1px solid ${T.border}`,overflowY:"auto",padding:16 }} onClick={e=>e.stopPropagation()}>
              <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:4 }}>⭐ Prioridades</div>
              <div style={{ color:T.textMuted,fontSize:11,marginBottom:16 }}>Habitos mais importantes hoje</div>
              <div style={{ color:T.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>TOP 5 DO DIA</div>
              {top5Dia.length === 0 && <div style={{ color:T.textMuted,fontSize:12,marginBottom:16 }}>Todos concluidos!</div>}
              {top5Dia.map((h,i) => (
                <div key={h.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:T.bgElevated,borderRadius:8,marginBottom:6 }}>
                  <span style={{ color:T.gold,fontWeight:800,fontSize:12,width:16 }}>{i+1}.</span>
                  <span style={{ fontSize:12,flex:1,color:T.text }}>{h.name}</span>
                </div>
              ))}
              <div style={{ height:1,background:T.border,margin:"12px 0" }} />
              <div style={{ color:T.success,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>TOP 5 EXTRAS</div>
              {extras.slice(0,5).map((e,i) => (
                <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:T.bgElevated,borderRadius:8,marginBottom:6 }}>
                  <span style={{ color:T.success,fontWeight:800,fontSize:12,width:16 }}>{i+1}.</span>
                  <span style={{ flex:1,fontSize:12,color:T.text }}>{e}</span>
                  <button onClick={()=>saveExtras(extras.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:12 }}>✕</button>
                </div>
              ))}
              {extras.length < 5 && (
                <div style={{ display:"flex",gap:6 }}>
                  <input value={newExtra} onChange={e=>setNewExtra(e.target.value)} placeholder="Habito extra..." style={{ ...styles.input,flex:1,fontSize:12,padding:"8px 10px" }} />
                  <button onClick={()=>{ if(newExtra.trim()){ saveExtras([...extras,newExtra.trim()]); setNewExtra(""); } }} style={{ ...styles.btnSolid(T.success),padding:"8px 12px" }}>+</button>
                </div>
              )}
              <button onClick={()=>setShowPriority(false)} style={{ ...styles.btn(T.textMuted),width:"100%",marginTop:16,padding:12,textAlign:"center" }}>Fechar</button>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <div>
            <div style={{ fontWeight:700,fontSize:18,color:T.text }}>🔁 Habitos</div>
            <div style={{ color:T.textMuted,fontSize:12 }}>{todayHabits.filter(h=>(h.doneDates||[]).includes(today)).length}/{todayHabits.length} hoje</div>
          </div>
          <button onClick={()=>setModal("newHabit")} style={{ ...styles.btnSolid(T.accent) }}>+ Novo</button>
        </div>

        {/* Resumo do dia */}
        {todayHabits.length > 0 && (() => {
          const doneCount = todayHabits.filter(h => (h.dailyStatus||{})[today] === "done").length;
          const pct = Math.round((doneCount / todayHabits.length) * 100);
          return (
            <div style={{ ...styles.card,display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:`conic-gradient(${T.success} ${pct}%, ${T.bgElevated} 0)` }}>
                <div style={{ width:34,height:34,borderRadius:"50%",background:T.bgCard,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.text }}>{pct}%</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:13,color:T.text }}>Progresso de hoje</div>
                <div style={{ fontSize:11,color:T.textMuted }}>{doneCount} de {todayHabits.length} habitos concluidos</div>
              </div>
            </div>
          );
        })()}

        {/* Banner prioritarios */}
        {isViewingToday && top5Dia.length > 0 && (
          <div style={{ ...styles.card,background:`linear-gradient(135deg, ${T.gold}12, ${T.bgCard})`,border:`1px solid ${T.gold}30`,marginBottom:10 }}>
            <div style={{ color:T.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:6 }}>PRIORITARIOS DE HOJE</div>
            {top5Dia.slice(0,3).map((h,i) => (
              <div key={h.id} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                <span style={{ color:T.gold,fontWeight:800,fontSize:11,width:14 }}>{i+1}.</span>
                <span style={{ fontSize:12,color:T.text }}>{h.name}</span>
                {h.startTime && <span style={{ color:T.textMuted,fontSize:10,marginLeft:"auto" }}>{h.startTime}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Day selector */}
        <div style={{ display:"flex",gap:4,marginBottom:12 }}>
          {WEEKDAYS.map(w => (
            <button key={w.idx} onClick={()=>setSelectedDay(w.idx)} style={{ flex:1,padding:"8px 0",borderRadius:8,border:w.idx===todayIdx?`1px solid ${T.accent}`:"1px solid transparent",background:selectedDay===w.idx?T.accent:T.bgElevated,color:selectedDay===w.idx?"#fff":T.textMuted,fontWeight:700,fontSize:10,cursor:"pointer" }}>{w.short}</button>
          ))}
        </div>

        {/* Habits list */}
        {dayHabits.length === 0 ? (
          <div style={{ textAlign:"center",color:T.textMuted,padding:40 }}>
            <div style={{ fontSize:40,marginBottom:8 }}>📅</div>
            <div style={{ fontWeight:600,color:T.text }}>Nenhum habito em {WEEKDAYS[selectedDay].full}</div>
            <div style={{ fontSize:12,marginTop:4 }}>Habitos so aparecem nos dias configurados</div>
          </div>
        ) : (() => {
          const periodOf = (h) => {
            const hh = h.startTime ? Number(h.startTime.split(":")[0]) : null;
            if (hh === null) return "Sem horario";
            if (hh < 12) return "Manha";
            if (hh < 18) return "Tarde";
            return "Noite";
          };
          const periodIcon = { "Manha":"🌅", "Tarde":"🌤️", "Noite":"🌙", "Sem horario":"🗒️" };
          const groups = {};
          dayHabits.forEach(h => { const p = periodOf(h); (groups[p] = groups[p] || []).push(h); });
          const order = ["Manha","Tarde","Noite","Sem horario"].filter(p => groups[p]);

          return order.map(period => (
            <div key={period} style={{ marginBottom:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:8,paddingLeft:2 }}>
                <span style={{ fontSize:12 }}>{periodIcon[period]}</span>
                <span style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>{period}</span>
                <div style={{ flex:1,height:1,background:T.border }} />
              </div>
              {groups[period].map(habit => {
          const todayStr = today;
          const dailyStatus = (habit.dailyStatus || {})[todayStr];
          const isDone = dailyStatus === "done";
          const isPartial = dailyStatus === "partial";
          const isFailed = dailyStatus === "failed";
          const col = isDone ? T.success : isPartial ? T.warning : isFailed ? T.danger : T.textMuted;

          return (
            <div key={habit.id} style={{ ...styles.card,borderLeft:`3px solid ${col}`,marginBottom:8 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                <div style={{ width:34,height:34,borderRadius:10,flexShrink:0,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{habit.icon||"🔁"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.text }}>{habit.name}</div>
                  {habit.startTime && <div style={{ fontSize:10,color:T.textMuted,marginTop:2 }}>{habit.startTime}{habit.endTime?` - ${habit.endTime}`:""}</div>}
                </div>
                <div style={{ display:"flex",gap:4,alignItems:"center" }}>
                  <span style={{ ...styles.badge(T.warning) }}>+{habit.xp||20}</span>
                  {habit.difficulty && <span style={{ ...styles.badge(T.textMuted),fontSize:9 }}>Dif:{habit.difficulty}</span>}
                  <button onClick={()=>deleteHabit(habit.id)} style={{ background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:12,padding:"0 2px" }}>✕</button>
                </div>
              </div>
              {isViewingToday && (
                <div style={{ display:"flex",gap:6 }}>
                  <button onClick={()=>setHabitStatus(habit.id,"done")} style={{ flex:1,padding:"7px 0",borderRadius:8,border:"none",background:isDone?T.success:`${T.success}20`,color:isDone?"#000":T.success,fontWeight:700,fontSize:11,cursor:"pointer" }}>✓ Feito</button>
                  <button onClick={()=>setHabitStatus(habit.id,"partial")} style={{ flex:1,padding:"7px 0",borderRadius:8,border:"none",background:isPartial?T.warning:`${T.warning}20`,color:isPartial?"#000":T.warning,fontWeight:700,fontSize:11,cursor:"pointer" }}>~ Parcial</button>
                  <button onClick={()=>{ setHabitStatus(habit.id,"failed"); setShowFailInput(habit.id); }} style={{ flex:1,padding:"7px 0",borderRadius:8,border:"none",background:isFailed?T.danger:`${T.danger}20`,color:isFailed?"#fff":T.danger,fontWeight:700,fontSize:11,cursor:"pointer" }}>✕ Falhou</button>
                </div>
              )}
              {showFailInput === habit.id && isFailed && (
                <div style={{ marginTop:8 }}>
                  <input placeholder="Motivo (opcional)..." value={failReason[habit.id]||""} onChange={e=>setFailReason(r=>({...r,[habit.id]:e.target.value}))} style={{ ...styles.input,fontSize:12 }} onBlur={()=>{ setState(s=>({ ...s, habits: s.habits.map(h=>h.id===habit.id?{...h,failReasons:{...(h.failReasons||{}),[today]:failReason[habit.id]||""}}:h) })); setShowFailInput(null); }} />
                </div>
              )}
            </div>
          );
              })}
            </div>
          ));
        })()}
      </div>
    );
  }

  // ─── TASKS TAB ──────────────────────────────────────────────────────────
  function TasksTab() {
    const [filter, setFilter] = useState("today");
    const [rankMode, setRankMode] = useState(false);
    const [taskPriority, setTaskPriority] = useState(state.taskPriority || []);
    const saveTaskPriority = (val) => { setTaskPriority(val); setState(s => ({ ...s, taskPriority: val })); };

    const filtered = (state.tasks||[]).filter(t => {
      if (filter === "today") return t.date === today || !t.date;
      if (filter === "pending") return !t.done;
      if (filter === "done") return t.done;
      return true;
    }).sort((a,b) => {
      const pa = taskPriority.indexOf(a.id), pb = taskPriority.indexOf(b.id);
      if (pa !== -1 && pb !== -1) return pa - pb;
      if (pa !== -1) return -1; if (pb !== -1) return 1;
      return 0;
    });

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <div style={{ fontWeight:700,fontSize:18,color:T.text }}>📋 Tarefas</div>
          <div style={{ display:"flex",gap:6 }}>
            <button onClick={()=>setRankMode(!rankMode)} style={{ ...styles.btn(rankMode?T.gold:T.textMuted) }}>🏅 Rank</button>
            <button onClick={()=>setModal("importRoutine")} style={{ ...styles.btn(T.gold) }}>📋 Importar</button>
            <button onClick={()=>setModal("newTask")} style={{ ...styles.btnSolid(T.accent) }}>+ Nova</button>
          </div>
        </div>

        {rankMode && (
          <div style={{ ...styles.card,border:`1px solid ${T.gold}30`,marginBottom:12 }}>
            <div style={{ color:T.gold,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>RANKING DE PRIORIDADE</div>
            {filtered.filter(t=>!t.done).map(t => {
              const pos = taskPriority.indexOf(t.id);
              return (
                <div key={t.id} onClick={()=>{ const n=taskPriority.includes(t.id)?taskPriority.filter(id=>id!==t.id):[...taskPriority,t.id]; saveTaskPriority(n); }} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:pos>=0?`${T.gold}10`:T.bgElevated,borderRadius:8,marginBottom:4,cursor:"pointer",border:`1px solid ${pos>=0?T.gold+"40":T.border}` }}>
                  <span style={{ color:T.gold,fontWeight:800,fontSize:12,width:20 }}>{pos>=0?pos+1:"-"}</span>
                  <span style={{ fontSize:12,flex:1,color:T.text }}>{t.name}</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display:"flex",gap:4,marginBottom:12 }}>
          {["today","pending","done","all"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ flex:1,padding:"7px 0",borderRadius:8,border:"none",background:filter===f?T.accent:T.bgElevated,color:filter===f?"#fff":T.textMuted,fontWeight:600,fontSize:11,cursor:"pointer" }}>
              {f==="today"?"Hoje":f==="pending"?"Pendentes":f==="done"?"Feitas":"Todas"}
            </button>
          ))}
        </div>

        {filtered.length === 0 && <div style={{ textAlign:"center",color:T.textMuted,padding:40 }}><div style={{ fontSize:40 }}>✅</div><div style={{ marginTop:8,fontWeight:600,color:T.text }}>Nenhuma tarefa</div></div>}

        {filtered.map(task => (
          <div key={task.id} style={{ ...styles.card,border:`1px solid ${task.done?T.success+"30":T.border}`,opacity:task.done?0.7:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <button onClick={()=>toggleTaskDone(task.id)} style={{ width:26,height:26,borderRadius:"50%",border:`2px solid ${task.done?T.success:T.textMuted}`,background:task.done?T.success:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0 }}>{task.done?"✓":""}</button>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600,color:task.done?T.textMuted:T.text,textDecoration:task.done?"line-through":"none" }}>{task.name}</div>
                {task.startTime && <div style={{ fontSize:10,color:T.textMuted }}>{task.startTime}{task.endTime?` - ${task.endTime}`:""}</div>}
              </div>
              <div style={{ display:"flex",gap:4,alignItems:"center" }}>
                <span style={{ ...styles.badge(T.warning) }}>+{task.xp||30}</span>
                <button onClick={()=>deleteTask(task.id)} style={{ background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:12 }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── MAESTRIA TAB ────────────────────────────────────────────────────────
  function MaestriaTab() {
    const maestria = state.maestria || [];
    const [showNew, setShowNew] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showReg, setShowReg] = useState(false);
    const [form, setForm] = useState({ habilidade: "", duracao: 30, personalizada: false });
    const [regForm, setRegForm] = useState({ aprendeu: "", praticou: "", tempo: "", dificuldade: 5, evolucao: 5, desafio: "", amanha: "", obs: "" });
    const [filterHab, setFilterHab] = useState("");

    const habAtiva = maestria.find(m => m.id === selected);

    const iniciar = () => {
      if (!form.habilidade) return;
      const nova = { id: Date.now(), habilidade: form.habilidade, duracao: form.duracao, inicio: today, registros: [] };
      setState(s => ({ ...s, maestria: [...(s.maestria||[]), nova] }));
      setShowNew(false);
      setForm({ habilidade: "", duracao: 30, personalizada: false });
      showToast("Programa de Maestria iniciado!");
    };

    const registrar = () => {
      if (!regForm.aprendeu.trim()) return;
      setState(s => ({
        ...s,
        maestria: s.maestria.map(m => m.id === selected ? { ...m, registros: [...m.registros, { ...regForm, data: today, numero: m.registros.length + 1 }] } : m),
        totalXP: s.totalXP + 50,
      }));
      setRegForm({ aprendeu: "", praticou: "", tempo: "", dificuldade: 5, evolucao: 5, desafio: "", amanha: "", obs: "" });
      setShowReg(false);
      showToast("+50 XP pelo registro!");
    };

    const habsFiltradas = HABILIDADES.filter(h => h.toLowerCase().includes(filterHab.toLowerCase()));

    if (habAtiva) {
      const diasRestantes = habAtiva.duracao - habAtiva.registros.length;
      const pct = Math.min(100, (habAtiva.registros.length / habAtiva.duracao) * 100);
      const mediaEvolucao = habAtiva.registros.length > 0 ? (habAtiva.registros.reduce((s,r)=>s+(r.evolucao||0),0)/habAtiva.registros.length).toFixed(1) : 0;
      const tempoTotal = habAtiva.registros.reduce((s,r)=>s+(Number(r.tempo)||0),0);

      return (
        <div style={{ padding:16,paddingBottom:100 }}>
          <button onClick={()=>setSelected(null)} style={{ ...styles.btn(T.textMuted),marginBottom:16 }}>← Voltar</button>
          <div style={{ fontWeight:800,fontSize:20,color:T.text,marginBottom:4 }}>{habAtiva.habilidade}</div>
          <div style={{ color:T.textMuted,fontSize:12,marginBottom:16 }}>Iniciado em {habAtiva.inicio}</div>

          {/* Progress */}
          <div style={{ ...styles.card,border:`1px solid ${T.purple}30`,marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
              <span style={{ color:T.textMuted,fontSize:11 }}>{habAtiva.registros.length} dias registrados</span>
              <span style={{ color:T.purple,fontSize:11 }}>{diasRestantes > 0 ? `${diasRestantes} restantes` : "Concluido!"}</span>
            </div>
            <div style={{ height:8,background:T.border,borderRadius:4,overflow:"hidden",marginBottom:10 }}>
              <div style={{ height:"100%",width:`${pct}%`,background:`linear-gradient(90deg, ${T.purple}, ${T.accent})`,borderRadius:4,transition:"width 0.5s" }} />
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:800,color:T.purple }}>{habAtiva.registros.length}</div>
                <div style={{ fontSize:9,color:T.textMuted }}>dias feitos</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:800,color:T.success }}>{mediaEvolucao}/10</div>
                <div style={{ fontSize:9,color:T.textMuted }}>evolucao media</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:800,color:T.gold }}>{tempoTotal}min</div>
                <div style={{ fontSize:9,color:T.textMuted }}>tempo total</div>
              </div>
            </div>
          </div>

          <button onClick={()=>setShowReg(true)} style={{ ...styles.btnSolid(T.purple),width:"100%",marginBottom:12 }}>+ Registrar de Hoje</button>

          {/* Historico */}
          {habAtiva.registros.length > 0 && (
            <div style={{ ...styles.card }}>
              <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10 }}>LINHA DO TEMPO</div>
              {[...habAtiva.registros].reverse().map((r,i) => (
                <div key={i} style={{ borderLeft:`2px solid ${T.purple}40`,paddingLeft:12,marginBottom:12 }}>
                  <div style={{ color:T.purple,fontSize:11,fontWeight:700 }}>Dia {r.numero} — {r.data}</div>
                  <div style={{ color:T.text,fontSize:12,marginTop:4 }}>{r.aprendeu}</div>
                  {r.praticou && <div style={{ color:T.textMuted,fontSize:11,marginTop:2 }}>Pratiquei: {r.praticou}</div>}
                  <div style={{ display:"flex",gap:8,marginTop:4 }}>
                    {r.tempo && <span style={{ ...styles.badge(T.textMuted) }}>{r.tempo}min</span>}
                    <span style={{ ...styles.badge(T.purple) }}>Dif: {r.dificuldade}/10</span>
                    <span style={{ ...styles.badge(T.success) }}>Ev: {r.evolucao}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal registro */}
          {showReg && (
            <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
              <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${T.border}` }}>
                <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:14 }}>Registro do Dia {habAtiva.registros.length+1}</div>
                {[
                  ["O que aprendi hoje:", "aprendeu"],
                  ["O que pratiquei:", "praticou"],
                  ["Maior desafio:", "desafio"],
                  ["O que melhorar amanha:", "amanha"],
                  ["Observacoes:", "obs"],
                ].map(([label, key]) => (
                  <div key={key} style={{ marginBottom:8 }}>
                    <span style={styles.label}>{label}</span>
                    <input value={regForm[key]} onChange={e=>setRegForm(f=>({...f,[key]:e.target.value}))} style={{ ...styles.input }} />
                  </div>
                ))}
                <div style={{ marginBottom:8 }}>
                  <span style={styles.label}>Tempo praticado (minutos)</span>
                  <input value={regForm.tempo} onChange={e=>setRegForm(f=>({...f,tempo:e.target.value}))} type="number" style={{ ...styles.input }} />
                </div>
                <div style={{ marginBottom:8 }}>
                  <span style={styles.label}>Dificuldade: {regForm.dificuldade}/10</span>
                  <input type="range" min="1" max="10" value={regForm.dificuldade} onChange={e=>setRegForm(f=>({...f,dificuldade:Number(e.target.value)}))} style={{ width:"100%" }} />
                </div>
                <div style={{ marginBottom:14 }}>
                  <span style={styles.label}>Evolucao percebida: {regForm.evolucao}/10</span>
                  <input type="range" min="1" max="10" value={regForm.evolucao} onChange={e=>setRegForm(f=>({...f,evolucao:Number(e.target.value)}))} style={{ width:"100%" }} />
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={()=>setShowReg(false)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
                  <button onClick={registrar} style={{ ...styles.btnSolid(T.purple),flex:1 }}>Registrar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div>
            <div style={{ fontWeight:700,fontSize:18,color:T.text }}>📚 Programa de Maestria</div>
            <div style={{ color:T.textMuted,fontSize:12 }}>Domine novas habilidades</div>
          </div>
          <button onClick={()=>setShowNew(true)} style={{ ...styles.btnSolid(T.purple) }}>+ Iniciar</button>
        </div>

        {maestria.length === 0 && !showNew && (
          <div style={{ textAlign:"center",padding:60,color:T.textMuted }}>
            <div style={{ fontSize:44,marginBottom:8 }}>📚</div>
            <div style={{ fontWeight:600,color:T.text,marginBottom:4 }}>Nenhuma habilidade em treinamento</div>
            <div style={{ fontSize:12 }}>Inicie um programa de 30 dias para dominar uma nova habilidade</div>
          </div>
        )}

        {maestria.map(m => {
          const pct = Math.min(100, (m.registros.length / m.duracao) * 100);
          return (
            <div key={m.id} onClick={()=>setSelected(m.id)} style={{ ...styles.card,cursor:"pointer",border:`1px solid ${T.purple}30` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                <div style={{ fontWeight:700,fontSize:14,color:T.text }}>{m.habilidade}</div>
                <span style={{ ...styles.badge(T.purple) }}>{m.registros.length}/{m.duracao} dias</span>
              </div>
              <div style={{ height:4,background:T.border,borderRadius:4,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${pct}%`,background:T.purple,borderRadius:4 }} />
              </div>
              <div style={{ color:T.textMuted,fontSize:11,marginTop:6 }}>Iniciado em {m.inicio}</div>
            </div>
          );
        })}

        {showNew && (
          <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
            <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${T.border}` }}>
              <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:14 }}>Iniciar Programa de Maestria</div>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <button onClick={()=>setForm(f=>({...f,habilidade:HABILIDADES[Math.floor(Math.random()*HABILIDADES.length)],personalizada:false}))} style={{ ...styles.btnSolid(T.purple),flex:1 }}>🎲 Sortear</button>
                <button onClick={()=>setForm(f=>({...f,personalizada:true}))} style={{ ...styles.btn(T.textMuted),flex:1 }}>Escolher</button>
              </div>
              {form.personalizada && (
                <>
                  <input placeholder="Buscar habilidade..." value={filterHab} onChange={e=>setFilterHab(e.target.value)} style={{ ...styles.input,marginBottom:6 }} />
                  <div style={{ maxHeight:150,overflowY:"auto",marginBottom:8 }}>
                    {habsFiltradas.map(h => (
                      <div key={h} onClick={()=>setForm(f=>({...f,habilidade:h}))} style={{ padding:"8px 12px",borderRadius:8,background:form.habilidade===h?`${T.purple}30`:T.bgElevated,cursor:"pointer",marginBottom:4,color:form.habilidade===h?T.purple:T.text,fontSize:13,border:`1px solid ${form.habilidade===h?T.purple+"40":T.border}` }}>{h}</div>
                    ))}
                  </div>
                </>
              )}
              {form.habilidade && <div style={{ ...styles.card,border:`1px solid ${T.purple}40`,marginBottom:10,textAlign:"center" }}><span style={{ color:T.purple,fontWeight:700,fontSize:14 }}>📚 {form.habilidade}</span></div>}
              <div style={{ marginBottom:12 }}>
                <span style={styles.label}>Duracao (dias)</span>
                <input value={form.duracao} onChange={e=>setForm(f=>({...f,duracao:Number(e.target.value)}))} type="number" min="7" max="365" style={{ ...styles.input }} />
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>setShowNew(false)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
                <button onClick={iniciar} disabled={!form.habilidade} style={{ ...styles.btnSolid(T.purple),flex:1,opacity:form.habilidade?1:0.5 }}>Iniciar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── RELATORIO NOTURNO ───────────────────────────────────────────────────
  function RelatorioNoturnoTab() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ bemFeito: "", melhorar: "", prioridade: "" });
    const [done, setDone] = useState(false);
    const todayHabits = (state.habits||[]).filter(h => getHabitDays(h).includes(todayIdx));
    const habitsDone = todayHabits.filter(h => (h.doneDates||[]).includes(today)).length;
    const tasksDone = (state.tasks||[]).filter(t => t.done && (t.date===today||!t.date)).length;
    const pctProd = Math.round(((habitsDone + tasksDone) / Math.max(1, todayHabits.length + (state.tasks||[]).filter(t=>t.date===today||!t.date).length)) * 100);

    const perguntas = [
      { key: "bemFeito", label: "O que eu fiz bem hoje?", placeholder: "Descreva algo positivo do dia..." },
      { key: "melhorar", label: "O que posso melhorar amanha?", placeholder: "Identifique uma area de melhoria..." },
      { key: "prioridade", label: "Qual e minha principal prioridade para amanha?", placeholder: "Defina sua missao de amanha..." },
    ];

    const salvar = () => {
      setState(s => ({
        ...s,
        relatoriosNoturnos: [...(s.relatoriosNoturnos||[]), { ...form, data: today, habitsDone, tasksDone, pctProd }],
        totalXP: s.totalXP + 30,
      }));
      setDone(true);
      showToast("+30 XP pelo relatorio!");
    };

    if (done) {
      return (
        <div style={{ padding:16,paddingBottom:100 }}>
          <div style={{ textAlign:"center",padding:"40px 20px" }}>
            <div style={{ fontSize:48,marginBottom:12 }}>🌙</div>
            <div style={{ fontWeight:800,fontSize:20,color:T.text,marginBottom:8 }}>Relatorio concluido</div>
            <div style={{ color:T.textMuted,fontSize:13,marginBottom:24 }}>Boa noite. Descanse bem e prepare-se para amanha.</div>
          </div>
          <div style={{ ...styles.card,border:`1px solid ${T.accent}30` }}>
            <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:12 }}>RESUMO DO DIA</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:24,fontWeight:800,color:T.success }}>{habitsDone}</div>
                <div style={{ fontSize:10,color:T.textMuted }}>habitos feitos</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:24,fontWeight:800,color:T.accent }}>{tasksDone}</div>
                <div style={{ fontSize:10,color:T.textMuted }}>tarefas feitas</div>
              </div>
              <div style={{ textAlign:"center",gridColumn:"1/-1" }}>
                <div style={{ fontSize:32,fontWeight:800,color:T.gold }}>{pctProd}%</div>
                <div style={{ fontSize:10,color:T.textMuted }}>produtividade</div>
              </div>
            </div>
          </div>
          <button onClick={()=>{ setStep(0); setForm({ bemFeito:"", melhorar:"", prioridade:"" }); setDone(false); }} style={{ ...styles.btn(T.textMuted),width:"100%",marginTop:8,padding:12,textAlign:"center" }}>Novo relatorio</button>
        </div>
      );
    }

    const p = perguntas[step];
    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ fontWeight:700,fontSize:18,color:T.text,marginBottom:4 }}>🌙 Relatorio Noturno</div>
        <div style={{ color:T.textMuted,fontSize:12,marginBottom:20 }}>Reflita sobre o dia e planeje o proximo</div>

        <div style={{ display:"flex",gap:4,marginBottom:20 }}>
          {perguntas.map((_,i) => (
            <div key={i} style={{ flex:1,height:4,borderRadius:4,background:i<=step?T.accent:T.border,transition:"background 0.3s" }} />
          ))}
        </div>

        <div style={{ ...styles.card,border:`1px solid ${T.accent}30`,marginBottom:16 }}>
          <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>{step+1}/3</div>
          <div style={{ color:T.text,fontWeight:700,fontSize:15,marginBottom:12 }}>{p.label}</div>
          <textarea value={form[p.key]} onChange={e=>setForm(f=>({...f,[p.key]:e.target.value}))} placeholder={p.placeholder} style={{ ...styles.input,minHeight:100,resize:"none" }} />
        </div>

        <div style={{ display:"flex",gap:8 }}>
          {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>← Voltar</button>}
          {step < 2
            ? <button onClick={()=>setStep(s=>s+1)} style={{ ...styles.btnSolid(T.accent),flex:1 }}>Proximo →</button>
            : <button onClick={salvar} style={{ ...styles.btnSolid(T.success),flex:1 }}>Concluir</button>
          }
        </div>

        {(state.relatoriosNoturnos||[]).length > 0 && (
          <div style={{ ...styles.card,marginTop:16 }}>
            <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>ULTIMOS RELATORIOS</div>
            {[...(state.relatoriosNoturnos||[])].reverse().slice(0,3).map((r,i) => (
              <div key={i} style={{ padding:"8px 0",borderBottom:`1px solid ${T.border}`,lastChild:{border:"none"} }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <span style={{ color:T.textMuted,fontSize:11 }}>{r.data}</span>
                  <span style={{ color:T.gold,fontSize:11,fontWeight:700 }}>{r.pctProd}%</span>
                </div>
                <div style={{ color:T.text,fontSize:12,marginTop:2 }}>{r.bemFeito}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── RANKING PESSOAL ─────────────────────────────────────────────────────
  function RankingTab() {
    const totalTasks = state.totalTasksDone || 0;
    const streak = state.streak || 0;
    const habitsCount = (state.habits||[]).length;
    const maestriaCount = (state.maestria||[]).length;
    const conquistas = (state.achievements||[]).length;
    const relatorios = (state.relatoriosNoturnos||[]).length;

    const stats = [
      { label: "Sequencia maxima", value: streak, unit: "dias", color: T.danger, icon: "🔥" },
      { label: "Tarefas concluidas", value: totalTasks, unit: "total", color: T.success, icon: "✅" },
      { label: "Habitos ativos", value: habitsCount, unit: "habitos", color: T.accent, icon: "🔁" },
      { label: "Habilidades em maestria", value: maestriaCount, unit: "habilidades", color: T.purple, icon: "📚" },
      { label: "Conquistas desbloqueadas", value: conquistas, unit: `de ${ACHIEVEMENTS_DEF.length}`, color: T.gold, icon: "🏆" },
      { label: "Relatorios noturnos", value: relatorios, unit: "relatorios", color: T.textMuted, icon: "🌙" },
      { label: "XP total acumulado", value: state.totalXP, unit: "XP", color: T.warning, icon: "⭐" },
      { label: "Nivel atual", value: level, unit: `${rank.name}`, color: rank.color, icon: "⚔️" },
    ];

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ fontWeight:700,fontSize:18,color:T.text,marginBottom:4 }}>🏅 Ranking Pessoal</div>
        <div style={{ color:T.textMuted,fontSize:12,marginBottom:20 }}>Sua evolucao comparada com voce mesmo</div>

        <div style={{ ...styles.card,background:`linear-gradient(135deg, ${T.bgCard}, ${T.bgElevated})`,border:`1px solid ${rank.color}40`,textAlign:"center",marginBottom:16,padding:24 }}>
          <Avatar level={level} rank={rank} />
          <div style={{ color:rank.color,fontWeight:800,fontSize:22,marginTop:8 }}>{state.username}</div>
          <div style={{ ...styles.badge(rank.color),fontSize:12,padding:"4px 16px",margin:"6px auto",display:"inline-flex" }}>{rank.name} — Nv. {level}</div>
        </div>

        {stats.map((s,i) => (
          <div key={i} style={{ ...styles.card,display:"flex",alignItems:"center",gap:12,marginBottom:8 }}>
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,color:T.textMuted }}>{s.label}</div>
              <div style={{ height:4,background:T.border,borderRadius:4,marginTop:4,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${Math.min(100,(s.value/Math.max(s.value,1))*100)}%`,background:s.color,borderRadius:4 }} />
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:s.color,fontWeight:800,fontSize:16 }}>{s.value}</div>
              <div style={{ color:T.textMuted,fontSize:9 }}>{s.unit}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── CONQUISTAS TAB ──────────────────────────────────────────────────────
  function AchievementsTab() {
    const unlocked = state.achievements || [];
    const [filter, setFilter] = useState("all");
    const filtered = ACHIEVEMENTS_DEF.filter(a => filter === "all" || (filter === "done" ? unlocked.includes(a.id) : !unlocked.includes(a.id)));

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ fontWeight:700,fontSize:18,color:T.text,marginBottom:4 }}>🏆 Conquistas</div>
        <div style={{ color:T.textMuted,fontSize:12,marginBottom:12 }}>{unlocked.length}/{ACHIEVEMENTS_DEF.length} desbloqueadas</div>
        <div style={{ display:"flex",gap:4,marginBottom:12 }}>
          {["all","done","pending"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ flex:1,padding:"7px 0",borderRadius:8,border:"none",background:filter===f?T.gold:T.bgElevated,color:filter===f?"#000":T.textMuted,fontWeight:600,fontSize:11,cursor:"pointer" }}>
              {f==="all"?"Todas":f==="done"?"Desbloqueadas":"Pendentes"}
            </button>
          ))}
        </div>
        {filtered.map(a => {
          const isDone = unlocked.includes(a.id);
          return (
            <div key={a.id} style={{ ...styles.card,opacity:isDone?1:0.5,border:`1px solid ${isDone?T.gold+"40":T.border}` }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ fontSize:24 }}>{isDone ? a.icon : "🔒"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:isDone?T.text:T.textMuted }}>{a.name}</div>
                  <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>{a.desc}</div>
                </div>
                <span style={{ ...styles.badge(isDone?T.gold:T.textMuted) }}>+{a.xp}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─── HISTORICO TAB ───────────────────────────────────────────────────────
  function HistoricoTab() {
    const habits = state.habits || [];
    const [viewMode, setViewMode] = useState("semanas");
    const [selectedWeek, setSelectedWeek] = useState(0);

    const getWeekData = (weeksAgo) => {
      const end = new Date(); end.setDate(end.getDate() - (weeksAgo * 7));
      const start = new Date(end); start.setDate(start.getDate() - 6);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start); d.setDate(start.getDate() + i);
        const dateStr = d.toDateString();
        const dayHabits = habits.filter(h => getHabitDays(h).includes(d.getDay()));
        const done = dayHabits.filter(h => (h.doneDates||[]).includes(dateStr));
        days.push({ date: d, dateStr, dayHabits, done, pct: dayHabits.length > 0 ? (done.length / dayHabits.length) * 100 : 0 });
      }
      const totalDone = days.reduce((s,d)=>s+d.done.length,0);
      const xpEstimado = totalDone * 20;
      const perfectDays = days.filter(d=>d.dayHabits.length>0&&d.pct===100).length;
      const skippedDays = days.filter(d=>d.dayHabits.length>0&&d.pct===0).length;
      const habitFreq = {}; days.forEach(d=>d.done.forEach(h=>{ habitFreq[h.name]=(habitFreq[h.name]||0)+1; }));
      const skippedHabits = {}; days.forEach(d=>d.dayHabits.filter(h=>!(h.doneDates||[]).includes(d.dateStr)).forEach(h=>{ skippedHabits[h.name]=(skippedHabits[h.name]||0)+1; }));
      const label = weeksAgo===0?"Esta semana":weeksAgo===1?"Semana passada":`${weeksAgo} semanas atras`;
      return { days, totalDone, perfectDays, skippedDays, xpEstimado, label, habitFreq: Object.entries(habitFreq).sort((a,b)=>b[1]-a[1]), skippedHabits: Object.entries(skippedHabits).sort((a,b)=>b[1]-a[1]) };
    };

    const weeks = Array.from({ length: 8 }, (_,i) => getWeekData(i));
    const cw = weeks[selectedWeek];

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ fontWeight:700,fontSize:18,color:T.text,marginBottom:4 }}>📅 Historico</div>
        <div style={{ color:T.textMuted,fontSize:12,marginBottom:14 }}>Sua evolucao detalhada</div>

        <div style={{ display:"flex",gap:4,marginBottom:14 }}>
          <button onClick={()=>setViewMode("semanas")} style={{ ...styles.btn(viewMode==="semanas"?T.accent:T.textMuted),flex:1 }}>Semanas</button>
          <button onClick={()=>setViewMode("meses")} style={{ ...styles.btn(viewMode==="meses"?T.accent:T.textMuted),flex:1 }}>Meses</button>
        </div>

        {viewMode === "semanas" && (
          <>
            <div style={{ display:"flex",gap:4,marginBottom:12,overflowX:"auto" }}>
              {weeks.map((_,i) => (
                <button key={i} onClick={()=>setSelectedWeek(i)} style={{ flexShrink:0,padding:"6px 12px",borderRadius:8,border:"none",background:selectedWeek===i?T.accent:T.bgElevated,color:selectedWeek===i?"#fff":T.textMuted,fontWeight:700,fontSize:10,cursor:"pointer" }}>{i===0?"Esta":i===1?"Ant.":`${i}s`}</button>
              ))}
            </div>
            <div style={{ color:T.gold,fontSize:12,fontWeight:700,marginBottom:12 }}>{cw.label}</div>
            <div style={{ ...styles.card,marginBottom:10 }}>
              <div style={{ color:T.textMuted,fontSize:10,letterSpacing:2,marginBottom:8 }}>HABITOS POR DIA</div>
              <div style={{ display:"flex",alignItems:"flex-end",gap:4,height:70 }}>
                {cw.days.map((d,i) => (
                  <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
                    <div style={{ fontSize:9,color:T.textMuted }}>{d.done.length}/{d.dayHabits.length}</div>
                    <div style={{ width:"100%",height:50,background:T.border,borderRadius:4,display:"flex",alignItems:"flex-end",overflow:"hidden" }}>
                      <div style={{ width:"100%",height:`${Math.max(d.pct*0.5,d.done.length>0?8:0)}%`,background:d.pct===100?T.success:d.pct>50?T.warning:T.accent,borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:9,color:T.textMuted }}>{"DSTQQSS"[d.date.getDay()]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10 }}>
              <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.success }}>{cw.totalDone}</div><div style={{ fontSize:10,color:T.textMuted }}>habitos feitos</div></div>
              <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.gold }}>{cw.xpEstimado}</div><div style={{ fontSize:10,color:T.textMuted }}>XP ganho</div></div>
              <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.purple }}>{cw.perfectDays}</div><div style={{ fontSize:10,color:T.textMuted }}>dias perfeitos</div></div>
              <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.danger }}>{cw.skippedDays}</div><div style={{ fontSize:10,color:T.textMuted }}>dias pulados</div></div>
            </div>
            {cw.habitFreq.length > 0 && (
              <div style={{ ...styles.card,marginBottom:10 }}>
                <div style={{ color:T.success,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>MAIS FEITOS</div>
                {cw.habitFreq.slice(0,5).map(([name,count],i) => (
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:12,color:T.text }}>{i+1}. {name}</span>
                    <span style={{ color:T.success,fontSize:12,fontWeight:700 }}>{count}x</span>
                  </div>
                ))}
              </div>
            )}
            {cw.skippedHabits.length > 0 && (
              <div style={{ ...styles.card }}>
                <div style={{ color:T.danger,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>MAIS PULADOS</div>
                {cw.skippedHabits.slice(0,5).map(([name,count],i) => (
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:12,color:T.text }}>{i+1}. {name}</span>
                    <span style={{ color:T.danger,fontSize:12,fontWeight:700 }}>{count}x pulado</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ─── ESPECIAIS TAB ───────────────────────────────────────────────────────
  function EspeciaisTab() {
    const especiais = state.especiais || [];
    const setEspeciais = (val) => setState(s => ({ ...s, especiais: typeof val === "function" ? val(s.especiais||[]) : val }));
    const [showNew, setShowNew] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ nome: "", descricao: "", unidade: "", metaFinal: "", dificuldade: 5 });
    const [novaEvolucao, setNovaEvolucao] = useState({ valor: "", nota: "", dificuldade: 5, foco: 5, energia: 5, satisfacao: 5 });

    const tarefa = especiais.find(e => e.id === selected);

    const saveNew = () => {
      if (!form.nome.trim()) return;
      const nova = { id: Date.now(), nome: form.nome, descricao: form.descricao, unidade: form.unidade || "unidades", metaFinal: Number(form.metaFinal)||0, dificuldade: form.dificuldade, evolucoes: [], criadaEm: today };
      setEspeciais([...especiais, nova]);
      setForm({ nome: "", descricao: "", unidade: "", metaFinal: "", dificuldade: 5 });
      setShowNew(false);
      showToast("Tarefa especial criada!");
    };

    const addEvolucao = (id) => {
      if (!novaEvolucao.valor) return;
      setEspeciais(especiais.map(e => e.id === id ? { ...e, evolucoes: [...e.evolucoes, { data: today, ...novaEvolucao, valor: Number(novaEvolucao.valor) }] } : e));
      setState(s => ({ ...s, totalXP: s.totalXP + 40 }));
      setNovaEvolucao({ valor: "", nota: "", dificuldade: 5, foco: 5, energia: 5, satisfacao: 5 });
      setSelected(null);
      showToast("+40 XP pelo registro!");
    };

    if (tarefa) {
      const ultima = tarefa.evolucoes[tarefa.evolucoes.length-1];
      const pct = tarefa.metaFinal > 0 && ultima ? Math.min(100,(ultima.valor/tarefa.metaFinal)*100) : 0;
      const mediaSat = tarefa.evolucoes.length > 0 ? (tarefa.evolucoes.reduce((s,e)=>s+(e.satisfacao||0),0)/tarefa.evolucoes.length).toFixed(1) : 0;
      return (
        <div style={{ padding:16,paddingBottom:100 }}>
          <button onClick={()=>setSelected(null)} style={{ ...styles.btn(T.textMuted),marginBottom:14 }}>← Voltar</button>
          <div style={{ fontWeight:800,fontSize:20,color:T.text,marginBottom:4 }}>{tarefa.nome}</div>
          {tarefa.descricao && <div style={{ color:T.textMuted,fontSize:13,marginBottom:12 }}>{tarefa.descricao}</div>}
          {tarefa.metaFinal > 0 && (
            <div style={{ ...styles.card,marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <span style={{ color:T.textMuted,fontSize:11 }}>Atual: <b style={{ color:T.text }}>{ultima?.valor||0} {tarefa.unidade}</b></span>
                <span style={{ color:T.purple,fontSize:11 }}>Meta: <b>{tarefa.metaFinal} {tarefa.unidade}</b></span>
              </div>
              <div style={{ height:6,background:T.border,borderRadius:4,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${T.purple},${T.accent})`,borderRadius:4 }} />
              </div>
            </div>
          )}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
            <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.purple }}>{tarefa.evolucoes.length}</div><div style={{ fontSize:10,color:T.textMuted }}>registros</div></div>
            <div style={{ ...styles.card,textAlign:"center" }}><div style={{ fontSize:22,fontWeight:800,color:T.gold }}>{mediaSat}/10</div><div style={{ fontSize:10,color:T.textMuted }}>satisfacao media</div></div>
          </div>
          <button onClick={()=>{ }} style={{ ...styles.btnSolid(T.purple),width:"100%",marginBottom:12 }} onClick={()=>document.getElementById("reg-form").scrollIntoView()}>+ Registrar Hoje</button>
          {tarefa.evolucoes.length > 0 && (
            <div style={{ ...styles.card,marginBottom:12 }}>
              <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10 }}>LINHA DO TEMPO</div>
              {[...tarefa.evolucoes].reverse().map((ev,i) => (
                <div key={i} style={{ borderLeft:`2px solid ${T.purple}40`,paddingLeft:12,marginBottom:10 }}>
                  <div style={{ color:T.purple,fontSize:11,fontWeight:700 }}>{ev.data} — {ev.valor} {tarefa.unidade}</div>
                  {ev.nota && <div style={{ color:T.text,fontSize:12,marginTop:2 }}>{ev.nota}</div>}
                  <div style={{ display:"flex",gap:6,marginTop:4 }}>
                    <span style={{ ...styles.badge(T.textMuted) }}>Dif:{ev.dificuldade}/10</span>
                    <span style={{ ...styles.badge(T.success) }}>Sat:{ev.satisfacao}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div id="reg-form" style={{ ...styles.card,border:`1px solid ${T.purple}30` }}>
            <div style={{ color:T.purple,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:12 }}>NOVO REGISTRO</div>
            <input value={novaEvolucao.valor} onChange={e=>setNovaEvolucao(n=>({...n,valor:e.target.value}))} placeholder={`Valor (${tarefa.unidade})`} type="number" style={{ ...styles.input,marginBottom:8 }} />
            <input value={novaEvolucao.nota} onChange={e=>setNovaEvolucao(n=>({...n,nota:e.target.value}))} placeholder="Observacoes..." style={{ ...styles.input,marginBottom:8 }} />
            {[["dificuldade","Dificuldade"],["foco","Foco"],["energia","Energia"],["satisfacao","Satisfacao"]].map(([key,label]) => (
              <div key={key} style={{ marginBottom:8 }}>
                <span style={styles.label}>{label}: {novaEvolucao[key]}/10</span>
                <input type="range" min="1" max="10" value={novaEvolucao[key]} onChange={e=>setNovaEvolucao(n=>({...n,[key]:Number(e.target.value)}))} style={{ width:"100%" }} />
              </div>
            ))}
            <button onClick={()=>addEvolucao(selected)} style={{ ...styles.btnSolid(T.purple),width:"100%",marginTop:4 }}>Registrar</button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <div><div style={{ fontWeight:700,fontSize:18,color:T.text }}>🌟 Tarefas Especiais</div><div style={{ color:T.textMuted,fontSize:12 }}>Acompanhe sua evolucao detalhada</div></div>
          <button onClick={()=>setShowNew(true)} style={{ ...styles.btnSolid(T.purple) }}>+ Nova</button>
        </div>
        {especiais.length === 0 && !showNew && <div style={{ textAlign:"center",padding:60,color:T.textMuted }}><div style={{ fontSize:44,marginBottom:8 }}>🌟</div><div style={{ fontWeight:600,color:T.text }}>Nenhuma tarefa especial</div></div>}
        {especiais.map(e => {
          const ultima = e.evolucoes[e.evolucoes.length-1];
          const pct = e.metaFinal > 0 && ultima ? Math.min(100,(ultima.valor/e.metaFinal)*100) : 0;
          return (
            <div key={e.id} onClick={()=>setSelected(e.id)} style={{ ...styles.card,cursor:"pointer",border:`1px solid ${T.purple}30` }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <div style={{ fontWeight:700,fontSize:14,color:T.text }}>{e.nome}</div>
                <span style={{ ...styles.badge(T.purple) }}>{e.evolucoes.length} registros</span>
              </div>
              {e.metaFinal > 0 && ultima && (
                <>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:T.textMuted,marginBottom:4 }}>
                    <span>Atual: {ultima.valor} {e.unidade}</span>
                    <span>Meta: {e.metaFinal} {e.unidade}</span>
                  </div>
                  <div style={{ height:4,background:T.border,borderRadius:4,overflow:"hidden" }}>
                    <div style={{ height:"100%",width:`${pct}%`,background:T.purple,borderRadius:4 }} />
                  </div>
                </>
              )}
            </div>
          );
        })}
        {showNew && (
          <div style={{ position:"fixed",inset:0,background:"#000c",zIndex:100,display:"flex",alignItems:"flex-end" }}>
            <div style={{ background:T.bgCard,borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",border:`1px solid ${T.border}` }}>
              <div style={{ fontWeight:700,fontSize:15,color:T.text,marginBottom:14 }}>Nova Tarefa Especial</div>
              <input value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} placeholder="Nome da atividade" style={{ ...styles.input,marginBottom:8 }} />
              <input value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} placeholder="Descricao (opcional)" style={{ ...styles.input,marginBottom:8 }} />
              <div style={{ display:"flex",gap:8,marginBottom:8 }}>
                <input value={form.unidade} onChange={e=>setForm(f=>({...f,unidade:e.target.value}))} placeholder="Unidade (metros, min...)" style={{ ...styles.input,flex:1 }} />
                <input value={form.metaFinal} onChange={e=>setForm(f=>({...f,metaFinal:e.target.value}))} placeholder="Meta final" type="number" style={{ ...styles.input,flex:1 }} />
              </div>
              <div style={{ marginBottom:12 }}>
                <span style={styles.label}>Dificuldade: {form.dificuldade}/10</span>
                <input type="range" min="1" max="10" value={form.dificuldade} onChange={e=>setForm(f=>({...f,dificuldade:Number(e.target.value)}))} style={{ width:"100%" }} />
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>setShowNew(false)} style={{ ...styles.btn(T.textMuted),flex:1,padding:12 }}>Cancelar</button>
                <button onClick={saveNew} style={{ ...styles.btnSolid(T.purple),flex:1 }}>Criar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── PERFIL TAB ──────────────────────────────────────────────────────────
  function ProfileTab() {
    const [name, setName] = useState(state.username);
    const diaIdx = new Date().getDate() % FRASES.length;
    const frase = FRASES[diaIdx];
    return (
      <div style={{ padding:16,paddingBottom:100 }}>
        <div style={{ textAlign:"center",padding:"20px 0 16px" }}>
          <Avatar level={level} rank={rank} />
          <div style={{ color:T.text,fontWeight:800,fontSize:20,marginTop:8 }}>{state.username}</div>
          <div style={{ ...styles.badge(rank.color),fontSize:12,padding:"4px 16px",margin:"6px auto",display:"inline-flex" }}>{rank.name}</div>
          <div style={{ color:T.textMuted,fontSize:12,marginTop:4 }}>Nivel {level} • {state.streak} dias de sequencia</div>
        </div>

        <div style={{ ...styles.card,border:`1px solid ${T.purple}30`,marginBottom:10 }}>
          <div style={{ color:T.purple,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:6 }}>FRASE DO DIA</div>
          <div style={{ color:T.text,fontSize:13,fontStyle:"italic",lineHeight:1.6 }}>"{frase.frase}"</div>
          <div style={{ color:T.purple,fontSize:11,marginTop:6,textAlign:"right" }}>— {frase.autor}</div>
        </div>

        <div style={{ ...styles.card,marginBottom:10 }}>
          <div style={{ color:T.textMuted,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:8 }}>DESAFIOS ATIVOS</div>
          {DESAFIOS.slice(0,3).map(d => {
            const completo = (state.desafiosCompletos||[]).includes(d.id);
            return (
              <div key={d.id} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8,opacity:completo?0.5:1 }}>
                <div style={{ width:32,height:32,borderRadius:8,background:completo?`${T.success}20`:`${T.gold}20`,border:`1px solid ${completo?T.success+"40":T.gold+"40"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>{completo?"✓":"!"}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:12,fontWeight:700,color:T.text }}>{d.nome}</div><div style={{ fontSize:10,color:T.textMuted }}>{d.desc}</div></div>
                <span style={{ ...styles.badge(T.gold) }}>+{d.xp} XP</span>
              </div>
            );
          })}
        </div>

        <div style={{ display:"flex",gap:8,marginBottom:10 }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome" style={{ ...styles.input,flex:1 }} />
          <button onClick={()=>setState(s=>({...s,username:name}))} style={{ ...styles.btnSolid(T.accent) }}>Salvar</button>
        </div>

        <button onClick={()=>{ if(confirm("Resetar tudo? Esta acao e irreversivel.")) { localStorage.removeItem("titinfocus_v2"); window.location.reload(); } }} style={{ ...styles.btn(T.danger),width:"100%",padding:12,textAlign:"center" }}>Resetar dados</button>
      </div>
    );
  }

  // ─── SALA BRANCA ─────────────────────────────────────────────────────────
  if (whiteRoom) {
    return (
      <div style={{ background:"#050508",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",padding:20 }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ color:"#8b5cf6",fontSize:10,letterSpacing:4,marginBottom:8 }}>SALA BRANCA</div>
          <div style={{ color:"#e2e8f0",fontSize:48,fontWeight:900,letterSpacing:8 }}>{formatTime(timer)}</div>
          <div style={{ color:"#4b5563",fontSize:12,marginTop:8 }}>{whiteTask || "Sessao de foco total"}</div>
        </div>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={()=>setTimerRunning(!timerRunning)} style={{ ...styles.btnSolid(timerRunning?"#ef4444":"#8b5cf6"),padding:"12px 24px",fontSize:14 }}>{timerRunning?"Pausar":"Iniciar"}</button>
          <button onClick={()=>{ setWhiteRoom(false); setTimer(0); setTimerRunning(false); setState(s=>({...s,whiteRoomSessions:(s.whiteRoomSessions||0)+1,totalXP:s.totalXP+50})); showToast("+50 XP pela sessao!"); }} style={{ ...styles.btn("#6b7280"),padding:"12px 24px",fontSize:14 }}>Sair</button>
        </div>
      </div>
    );
  }

  // ─── NAVIGATION ──────────────────────────────────────────────────────────
  const tabs = [
    { id: "home", icon: "⚡", label: "Inicio" },
    { id: "tasks", icon: "📋", label: "Tarefas" },
    { id: "habits", icon: "🔁", label: "Habitos" },
    { id: "maestria", icon: "📚", label: "Maestria" },
    { id: "especiais", icon: "🌟", label: "Especiais" },
    { id: "historico", icon: "📅", label: "Historico" },
    { id: "relatorio", icon: "🌙", label: "Noturno" },
    { id: "ranking", icon: "🏅", label: "Ranking" },
    { id: "conquistas", icon: "🏆", label: "Conquistas" },
    { id: "perfil", icon: "⚔️", label: "Perfil" },
  ];

  return (
    <div style={{ background:T.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"'Segoe UI', system-ui, sans-serif",color:T.text,position:"relative" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.color,color:"#fff",padding:"8px 20px",borderRadius:20,fontSize:13,fontWeight:700,zIndex:200,boxShadow:"0 4px 20px #0006",transition:"all 0.3s" }}>
          {toast.msg}
        </div>
      )}

      {/* Achievement popup */}
      {newAchievement && (
        <div style={{ position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",background:T.bgCard,border:`1px solid ${T.gold}60`,borderRadius:14,padding:"12px 20px",fontSize:13,zIndex:200,boxShadow:"0 4px 20px #0008",minWidth:200,textAlign:"center" }}>
          <div style={{ fontSize:24 }}>{newAchievement.icon}</div>
          <div style={{ color:T.gold,fontWeight:700,marginTop:4 }}>Conquista desbloqueada!</div>
          <div style={{ color:T.text,fontSize:12,marginTop:2 }}>{newAchievement.name}</div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:`${T.bgCard}f0`,borderBottom:`1px solid ${T.border}`,padding:"12px 16px",position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:10,background:`linear-gradient(135deg, #1a3a6b, #2563eb)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",boxShadow:`0 0 10px ${T.accentGlow}` }}>TF</div>
            <div>
              <div style={{ color:rank.color,fontSize:9,fontWeight:700,letterSpacing:3 }}>TITINFOCUS</div>
              <div style={{ color:T.textMuted,fontSize:10 }}>Foco - Disciplina - Resultados</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ ...styles.badge(rank.color) }}>Nv. {level}</div>
            <button onClick={()=>{ setWhiteTask(null); setWhiteRoom(true); }} style={{ ...styles.btn(T.purple),padding:"5px 10px" }}>🤍</button>
          </div>
        </div>
        <div style={{ marginTop:8 }}>
          <div style={{ height:3,background:T.border,borderRadius:4,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${xpPct}%`,background:`linear-gradient(90deg,${rank.color}80,${rank.color})`,borderRadius:4,transition:"width 0.5s" }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {tab === "home" && <HomeTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "habits" && <HabitsTab />}
        {tab === "maestria" && <MaestriaTab />}
        {tab === "especiais" && <EspeciaisTab />}
        {tab === "historico" && <HistoricoTab />}
        {tab === "relatorio" && <RelatorioNoturnoTab />}
        {tab === "ranking" && <RankingTab />}
        {tab === "conquistas" && <AchievementsTab />}
        {tab === "perfil" && <ProfileTab />}
      </div>

      {/* Modals */}
      {modal === "newHabit" && <NewHabitModal />}
      {modal === "newTask" && <NewTaskModal />}
      {modal === "importRoutine" && <ImportRoutineModal />}

      {/* Nav */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:`${T.bgCard}f5`,borderTop:`1px solid ${T.border}`,display:"flex",padding:"4px 0 6px",backdropFilter:"blur(10px)",zIndex:20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={styles.navBtn(tab===t.id)}>
            <span style={{ fontSize:17 }}>{t.icon}</span>
            <span style={{ fontSize:8,fontWeight:tab===t.id?700:400,color:tab===t.id?rank.color:T.textMuted }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
