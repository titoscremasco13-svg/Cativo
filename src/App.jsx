import { useState, useEffect, useRef, useCallback } from "react";

//  CONSTANTS 

const RANKS = [
  { name: "CLASSE D", min: 1, max: 25, color: "#6b7280", glow: "#6b728040", label: "Iniciante", bg: "#111827" },
  { name: "CLASSE C", min: 26, max: 50, color: "#10b981", glow: "#10b98140", label: "Crescimento", bg: "#0d1f17" },
  { name: "CLASSE B", min: 51, max: 75, color: "#3b82f6", glow: "#3b82f640", label: "Acima da Media", bg: "#0d1530" },
  { name: "CLASSE A", min: 76, max: 90, color: "#f59e0b", glow: "#f59e0b40", label: "Elite", bg: "#1a1200" },
  { name: "SALA BRANCA", min: 91, max: 99, color: "#ffffff", glow: "#ffffff50", label: "Excelencia Maxima", bg: "#0a0a0a" },
  { name: "GENIO", min: 100, max: 100, color: "#a855f7", glow: "#a855f760", label: "Genio da Sala Branca", bg: "#0f0010" },
];

const CLASS_D_TITLES = [
  "Aluno Classe D", "Estudante Comum", "Novato Disciplinado", "Observador Silencioso",
  "Aprendiz Estrategico", "Mente Analitica", "Planejador Iniciante", "Discipulo da Disciplina",
  "Explorador Curioso", "Candidato Promissor", "Estudante Dedicado", "Buscador do Conhecimento",
  "Aprendiz Consistente", "Iniciado nos Estudos", "Candidato Disciplinado",
  "Estudante Metodico", "Buscador de Progresso", "Aprendiz Focado", "Candidato Resiliente",
  "Discipulo Aplicado", "Estudante Perseverante", "Analista Iniciante", "Estrategista Novato",
  "Aprendiz Determinado", "Estudante Evoluido"
];

const CLASS_C_TITLES = [
  "Estudante Disciplinado", "Aprendiz Avancado", "Praticante Consistente", "Pensador Estrategico",
  "Executor Disciplinado", "Analista Crescente", "Produtivo Emergente", "Mestre do Autocontrole",
  "Estrategista Intermediario", "Estudante de Alta Performance", "Pensador Produtivo",
  "Executor Consistente", "Analista Estrategico", "Disciplinado Avancado", "Produtivo Consistente",
  "Mestre da Rotina", "Estrategista Crescente", "Estudante Elite", "Executor de Alto Nivel",
  "Analista Avancado", "Pensador de Elite", "Produtivo Avancado", "Mestre da Consistencia",
  "Estrategista Avancado", "Disciplinado de Elite"
];

const CLASS_B_TITLES = [
  "Estrategista Avancado", "Inteligencia Superior", "Executor de Alta Performance", "Mestre da Disciplina",
  "Analista de Elite", "Pensador Estrategico Superior", "Produtivo de Alto Nivel", "Mestre do Foco",
  "Estrategista de Elite", "Inteligencia Avancada", "Executor Superior", "Disciplinado Superior",
  "Analista Superior", "Pensador de Alta Performance", "Mestre da Execucao",
  "Estrategista Superior", "Inteligencia Estrategica", "Executor de Elite", "Disciplinado de Alta Performance",
  "Analista de Alta Performance", "Pensador Superior", "Mestre da Inteligencia",
  "Estrategista de Alta Performance", "Inteligencia de Elite", "Executor Mestre"
];

const CLASS_A_TITLES = [
  "Elite da Disciplina", "Mestre Estrategico", "Executivo de Alto Desempenho", "Controle Absoluto",
  "Inteligencia de Elite", "Performance Maxima", "Disciplina Inabalavel", "Estrategista Supremo",
  "Mestre da Consistencia", "Elite da Inteligencia", "Executivo Supremo", "Controle Emocional Avancado",
  "Inteligencia Suprema", "Performance de Elite", "Mestre Absoluto"
];

const SALA_BRANCA_TITLES = [
  "Iniciado da Sala Branca", "Guardiao do Silencio", "Mestre do Foco Absoluto",
  "Senhor da Disciplina", "Arquiteto da Mente", "Mestre do Controle Absoluto",
  "Elite Suprema", "Guardiao da Excelencia", "Senhor da Performance"
];

const ATTRIBUTES = [
  { id: "discipline", name: "Disciplina", icon: "⚔️", color: "#ef4444" },
  { id: "intelligence", name: "Inteligencia", icon: "🧠", color: "#3b82f6" },
  { id: "physical", name: "Condicionamento Fisico", icon: "💪", color: "#10b981" },
  { id: "mental", name: "Controle Mental", icon: "🌀", color: "#8b5cf6" },
  { id: "social", name: "Habilidades Sociais", icon: "🤝", color: "#f59e0b" },
];

const ACHIEVEMENTS = [
  { id: "first_task", name: "Primeira Tarefa", desc: "Complete sua primeira tarefa", icon: "✅", xp: 50, condition: (s) => s.totalTasksDone >= 1 },
  { id: "week_one", name: "Primeira Semana", desc: "Complete 7 dias de uso", icon: "📅", xp: 200, condition: (s) => s.streak >= 7 },
  { id: "streak_7", name: "7 Dias Seguidos", desc: "Mantenha streak de 7 dias", icon: "🔥", xp: 150, condition: (s) => s.streak >= 7 },
  { id: "streak_30", name: "30 Dias Seguidos", desc: "Mantenha streak de 30 dias", icon: "🔥🔥", xp: 500, condition: (s) => s.streak >= 30 },
  { id: "streak_100", name: "100 Dias Seguidos", desc: "Mantenha streak de 100 dias", icon: "", xp: 2000, condition: (s) => s.streak >= 100 },
  { id: "xp_1000", name: "1.000 XP", desc: "Acumule 1.000 XP", icon: "⭐", xp: 100, condition: (s) => s.totalXP >= 1000 },
  { id: "xp_10000", name: "10.000 XP", desc: "Acumule 10.000 XP", icon: "⭐", xp: 500, condition: (s) => s.totalXP >= 10000 },
  { id: "rank_c", name: "Classe C", desc: "Alcance a Classe C", icon: "🥉", xp: 300, condition: (s) => s.level >= 26 },
  { id: "rank_b", name: "Classe B", desc: "Alcance a Classe B", icon: "🥈", xp: 500, condition: (s) => s.level >= 51 },
  { id: "rank_a", name: "Classe A", desc: "Alcance a Classe A", icon: "🥇", xp: 1000, condition: (s) => s.level >= 76 },
  { id: "sala_branca", name: "Sala Branca", desc: "Entre na Sala Branca", icon: "🤍", xp: 2000, condition: (s) => s.level >= 91 },
  { id: "genius", name: "Genio", desc: "Alcance o Nivel 100", icon: "👑", xp: 5000, condition: (s) => s.level >= 100 },
  { id: "tasks_50", name: "50 Tarefas", desc: "Complete 50 tarefas", icon: "📋", xp: 200, condition: (s) => s.totalTasksDone >= 50 },
  { id: "tasks_100", name: "100 Tarefas", desc: "Complete 100 tarefas", icon: "📊", xp: 400, condition: (s) => s.totalTasksDone >= 100 },
  { id: "master_discipline", name: "Mestre da Disciplina", desc: "Disciplina nivel 50", icon: "⚔️", xp: 800, condition: (s) => (s.attributes?.discipline?.level || 0) >= 50 },
  { id: "master_intelligence", name: "Mestre da Inteligencia", desc: "Inteligencia nivel 50", icon: "🧠", xp: 800, condition: (s) => (s.attributes?.intelligence?.level || 0) >= 50 },
  { id: "master_consistency", name: "Mestre da Consistencia", desc: "Streak de 60 dias", icon: "💪", xp: 1200, condition: (s) => s.streak >= 60 },
  { id: "evolution_7", name: "7 Evolucoes", desc: "Registre 7 evolucoes diarias", icon: "📈", xp: 300, condition: (s) => (s.evolutions?.length || 0) >= 7 },
  { id: "goals_10", name: "10 Metas", desc: "Crie 10 metas", icon: "🎯", xp: 200, condition: (s) => (s.goals?.length || 0) >= 10 },
  { id: "vault_10", name: "Cofre Rico", desc: "Adicione 10 itens ao cofre", icon: "📚", xp: 250, condition: (s) => (s.vault?.length || 0) >= 10 },
];

const XP_PER_LEVEL = (level) => Math.floor(100 * Math.pow(1.15, level - 1));

function getLevelFromXP(totalXP) {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= XP_PER_LEVEL(level) && level < 100) {
    remaining -= XP_PER_LEVEL(level);
    level++;
  }
  return { level, xpInLevel: remaining, xpNeeded: XP_PER_LEVEL(level) };
}

function getRank(level) {
  return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0];
}

function getTitle(level) {
  if (level <= 25) return CLASS_D_TITLES[level - 1] || CLASS_D_TITLES[0];
  if (level <= 50) return CLASS_C_TITLES[level - 26] || CLASS_C_TITLES[0];
  if (level <= 75) return CLASS_B_TITLES[level - 51] || CLASS_B_TITLES[0];
  if (level <= 90) return CLASS_A_TITLES[level - 76] || CLASS_A_TITLES[0];
  if (level <= 99) return SALA_BRANCA_TITLES[level - 91] || SALA_BRANCA_TITLES[0];
  return "Genio da Sala Branca";
}

function getAttrLevel(xp) {
  let level = 1;
  let rem = xp;
  while (rem >= 50 * level && level < 100) { rem -= 50 * level; level++; }
  return level;
}

//  HABIT WEEKDAYS 

const WEEKDAYS = [
  { idx: 0, short: "Dom", full: "Domingo" },
  { idx: 1, short: "Seg", full: "Segunda" },
  { idx: 2, short: "Ter", full: "Terca" },
  { idx: 3, short: "Qua", full: "Quarta" },
  { idx: 4, short: "Qui", full: "Quinta" },
  { idx: 5, short: "Sex", full: "Sexta" },
  { idx: 6, short: "Sab", full: "Sabado" },
];

// Returns the array of weekday indices (0=Dom ... 6=Sab) a habit is scheduled for.
// Falls back to the old "freq" field for habits created before this feature existed.
function getHabitDays(h) {
  // Habitos novos tem o campo days definido (mesmo que vazio)
  if (Array.isArray(h.days)) return h.days;
  // Fallback para habitos antigos que usavam o campo freq
  switch (h.freq) {
    case "weekdays": return [1, 2, 3, 4, 5];
    case "weekend": return [0, 6];
    case "daily":
    default: return [0, 1, 2, 3, 4, 5, 6];
  }
}

function formatDaysLabel(days) {
  if (!days || days.length === 0) return "Sem dias";
  if (days.length === 7) return "Todos os dias";
  const sorted = [...days].sort();
  if (sorted.length === 5 && sorted.join(",") === "1,2,3,4,5") return "Dias Uteis";
  if (sorted.length === 2 && sorted.join(",") === "0,6") return "Fim de Semana";
  return sorted.map(d => WEEKDAYS[d].short).join(", ");
}

const FRASES = [
  { frase: "Nao importa o quanto e genial um plano, quando chega a hora de agir, voce deve agir.", autor: "Ayanokoji Kiyotaka" },
  { frase: "O ser humano e uma criatura que nunca pode ser satisfeita. E exatamente por isso que ele pode evoluir.", autor: "Ayanokoji Kiyotaka" },
  { frase: "O fraco nunca pode escolher a paz. A opcao esta sempre nas maos do forte.", autor: "Ayanokoji Kiyotaka" },
  { frase: "Eu nao faco as coisas pela metade. Quando decido agir, vou ate o fim.", autor: "Ayanokoji Kiyotaka" },
  { frase: "A dor e temporaria. Desistir e para sempre.", autor: "Lance Armstrong" },
  { frase: "Disciplina e a ponte entre metas e realizacoes.", autor: "Jim Rohn" },
  { frase: "O sucesso e a soma de pequenos esforcos repetidos dia apos dia.", autor: "Robert Collier" },
  { frase: "Nao conte os dias. Faca os dias contarem.", autor: "Muhammad Ali" },
  { frase: "A unica forma de fazer um excelente trabalho e amar o que voce faz.", autor: "Steve Jobs" },
  { frase: "Primeiro forme habitos, depois os habitos te formam.", autor: "Rob Gilbert" },
  { frase: "Voce nao precisa ser grande para comecar, mas precisa comecar para ser grande.", autor: "Zig Ziglar" },
  { frase: "O segredo do sucesso e a constancia do proposito.", autor: "Benjamin Disraeli" },
  { frase: "Nao espere. O tempo nunca sera exatamente certo.", autor: "Napoleon Hill" },
  { frase: "Acredite que voce pode, e ja esta na metade do caminho.", autor: "Theodore Roosevelt" },
  { frase: "Se voce nao construir seu sonho, alguem vai te contratar para construir o sonho dele.", autor: "Tony Gaskins" },
];

const DESAFIOS = [
  { id: "d1", nome: "Sequencia de 3", desc: "Complete todos os habitos por 3 dias seguidos", xp: 150, meta: 3, tipo: "streak" },
  { id: "d2", nome: "Semana Perfeita", desc: "Complete todos os habitos dos 7 dias desta semana", xp: 300, meta: 7, tipo: "semana" },
  { id: "d3", nome: "Madrugador", desc: "Complete um habito antes das 8h da manha", xp: 100, meta: 1, tipo: "cedo" },
  { id: "d4", nome: "Produtivo", desc: "Complete 5 habitos em um unico dia", xp: 200, meta: 5, tipo: "dia" },
  { id: "d5", nome: "Consistente", desc: "Use o app por 7 dias seguidos", xp: 250, meta: 7, tipo: "uso" },
];

//  INITIAL STATE 

const initialState = () => {
  try {
    const saved = localStorage.getItem("titinfocus_v2");
    if (saved) return JSON.parse(saved);
  } catch {}
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
    desafiosCompletos: [],
    relatorioSemana: null,
  };
};

//  AVATAR COMPONENT 

function Avatar({ level, rank }) {
  const tier = level <= 25 ? 0 : level <= 50 ? 1 : level <= 75 ? 2 : level <= 90 ? 3 : level <= 99 ? 4 : 5;
  const avatarStyles = [
    { robe: "#374151", aura: "none", crown: false, wings: false, particles: false },
    { robe: "#065f46", aura: "#10b98130", crown: false, wings: false, particles: false },
    { robe: "#1e3a8a", aura: "#3b82f630", crown: false, wings: false, particles: true },
    { robe: "#78350f", aura: "#f59e0b40", crown: true, wings: false, particles: true },
    { robe: "#1a1a1a", aura: "#ffffff40", crown: true, wings: true, particles: true },
    { robe: "#2e1065", aura: "#a855f760", crown: true, wings: true, particles: true },
  ];
  const s = avatarStyles[tier];

  return (
    <svg width="120" height="140" viewBox="0 0 120 140" style={{ filter: tier >= 3 ? `drop-shadow(0 0 12px ${rank.color})` : "none" }}>
      {/* Aura */}
      {tier >= 2 && <ellipse cx="60" cy="110" rx="50" ry="20" fill={s.aura} />}
      {/* Wings */}
      {s.wings && <>
        <path d="M20 70 Q0 40 10 20 Q25 50 35 65" fill={rank.color} opacity="0.6" />
        <path d="M100 70 Q120 40 110 20 Q95 50 85 65" fill={rank.color} opacity="0.6" />
      </>}
      {/* Body/Robe */}
      <path d="M35 80 Q30 120 25 135 L95 135 Q90 120 85 80 Q70 95 60 95 Q50 95 35 80Z" fill={s.robe} />
      {/* Head */}
      <circle cx="60" cy="52" r="22" fill="#d4a96a" />
      {/* Eyes */}
      <circle cx="53" cy="50" r="3" fill={tier >= 4 ? rank.color : "#1f2937"} />
      <circle cx="67" cy="50" r="3" fill={tier >= 4 ? rank.color : "#1f2937"} />
      {tier >= 4 && <>
        <circle cx="53" cy="50" r="1.5" fill="#fff" />
        <circle cx="67" cy="50" r="1.5" fill="#fff" />
      </>}
      {/* Scar / mark for higher tiers */}
      {tier >= 3 && <line x1="55" y1="44" x2="58" y2="56" stroke={rank.color} strokeWidth="1.5" opacity="0.8" />}
      {/* Crown */}
      {s.crown && <>
        <rect x="45" y="28" width="30" height="8" rx="2" fill={rank.color} />
        <polygon points="45,28 50,18 55,28" fill={rank.color} />
        <polygon points="57,28 60,16 63,28" fill={rank.color} />
        <polygon points="65,28 70,18 75,28" fill={rank.color} />
      </>}
      {/* Emblem on chest */}
      {tier >= 1 && <circle cx="60" cy="100" r="8" fill="none" stroke={rank.color} strokeWidth="1.5" />}
      {tier >= 2 && <text x="60" y="104" textAnchor="middle" fontSize="8" fill={rank.color}>★</text>}
      {/* Particle effects */}
      {s.particles && [0,1,2,3].map(i => (
        <circle key={i} cx={45 + i * 10} cy={60 + Math.sin(i) * 20} r="2" fill={rank.color} opacity="0.5">
          <animate attributeName="cy" values={`${60 + Math.sin(i) * 20};${50 + Math.sin(i) * 20};${60 + Math.sin(i) * 20}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

//  ATTR BAR 

function AttrBar({ attr, xp, color }) {
  const level = getAttrLevel(xp);
  const pct = Math.min(100, ((xp % (50 * level)) / (50 * level)) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ color: "#d1d5db", fontSize: 12 }}>{attr.icon} {attr.name}</span>
        <span style={{ color, fontSize: 12, fontWeight: 700 }}>Lv.{level}</span>
      </div>
      <div style={{ background: "#1f2937", borderRadius: 6, height: 8, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, width: `${pct}%`, height: "100%", borderRadius: 6, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

//  HEXAGON RADAR 

function RadarChart({ attributes, attrData }) {
  const cx = 90, cy = 90, r = 65;
  const angles = [270, 342, 54, 126, 198];
  const points = ATTRIBUTES.map((a, i) => {
    const lvl = getAttrLevel(attrData[a.id]?.xp || 0);
    const ratio = Math.min(lvl / 100, 1);
    const rad = (angles[i] * Math.PI) / 180;
    return { x: cx + r * ratio * Math.cos(rad), y: cy + r * ratio * Math.sin(rad), color: a.color, name: a.name, icon: a.icon, lvl };
  });
  const polyPts = points.map(p => `${p.x},${p.y}`).join(" ");
  const gridPts = (ratio) => ATTRIBUTES.map((_, i) => {
    const rad = (angles[i] * Math.PI) / 180;
    return `${cx + r * ratio * Math.cos(rad)},${cy + r * ratio * Math.sin(rad)}`;
  }).join(" ");

  return (
    <svg width="180" height="180" style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map(ratio => (
        <polygon key={ratio} points={gridPts(ratio)} fill="none" stroke="#374151" strokeWidth="0.5" />
      ))}
      {ATTRIBUTES.map((_, i) => {
        const rad = (angles[i] * Math.PI) / 180;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)} stroke="#374151" strokeWidth="0.5" />;
      })}
      <polygon points={polyPts} fill="#3b82f620" stroke="#3b82f6" strokeWidth="1.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={p.color} />
          <text x={cx + (r + 16) * Math.cos((angles[i] * Math.PI) / 180)} y={cy + (r + 16) * Math.sin((angles[i] * Math.PI) / 180)}
            textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#9ca3af">{p.icon}</text>
        </g>
      ))}
    </svg>
  );
}

//  MAIN APP 

export default function TitinFocusApp() {
  const [state, setState] = useState(initialState);
  const [tab, setTab] = useState("profile");
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
  const title = getTitle(level);
  const xpPct = Math.min(100, (xpInLevel / xpNeeded) * 100);

  useEffect(() => {
    try { localStorage.setItem("titinfocus_v2", JSON.stringify({ ...state })); } catch {}
  }, [state]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = state.lastActiveDate === yesterday.toDateString();
      const newStreak = wasYesterday ? state.streak + 1 : (state.lastActiveDate ? 0 : 1);

      // Penalidade: habitos/tarefas marcados para o ultimo dia ativo e nao cumpridos
      // fazem o usuario perder metade do XP que valiam.
      let xpPenalty = 0;
      let habits = state.habits || [];
      let tasks = state.tasks || [];
      const checkDate = state.lastActiveDate;
      if (checkDate) {
        const checkWeekday = new Date(checkDate).getDay();
        habits = habits.map(h => {
          const scheduled = getHabitDays(h).includes(checkWeekday);
          const done = (h.doneDates || []).includes(checkDate);
          const alreadyPenalized = (h.penalizedDates || []).includes(checkDate);
          if (scheduled && !done && !alreadyPenalized) {
            const penalty = Math.floor((h.xp || 20) / 2);
            xpPenalty += penalty;
            return { ...h, penalizedDates: [...(h.penalizedDates || []), checkDate] };
          }
          return h;
        });
        tasks = tasks.map(t => {
          const taskDate = t.date || checkDate;
          if (taskDate === checkDate && !t.done && !t.penalized) {
            const penalty = Math.floor((t.xp || 30) / 2);
            xpPenalty += penalty;
            return { ...t, penalized: true };
          }
          return t;
        });
      }

      setState(s => ({ ...s, lastActiveDate: today, streak: newStreak, habits, tasks, totalXP: Math.max(0, s.totalXP - xpPenalty) }));
      if (xpPenalty > 0) showToast(`⚠️ -${xpPenalty} XP por compromissos nao cumpridos ontem`);
    }
  }, []);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  useEffect(() => {
    const unlocked = [...(state.achievements || [])];
    let changed = false;
    ACHIEVEMENTS.forEach(a => {
      if (!unlocked.includes(a.id) && a.condition(state)) {
        unlocked.push(a.id);
        changed = true;
        setNewAchievement(a);
        showToast(`🏆 Conquista: ${a.name}!`);
      }
    });
    if (changed) setState(s => ({ ...s, achievements: unlocked }));
  }, [state.totalXP, state.streak, state.totalTasksDone, state.evolutions?.length, state.goals?.length, state.vault?.length]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function addXP(amount, attrId = null) {
    setState(s => {
      const newTotal = s.totalXP + amount;
      const newAttrs = { ...s.attributes };
      if (attrId && newAttrs[attrId]) {
        newAttrs[attrId] = { ...newAttrs[attrId], xp: (newAttrs[attrId].xp || 0) + Math.floor(amount * 0.3) };
      }
      return { ...s, totalXP: newTotal, attributes: newAttrs };
    });
    showToast(`+${amount} XP ganhos!`);
  }

  function completeTask(taskId) {
    setState(s => {
      const tasks = s.tasks.map(t => t.id === taskId ? { ...t, done: true, doneAt: Date.now() } : t);
      const task = s.tasks.find(t => t.id === taskId);
      if (!task || task.done) return s;
      const xpGain = task.xp || 30;
      const newAttrs = { ...s.attributes };
      if (task.attr && newAttrs[task.attr]) {
        newAttrs[task.attr] = { xp: (newAttrs[task.attr].xp || 0) + Math.floor(xpGain * 0.3) };
      }
      return { ...s, tasks, totalXP: s.totalXP + xpGain, totalTasksDone: s.totalTasksDone + 1, attributes: newAttrs };
    });
    showToast("✅ Tarefa concluida! XP ganho!");
  }

  function deleteTask(taskId) {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== taskId) }));
  }

  const fmtTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const todayTasks = state.tasks.filter(t => {
    if (!t.date) return true;
    return t.date === new Date().toDateString();
  });
  const doneTodayCount = todayTasks.filter(t => t.done).length;

  const attrLevels = ATTRIBUTES.map(a => ({ ...a, level: getAttrLevel(state.attributes[a.id]?.xp || 0) }));
  const bestAttr = [...attrLevels].sort((a, b) => b.level - a.level)[0];
  const worstAttr = [...attrLevels].sort((a, b) => a.level - b.level)[0];

  const C = {
    bg: "#0a0c10",
    card: "#111827",
    cardBorder: "#1f2937",
    text: "#f9fafb",
    muted: "#6b7280",
    accent: rank.color,
  };

  const styles = {
    app: { background: C.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: C.text, maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 },
    card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 16, marginBottom: 12 },
    btn: (col = C.accent) => ({ background: `${col}20`, border: `1px solid ${col}`, color: col, borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }),
    btnSolid: (col = C.accent) => ({ background: col, border: "none", color: "#000", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700 }),
    input: { background: "#1f2937", border: "1px solid #374151", borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 14, width: "100%", boxSizing: "border-box" },
    label: { color: C.muted, fontSize: 12, marginBottom: 4, display: "block" },
    navBtn: (active) => ({ flex: 1, padding: "10px 4px", background: active ? `${C.accent}20` : "transparent", border: `1px solid ${active ? C.accent : "transparent"}`, borderRadius: 10, color: active ? C.accent : C.muted, cursor: "pointer", fontSize: 10, fontWeight: active ? 700 : 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }),
  };

  if (whiteRoom) {
    const task = whiteTask ? state.tasks.find(t => t.id === whiteTask) : null;
    return (
      <div style={{ ...styles.app, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #ffffff08 0%, transparent 70%)" }} />
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ color: "#ffffff30", fontSize: 12, letterSpacing: 8, marginBottom: 40 }}>MODO SALA BRANCA</div>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 32 }}>🤍</div>
          {task ? (
            <>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{task.name}</div>
              <div style={{ color: "#ffffff60", fontSize: 14, marginBottom: 40 }}>{task.description || "Foco total. Elimine as distracoes."}</div>
            </>
          ) : (
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 40 }}>Foco Total</div>
          )}
          <div style={{ fontSize: 56, fontWeight: 200, letterSpacing: 4, color: "#fff", marginBottom: 40, fontVariantNumeric: "tabular-nums" }}>{fmtTime(timer)}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={styles.btn("#fff")} onClick={() => setTimerRunning(r => !r)}>
              {timerRunning ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button style={styles.btn("#6b7280")} onClick={() => { setTimer(0); setTimerRunning(false); }}>↺ Reset</button>
            {task && <button style={styles.btnSolid("#10b981")} onClick={() => { completeTask(whiteTask); setWhiteRoom(false); setTimer(0); setTimerRunning(false); }}>✓ Concluir</button>}
            <button style={styles.btn("#ef4444")} onClick={() => { setWhiteRoom(false); setTimer(0); setTimerRunning(false); }}>✕ Sair</button>
          </div>
        </div>
      </div>
    );
  }

  const ModalWrapper = ({ children, title: t }) => (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setModal(null)}>
      <div style={{ ...styles.card, width: "100%", maxWidth: 480, borderRadius: "20px 20px 0 0", padding: 24, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{t}</span>
          <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );

  function NewTaskModal() {
    const [form, setForm] = useState({ name: "", description: "", startTime: "", endTime: "", attr: "discipline", xp: 30, date: "" });
    const dur = form.startTime && form.endTime ? (() => {
      const [sh, sm] = form.startTime.split(":").map(Number);
      const [eh, em] = form.endTime.split(":").map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm);
      return mins > 0 ? `${Math.floor(mins / 60)}h ${mins % 60}min` : "—";
    })() : null;
    const save = () => {
      if (!form.name.trim()) return;
      setState(s => ({ ...s, tasks: [...s.tasks, { ...form, id: Date.now(), done: false, date: form.date || new Date().toDateString() }] }));
      setModal(null);
      showToast("Tarefa criada!");
    };
    return (
      <ModalWrapper title="Nova Tarefa">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Nome da Tarefa</label><input style={styles.input} placeholder="Ex: Estudar matematica" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descricao (opcional)</label><input style={styles.input} placeholder="Detalhes..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Inicio</label><input type="time" style={styles.input} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
            <div><label style={styles.label}>Termino</label><input type="time" style={styles.input} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
          </div>
          {dur && <div style={{ background: "#1f2937", borderRadius: 8, padding: "8px 12px", color: "#10b981", fontSize: 13 }}>⏱ Duracao: {dur}</div>}
          <div><label style={styles.label}>Data</label><input type="date" style={styles.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div><label style={styles.label}>Atributo</label>
            <select style={styles.input} value={form.attr} onChange={e => setForm(f => ({ ...f, attr: e.target.value }))}>
              {ATTRIBUTES.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>XP de Recompensa</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={15}>15 XP (Facil)</option>
              <option value={30}>30 XP (Normal)</option>
              <option value={60}>60 XP (Dificil)</option>
              <option value={100}>100 XP (Epico)</option>
            </select>
          </div>
          <button style={{ ...styles.btnSolid(C.accent), width: "100%", marginTop: 8 }} onClick={save}>Criar Tarefa</button>
        </div>
      </ModalWrapper>
    );
  }

  function NewGoalModal() {
    const [form, setForm] = useState({ name: "", description: "", type: "daily", deadline: "", category: "disciplina", xp: 100 });
    const save = () => {
      if (!form.name.trim()) return;
      setState(s => ({ ...s, goals: [...(s.goals || []), { ...form, id: Date.now(), done: false, createdAt: Date.now() }] }));
      setModal(null); showToast("Meta criada!");
    };
    return (
      <ModalWrapper title="Nova Meta">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Nome da Meta</label><input style={styles.input} placeholder="Ex: Estudar 2h por dia" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descricao</label><textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Tipo</label>
              <select style={styles.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="daily">Diaria</option><option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option><option value="yearly">Anual</option>
              </select>
            </div>
            <div><label style={styles.label}>Categoria</label>
              <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="disciplina">Disciplina</option><option value="estudo">Estudo</option>
                <option value="saude">Saude</option><option value="social">Social</option><option value="mental">Mental</option>
              </select>
            </div>
          </div>
          <div><label style={styles.label}>Data Limite</label><input type="date" style={styles.input} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></div>
          <div><label style={styles.label}>XP de Recompensa</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={50}>50 XP</option><option value={100}>100 XP</option>
              <option value={200}>200 XP</option><option value={500}>500 XP</option><option value={1000}>1000 XP</option>
            </select>
          </div>
          <button style={{ ...styles.btnSolid(C.accent), width: "100%", marginTop: 8 }} onClick={save}>Criar Meta</button>
        </div>
      </ModalWrapper>
    );
  }

  function EvolutionModal() {
    const [form, setForm] = useState({ learned: "", improved: "", achieved: "", tomorrow: "" });
    const save = () => {
      const entry = { ...form, date: new Date().toDateString(), timestamp: Date.now() };
      setState(s => ({ ...s, evolutions: [...(s.evolutions || []), entry], totalXP: s.totalXP + 80 }));
      setModal(null); showToast("+80 XP — Evolucao registrada!");
    };
    return (
      <ModalWrapper title="🌱 Evolucao de Hoje">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "learned", label: "O que aprendi hoje?", icon: "📖" },
            { key: "improved", label: "O que melhorei hoje?", icon: "📈" },
            { key: "achieved", label: "O que conquistei hoje?", icon: "🏆" },
            { key: "tomorrow", label: "O que melhorar amanha?", icon: "🎯" },
          ].map(({ key, label, icon }) => (
            <div key={key}>
              <label style={styles.label}>{icon} {label}</label>
              <textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Escreva aqui..." />
            </div>
          ))}
          <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: 10, color: "#10b981", fontSize: 12 }}>+80 XP ao salvar sua evolucao diaria</div>
          <button style={{ ...styles.btnSolid("#10b981"), width: "100%", marginTop: 4 }} onClick={save}>Salvar Evolucao</button>
        </div>
      </ModalWrapper>
    );
  }

  function VaultModal() {
    const [form, setForm] = useState({ title: "", content: "", category: "resumo" });
    const save = () => {
      if (!form.title.trim()) return;
      setState(s => ({ ...s, vault: [...(s.vault || []), { ...form, id: Date.now(), date: new Date().toDateString() }] }));
      setModal(null); showToast("Salvo no Cofre!");
    };
    const categories = ["resumo", "estrategia", "reflexao", "aprendizado", "ideia"];
    return (
      <ModalWrapper title="📚 Cofre de Conhecimento">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Titulo</label><input style={styles.input} placeholder="Ex: Tecnica Pomodoro" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><label style={styles.label}>Categoria</label>
            <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>Conteudo</label><textarea style={{ ...styles.input, minHeight: 120, resize: "vertical" }} placeholder="Escreva seu conhecimento aqui..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Salvar no Cofre</button>
        </div>
      </ModalWrapper>
    );
  }

  function SettingsModal() {
    const [name, setName] = useState(state.username);
    return (
      <ModalWrapper title=" Configuracoes">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Seu Nome</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} /></div>
          <button style={styles.btnSolid(C.accent)} onClick={() => { setState(s => ({ ...s, username: name })); setModal(null); }}>Salvar</button>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 12, marginTop: 4 }}>
            <button style={styles.btn("#ef4444")} onClick={() => { if (confirm("Resetar tudo? Esta acao e irreversivel.")) { localStorage.removeItem("titinfocus_v2"); window.location.reload(); } }}>
              🗑 Resetar Progresso
            </button>
          </div>
          <div style={{ background: "#1f2937", borderRadius: 10, padding: 12 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Exportar Dados</div>
            <button style={styles.btn("#6b7280")} onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "titinfocus_backup.json"; a.click();
            }}>⬇ Exportar JSON</button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  function ProfileTab() {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ ...styles.card, background: `linear-gradient(135deg, ${rank.bg}, ${C.card})`, border: `1px solid ${rank.color}40`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 20%, ${rank.glow}, transparent 60%)` }} />
          <div style={{ position: "relative", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ flexShrink: 0 }}>
              <Avatar level={level} rank={rank} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: rank.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 2 }}>{rank.name} — {rank.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{state.username}</div>
              <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8 }}>{title}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40`, color: rank.color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>Nv. {level}</span>
                <span style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", color: "#f59e0b", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>🔥 {state.streak} dias</span>
                <span style={{ background: "#10b98120", border: "1px solid #10b98140", color: "#10b981", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>✅ {state.totalTasksDone}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                  <span>XP: {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()}</span>
                  <span>Total: {state.totalXP.toLocaleString()}</span>
                </div>
                <div style={{ background: "#1f2937", borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`, width: `${xpPct}%`, height: "100%", borderRadius: 8, transition: "width 0.8s ease", boxShadow: `0 0 8px ${rank.color}80` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Missao", value: todayTasks.length > 0 ? `${doneTodayCount}/${todayTasks.length} tarefas` : "Sem missoes hoje", icon: "🎯" },
            { label: "Melhor Atributo", value: bestAttr.name, icon: bestAttr.icon },
            { label: "A Melhorar", value: worstAttr.name, icon: "⚠️" },
            { label: "Conquistas", value: `${state.achievements?.length || 0}/${ACHIEVEMENTS.length}`, icon: "🏆" },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.card, margin: 0, padding: 12 }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{s.icon} {s.label}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 8, letterSpacing: 2 }}>MAPA DE ATRIBUTOS</div>
          <RadarChart attrData={state.attributes} />
        </div>

        <div style={styles.card}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>ATRIBUTOS</div>
          {ATTRIBUTES.map(a => <AttrBar key={a.id} attr={a} xp={state.attributes[a.id]?.xp || 0} color={a.color} />)}
        </div>

        {/* Frase do dia */}
        {(() => {
          const diaIdx = new Date().getDate() % FRASES.length;
          return (
            <div style={{ ...styles.card, background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #a855f730", marginBottom: 12 }}>
              <div style={{ color: "#a855f7", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>FRASE DO DIA</div>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontStyle: "italic", lineHeight: 1.5 }}>"{FRASES[diaIdx].frase}"</div>
              <div style={{ color: "#a855f7", fontSize: 11, marginTop: 6, textAlign: "right" }}>— {FRASES[diaIdx].autor}</div>
            </div>
          );
        })()}

        {/* Desafios ativos */}
        <div style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>DESAFIOS ATIVOS</div>
          {DESAFIOS.slice(0, 3).map(d => {
            const completo = (state.desafiosCompletos || []).includes(d.id);
            return (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: completo ? 0.5 : 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: completo ? "#10b98120" : "#f59e0b20", border: "1px solid " + (completo ? "#10b98140" : "#f59e0b40"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{completo ? "V" : "!"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{d.nome}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{d.desc}</div>
                </div>
                <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>+{d.xp} XP</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{ ...styles.btn("#10b981"), width: "100%" }} onClick={() => setModal("evolution")}>Evolucao de Hoje</button>
          <button style={{ ...styles.btn("#8b5cf6"), width: "100%" }} onClick={() => { setWhiteTask(null); setWhiteRoom(true); }}>Sala Branca</button>
        </div>
      </div>
    );
  }

  function TasksTab() {
    const [filter, setFilter] = useState("today");
    const [rankMode, setRankMode] = useState(false);
    const [taskPriority, setTaskPriority] = useState(state.taskPriority || []);

    const saveTaskPriority = (val) => { setTaskPriority(val); setState(s => ({ ...s, taskPriority: val })); };

    const filtered = state.tasks.filter(t => {
      if (filter === "today") return t.date === new Date().toDateString() || !t.date;
      if (filter === "pending") return !t.done;
      if (filter === "done") return t.done;
      return true;
    }).sort((a, b) => {
      // Sort by priority first
      const pa = taskPriority.indexOf(a.id);
      const pb = taskPriority.indexOf(b.id);
      if (pa !== -1 && pb !== -1) return pa - pb;
      if (pa !== -1) return -1;
      if (pb !== -1) return 1;
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      return 0;
    });

    const conflicts = [];
    for (let i = 0; i < filtered.length - 1; i++) {
      const a = filtered[i], b = filtered[i + 1];
      if (a.endTime && b.startTime && a.endTime > b.startTime && !a.done && !b.done) {
        conflicts.push(b.id);
      }
    }

    const copyToTomorrow = () => {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toDateString();
      const todayT = state.tasks.filter(t => t.date === new Date().toDateString() || !t.date);
      const copies = todayT.map(t => ({ ...t, id: Date.now() + Math.random(), done: false, date: tomorrowStr }));
      setState(s => ({ ...s, tasks: [...s.tasks, ...copies] }));
      showToast(`${copies.length} tarefas copiadas para amanha!`);
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Tarefas</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn(rankMode ? "#f59e0b" : "#6b7280")} onClick={() => setRankMode(!rankMode)}>🏅 Ranking</button>
            <button style={styles.btn("#6b7280")} onClick={copyToTomorrow}>📋 Copiar</button>
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newTask")}>+ Nova</button>
          </div>
        </div>

        {rankMode && (
          <div style={{ ...styles.card, background: "#1a1200", border: "1px solid #f59e0b30", marginBottom: 12 }}>
            <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>RANKING DE PRIORIDADE</div>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>Toque para definir ordem (1 = mais urgente):</div>
            {filtered.filter(t => !t.done).map((t) => {
              const pos = taskPriority.indexOf(t.id);
              return (
                <div key={t.id} onClick={() => {
                  const newOrder = taskPriority.includes(t.id)
                    ? taskPriority.filter(id => id !== t.id)
                    : [...taskPriority, t.id];
                  saveTaskPriority(newOrder);
                }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: pos >= 0 ? "#f59e0b15" : "#0f1117", borderRadius: 8, marginBottom: 4, border: "1px solid " + (pos >= 0 ? "#f59e0b40" : "#2d3148"), cursor: "pointer" }}>
                  <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 14, width: 20 }}>{pos >= 0 ? pos + 1 : "-"}</span>
                  <span style={{ fontSize: 13, flex: 1 }}>{t.name}</span>
                  {pos >= 0 && <span style={{ color: "#f59e0b", fontSize: 10 }}>✓</span>}
                </div>
              );
            })}
            <button onClick={() => { saveTaskPriority([]); }} style={{ background: "#ef444420", border: "none", borderRadius: 6, padding: "6px 10px", color: "#ef4444", fontSize: 11, cursor: "pointer", marginTop: 4 }}>Limpar ranking</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[["today", "Hoje"], ["all", "Todas"], ["pending", "Pendentes"], ["done", "Feitas"]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ ...styles.btn(filter === v ? C.accent : "#6b7280"), padding: "6px 10px", fontSize: 11 }}>{l}</button>
          ))}
        </div>

        <div style={{ ...styles.card, background: "#0a0a0a", border: "1px solid #ffffff20", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#ffffff80", fontSize: 13 }}>🤍 Modo Sala Branca</span>
            <button style={styles.btn("#fff")} onClick={() => { setWhiteTask(null); setWhiteRoom(true); }}>Entrar</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 40 }}></div>
            <div style={{ marginTop: 8 }}>Nenhuma tarefa aqui.</div>
            <button style={{ ...styles.btnSolid(C.accent), marginTop: 16 }} onClick={() => setModal("newTask")}>Criar Tarefa</button>
          </div>
        ) : filtered.map(task => {
          const attr = ATTRIBUTES.find(a => a.id === task.attr);
          const hasConflict = conflicts.includes(task.id);
          const dur = task.startTime && task.endTime ? (() => {
            const [sh, sm] = task.startTime.split(":").map(Number);
            const [eh, em] = task.endTime.split(":").map(Number);
            const m = (eh * 60 + em) - (sh * 60 + sm);
            return m > 0 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}` : null;
          })() : null;

          return (
            <div key={task.id} style={{ ...styles.card, margin: "0 0 8px", border: `1px solid ${task.done ? "#10b98140" : hasConflict ? "#ef444440" : C.cardBorder}`, opacity: task.done ? 0.7 : 1 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <button onClick={() => !task.done && completeTask(task.id)} style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 6, border: `2px solid ${task.done ? "#10b981" : C.muted}`, background: task.done ? "#10b981" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                  {task.done && <span style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>✓</span>}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, textDecoration: task.done ? "line-through" : "none", color: task.done ? C.muted : C.text }}>{task.name}</span>
                    {hasConflict && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ Conflito</span>}
                  </div>
                  {task.description && <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>{task.description}</div>}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {task.startTime && <span style={{ color: C.muted, fontSize: 11 }}> {task.startTime}{task.endTime ? `  ${task.endTime}` : ""}</span>}
                    {dur && <span style={{ color: "#3b82f6", fontSize: 11 }}>⏱ {dur}</span>}
                    {attr && <span style={{ fontSize: 11, color: attr.color }}>{attr.icon} {attr.name}</span>}
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>+{task.xp || 30} XP</span>
                    {!task.done && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ -{Math.floor((task.xp || 30) / 2)} XP se nao cumprir</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {!task.done && <button style={{ background: "#ffffff10", border: "none", color: "#fff", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }} onClick={() => { setWhiteTask(task.id); setWhiteRoom(true); }}>🤍</button>}
                  <button style={{ background: "#ef444420", border: "none", color: "#ef4444", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 }} onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function EspeciaisTab() {
    const especiais = state.especiais || [];
    const setEspeciais = (val) => setState(s => ({ ...s, especiais: typeof val === "function" ? val(s.especiais || []) : val }));
    const [showNew, setShowNew] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ nome: "", descricao: "", unidade: "", metaFinal: "", dificuldade: 5 });
    const [novaEvolucao, setNovaEvolucao] = useState({ valor: "", nota: "", dificuldade: 5 });

    const saveNew = () => {
      if (!form.nome.trim()) return;
      const nova = { id: Date.now(), nome: form.nome, descricao: form.descricao, unidade: form.unidade || "unidades", metaFinal: Number(form.metaFinal) || 0, dificuldade: form.dificuldade, evolucoes: [], criadaEm: new Date().toISOString().slice(0,10) };
      setEspeciais([...especiais, nova]);
      setForm({ nome: "", descricao: "", unidade: "", metaFinal: "", dificuldade: 5 });
      setShowNew(false);
    };

    const addEvolucao = (id) => {
      if (!novaEvolucao.valor) return;
      setEspeciais(especiais.map(e => e.id === id ? { ...e, evolucoes: [...e.evolucoes, { data: new Date().toISOString().slice(0,10), valor: Number(novaEvolucao.valor), nota: novaEvolucao.nota, dificuldade: novaEvolucao.dificuldade }] } : e));
      setNovaEvolucao({ valor: "", nota: "", dificuldade: 5 });
      setSelected(null);
    };

    const tarefa = especiais.find(e => e.id === selected);

    return (
      <div style={{ padding: 16, paddingBottom: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>🌟 Tarefas Especiais</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Acompanhe sua evolucao detalhada</div>
          </div>
          <button onClick={() => setShowNew(true)} style={{ background: "#a855f7", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Nova</button>
        </div>

        {especiais.length === 0 && !showNew && (
          <div style={{ textAlign: "center", color: C.muted, padding: 60 }}>
            <div style={{ fontSize: 44 }}>🌟</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhuma tarefa especial</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie uma para acompanhar sua evolucao detalhada</div>
          </div>
        )}

        {especiais.map(e => {
          const ultima = e.evolucoes[e.evolucoes.length - 1];
          const primeira = e.evolucoes[0];
          const pct = e.metaFinal > 0 && ultima ? Math.min(100, (ultima.valor / e.metaFinal) * 100) : 0;
          return (
            <div key={e.id} style={{ ...styles.card, marginBottom: 10, border: "1px solid #a855f730" }} onClick={() => setSelected(e.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{e.nome}</div>
                  {e.descricao && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{e.descricao}</div>}
                </div>
                <span style={{ color: "#a855f7", fontSize: 11 }}>{e.evolucoes.length} registros</span>
              </div>
              {ultima && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                    <span>Atual: <b style={{ color: C.text }}>{ultima.valor} {e.unidade}</b></span>
                    {e.metaFinal > 0 && <span>Meta: <b style={{ color: "#a855f7" }}>{e.metaFinal} {e.unidade}</b></span>}
                  </div>
                  {e.metaFinal > 0 && (
                    <div style={{ height: 6, background: "#1f2937", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: pct + "%", background: pct >= 100 ? "#10b981" : "#a855f7", borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  )}
                </div>
              )}
              {e.evolucoes.length >= 2 && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, overflowX: "auto" }}>
                  {e.evolucoes.slice(-7).map((ev, i) => (
                    <div key={i} style={{ textAlign: "center", minWidth: 40 }}>
                      <div style={{ fontSize: 10, color: "#a855f7", fontWeight: 700 }}>{ev.valor}</div>
                      <div style={{ fontSize: 9, color: C.muted }}>{ev.data.slice(5)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {showNew && (
          <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "#1a1d2e", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, margin: "0 auto" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Nova Tarefa Especial</div>
              <input value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} placeholder="Nome da tarefa (ex: Corrida)" style={{ width: "100%", background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
              <input value={form.descricao} onChange={e => setForm(f => ({...f, descricao: e.target.value}))} placeholder="Descricao (opcional)" style={{ width: "100%", background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={form.unidade} onChange={e => setForm(f => ({...f, unidade: e.target.value}))} placeholder="Unidade (metros, kg, min...)" style={{ flex: 1, background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14 }} />
                <input value={form.metaFinal} onChange={e => setForm(f => ({...f, metaFinal: e.target.value}))} placeholder="Meta final" type="number" style={{ flex: 1, background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Dificuldade inicial: {form.dificuldade}/10</div>
                <input type="range" min="1" max="10" value={form.dificuldade} onChange={e => setForm(f => ({...f, dificuldade: Number(e.target.value)}))} style={{ width: "100%" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowNew(false)} style={{ flex: 1, background: "#374151", border: "none", borderRadius: 8, padding: 12, color: C.text, cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
                <button onClick={saveNew} style={{ flex: 1, background: "#a855f7", border: "none", borderRadius: 8, padding: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Criar</button>
              </div>
            </div>
          </div>
        )}

        {selected && tarefa && (
          <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "#1a1d2e", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{tarefa.nome}</div>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Registrar evolucao de hoje</div>
              <input value={novaEvolucao.valor} onChange={e => setNovaEvolucao(n => ({...n, valor: e.target.value}))} placeholder={"Valor de hoje em " + tarefa.unidade} type="number" style={{ width: "100%", background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
              <input value={novaEvolucao.nota} onChange={e => setNovaEvolucao(n => ({...n, nota: e.target.value}))} placeholder="Observacao (ex: pouco esforco, dor no joelho...)" style={{ width: "100%", background: "#0f1117", border: "1px solid #374151", borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Dificuldade hoje: {novaEvolucao.dificuldade}/10</div>
                <input type="range" min="1" max="10" value={novaEvolucao.dificuldade} onChange={e => setNovaEvolucao(n => ({...n, dificuldade: Number(e.target.value)}))} style={{ width: "100%" }} />
              </div>
              {tarefa.evolucoes.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Historico</div>
                  {tarefa.evolucoes.map((ev, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1f2937", fontSize: 12 }}>
                      <span style={{ color: C.muted }}>{ev.data}</span>
                      <span style={{ color: "#a855f7", fontWeight: 700 }}>{ev.valor} {tarefa.unidade}</span>
                      <span style={{ color: C.muted }}>Dif: {ev.dificuldade}/10</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSelected(null)} style={{ flex: 1, background: "#374151", border: "none", borderRadius: 8, padding: 12, color: C.text, cursor: "pointer", fontWeight: 600 }}>Fechar</button>
                <button onClick={() => addEvolucao(selected)} style={{ flex: 1, background: "#a855f7", border: "none", borderRadius: 8, padding: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Registrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function GoalsTab() {
    const goalTypes = { daily: "Diaria", weekly: "Semanal", monthly: "Mensal", yearly: "Anual" };
    const typeColors = { daily: "#3b82f6", weekly: "#10b981", monthly: "#f59e0b", yearly: "#a855f7" };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Metas</span>
          <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newGoal")}>+ Nova Meta</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
          {Object.entries(goalTypes).map(([type, label]) => {
            const count = (state.goals || []).filter(g => g.type === type).length;
            const done = (state.goals || []).filter(g => g.type === type && g.done).length;
            return (
              <div key={type} style={{ ...styles.card, margin: 0, padding: 10, textAlign: "center" }}>
                <div style={{ color: typeColors[type], fontSize: 16, marginBottom: 4 }}>
                  {type === "daily" ? "📅" : type === "weekly" ? "" : type === "monthly" ? "" : ""}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{done}/{count}</div>
                <div style={{ fontSize: 9, color: C.muted }}>{label}</div>
              </div>
            );
          })}
        </div>

        {(state.goals || []).length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 40 }}>🎯</div>
            <div style={{ marginTop: 8 }}>Nenhuma meta criada ainda.</div>
            <button style={{ ...styles.btnSolid(C.accent), marginTop: 16 }} onClick={() => setModal("newGoal")}>Criar Meta</button>
          </div>
        ) : (state.goals || []).map(goal => {
          const col = typeColors[goal.type] || C.accent;
          const deadline = goal.deadline ? new Date(goal.deadline) : null;
          const overdue = deadline && !goal.done && deadline < new Date();
          return (
            <div key={goal.id} style={{ ...styles.card, border: `1px solid ${goal.done ? "#10b98140" : overdue ? "#ef444440" : col + "40"}`, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ background: `${col}20`, color: col, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{goalTypes[goal.type]}</span>
                    {overdue && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ Vencida</span>}
                    {goal.done && <span style={{ color: "#10b981", fontSize: 10 }}>✅ Concluida</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, textDecoration: goal.done ? "line-through" : "none", color: goal.done ? C.muted : C.text }}>{goal.name}</div>
                  {goal.description && <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{goal.description}</div>}
                  <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 11 }}>
                    {deadline && <span style={{ color: C.muted }}>📅 {deadline.toLocaleDateString("pt-BR")}</span>}
                    <span style={{ color: "#f59e0b" }}>+{goal.xp} XP</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                  {!goal.done && (
                    <button style={{ ...styles.btnSolid("#10b981"), padding: "6px 10px", fontSize: 11 }} onClick={() => {
                      setState(s => ({ ...s, goals: s.goals.map(g => g.id === goal.id ? { ...g, done: true } : g), totalXP: s.totalXP + goal.xp }));
                      showToast(`+${goal.xp} XP — Meta concluida!`);
                    }}>✓</button>
                  )}
                  <button style={{ background: "#ef444420", border: "none", color: "#ef4444", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11 }} onClick={() => setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== goal.id) }))}>✕</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function AnalyticsTab() {
    const totalDone = state.totalTasksDone;
    const totalGoalsDone = (state.goals || []).filter(g => g.done).length;
    const unlockedAch = state.achievements?.length || 0;
    const vaultSize = state.vault?.length || 0;
    const evCount = state.evolutions?.length || 0;

    const attrRanked = ATTRIBUTES.map(a => ({ ...a, level: getAttrLevel(state.attributes[a.id]?.xp || 0), xp: state.attributes[a.id]?.xp || 0 })).sort((a, b) => b.level - a.level);

    const StatCard = ({ icon, label, value, color = C.accent }) => (
      <div style={{ ...styles.card, margin: 0, padding: 14, textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
      </div>
    );

    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Analise & Progresso</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          <StatCard icon="⚡" label="Total XP" value={state.totalXP.toLocaleString()} color={rank.color} />
          <StatCard icon="🔥" label="Streak" value={state.streak} color="#f59e0b" />
          <StatCard icon="✅" label="Tarefas" value={totalDone} color="#10b981" />
          <StatCard icon="🎯" label="Metas" value={totalGoalsDone} color="#3b82f6" />
          <StatCard icon="🏆" label="Conquistas" value={unlockedAch} color="#a855f7" />
          <StatCard icon="📚" label="No Cofre" value={vaultSize} color="#f59e0b" />
        </div>

        <div style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, letterSpacing: 2 }}>PROGRESSO — NIVEL {level}  {level + 1}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
            <span>{xpInLevel.toLocaleString()} XP</span>
            <span>{xpNeeded.toLocaleString()} XP necessarios</span>
          </div>
          <div style={{ background: "#1f2937", borderRadius: 8, height: 14, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`, width: `${xpPct}%`, height: "100%", borderRadius: 8 }} />
          </div>
          <div style={{ color: C.muted, fontSize: 11 }}>{Math.round(xpPct)}% completo</div>
        </div>

        <div style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>RANKING DE ATRIBUTOS</div>
          {attrRanked.map((a, i) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : C.muted, fontWeight: 700, fontSize: 14, width: 20 }}>#{i + 1}</span>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12 }}>{a.name}</span>
                  <span style={{ color: a.color, fontSize: 12, fontWeight: 700 }}>Lv.{a.level}</span>
                </div>
                <div style={{ background: "#1f2937", borderRadius: 4, height: 5 }}>
                  <div style={{ background: a.color, width: `${Math.min(a.level, 100)}%`, height: "100%", borderRadius: 4 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {evCount > 0 && (
          <div style={styles.card}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>ULTIMAS EVOLUCOES</div>
            {[...(state.evolutions || [])].reverse().slice(0, 3).map((ev, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 12, marginBottom: 12 }}>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>📅 {ev.date}</div>
                {ev.learned && <div style={{ fontSize: 12, marginBottom: 2 }}><span style={{ color: "#3b82f6" }}>📖</span> {ev.learned}</div>}
                {ev.achieved && <div style={{ fontSize: 12 }}><span style={{ color: "#10b981" }}>🏆</span> {ev.achieved}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Grafico de habitos da semana */}
        {(() => {
          const habits = state.habits || [];
          const dias = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().slice(0, 10);
            const weekday = d.getDay();
            const habitusDoDia = habits.filter(h => getHabitDays(h).includes(weekday));
            const feitos = habitusDoDia.filter(h => (h.doneDates || []).includes(dateStr)).length;
            const total = habitusDoDia.length;
            const pct = total > 0 ? (feitos / total) * 100 : 0;
            return { dia: ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"][weekday], feitos, total, pct, hoje: i === 6 };
          });
          const maxVal = Math.max(...dias.map(d => d.total), 1);
          return (
            <div style={{ ...styles.card, marginBottom: 12 }}>
              <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, letterSpacing: 2 }}>HABITOS — ULTIMOS 7 DIAS</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {dias.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 9, color: d.pct === 100 ? "#10b981" : C.muted }}>{d.feitos}/{d.total}</div>
                    <div style={{ width: "100%", height: 60, background: "#1f2937", borderRadius: 4, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: d.total > 0 ? (d.pct * 0.6) + "%" : "0%", background: d.pct === 100 ? "#10b981" : d.hoje ? rank.color : "#3b82f6", borderRadius: 4, transition: "height 0.5s ease", minHeight: d.feitos > 0 ? 4 : 0 }} />
                    </div>
                    <div style={{ fontSize: 9, color: d.hoje ? rank.color : C.muted, fontWeight: d.hoje ? 700 : 400 }}>{d.dia}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div style={styles.card}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, letterSpacing: 2 }}>TREINAR ATRIBUTOS MANUALMENTE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {ATTRIBUTES.map(a => (
              <button key={a.id} style={{ ...styles.btn(a.color), padding: "8px 10px", fontSize: 12 }} onClick={() => {
                setState(s => ({ ...s, attributes: { ...s.attributes, [a.id]: { xp: (s.attributes[a.id]?.xp || 0) + 25 } }, totalXP: s.totalXP + 10 }));
                showToast(`+25 XP em ${a.name}!`);
              }}>{a.icon} +25 XP</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function HistoricoTab() {
    const habits = state.habits || [];
    const [viewMode, setViewMode] = useState("semanas"); // semanas | meses
    const [selectedWeek, setSelectedWeek] = useState(0); // 0 = esta semana, 1 = semana passada...

    // Generate last 8 weeks of data
    const getWeekData = (weeksAgo) => {
      const end = new Date();
      end.setDate(end.getDate() - (weeksAgo * 7));
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toDateString();
        const dayIdx = d.getDay();
        const dayHabits = habits.filter(h => {
          const hdays = h.days || [0,1,2,3,4,5,6];
          return hdays.includes(dayIdx);
        });
        const done = dayHabits.filter(h => (h.doneDates || []).includes(dateStr));
        days.push({ date: d, dateStr, dayHabits, done, pct: dayHabits.length > 0 ? (done.length / dayHabits.length) * 100 : 0 });
      }

      const totalDone = days.reduce((sum, d) => sum + d.done.length, 0);
      const totalPossible = days.reduce((sum, d) => sum + d.dayHabits.length, 0);
      const perfectDays = days.filter(d => d.dayHabits.length > 0 && d.pct === 100).length;
      const skippedDays = days.filter(d => d.dayHabits.length > 0 && d.pct === 0).length;

      // Habit frequency this week
      const habitFreq = {};
      days.forEach(d => {
        d.done.forEach(h => {
          habitFreq[h.name] = (habitFreq[h.name] || 0) + 1;
        });
      });
      const sortedHabits = Object.entries(habitFreq).sort((a, b) => b[1] - a[1]);

      // Skipped habits
      const skippedHabits = {};
      days.forEach(d => {
        d.dayHabits.filter(h => !(h.doneDates || []).includes(d.dateStr)).forEach(h => {
          skippedHabits[h.name] = (skippedHabits[h.name] || 0) + 1;
        });
      });
      const sortedSkipped = Object.entries(skippedHabits).sort((a, b) => b[1] - a[1]);

      const xpEstimado = totalDone * 20;
      const label = weeksAgo === 0 ? "Esta semana" : weeksAgo === 1 ? "Semana passada" : `${weeksAgo} semanas atras`;

      return { days, totalDone, totalPossible, perfectDays, skippedDays, sortedHabits, sortedSkipped, xpEstimado, label, start, end };
    };

    const weeks = Array.from({ length: 8 }, (_, i) => getWeekData(i));
    const currentWeek = weeks[selectedWeek];

    // Month comparison
    const getMonthData = (monthsAgo) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() - monthsAgo;
      const d = new Date(year, month, 1);
      const monthName = d.toLocaleString("pt-BR", { month: "long", year: "numeric" });
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let totalDone = 0, totalPossible = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toDateString();
        const dayIdx = date.getDay();
        const dayHabits = habits.filter(h => {
          const hdays = h.days || [0,1,2,3,4,5,6];
          return hdays.includes(dayIdx);
        });
        totalPossible += dayHabits.length;
        totalDone += dayHabits.filter(h => (h.doneDates || []).includes(dateStr)).length;
      }
      const pct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
      return { monthName, totalDone, totalPossible, pct, xp: totalDone * 20 };
    };

    const months = Array.from({ length: 6 }, (_, i) => getMonthData(i));

    return (
      <div style={{ padding: 16, paddingBottom: 100 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>📅 Historico</div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Sua evolucao detalhada por semana e mes</div>

        {/* Toggle semanas/meses */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <button onClick={() => setViewMode("semanas")} style={{ ...styles.btn(viewMode === "semanas" ? C.accent : "#374151"), flex: 1 }}>Por Semana</button>
          <button onClick={() => setViewMode("meses")} style={{ ...styles.btn(viewMode === "meses" ? C.accent : "#374151"), flex: 1 }}>Por Mes</button>
        </div>

        {viewMode === "semanas" && (
          <>
            {/* Week selector */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, overflowX: "auto" }}>
              {weeks.map((w, i) => (
                <button key={i} onClick={() => setSelectedWeek(i)} style={{ flexShrink: 0, padding: "6px 10px", borderRadius: 8, border: "none", background: selectedWeek === i ? C.accent : "#1f2937", color: selectedWeek === i ? "#000" : C.muted, fontWeight: 700, fontSize: 10, cursor: "pointer" }}>
                  {i === 0 ? "Esta" : i === 1 ? "Ant." : `${i}s`}
                </button>
              ))}
            </div>

            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{currentWeek.label}</div>

            {/* Daily bars */}
            <div style={{ ...styles.card, marginBottom: 12 }}>
              <div style={{ color: C.muted, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>HABITOS POR DIA</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 70 }}>
                {currentWeek.days.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <div style={{ fontSize: 9, color: d.pct === 100 ? "#10b981" : C.muted }}>{d.done.length}/{d.dayHabits.length}</div>
                    <div style={{ width: "100%", height: 50, background: "#1f2937", borderRadius: 4, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: Math.max(d.pct * 0.5, d.done.length > 0 ? 4 : 0) + "%", background: d.pct === 100 ? "#10b981" : d.pct > 50 ? "#f59e0b" : "#3b82f6", borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 9, color: C.muted }}>{"DSTQQSS"[d.date.getDay()]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ ...styles.card, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{currentWeek.totalDone}</div>
                <div style={{ fontSize: 10, color: C.muted }}>habitos feitos</div>
              </div>
              <div style={{ ...styles.card, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{currentWeek.xpEstimado}</div>
                <div style={{ fontSize: 10, color: C.muted }}>XP ganho</div>
              </div>
              <div style={{ ...styles.card, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#a855f7" }}>{currentWeek.perfectDays}</div>
                <div style={{ fontSize: 10, color: C.muted }}>dias perfeitos</div>
              </div>
              <div style={{ ...styles.card, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>{currentWeek.skippedDays}</div>
                <div style={{ fontSize: 10, color: C.muted }}>dias pulados</div>
              </div>
            </div>

            {/* Most done habits */}
            {currentWeek.sortedHabits.length > 0 && (
              <div style={{ ...styles.card, marginBottom: 12 }}>
                <div style={{ color: "#10b981", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>HABITOS MAIS FEITOS</div>
                {currentWeek.sortedHabits.slice(0, 5).map(([name, count], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 4 ? "1px solid #1f2937" : "none" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "#10b981", fontWeight: 800, fontSize: 12 }}>{i + 1}.</span>
                      <span style={{ fontSize: 12 }}>{name}</span>
                    </div>
                    <span style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>{count}x</span>
                  </div>
                ))}
              </div>
            )}

            {/* Most skipped habits */}
            {currentWeek.sortedSkipped.length > 0 && (
              <div style={{ ...styles.card, marginBottom: 12 }}>
                <div style={{ color: "#ef4444", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>HABITOS MAIS PULADOS</div>
                {currentWeek.sortedSkipped.slice(0, 5).map(([name, count], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 4 ? "1px solid #1f2937" : "none" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: "#ef4444", fontWeight: 800, fontSize: 12 }}>{i + 1}.</span>
                      <span style={{ fontSize: 12 }}>{name}</span>
                    </div>
                    <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 700 }}>{count}x pulado</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === "meses" && (
          <>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Comparacao dos ultimos 6 meses</div>
            {/* Month bars */}
            <div style={{ ...styles.card, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                {months.reverse().map((m, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 9, color: C.muted }}>{m.pct}%</div>
                    <div style={{ width: "100%", height: 70, background: "#1f2937", borderRadius: 4, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: Math.max(m.pct * 0.7, m.totalDone > 0 ? 4 : 0) + "%", background: m.pct >= 80 ? "#10b981" : m.pct >= 50 ? "#f59e0b" : "#3b82f6", borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 8, color: C.muted, textAlign: "center" }}>{m.monthName.slice(0, 3)}</div>
                  </div>
                ))}
              </div>
            </div>

            {months.map((m, i) => (
              <div key={i} style={{ ...styles.card, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, textTransform: "capitalize" }}>{m.monthName}</div>
                  <span style={{ color: m.pct >= 80 ? "#10b981" : m.pct >= 50 ? "#f59e0b" : "#ef4444", fontWeight: 700, fontSize: 13 }}>{m.pct}%</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: C.muted }}>
                  <span>✅ {m.totalDone} feitos</span>
                  <span>⭐ {m.xp} XP</span>
                  <span>📊 {m.totalPossible} total</span>
                </div>
                <div style={{ height: 4, background: "#1f2937", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: m.pct + "%", background: m.pct >= 80 ? "#10b981" : m.pct >= 50 ? "#f59e0b" : "#3b82f6", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  function AchievementsTab() {
    const unlocked = state.achievements || [];
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Conquistas</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>{unlocked.length} / {ACHIEVEMENTS.length} desbloqueadas</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <div key={a.id} style={{ ...styles.card, margin: 0, padding: 14, border: `1px solid ${isUnlocked ? "#f59e0b40" : C.cardBorder}`, opacity: isUnlocked ? 1 : 0.5, position: "relative", overflow: "hidden" }}>
                {isUnlocked && <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "24px solid transparent", borderTop: "24px solid #f59e0b" }} />}
                <div style={{ fontSize: 28, marginBottom: 6 }}>{isUnlocked ? a.icon : ""}</div>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3, color: isUnlocked ? C.text : C.muted }}>{a.name}</div>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>{a.desc}</div>
                <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700 }}>+{a.xp} XP</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function VaultTab() {
    const catColors = { resumo: "#3b82f6", "estrategia": "#ef4444", "reflexao": "#8b5cf6", aprendizado: "#10b981", ideia: "#f59e0b" };
    const [filter, setFilter] = useState("todos");
    const filtered = filter === "todos" ? (state.vault || []) : (state.vault || []).filter(v => v.category === filter);
    const [expanded, setExpanded] = useState(null);

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>📚 Cofre</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{state.vault?.length || 0} itens salvos</div>
          </div>
          <button style={styles.btnSolid(C.accent)} onClick={() => setModal("vault")}>+ Novo</button>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
          {["todos", "resumo", "estrategia", "reflexao", "aprendizado", "ideia"].map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ ...styles.btn(filter === c ? (catColors[c] || C.accent) : "#6b7280"), padding: "5px 12px", fontSize: 11, flexShrink: 0 }}>{c}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 40 }}>📖</div>
            <div style={{ marginTop: 8 }}>Nenhum conhecimento salvo aqui.</div>
          </div>
        ) : filtered.map(item => {
          const col = catColors[item.category] || C.accent;
          return (
            <div key={item.id} style={{ ...styles.card, marginBottom: 8, border: `1px solid ${col}30`, cursor: "pointer" }} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ background: `${col}20`, color: col, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{item.category}</span>
                    <span style={{ color: C.muted, fontSize: 10 }}>{item.date}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                  {expanded === item.id && <div style={{ color: C.muted, fontSize: 13, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{item.content}</div>}
                </div>
                <span style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>{expanded === item.id ? "" : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function HabitsTab() {
    const habits = state.habits || [];
    const today = new Date().toDateString();
    const todayIdx = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(todayIdx);
    const isViewingToday = selectedDay === todayIdx;

    // Setup notifications
    useEffect(() => {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
      // Daily reminder at 8h and 20h
      const now = new Date();
      const scheduleNotif = (hour, msg) => {
        const next = new Date();
        next.setHours(hour, 0, 0, 0);
        if (next <= now) next.setDate(next.getDate() + 1);
        const delay = next - now;
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("TitinFocus", { body: msg, icon: "/icon-192.png" });
          }
        }, delay);
      };
      scheduleNotif(8, "Bom dia! Seus habitos de hoje estao esperando. Nao desista!");
      scheduleNotif(20, "Ainda tem habitos pendentes hoje. Voce consegue!");
    }, []);

    function toggleHabitToday(habitId) {
      setState(s => {
        const habits = (s.habits || []).map(h => {
          if (h.id !== habitId) return h;
          const doneToday = (h.doneDates || []).includes(today);
          const doneDates = doneToday
            ? h.doneDates.filter(d => d !== today)
            : [...(h.doneDates || []), today];
          const streak = calcHabitStreak(doneDates);
          return { ...h, doneDates, streak };
        });
        const habit = habits.find(h => h.id === habitId);
        const wasAdding = !(s.habits || []).find(h => h.id === habitId)?.doneDates?.includes(today);
        return { ...s, habits, totalXP: wasAdding ? s.totalXP + (habit?.xp || 20) : s.totalXP };
      });
    }

    function calcHabitStreak(doneDates) {
      let streak = 0;
      const d = new Date();
      while (true) {
        const ds = d.toDateString();
        if (doneDates.includes(ds)) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      return streak;
    }

    function deleteHabit(id) {
      setState(s => ({ ...s, habits: (s.habits || []).filter(h => h.id !== id) }));
    }

    const [copyModal, setCopyModal] = useState(false);

    function copyHabitsToDay(targetDay) {
      setState(s => {
        const habits = (s.habits || []).map(h => {
          const days = getHabitDays(h);
          if (days.includes(selectedDay) && !days.includes(targetDay)) {
            return { ...h, days: [...days, targetDay].sort() };
          }
          return h;
        });
        return { ...s, habits };
      });
      setCopyModal(false);
      showToast(`Habitos de ${WEEKDAYS[selectedDay].full} copiados para ${WEEKDAYS[targetDay].full}!`);
    }

    const sorted = [...habits].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    const todayHabits = sorted.filter(h => getHabitDays(h).includes(todayIdx));
    const dayHabits = sorted.filter(h => getHabitDays(h).includes(selectedDay));

    const [showPriority, setShowPriority] = useState(false);
    const [extras, setExtras] = useState(state.habitExtras || []);
    const [newExtra, setNewExtra] = useState("");
    const [editingPriority, setEditingPriority] = useState(false);
    const [priorityOrder, setPriorityOrder] = useState(state.habitPriority || []);

    const saveExtras = (val) => { setExtras(val); setState(s => ({ ...s, habitExtras: val })); };
    const savePriority = (val) => { setPriorityOrder(val); setState(s => ({ ...s, habitPriority: val })); };

    // Top 5 habitos do dia por prioridade
    const top5Dia = (() => {
      const diaHabits = dayHabits.filter(h => !((h.doneDates || []).includes(today)));
      const ordered = priorityOrder.map(id => diaHabits.find(h => h.id === id)).filter(Boolean);
      const rest = diaHabits.filter(h => !priorityOrder.includes(h.id));
      return [...ordered, ...rest].slice(0, 5);
    })();

    return (
      <div style={{ padding: 16 }}>
        {/* Botao lateral de prioridades */}
        <div style={{ position: "fixed", right: 0, top: "40%", zIndex: 30 }}>
          <button onClick={() => setShowPriority(true)} style={{ background: "#f59e0b", border: "none", borderRadius: "8px 0 0 8px", padding: "12px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: "-2px 0 10px #f59e0b40" }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ color: "#000", fontSize: 9, fontWeight: 700, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>PRIORIDADES</span>
          </button>
        </div>

        {/* Painel lateral de prioridades */}
        {showPriority && (
          <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100 }} onClick={() => setShowPriority(false)}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 300, background: "#1a1d2e", borderLeft: "1px solid #2d3148", overflowY: "auto", padding: 16 }} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>⭐ Prioridades</div>
              <div style={{ color: C.muted, fontSize: 11, marginBottom: 16 }}>Habitos mais importantes para hoje</div>

              {/* Top 5 do dia */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>TOP 5 DO DIA</div>
                {top5Dia.length === 0 && <div style={{ color: C.muted, fontSize: 12 }}>Todos os habitos de hoje ja foram concluidos!</div>}
                {top5Dia.map((h, i) => (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#0f1117", borderRadius: 8, marginBottom: 6, border: "1px solid #2d3148" }}>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13, width: 16 }}>{i + 1}.</span>
                    <span style={{ fontSize: 13 }}>{h.icon || "🔁"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{h.name}</div>
                      {h.startTime && <div style={{ fontSize: 10, color: C.muted }}>{h.startTime}{h.endTime ? " - " + h.endTime : ""}</div>}
                    </div>
                    <button onClick={() => toggleHabitToday(h.id)} style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: 6, padding: "4px 8px", color: "#f59e0b", fontSize: 10, cursor: "pointer" }}>✓</button>
                  </div>
                ))}
                {!editingPriority && dayHabits.length > 1 && (
                  <button onClick={() => setEditingPriority(true)} style={{ background: "none", border: "1px solid #374151", borderRadius: 6, padding: "6px 10px", color: C.muted, fontSize: 11, cursor: "pointer", width: "100%", marginTop: 4 }}>Definir ordem de prioridade</button>
                )}
                {editingPriority && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>Toque para definir ordem (1 = mais importante):</div>
                    {dayHabits.map((h, i) => {
                      const pos = priorityOrder.indexOf(h.id);
                      return (
                        <div key={h.id} onClick={() => {
                          const newOrder = priorityOrder.includes(h.id)
                            ? priorityOrder.filter(id => id !== h.id)
                            : [...priorityOrder, h.id];
                          savePriority(newOrder);
                        }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: pos >= 0 ? "#f59e0b15" : "#0f1117", borderRadius: 8, marginBottom: 4, border: "1px solid " + (pos >= 0 ? "#f59e0b40" : "#2d3148"), cursor: "pointer" }}>
                          <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 12, width: 16 }}>{pos >= 0 ? pos + 1 : "-"}</span>
                          <span style={{ fontSize: 12 }}>{h.name}</span>
                        </div>
                      );
                    })}
                    <button onClick={() => setEditingPriority(false)} style={{ background: "#f59e0b", border: "none", borderRadius: 6, padding: "8px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 6 }}>Salvar ordem</button>
                  </div>
                )}
              </div>

              {/* Top 5 extras */}
              <div>
                <div style={{ color: "#10b981", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>TOP 5 EXTRAS</div>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>Para quando sobra tempo</div>
                {extras.slice(0, 5).map((e, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#0f1117", borderRadius: 8, marginBottom: 6, border: "1px solid #2d3148" }}>
                    <span style={{ color: "#10b981", fontWeight: 800, fontSize: 13, width: 16 }}>{i + 1}.</span>
                    <span style={{ flex: 1, fontSize: 12 }}>{e}</span>
                    <button onClick={() => saveExtras(extras.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                ))}
                {extras.length < 5 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <input value={newExtra} onChange={e => setNewExtra(e.target.value)} placeholder="Adicionar habito extra..." style={{ flex: 1, background: "#0f1117", border: "1px solid #374151", borderRadius: 6, padding: "8px 10px", color: C.text, fontSize: 12 }} />
                    <button onClick={() => { if (newExtra.trim()) { saveExtras([...extras, newExtra.trim()]); setNewExtra(""); } }} style={{ background: "#10b981", border: "none", borderRadius: 6, padding: "8px 10px", color: "#000", fontWeight: 700, cursor: "pointer" }}>+</button>
                  </div>
                )}
              </div>

              <button onClick={() => setShowPriority(false)} style={{ width: "100%", background: "#374151", border: "none", borderRadius: 8, padding: 12, color: C.text, cursor: "pointer", fontWeight: 600, marginTop: 20 }}>Fechar</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>🔁 Habitos</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{todayHabits.filter(h => (h.doneDates || []).includes(today)).length}/{todayHabits.length} concluidos hoje</div>

          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {dayHabits.length > 0 && <button style={styles.btn("#6b7280")} onClick={() => setCopyModal(true)}>📋 Copiar</button>}
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newHabit")}>+ Novo</button>
          </div>
        </div>

        {/* Banner de habitos prioritarios */}
        {isViewingToday && top5Dia.length > 0 && (
          <div style={{ background: "linear-gradient(135deg, #1a1200, #0f1117)", border: "1px solid #f59e0b40", borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>HABITOS PRIORITARIOS DE HOJE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {top5Dia.slice(0, 3).map((h, i) => (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 12, width: 14 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12 }}>{h.icon || "🔁"} {h.name}</span>
                  {h.startTime && <span style={{ color: C.muted, fontSize: 10, marginLeft: "auto" }}>{h.startTime}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {copyModal && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setCopyModal(false)}>
            <div style={{ ...styles.card, width: 300, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📋 Copiar habitos</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Copiar habitos de {WEEKDAYS[selectedDay].full} para:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {WEEKDAYS.filter(w => w.idx !== selectedDay).map(w => (
                  <button key={w.idx} onClick={() => copyHabitsToDay(w.idx)} style={{ ...styles.btn(C.accent), textAlign: "left", padding: "10px 14px" }}>
                    {w.full}
                  </button>
                ))}
              </div>
              <button onClick={() => setCopyModal(false)} style={{ ...styles.btn("#6b7280"), width: "100%", marginTop: 12 }}>Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {WEEKDAYS.map(w => {
            const isSel = selectedDay === w.idx;
            const isToday = w.idx === todayIdx;
            return (
              <button
                key={w.idx}
                onClick={() => setSelectedDay(w.idx)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  border: isToday ? `1px solid ${C.accent}` : "1px solid transparent",
                  background: isSel ? C.accent : "#1f2937",
                  color: isSel ? "#000" : C.muted,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {w.short}
              </button>
            );
          })}
        </div>

        {dayHabits.filter(h => h.startTime).length > 0 && (
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>LINHA DO TEMPO — {isViewingToday ? "HOJE" : WEEKDAYS[selectedDay].full.toUpperCase()}</div>
            <div style={{ position: "relative", height: 36, background: "#1f2937", borderRadius: 8, overflow: "hidden" }}>
              {dayHabits.filter(h => h.startTime && h.endTime).map(h => {
                const toMin = t => { const [hh, mm] = t.split(":").map(Number); return hh * 60 + mm; };
                const dayStart = 5 * 60, dayEnd = 24 * 60;
                const s = Math.max(toMin(h.startTime), dayStart);
                const e = Math.min(toMin(h.endTime), dayEnd);
                const left = ((s - dayStart) / (dayEnd - dayStart)) * 100;
                const width = ((e - s) / (dayEnd - dayStart)) * 100;
                const done = (h.doneDates || []).includes(today);
                const attr = ATTRIBUTES.find(a => a.id === h.attr);
                return (
                  <div key={h.id} title={`${h.name} ${h.startTime}–${h.endTime}`} style={{ position: "absolute", left: `${left}%`, width: `${Math.max(width, 2)}%`, top: 4, height: 28, background: done ? (attr?.color || C.accent) : `${attr?.color || C.accent}40`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "default", border: `1px solid ${attr?.color || C.accent}60` }}>
                    <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 3px" }}>{h.icon || "🔁"}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["05:00","08:00","12:00","16:00","20:00","00:00"].map(t => <span key={t} style={{ color: C.muted, fontSize: 9 }}>{t}</span>)}
            </div>
          </div>
        )}

        {habits.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 44 }}>🔁</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum habito criado ainda.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie habitos com horario para construir sua rotina.</div>
            <button style={{ ...styles.btnSolid(C.accent), marginTop: 20 }} onClick={() => setModal("newHabit")}>Criar Habito</button>
          </div>
        ) : dayHabits.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 44 }}>📅</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum habito em {WEEKDAYS[selectedDay].full}.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie um habito e marque esse dia, ou escolha outro dia acima.</div>
          </div>
        ) : dayHabits.map(habit => {
          const doneToday = (habit.doneDates || []).includes(today);
          const attr = ATTRIBUTES.find(a => a.id === habit.attr);
          const dur = habit.startTime && habit.endTime ? (() => {
            const [sh, sm] = habit.startTime.split(":").map(Number);
            const [eh, em] = habit.endTime.split(":").map(Number);
            const m = (eh * 60 + em) - (sh * 60 + sm);
            return m > 0 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}` : null;
          })() : null;
          const streak = habit.streak || 0;
          const col = attr?.color || C.accent;
          const canCheck = isViewingToday;

          return (
            <div key={habit.id} style={{ ...styles.card, marginBottom: 6, padding: "8px 10px", border: `1px solid ${doneToday ? col + "50" : C.cardBorder}`, borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => canCheck && toggleHabitToday(habit.id)} disabled={!canCheck} style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: `2px solid ${doneToday ? col : C.muted}`, background: doneToday ? col : "transparent", cursor: canCheck ? "pointer" : "not-allowed", opacity: canCheck ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                  {doneToday ? "✓" : (habit.icon || "🔁")}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: doneToday ? col : C.text }}>{habit.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#f59e0b", fontSize: 10 }}>+{habit.xp || 20} XP</span>
                      {streak > 0 && <span style={{ color: "#f59e0b", fontSize: 10 }}>🔥{streak}</span>}
                      <button onClick={() => deleteHabit(habit.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12, padding: "0 2px", flexShrink: 0 }}>✕</button>
                    </div>
                  </div>
                  {habit.startTime && <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{habit.startTime}{habit.endTime ? `  ${habit.endTime}` : ""}{dur ? ` - ${dur}` : ""}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function NewHabitModal() {
    const [form, setForm] = useState({ name: "", description: "", icon: "🔁", startTime: "", endTime: "", days: [], attr: "discipline", xp: 20 });
    const icons = ["🔁","📖","💪","🧘","🏃","✍️","🥗","💧","🛌","🧠","⚔️","🎯","🎨","🎵","💻"];
    const dur = form.startTime && form.endTime ? (() => {
      const [sh, sm] = form.startTime.split(":").map(Number);
      const [eh, em] = form.endTime.split(":").map(Number);
      const m = (eh * 60 + em) - (sh * 60 + sm);
      return m > 0 ? `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}min` : ""}` : null;
    })() : null;

    const toggleDay = (idx) => {
      setForm(f => ({
        ...f,
        days: f.days.includes(idx) ? f.days.filter(d => d !== idx) : [...f.days, idx].sort(),
      }));
    };

    const save = () => {
      if (!form.name.trim()) return;
      if (form.days.length === 0) { showToast("Escolha pelo menos um dia da semana"); return; }
      setState(s => ({ ...s, habits: [...(s.habits || []), { ...form, id: Date.now(), doneDates: [], streak: 0, penalizedDates: [] }] }));
      setModal(null); showToast("Habito criado!");
    };

    return (
      <ModalWrapper title="🔁 Novo Habito">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Icone</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {icons.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? C.accent : "#374151"}`, background: form.icon === ic ? `${C.accent}20` : "#1f2937", cursor: "pointer", fontSize: 18 }}>{ic}</button>
              ))}
            </div>
          </div>

          <div><label style={styles.label}>Nome do Habito</label><input style={styles.input} placeholder="Ex: Leitura diaria" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descricao (opcional)</label><input style={styles.input} placeholder="Detalhes do habito..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>

          <div>
            <label style={styles.label}> Horario</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Inicio</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Fim</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            {dur && (
              <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "8px 12px", marginTop: 8, color: C.accent, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                ⏱ Duracao: {dur}
              </div>
            )}
          </div>

          <div>
            <label style={styles.label}>📅 Dias da Semana</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <button onClick={() => setForm(f => ({ ...f, days: [0,1,2,3,4,5,6] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Todos</button>
              <button onClick={() => setForm(f => ({ ...f, days: [1,2,3,4,5] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Dias Uteis</button>
              <button onClick={() => setForm(f => ({ ...f, days: [0,6] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Fim de Semana</button>
              <button onClick={() => setForm(f => ({ ...f, days: [] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Limpar</button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {WEEKDAYS.map(w => {
                const sel = form.days.includes(w.idx);
                return (
                  <button key={w.idx} onClick={() => toggleDay(w.idx)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${sel ? C.accent : "#374151"}`, background: sel ? `${C.accent}30` : "#1f2937", color: sel ? C.accent : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                    {w.short}
                  </button>
                );
              })}
            </div>
          </div>

          <div><label style={styles.label}>Atributo</label>
            <select style={styles.input} value={form.attr} onChange={e => setForm(f => ({ ...f, attr: e.target.value }))}>
              {ATTRIBUTES.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>

          <div><label style={styles.label}>XP por conclusao</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={10}>10 XP (Leve)</option>
              <option value={20}>20 XP (Normal)</option>
              <option value={40}>40 XP (Intenso)</option>
              <option value={60}>60 XP (Epico)</option>
            </select>
          </div>

          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Criar Habito</button>
        </div>
      </ModalWrapper>
    );
  }

  const tabs = [
    { id: "profile", icon: "⚔️", label: "Perfil" },
    { id: "tasks", icon: "📋", label: "Tarefas" },
    { id: "habits", icon: "🔁", label: "Habitos" },
    { id: "especiais", icon: "🌟", label: "Especiais" },
    { id: "goals", icon: "🎯", label: "Metas" },
    { id: "analytics", icon: "📊", label: "Analise" },
    { id: "historico", icon: "📅", label: "Historico" },
    { id: "achievements", icon: "🏆", label: "Conquistas" },
    { id: "vault", icon: "📚", label: "Cofre" },
  ];

  return (
    <div style={styles.app}>
      <div style={{ background: `linear-gradient(180deg, ${rank.bg}cc, transparent)`, padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAtlUlEQVR4nO19d3hVRd7/Z+a0e27NvTeNdEISegRCE5GAiCLFhsGCZVd38V0VfffVteyqMbvqrrruytpWdC2gqGBFRJpAQDqhBQiQkN6Tm5vbzz1tfn8EEF37lt++z+vneeY592TOmfnO53ynfWe+EwIAGzdutHd0dAwTRZEQQnhN03YSQoZaLBZXLBbb43K5kkRRlDiOE9vb26P9+vWTJk6cWPXmm2+epeu6mJqamqWqakdNTU1bLBYz7rvvvlrGGCGEMHw/EACMMSbpuj6F53kOAHRdN3ie30gIiZ965num+31BiouLuXA4TOx2O5s8eXKuKIpJkydPtvv9/nM2bChXUlISn77nnntCPAAMGDDAmDx5cicAEgwG+erqatbU1OQSRVHUdd1NKSUcx4maptkJIXbDMNimTZsoY4wahsETQgTTNAVCiABAAwBCyA8R/BQxGs/zO9FHFnieZ6fSxb+ePABg5eXl+qmbK6+8spcxZpkwYUJ3dXVtYuX+SmX48OEqTgpIAFgSExPnEUIG67q+x+/3vwtA/TcI+p8GAgCFhYXWYDB4o67rQwRBqKirq3sJAJxO59WEsME8zx+VZdv7zc3NCgAgJyfngVGjRrF58+axwsJClpOTM58xRhcsWCAxxghjjJSWllLGGD11BYDS0lJaWlpKly1bxp38O2GM/SDV+yr8s9P7NhQXF/MAkJOT8+CIESPYjTfeyIYOHcry8vKuGDJkSMmgQYPYhRdeyIYOHcry8/PvB05qYH5+/iBK6aMWiyU3Eokc1nX9vvr6+sZT5fh3FeA/ABQAy8rKGuxwOB5JTk7ObW9vPxyJRO60Wq3QNO1Jm802NBqN1hJCfl1dXX30ywn82772/xJ8FR9fyRE9GQCA+7qH/g+BAqAnO8JTfJCTv0/Hf9WL/9eJ+zK+swb+iB/xI37Ej/gRP+Lfjf+0Lvnr5GFnxP1fmhl9JQhQSgFGgBLu8/CV49L/ePwbNLD0NDMlOEKWY7nxdU+mpMB2zaRtZqX/Q1GzKUQSE2hIAi9yCJ7Yvd2q+Vi8o2NdpI/wM9I5ZXA4bX9kBKUPEZSVMfyLNfZfQSABgBIso0NQwspAzDMjKYDxYsnAuEXWw4IxVJeRHdcj6RZh9Iw4S0lU1PePSS6vIdjlbe4067r2QFzS3QmV8QMH1bgwopRySiWUTats/ceFjFgt7ZFjKsrLldMZvPCCgJtv1k7fM0YwdznF8hLzpGj/VEL/WQRyxSgmm7DJoOAZw+fKMV6emR7UnOkU4FwkqSBOwlcTwo7KHL/mKKsTwBtg1CKI0iTZUFh3e/AvFSnT5kU7VLuB8jIlxfWb/oZdGtzd8uAq78CXHMTebu+uuL/Te/GNVj1gcIHJOcHkhowbeSrmI16/NsYFRSMUY1R0RYzaqiOh3R/4TgtDOeCB9TzKppgAzK8ox/fGP0ogx8BMCsrYGR/Wg/z0odIj0xTTuJ4jbJzKdtUz0r3YCUetypxnpfB5K86KNe8tQ5kOACXOa/OORyoz/MaBA8RVzBoC9QqQowPlel7eAgk91VKXEaN5VofaGucntvX4NwAnLcZF84Wk3EKvnJ4/BKHaeLhueb2loMiuca4cSRS9Sg/tr+qJ1apq3aEsn9tnoiMEpaZJy8hcgm9oUr4LfiiBlIGxM4g714Zx0zMcIydaWEaBTU9zqYbZENCbP2inG7aFjM1bAfR8VTpAKQDgMlfbiJAabF8fe6sdfdXs9BfxYoJDlk1nc2xHi12cOERFXFfV3cfz8qZLvoCryN/19ravK13O4yuz493aNEM1bhXddnd4/+YXet979AMAVUCf0ZaQufQfJfK7ggCllHzO+2w3zttyseuv7OHcLnZ1xk42wvH4WxnczAsBSKceGmq5ILOvM0mxLchbmHH/6KU3AqAlQ0rEz5MeInrk8el2FCVKBbf1F866fyhcZyXI3qvSgGJeTJyZL3tK0uWMknRr4gVFkmtq7hckyyiRUVzK45TpqWi+gDO6dlmW0/u9cGxj4YY4m/j2PjbkjudXAjkXAgChAJYt+5IZ77tZwr+PBlKAmJQwmAzjrZj0yPmOK8+7xn0DYsSGD3o3GnXR97ce1J4uBoBSMPq24zJ3p94qSzGjpw0VUQAozr7BMqrfTPLnHXNjQAnXD7VSGyqUBMuUzF7FDABdOpc+egyhKNCD+5ZJ4khPpsvVXB9oGqMbqgZvvyCETi0lkpSpZaTGDLuj3VVVGWgMNAKBWBio6OtAkort6GrRwKpVPLSJQ9kUHUBa2iW3XdB/zjV3JA0aOEJpbUPDmtUbqp6/62EAGwlHwYwHKFDW1z5mF1vQcEYH9Q8QyBEQY1QREyoqUl4sFK68/s7s35BMLhmfdO7C5vDa2kPaiwtHZzcuQvQWvrzruWi2VJylMU2yCMzvjgz3V2CRDhRzSeiyGOASBBB/Bw5GizBLjqFWD8NjI+BY3EJdklIbsKEh2oGBkt0+89owT5rF3ic/XYqN9AHh9dxWrd3sSFFhyR0vK72+/t5I77pGLRhHW0hFiighaloQ+vRU50EAME/qxUMMm8USOLFsLwDeklg4J3Fi8V9H3npbQjwY0nc/vuhN/85F94KgFayU2ufQ2Yb/xJ7YhsUtp9L4gQQW8wSbdSayAlEdu2he+u3F87PmGfva6tjrbS92HNVWP5YgSnvt7JrWnni7SlFlNuKYD1CJR7YlDo8ldJQjmQG11CXx6R5mGRZTAzsZzGgHDkZO5VIkzhrUIvb62sM9AWCoASwzgckSnCesZ+sXZFPqfjjGsSTVjPhFXbLIcePlreazr0veuZMwILk+vuuZOgBAyjSbjRn2SOeGDvRVYQLAyLCXFGtKRHHkDNj/aPVf9LkcMTJKbnsUCefelzYiF6nTinDw2cXN9c88/Rti7FvsnvfQ4J4lD1Z9GzvfQmAJR8g7BmNsShqufOehcb/3jErtrz+17Q1+ffcroSxp0FY7G5TUaTRmRhFb56aOfT7W1BU3Oo0ICXTyRlpVD3ragTA5VbWm5y2QVtc8HT/1cYByAwArwixrs9SV7I2HWo8gizidps2u81nxeK/7HPH884+Rjut9RrfkRUJNN6tvKsRoTeHx5C62/1JLTsoylujpiR46FIV/feBU2dzIdapub0ZkYE6t97IcXnjrhIfviuvNzR+3oLSUevfts1nyf/pYy7uvmmlFo4bn3Hv3pL0Lftms7PhrIQA/SpZxWD73GzuXbyKQEkJMxtikXHrjJ8+c95wc50Pkuc3vskOxt3pHui5zqwbf3qbs/8BKuz/cHX9/zXz3PcMW+R+rtOG8lETONjJCQrFkvXN7r5AwRCRSrF7dWAtAKxIvHxThWaA12hYPoi0KNGgATKCEerDPFnXnJJDc0ZeS3ubjZkNVaCyZNEAh2jU+1hYCMy0ipC430uu7uLrX682QVUsy2xKikl3upV1tOGoAGvHCIvgQ0QV3Sp5UWNAmZHmnUh4CRK7ZrvTuaIhGNSzv63mHZ1wyvKN5O3qLZk2TM6wBlSOdGD52X6zsumaUMooy8rVjxq8jkDIwRkAyh0m37X1mytPeXf71eH33isa4cGRPLrt6rMpFG2vYwrsalBPbT700xXX9XZrBvZZpjhkVJa2tmyJrwxzg88ATV+TexDFJ56YUphYqq/d9zCs0XlQfr31/BBLC5Sg3gWIKlBvZKJYaoAminWayeJBKktAeZj1cvn7ORalIsYcQMazM1VqlVmzyY30IJwfEg4WrRhpEyzquvrs6BYV8B9xxoNyQ5XPHYNaQFlnixxOR1wAdRNd6GS96KLXUD0mfeejw3566z+7yrKg//MphIXH0cGnSRKsx8ur5YkfDQ4Fn5tZ9kyZ+5Qy+FKUgICSJn/i3n4y6wftq/SOf3b3zF7fY3UuHMaPfLjAtqcV8vax+XM3uPCyQANB8eca4HDLjCbuZ/ZLMOeo/jDxcORjntEticto8jNMQQ49bTqR+xZe7U3vr4IH4+68EcCDQhS6aiyJHX85FfAMAwNRtQqzFas1ssdk8sYwZjwXrnOScLfqmw/vp3o+2kXcP9ZJPA4RQs7SUUUIIqvS39kWT6dp+/WZxHRBUoNxME6fmcxqRREkQTZPpZoxZmUZ4NWYc8p0Ire66YGxlednPOcVNDT8XDgrJ44ZQl8sVfu+prQYnZERHXrQudeL0JLxzlYGvWeD/ylUnSigbmz5Hnjd0frA92Nj1yPabskCggwGD+RvvSCOD/tArfTxtQvie3dvwgVmBRfpE292Lcuj4wdtDL9x8AmsOl6CE24dUPmKpS2lTVjYV2Iu9x8PNMnCiqdB2WXJMD9qr48fa0vn0Qgd1JeVkDVy39sSzcZN9bW1xAAidcc8Bp+eMlpPxXWcWzOO90REK7ctw/OR8m+kPTyacWW8SFocgugmjujN35Hv+P79gZXmZN5l+3+JI3YZOgLDSjSb/+19dO4DN+91+jqNV1ttzJvcwFupj64sbpv6OwNJSRsvKiPnHS167MKqwuz/ctnpHP2OCqpKY9VD8gw+Delf1SO4Xlb2kev1YSbvzb5G/dQBABsbLzdgROyNdNl64dXg7dyQYU3zdAnpM3Z5oTzdTeJXQxEa1WQzolRU3FvzK8dax9/KjONEAoD9F5hivlJphkVx2nkIyTUXRFSLqQH+D6TWMqINkyUusssstihLhBSobTE8IhP29BuGPcozzR5TOo77w8XWAFgCXNVwcna9JdlciBJiM6SEmShJP4DLtfLO2s/aQZEu4OTA+oQyLFmlncsEPuehOev9Hf6QHN76jbH/4amzaZIJ8sT38MoEEALt4wo1pqRbXeYuif343c8eU3AnyrYcUEsIO7alhHVrB0SwBI5zs7F8H2JE6xnf81RJPUWrwUvNoqTR3Zhz174vdeUGzzh2kvqChWtokKFIH29FJCGG5tmnJkXjX84aJ/G4z+CzgH5sk5gwv8I4a3N99lh2SgB6lM6CEtaMxtbs9GG/YZWjWOo7yDb1qt0h5URDFlEiCJ1uxEEHsibeNIIKRoqk94UBEL0x3ZR8xaU9hLKKODoS7TL/SI4uGJaQiUKWDfexC7sYIQlaLRDWOt8omi4lUMlRrhMUNTkjwOAvHZWVcOuNY1+tNdY0v/pd0yQMrmCtpmLr49v593cIXLTr8lzVwfEaJ3NRaJyQOHbifbqQxkZOTQ+hQmcnAmQn9ABxt1JZXAMvnZHA3X8YMc05IqOrqx008FlR8vjI844GaynMQEw00HgYQzsvLkwgh+Qni0IL2aO0NCjMutMJtO9d7/l8nZc2GW85GSyTS2KU0vlTdeOTDnb5XDgCN/i/LBgIgDiAC4PPYHSev6QCeGuP/depKvNo62HP7H7KseXc6+frDIkcLO7VWVzjq0/3GwQIK/nA4Trh+8ZFEFtNyImZ3nFBmWjRlpEVOv3rE4HNQUfuHT0EpEw5/dKN+9tTfOW/5ZV5w+fI6fMmKQ770m00fO8/JB+nIlUeXlAMgeeLFg1MwpALgLHXGlksEo2FtFDl8F7pUkCMqzyh0mOmAbXCSmOHOdBeQOIla9DifEtUi2b3RnrSQGRk2xF6UqUCl4XBcHO4dhpKCeWB6GnZ1Ha4ob161uFb/82sAAvgCSrhZs2LSwYq2QY1taiHQCyDRB84MwzhwKBkuh8Il5ckp53uS3dYRbXUH3k6Oeqp9cmBIpss9sDOemEZ4uSOqNdusjpybXZbc4Z09O2EjKQiymoDKejfxJNqrKsRhIjmFd8T3Bdr3ZOWkDFpa37FpNUpLQygrM+1/evNctmfztMjS5x/88jc9rYEMDAQEQ1PzMnS30oCjfYRS1exUhN4egch6q7F5VQlK2HJAI6TcYAyizvHTJ+fOuyRDKJgWiUcy22KN6PCHoKsyzsq8CEXZI6CHTXgsDqBfF0xFBAgXPtYcVHYdXa03KltMSPSiHGnmNJ6QHolzHu5izYMNEk0W+AaufD0VFMU6Ni1jsH38pDE4sP8Amk7UqqJ8+bYA4yMWwfCGQ6FEO59mMmHwrDZ3pD0SaFjd0X64nlry51HOkWnq/WjIbLP5Qh2fDsietc7p5tvTDHvbgaaq+wKd4UuIaAuZqm4dZC0+Jz3z4mh11+sNGRlY0bxpEwVjCFuSWy23/P6X/E/+6NM/fvlv3rNnEt+KJ0JfIJCAMAKARXXPwvWPHenTSEYcGB2wYGCVwpQBHoxNfQfvNG8sfZCfUpZy0/is82+f6r2qsDvEsLH2fbQoJ5goEfPs7AnISszmbJwEtUMDtdqVimBNY0vnwd2M4jNfqLXX72/vJwt0iGCxX66Z4hidxmGxeBHXAMSs0OKS3qMTPjenACPGjIJsdakNtb1csKOQuF3n8QaVJ3PsMLTojsOy2LOpIxSI6YbcnZ8yscSRPfuWQ9Wv0VC0ab/OIp9yYmAux2U71UirduDAnBcB9HBFzz1qSZw33l04ROPsboezuZkJe1aYDpu7Oyidt6C5df/WJKezoovSGjDWTsKRLnv+gD+Hu+q2man0+KnaS07zB7CJaZcWOG2u/B3VW7cswLxwGR5i03G72MoHak1Q3a67B+3AnyWg30tjhk+fc5XzNnyyZ7t5IL6Oje43CiMSz+YSE5zoxIFYY0/Dc+sO706NgIgKVIMXwnkCD9nCmzVghhCJ6YkmcY9JTzqHuCVO6/RVt5oaaY+bca+uRWIux4D8iy6/WMzMGEg3rGnH4UO1iKmKIVhNTjXbIECNq2b50eyM+GOerOydHY3xRKfVkVRxIDzh+iv7XdzZraVv25PWLbkNj6YcCKpxBkhjJCJoIoirW0ibMYhBhNK+yWABv5llcEKPsnFRWO8+kSqMnteB3Ss4Z+qzfJbDFqzd3W3PKbzffeuv72q647+mIrJ3A4qKBFRUaDwAFKOYK0e53qMYP+uKdF4OxCaXoSwIgO7Ex5bB5PJwHIpjL977S6H9sgsm978wC2a6vrnyKBKYhfuF/W6i6hZyuH5PR2Vo86t1+GwnYN8zZWQ2DYWNIl9PbHJvPGrTVLbDH4uNBGAXid0hUbM31nPUGTRCTYbO7c6Qhx21u5Lu6AqfCCUljrD4a9PNdW/UtKhGqINKgV6T7hsYjvhU1QxVewWo3kRsafcJm49UvxewYFiKgkMfC7TItfmzfbmSlLw30PvqT5xJ10+XnO6aghGJHTs/+V0kZfjPhgaa9v1K6d6smaYznal+DweNa4C+RTPrnoUgme10azXHWYhpN/I13UxMHDXwcOhIS7S7TTPppPMy0io75WYU6UDFySpcPBkoL4fVKqrRkN7iQ0sLAUjfKlptWEX4sAb1MgLLz65L/zluG3sROjpNfmcrxQfGMbwWfRrR6LEtWRMqVybqzo6u/U6fh5fv2F/VVKxr4GCIIo80004ds5N4N3jOBtUgkLgEkxGoHOGzbXJCrmgmgY+EYJc0JdBsfbC89l3DJgXdPv2o01RCTq+cv7RNq2wfP3D8DN6GlF1Vh48zIiQD07vzxX7jQnx2tAd1Pe0tmR7Kc7kj8y+dFOpe/EmoG+iuBQh5ughI7w+BXwWt4QlK+02S5cyreM75SSzWVJOV4dI7O+UwM1mAy8w/GDn+ZrdtwNhLovYcWY+2H+QPrKGc3rO3OaVZR0XfmJEHgMnlMMsBFNozN/ukthdIAAwAPbUEGTODiYyZ73JUWfmX4088uL/7cCDT4yoIQ2ojVofdpkRMhfWqntAwa2uDOMGlqreJuhjoB7nFzjs5KjgFajrbRYHfabHYHGHWObu//SyrwETKM8FiE0XYeBFehwNvH3sxerh36e12KcNfkDAzxR/vsXM8/uK2mwlt/tc6LphxbV7/hKFTKw7suVE2E1pTC3ocQ/sfOXfnOnmHzKQJTq/zVQ3cSCSFb37pVwtbLrjL/dMAsRQm5/AD7R7rGN6b2BgOt22L7m/JSPY4VlUfe+mZqAmguJRv3/vxRQazaK54+zbt+JupYlbRJcqYK/4Ap3sH2brsMdbev0b77L1DGFIiIrvTgoZy5QvjQIufC2Rw/aOn7kfIc24HhLSYGdotMLEh2Rw4s1WvanjD96up8CEdQOcI56BJCUJmV4Y5xrflQLc5CWn2F8c/1bh1x1q6BA8nd+gn/A040Augb99/nwVwsGjcch0BpUGlV1JZXNQNJlhEa9WB2K4dBmLbA/Fq7I4/BQC4GBMc2/1B4Y7bHhs2a2ZxyW3z77v7WNPGQwCMQGWGVntCGulR+ZGGIW7tavZPiqPHRIM/+6I7fz7q3EsvnJ0wetoFHWo07A+GPqzZv2efsmd71UDvXVM6Avs+YHTSFi/v+dBXXvahCOyggDOWec79+ojLx7CCMeeQzCLB2Pp+Bp888nbOmu0UMkseo6GWRfGm9HoA5AsEtqi+aJxo8qmRjUnNtwKsjUoC9K5YeJiVOoovSbrW2c1CVzZHjmye6ChMt8RT9jwfvc8/HFzGMIt87X5j5coJOxbGsADS/NZf5Tbu127K0SccTx/g2BlkqnF1ycyaa35xfheAR87ImgI+AngNAPLH727IlkSRBVSF/2jJqpE2E5EXb/pJ1G3n76qtbrw2LQ/s53e8mbpr6zYPsUpOHZ52yPSlhkMb+1kCmfl5I688Z/DYs8oGFI+SvIU52L++fNOB0oWbLLC12Cq7Yr2RgLjXN+f3oGc1W8WUBD1tgEccsXiOEu25ELJ1MvGm5CM1E5QDWIcCtAZH0KLZI8xA1y5Ee5R4YmLnyUUo8sVe2F6SFNECrn1xX0MeAlQT03IHGbNTWkhFkc9sm5JjGTpzvHssfGZv+Fh411IXh48iJF7HDEMxNDVRlD23X3H+tXICP8T01/YkE8VW4DT7Cf0LNE9PSzze2RMWB7tTDIsbTEoGkzNg2odQKArDsUMRZI4U0X+iZPIJxKQ8gaExokYNUlunafVtnZIv1DpmbGpVy2eRkQcLBuUk5GQ5SUw3WF1zT/jA0SYxKyfFTO2fDIvH5WZC3zJgZ8AkXV1BGiA8FOhxRyTwdn+r9nhCXt7RKzli2IsGeZWc+9MEI362aqhOqhqiKFl64i1Hc3mnO0pMNVFvPJZAvJa5Zn3lDVpnxZtnKt3fzUQG4+zsCLggQVNMQIrYz3q+rUs7kuYz2+5Op8Mnybrj/R52fCNn6d2ZZE02M+zZRjDWbTMjgq3b7HJ47BmOSydfOSLbMWRqvI2bkhD10sYGFUaIIVuWYPMAciLgHQDISQAsQEgD7JmAezyAJPTNNGN9s7amVqCqsRFd8drZM2a4N67do+8nzuy84QPtsEo6DMpDt1oQ4ftcmXgAUfTN9NpDOqK6avrjunnYp4RVw2zXeKfHumPjSytvmvWg1TVqRFwPemj8xLqzLp83rCsSzUqEE6boyiTdTfWiohEqxOMH2hJfVln8oUJv/dKKiiQKrFZPSvlFYwIBwfhh4wdtP7T9WAlK6HIsJwA4J825NAWjf3et+5f5Ddqh8Kroi390wL5aA2DqelcAAX8AlZ+3cCfxTunqQQ3HnNewykH3OapcdEC+TgQ7YbxTN/hs/1YTdLPGIQIr0/nssBt2kzi8crS3I87pphwWvdTsicewt2ZffemjJR9+vG7XnFo/Lelur/1s7JgCKaYjidns1jA4EojqJi/quskLqG9qTYxranJ02PAxlT7T2h0VLMwmm558K6cuXRWpumP+b4hsbwZJupxY7Jyu+FZbxPDGlLMnj7RYZKGrfL1TGzRyPknPMiMtzER7XTq699xsjBxf7qrbKwcaK0/PxE+1geTkVM4VaMpYmSFO37BcXX6HG0WiDMorNDLQYiRmT+w3VPcELJbPQpukBHuYBGIx3SW7VdnkXJmYPUsz42nt2tEnHi/6TTjoyRGvKLvw6PuPHgsGt9s43mqY/gCh8W7oDrssRAZWfHrNX899GBR4xSi1/PT2N1jxqHRSfhewYJ3MhuWvNm8m4F58crU1SwhHn3/+1fRdVUeaym7/yQ3oU85vxB/W7yhda/dcEKA8LExHe5gyrNzX2HP/vX82nUmdnJG6hE76hQzeCrrzkyt14cQrzZ+sfN+wOQPCz+9+ls8dnmRWVoEPVv1hwLS80iObmk2Uv6YHUKIBlafzOU0g7dsElJulTx0wI2nmgAfbZrf0mhVldkxIs8IVDZLW4N6OpoRjsVrai9oZvJrWEjQjWnusY70EFkmzOCpdJPVEN7rkZ+ret1VWrG7+aOmayw4/7nqisbHLHOJM5EgvMQQiCl1J1bue+uu1f9y+Ys/E5t/nvRzKF9Lfzb0T9i5K7h7LEL2PEkZEyzs3+Qy3Ymz8uP7gitb2iJyUlbn7q8g75bxxypFjyaH6eQsTsx/aFzIMSYuySIBBrGvj/aW3bgiF2jcKrgSiq7FtxGqbCCYYRAs3m6riJsPOe9dy692CeeJQa/yh+b8xexrKXTdf3nKk7AUNRUW85+z5JR6XtKJm9eebf053IqUoJWUo4xNw3po/ZX9cvNH/qrkk+ItpFGSjXUrPc6oF2ybarkqsV07ENLSHO8yaOoNnv9dZtN4GG0IsKniQPZ1ShJrU6k0XXTrq7HNCDz/RsNEj85yFigbPRIBIia2tB4c9VnT3XfdmVT+esI3bJ/OWNIDY+towFYDfUOCjhz+wuTufOnF2gN/XVj1qy0sPPsGO73DeEcq9V7dJXg+nsRChpDtm4ESzTnQbJXwCZZpBU7pl2/SGqECJQXmmAVzYAFn02Fr9nYWLYbOv4+zuoabGX0S0pGvBkUTiMo6R86/aTgcN7s/11u+jj5T8MQJ0giPAtS9b8NpPFcfYe+8yYSZGdj1+75lrJGe2gZSAmAxs+Gjp7n13Jz1G7u+4NnBce2NOLj+5gJnZ959ruTQ91WbXq/wdwhEsq1dZ+HUFoc90IVLF6VKOAVXv0Q9tf+j4OEfq797a2fBR9qC2UNi0UEYUPmA4LK3dZr+Kc689nNzS8rOhLx/5BKmKxa/YbFSKGzQS1mJRJ8kP9JoHdyysmbF4cc0aT/XR5Gdn0tpfLhYmzm6w236np9m8khsQhL4Gt00BjgcARexr1pkOwA9QBSDRWA8Nqht5pf415aoRHw1budLdsnjNQMPn64y2pzgI7ZxJ+xdch9T8R1i/wh3xsmGdAIIAgH5FVrRBAyo0KeuaXGrzlsas8Z+hop9xeucC/s4iXcIRvGMwuP/7p65X/zyeH8ce8P+kVyARd6Z5Me7w3InxecDSnSbbzH9o9rCjXBiNx33moe2M0F1WwVLboK9d/dLNe16temvEDQ29zXqY81E7EkwHx/Mux4Hrn+q6eMkN2a9YXmv4qYHPfYD/Dowx4eU9RxatapF2HunyzOp2uGeaXiDFCySa/v0RInS094RoUNN5RRBtpmYyplKNE0SNhI1uagu/z1kOboief0mHB3Bw1/w0SSecGm9jWsR7YbcrunQEP+6CsPuBX9TX9DlyWwFE5asfmK3t39GpH12/0zl4nIemeByKz/HfJMq/Hat5Y0ffHp+vJfAUicsNEUWv/8b91jyHaWXPhH7L4sxHSqQF5MqUScYjTRvoXjzFeNMy0YaSSj8WeqxOm3giuLb2wbnLbmjfOfzl4w3tmskxzjAkKlMZ2ZbInzjXYw+0h5Mzu+MtCMl858HAyt65WC4cxxvWVq55LGEYZ/LcXp+66+NHPz327NIT7pLjjVKCluYUQAGqKrCp9R/33jX4EnJyQenbNk4nldxij4VishT0Kb5tNXH7CNEV3r+/y5ZSmBzpONgJgHgn3GhXbKKs9nhLwUfP1/yHpuP4ulZx8OyXhQxvIwzfU5ENH3XgK7Z4fOWq3Mn2kHjIBUvuci262qUn4IXYHw0B4PrzY1ChrkEEhx+XafiTbEuuz52Y1vRhw8LebUv2jFpUpm09WNNBYqRJTOELiI0qTW60LRaEjnURQ49GuZo6+aLL/OvX32vX/PRmjoizCEHMNM1XRIe497npA+s7ryq757m6wb894m+HxfC3G0mJn3FadwXf0lBlK39jfcfBNyLYaPKYDBM3L+JS6raIHRNuiuOhyWbeXz4RmhtrU23+hh50++Cr32MmuQv7GWBKT7LaZk2akQTmLhICm6rQWO0PTB0dQFmZab/pt4PV/R13c4ETD8RqVkdp3vVvCGne8xCvHRjf+WE9Skq4Uwvx30Yg8PmwhiXT2XdeYb357qPmvuQT6nZD1W1bCB/6WKJkhabam4Z5Ur1ZLD306w+usj7zQNum7ZtDBby1GYlWKW41wmvj/mMvO2XHnpdiQ9uALy5Oy8hMU0HP4sAKZc5aHTD8+15d9rT6Uf3Ae9/dqW+EZf1hFB5rxT0vh75GTgBeB+Cj6FvyNAFAvvWxtNiz97SefICe+rt34ARHbNj0PJZSKMa69u3D8jIVGeNlWEwBNbuCRASYihRhzJ0rbL+4e2z0pQfvV7e98AiK5gunrC/flcCTmsjIyT3OiUnymD8k2RPOzbXZ5q+s/6D89EOEgjETT96w5E8HN+GXHHF0pYrya2b8yHuuq9qV4dPPbZs1ZVb7iy8+O9glJkVKbihpeuXlVzI4jiM3/OSGRmYyGwALocTHTCY///xSyy23zPMzBuHge4tSzpozv/mRhauS3ujJCpQ4Djj7J2pSfFu8UzxbtKmqGhGjUZsl1e1NPZrdECoKibymeWbMmdP8/PNPpttsSeJ1111Xv2TJkgF+RVHumD+/+StLynEYe5Xh3PUGzpGuWPik7eqbBkcX/XajsubxGVi2TMPcuSa+ppX4Jt8CVgZiFqOUp6DdXbHdtylc77yjKv2oIPPW5hH59y8T5YG3M2aKFc805qWqhRePTD3rzVkDRk989PiFv1povNrozR90VrwnnrJwwULJZnNP5B38UDBAEITRVGBFC25bIC1a/PzZry792/QFty2Q3tv09gCHQ5v2woo91lc3LfPuDFgKACA/y591+KGh2uwrPILVaj335hdv1lRVHZIzTha1FCE9GjWmT/v9VD2oBAcoxJxaUlLCmaZlFMdxExYtWsSLojhZYPpwAKSkZBl3uoSz5luLGbPIydmX7d173du2hzevki6YNTjw0H+/oqx5fDYIVb6JPOC77w+kpShFGcookDF1UOY1L04Ycmdmfccx1LU/9mnZ+b/Z1t0Q++x/tkz9FIAx3DXTHQTPGgIf9p6Rz0khSum5aEhP4rNmGbbAmyRsPc+EySSjdgURh98N3jjgi3bvTOSTr35bL31mtuWea+OK1mG6hV3Urw5ci8i+y6SEG9vjzatl0WuzwHLhKvWJhRdb7pnYrkT378LTwS/3lF9AaSn1dkdTzZb2bMQjNLh9h1cYee0Ltht+mRqrLO+KPll2L1D1MigHmMa3HrHyXb1bzLI+gXSgec3RpsdHvL/16nt7u7dWSKRg6n3v/y39f3a+1IiBsBbbCxLTAxdE6wMfBEpKlnEn7T3stM83yswReSM7OUFf8WFgYa9gmHuSDcvu5Vhu2FTj7anR2euGgIahqx8CgKmoG+dg4Kb5/tqwaDHaWekLhmCSHRdAa0tTxYb+KrcYgMkresNuPB3sy+6L5JWWllIQAtdZxQmeo7UDE61bQ/4PluxSQ66xCXMfesc6YaI7/Nw9f4g+eVUhUPUyShn9LuQB310Dz0AxT8gWfR4bZmuw1ji3aNmp493/sySLnZ+mRrGy0zj0YpU8+6C/B0EQsGJXaQIxmocyZhEMg2g6CWoWcGRT7JWd2Si24MoRqUJMsRphyodkCLZQOMocfFxXnU47jEB0mBCw13EDNVGM92Zr1b7KShVrV8ezLvpprpBk0ZSANZ/rjSpatluxhohF1SIqc8oKi0VtBsdLuhaq7n5/URuAvqF2SqEojr9iGu923cYz7iwa7nql992y5wDUg6OAMYf7PhvOf+gufVKE+XwFPu+ZLnYsG8jUkbdohmVqnMV6DRJb2iPtevdQ5OcdBIAJkLnIsDSgWPB4PFjd83QQACmcdqc1GlC5gGyYssEEO0c0f1g309APHblBNuogz9cUWlk4GhdEIxKtWe3RiotBW2I1ViU7WTM6iU0wYgZvcZpw98kSc1s0/dgmGrFkONDjZ6y3h+P6D3SQEZd6zB7feJ1SD/O1blXfvX8DgDgoAea8zWH5N7d3/0wCz3yfEFCTndzxUIISOUAfudyEpcSkekEQu5b0YM9mB5ttixu2yqMY3db3ap4EjNT7tvJS9lVynyPc+pidS3QLStt/r8Si6Bl5fnMhc+e7eDe5TrL7N5m93X7Rm1OArMHEcKS2h+E9gadn9BkkCAHefpvD3LkMP9Dx5p/m6lWKUroJD9FykNNHJp2PtWlhodkb4vY6JWPuEE23ZcZIg08xH18Sl6g7Gm8PRVDbfVJ4MgQlwlDAGIIhbK3ge5gS8ssINSjlhTUOLuH68kBZ72mxS97msO9l3iFJRaCKT4cSsaRmJpgal0J43UZVnWdM2a0KpmrSLC6mJXaivM+xB8uWcVi+HFi+/Htr3JfxL/GVK0HfyUbLQf6uLcnDQqkHn0gOa8xK9BkuXh83nQD+MPfRYZ6e6HXEhaYkDDEhRmcpxIjokknAW1wqr1RUsn2dondasSmmj6LRz/bb3J21gtfGwWFhmjsFAmcQgA9TpSNkb9sSrFldc9pyDAAoLaUo+5re+YcW9p+Z2N+DEeAhAjzESgC6HGD4gvNhKV+ACZng7Ylx/Xh1A37ae1quJNjgyLXC5eIxZl8X/DDlA7NG6bDHSbBTJ4ISd+bmR6RkT6B5iFNDWZn+VRLg26fL/2vxjWeyMDByKpT2ucx++8dmjJzcivuf5kj+rwQ76YD99fPyL/3+cvgRP+JH/Igf8SN+xI/4ET8c5OQBrNwPDSUlJafDP5LOqXBSHvJDZfsmOf5ROc+Q7Uf8oyAAyPDhwxNisdgC0zSH4geO8Hmeh2EY4DgO0WgUhBCIogjGvvcUlFFKGYATlNI/AYBpmv8DYIBpmt9ZNlEUEYvFYJomGGMwDAOEEFgsFoiiCNM0EQqFIEkSOI77rnKyk/IdlmX56crKyl4eAIvFYgt4ni/TNO0HnUDOGMPUqVPhcrmg6zpUVUVvby8+++yz7yPcF8DzPDRNI5RSIgjCPZqmgdLvtgJBCMG4ceMgin2HgsiyDFEUEQ6HYZomEhISEI/HwXEc6urqsHfv3u/8sRlj4HkesVgMAH7LAyAcxy3WNK0/Y2zgqUO28T21cMuWLRBFEaqqQpZlKIoC0/zelqNT58UwXdcbAPwtGAzqkiSlUkJyKcedOiblW2Xbs2cPRFGEruunCYxGo1BVFYQQmKYJu92OYDAIAMwwjG9K80xmTU3TjvE8v/i7yPH/BWfWAsZarIyxhM+6mOPfkd/3xZnaduZ5yT8onDy2/fT1+4TS0j6LzMqVK1NXr1593tKlS1MAkCVvb7rixffW3b1/4+GUM5/7HjLxH3zwwZRPPvlk4Jnvnzq6fs2aNf3Xrl07edmyZZ4vxwMgq1atGvDRRx+lfynv04f0/CepIAHAVq1aJTkcDqssy+HRo0drfeau7/1vNU6DMUaWLl2a4HA44hdffHH0VD6nritWrLBKkmQXRbFnypQp+pfjN27caOnq6iJz586NnRF3Gv8PjFvr7edC+ToAAAAASUVORK5CYII=" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "contain" }} alt="logo" />
            <div>
              <div style={{ color: rank.color, fontSize: 10, fontWeight: 700, letterSpacing: 3 }}>TITINFOCUS</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Foco - Disciplina - Resultados</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40`, borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ color: rank.color, fontSize: 12, fontWeight: 700 }}>Nv. {level}</span>
            </div>
            <button style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: C.muted, padding: "6px 10px", cursor: "pointer", fontSize: 14 }} onClick={() => setModal("settings")}></button>
          </div>
        </div>
      </div>

      <div>
        {tab === "profile" && <ProfileTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "goals" && <GoalsTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "habits" && <HabitsTab />}
        {tab === "especiais" && <EspeciaisTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "historico" && <HistoricoTab />}
        {tab === "vault" && <VaultTab />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${C.card}f0`, borderTop: `1px solid ${C.cardBorder}`, display: "flex", gap: 4, padding: 8, backdropFilter: "blur(12px)", zIndex: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={styles.navBtn(tab === t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {modal === "newTask" && <NewTaskModal />}
      {modal === "newGoal" && <NewGoalModal />}
      {modal === "evolution" && <EvolutionModal />}
      {modal === "vault" && <VaultModal />}
      {modal === "newHabit" && <NewHabitModal />}
      {modal === "settings" && <SettingsModal />}

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#1f2937", border: `1px solid ${rank.color}40`, borderRadius: 12, padding: "10px 20px", color: C.text, fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: `0 4px 20px ${rank.color}40`, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {newAchievement && (
        <div style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setNewAchievement(null)}>
          <div style={{ ...styles.card, border: `1px solid #f59e0b`, padding: 32, textAlign: "center", maxWidth: 300, boxShadow: "0 0 40px #f59e0b40" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{newAchievement.icon}</div>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>CONQUISTA DESBLOQUEADA!</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{newAchievement.name}</div>
            <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 16 }}>{newAchievement.desc}</div>
            <div style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700 }}>+{newAchievement.xp} XP</div>
            <button style={{ ...styles.btnSolid("#f59e0b"), marginTop: 16 }} onClick={() => setNewAchievement(null)}>Incrivel!</button>
          </div>
        </div>
      )}
    </div>
  );
    }
