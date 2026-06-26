import { useState, useEffect, useRef, useCallback } from "react";import { useState, useEffect, useRef, useCallback } from "react";

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
  { id: "genius", name: "Gênio", desc: "Alcance o Nível 100", icon: "👑", xp: 5000, condition: (s) => s.level >= 100 },
  { id: "tasks_50", name: "50 Tarefas", desc: "Complete 50 tarefas", icon: "📋", xp: 200, condition: (s) => s.totalTasksDone >= 50 },
  { id: "tasks_100", name: "100 Tarefas", desc: "Complete 100 tarefas", icon: "📊", xp: 400, condition: (s) => s.totalTasksDone >= 100 },
  { id: "master_discipline", name: "Mestre da Disciplina", desc: "Disciplina nível 50", icon: "⚔️", xp: 800, condition: (s) => (s.attributes?.discipline?.level || 0) >= 50 },
  { id: "master_intelligence", name: "Mestre da Inteligência", desc: "Inteligência nível 50", icon: "🧠", xp: 800, condition: (s) => (s.attributes?.intelligence?.level || 0) >= 50 },
  { id: "master_consistency", name: "Mestre da Consistência", desc: "Streak de 60 dias", icon: "💪", xp: 1200, condition: (s) => s.streak >= 60 },
  { id: "evolution_7", name: "7 Evoluções", desc: "Registre 7 evoluções diárias", icon: "📈", xp: 300, condition: (s) => (s.evolutions?.length || 0) >= 7 },
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
  return "Gênio da Sala Branca";
}

function getAttrLevel(xp) {
  let level = 1;
  let rem = xp;
  while (rem >= 50 * level && level < 100) { rem -= 50 * level; level++; }
  return level;
}

// ─── HABIT WEEKDAYS ────────────────────────────────────────────────────────────

const WEEKDAYS = [
  { idx: 0, short: "Dom", full: "Domingo" },
  { idx: 1, short: "Seg", full: "Segunda" },
  { idx: 2, short: "Ter", full: "Terça" },
  { idx: 3, short: "Qua", full: "Quarta" },
  { idx: 4, short: "Qui", full: "Quinta" },
  { idx: 5, short: "Sex", full: "Sexta" },
  { idx: 6, short: "Sáb", full: "Sábado" },
];

// Returns the array of weekday indices (0=Dom ... 6=Sáb) a habit is scheduled for.
// Falls back to the old "freq" field for habits created before this feature existed.
function getHabitDays(h) {
  // Hábitos novos têm o campo days definido (mesmo que vazio)
  if (Array.isArray(h.days)) return h.days;
  // Fallback para hábitos antigos que usavam o campo freq
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
  if (sorted.length === 5 && sorted.join(",") === "1,2,3,4,5") return "Dias Úteis";
  if (sorted.length === 2 && sorted.join(",") === "0,6") return "Fim de Semana";
  return sorted.map(d => WEEKDAYS[d].short).join(", ");
}

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────

const initialState = () => {
  try {
    const saved = localStorage.getItem("cativo_v2");
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
  };
};

// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────

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

// ─── ATTR BAR ─────────────────────────────────────────────────────────────────

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

// ─── HEXAGON RADAR ────────────────────────────────────────────────────────────

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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function CativoApp() {
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
    try { localStorage.setItem("cativo_v2", JSON.stringify({ ...state })); } catch {}
  }, [state]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = state.lastActiveDate === yesterday.toDateString();
      const newStreak = wasYesterday ? state.streak + 1 : (state.lastActiveDate ? 0 : 1);

      // Penalidade: hábitos/tarefas marcados para o último dia ativo e não cumpridos
      // fazem o usuário perder metade do XP que valiam.
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
      if (xpPenalty > 0) showToast(`⚠️ -${xpPenalty} XP por compromissos não cumpridos ontem`);
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
    showToast("✅ Tarefa concluída! XP ganho!");
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
              <div style={{ color: "#ffffff60", fontSize: 14, marginBottom: 40 }}>{task.description || "Foco total. Elimine as distrações."}</div>
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
          <div><label style={styles.label}>Nome da Tarefa</label><input style={styles.input} placeholder="Ex: Estudar matemática" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descrição (opcional)</label><input style={styles.input} placeholder="Detalhes..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Início</label><input type="time" style={styles.input} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
            <div><label style={styles.label}>Término</label><input type="time" style={styles.input} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
          </div>
          {dur && <div style={{ background: "#1f2937", borderRadius: 8, padding: "8px 12px", color: "#10b981", fontSize: 13 }}>⏱ Duração: {dur}</div>}
          <div><label style={styles.label}>Data</label><input type="date" style={styles.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div><label style={styles.label}>Atributo</label>
            <select style={styles.input} value={form.attr} onChange={e => setForm(f => ({ ...f, attr: e.target.value }))}>
              {ATTRIBUTES.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>XP de Recompensa</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={15}>15 XP (Fácil)</option>
              <option value={30}>30 XP (Normal)</option>
              <option value={60}>60 XP (Difícil)</option>
              <option value={100}>100 XP (Épico)</option>
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
          <div><label style={styles.label}>Descrição</label><textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Tipo</label>
              <select style={styles.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="daily">Diária</option><option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option><option value="yearly">Anual</option>
              </select>
            </div>
            <div><label style={styles.label}>Categoria</label>
              <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="disciplina">Disciplina</option><option value="estudo">Estudo</option>
                <option value="saude">Saúde</option><option value="social">Social</option><option value="mental">Mental</option>
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
      setModal(null); showToast("+80 XP — Evolução registrada!");
    };
    return (
      <ModalWrapper title="🌱 Evolução de Hoje">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "learned", label: "O que aprendi hoje?", icon: "📖" },
            { key: "improved", label: "O que melhorei hoje?", icon: "📈" },
            { key: "achieved", label: "O que conquistei hoje?", icon: "🏆" },
            { key: "tomorrow", label: "O que melhorar amanhã?", icon: "🎯" },
          ].map(({ key, label, icon }) => (
            <div key={key}>
              <label style={styles.label}>{icon} {label}</label>
              <textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Escreva aqui..." />
            </div>
          ))}
          <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: 10, color: "#10b981", fontSize: 12 }}>+80 XP ao salvar sua evolução diária</div>
          <button style={{ ...styles.btnSolid("#10b981"), width: "100%", marginTop: 4 }} onClick={save}>Salvar Evolução</button>
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
    const categories = ["resumo", "estratégia", "reflexão", "aprendizado", "ideia"];
    return (
      <ModalWrapper title="📚 Cofre de Conhecimento">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Título</label><input style={styles.input} placeholder="Ex: Técnica Pomodoro" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><label style={styles.label}>Categoria</label>
            <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>Conteúdo</label><textarea style={{ ...styles.input, minHeight: 120, resize: "vertical" }} placeholder="Escreva seu conhecimento aqui..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Salvar no Cofre</button>
        </div>
      </ModalWrapper>
    );
  }

  function SettingsModal() {
    const [name, setName] = useState(state.username);
    return (
      <ModalWrapper title="⚙️ Configurações">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Seu Nome</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} /></div>
          <button style={styles.btnSolid(C.accent)} onClick={() => { setState(s => ({ ...s, username: name })); setModal(null); }}>Salvar</button>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 12, marginTop: 4 }}>
            <button style={styles.btn("#ef4444")} onClick={() => { if (confirm("Resetar tudo? Esta ação é irreversível.")) { localStorage.removeItem("cativo_v2"); window.location.reload(); } }}>
              🗑 Resetar Progresso
            </button>
          </div>
          <div style={{ background: "#1f2937", borderRadius: 10, padding: 12 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Exportar Dados</div>
            <button style={styles.btn("#6b7280")} onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "cativo_backup.json"; a.click();
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
            { label: "Missão", value: todayTasks.length > 0 ? `${doneTodayCount}/${todayTasks.length} tarefas` : "Sem missões hoje", icon: "🎯" },
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{ ...styles.btn("#10b981"), width: "100%" }} onClick={() => setModal("evolution")}>🌱 Evolução de Hoje</button>
          <button style={{ ...styles.btn("#8b5cf6"), width: "100%" }} onClick={() => { setWhiteTask(null); setWhiteRoom(true); }}>🤍 Sala Branca</button>
        </div>
      </div>
    );
  }

  function TasksTab() {
    const [filter, setFilter] = useState("today");
    const filtered = state.tasks.filter(t => {
      if (filter === "today") return t.date === new Date().toDateString() || !t.date;
      if (filter === "pending") return !t.done;
      if (filter === "done") return t.done;
      return true;
    }).sort((a, b) => {
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
      showToast(`${copies.length} tarefas copiadas para amanhã!`);
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Tarefas</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn("#6b7280")} onClick={copyToTomorrow}>📋 Copiar</button>
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newTask")}>+ Nova</button>
          </div>
        </div>

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
            <div style={{ fontSize: 40 }}>📭</div>
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
                    {task.startTime && <span style={{ color: C.muted, fontSize: 11 }}>🕐 {task.startTime}{task.endTime ? ` → ${task.endTime}` : ""}</span>}
                    {dur && <span style={{ color: "#3b82f6", fontSize: 11 }}>⏱ {dur}</span>}
                    {attr && <span style={{ fontSize: 11, color: attr.color }}>{attr.icon} {attr.name}</span>}
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>+{task.xp || 30} XP</span>
                    {!task.done && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ -{Math.floor((task.xp || 30) / 2)} XP se não cumprir</span>}
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

  function GoalsTab() {
    const goalTypes = { daily: "Diária", weekly: "Semanal", monthly: "Mensal", yearly: "Anual" };
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
                  {type === "daily" ? "📅" : type === "weekly" ? "📆" : type === "monthly" ? "🗓" : "📌"}
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
                    {goal.done && <span style={{ color: "#10b981", fontSize: 10 }}>✅ Concluída</span>}
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
                      showToast(`+${goal.xp} XP — Meta concluída!`);
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
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Análise & Progresso</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          <StatCard icon="⚡" label="Total XP" value={state.totalXP.toLocaleString()} color={rank.color} />
          <StatCard icon="🔥" label="Streak" value={state.streak} color="#f59e0b" />
          <StatCard icon="✅" label="Tarefas" value={totalDone} color="#10b981" />
          <StatCard icon="🎯" label="Metas" value={totalGoalsDone} color="#3b82f6" />
          <StatCard icon="🏆" label="Conquistas" value={unlockedAch} color="#a855f7" />
          <StatCard icon="📚" label="No Cofre" value={vaultSize} color="#f59e0b" />
        </div>

        <div style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, letterSpacing: 2 }}>PROGRESSO — NÍVEL {level} → {level + 1}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
            <span>{xpInLevel.toLocaleString()} XP</span>
            <span>{xpNeeded.toLocaleString()} XP necessários</span>
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
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>ÚLTIMAS EVOLUÇÕES</div>
            {[...(state.evolutions || [])].reverse().slice(0, 3).map((ev, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 12, marginBottom: 12 }}>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>📅 {ev.date}</div>
                {ev.learned && <div style={{ fontSize: 12, marginBottom: 2 }}><span style={{ color: "#3b82f6" }}>📖</span> {ev.learned}</div>}
                {ev.achieved && <div style={{ fontSize: 12 }}><span style={{ color: "#10b981" }}>🏆</span> {ev.achieved}</div>}
              </div>
            ))}
          </div>
        )}

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
                <div style={{ fontSize: 28, marginBottom: 6 }}>{isUnlocked ? a.icon : "🔒"}</div>
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
    const catColors = { resumo: "#3b82f6", estratégia: "#ef4444", reflexão: "#8b5cf6", aprendizado: "#10b981", ideia: "#f59e0b" };
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
          {["todos", "resumo", "estratégia", "reflexão", "aprendizado", "ideia"].map(c => (
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
                <span style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>{expanded === item.id ? "▲" : "▼"}</span>
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
      showToast(`Hábitos de ${WEEKDAYS[selectedDay].full} copiados para ${WEEKDAYS[targetDay].full}!`);
    }

    const sorted = [...habits].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    const todayHabits = sorted.filter(h => getHabitDays(h).includes(todayIdx));
    const dayHabits = sorted.filter(h => getHabitDays(h).includes(selectedDay));

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>🔁 Hábitos</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{todayHabits.filter(h => (h.doneDates || []).includes(today)).length}/{todayHabits.length} concluídos hoje</div>

          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {dayHabits.length > 0 && <button style={styles.btn("#6b7280")} onClick={() => setCopyModal(true)}>📋 Copiar</button>}
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newHabit")}>+ Novo</button>
          </div>
        </div>

        {copyModal && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setCopyModal(false)}>
            <div style={{ ...styles.card, width: 300, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📋 Copiar hábitos</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Copiar hábitos de {WEEKDAYS[selectedDay].full} para:</div>
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
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum hábito criado ainda.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie hábitos com horário para construir sua rotina.</div>
            <button style={{ ...styles.btnSolid(C.accent), marginTop: 20 }} onClick={() => setModal("newHabit")}>Criar Hábito</button>
          </div>
        ) : dayHabits.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 44 }}>📅</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum hábito em {WEEKDAYS[selectedDay].full}.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie um hábito e marque esse dia, ou escolha outro dia acima.</div>
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
            <div key={habit.id} style={{ ...styles.card, marginBottom: 10, border: `1px solid ${doneToday ? (attr?.color || C.accent) + "60" : C.cardBorder}`, transition: "border-color 0.3s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <button onClick={() => canCheck && toggleHabitToday(habit.id)} disabled={!canCheck} title={canCheck ? "" : "Só é possível marcar no dia de hoje"} style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: `2px solid ${doneToday ? (attr?.color || C.accent) : C.muted}`, background: doneToday ? (attr?.color || C.accent) : "transparent", cursor: canCheck ? "pointer" : "not-allowed", opacity: canCheck ? 1 : 0.45, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.2s", marginTop: 2 }}>
                  {doneToday ? "✓" : (habit.icon || "🔁")}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: doneToday ? (attr?.color || C.accent) : C.text }}>{habit.name}</div>
                      {habit.description && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{habit.description}</div>}
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: 4 }}>✕</button>
                  </div>

                  {habit.startTime && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, background: "#1f2937", borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ fontSize: 13 }}>🕐</span>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{habit.startTime}</span>
                      {habit.endTime && <>
                        <span style={{ color: C.muted, fontSize: 13 }}>→</span>
                        <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{habit.endTime}</span>
                        {dur && <span style={{ color: attr?.color || C.accent, fontSize: 11, marginLeft: 4 }}>⏱ {dur}</span>}
                      </>}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ background: `${col}20`, color: col, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{formatDaysLabel(getHabitDays(habit))}</span>
                    {attr && <span style={{ background: `${attr.color}20`, color: attr.color, borderRadius: 6, padding: "2px 8px", fontSize: 10 }}>{attr.icon} {attr.name}</span>}
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>+{habit.xp || 20} XP</span>
                    {streak > 0 && <span style={{ color: "#f59e0b", fontSize: 11 }}>🔥 {streak} dias</span>}
                    {!doneToday && isViewingToday && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ -{Math.floor((habit.xp || 20) / 2)} XP se não cumprir hoje</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (6 - i));
                  const ds = d.toDateString();
                  const done = (habit.doneDates || []).includes(ds);
                  const isToday = ds === today;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>{["D","S","T","Q","Q","S","S"][d.getDay()]}</div>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 4, background: done ? (attr?.color || C.accent) : "#1f2937", border: isToday ? `1px solid ${attr?.color || C.accent}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done && <span style={{ fontSize: 8, color: "#000" }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
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
      setModal(null); showToast("Hábito criado!");
    };

    return (
      <ModalWrapper title="🔁 Novo Hábito">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Ícone</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {icons.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? C.accent : "#374151"}`, background: form.icon === ic ? `${C.accent}20` : "#1f2937", cursor: "pointer", fontSize: 18 }}>{ic}</button>
              ))}
            </div>
          </div>

          <div><label style={styles.label}>Nome do Hábito</label><input style={styles.input} placeholder="Ex: Leitura diária" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descrição (opcional)</label><input style={styles.input} placeholder="Detalhes do hábito..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>

          <div>
            <label style={styles.label}>⏰ Horário</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Início</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Fim</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            {dur && (
              <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "8px 12px", marginTop: 8, color: C.accent, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                ⏱ Duração: {dur}
              </div>
            )}
          </div>

          <div>
            <label style={styles.label}>📅 Dias da Semana</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <button onClick={() => setForm(f => ({ ...f, days: [0,1,2,3,4,5,6] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Todos</button>
              <button onClick={() => setForm(f => ({ ...f, days: [1,2,3,4,5] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Dias Úteis</button>
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

          <div><label style={styles.label}>XP por conclusão</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={10}>10 XP (Leve)</option>
              <option value={20}>20 XP (Normal)</option>
              <option value={40}>40 XP (Intenso)</option>
              <option value={60}>60 XP (Épico)</option>
            </select>
          </div>

          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Criar Hábito</button>
        </div>
      </ModalWrapper>
    );
  }

  const tabs = [
    { id: "profile", icon: "⚔️", label: "Perfil" },
    { id: "tasks", icon: "📋", label: "Tarefas" },
    { id: "habits", icon: "🔁", label: "Hábitos" },
    { id: "goals", icon: "🎯", label: "Metas" },
    { id: "analytics", icon: "📊", label: "Análise" },
    { id: "achievements", icon: "🏆", label: "Conquistas" },
    { id: "vault", icon: "📚", label: "Cofre" },
  ];

  return (
    <div style={styles.app}>
      <div style={{ background: `linear-gradient(180deg, ${rank.bg}cc, transparent)`, padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
          <div>
            <div style={{ color: rank.color, fontSize: 10, fontWeight: 700, letterSpacing: 3 }}>C A T I V O</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Sistema de Evolução Pessoal</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40`, borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ color: rank.color, fontSize: 12, fontWeight: 700 }}>Nv. {level}</span>
            </div>
            <button style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: C.muted, padding: "6px 10px", cursor: "pointer", fontSize: 14 }} onClick={() => setModal("settings")}>⚙️</button>
          </div>
        </div>
      </div>

      <div>
        {tab === "profile" && <ProfileTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "goals" && <GoalsTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "habits" && <HabitsTab />}
        {tab === "achievements" && <AchievementsTab />}
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
            <button style={{ ...styles.btnSolid("#f59e0b"), marginTop: 16 }} onClick={() => setNewAchievement(null)}>Incrível!</button>
          </div>
        </div>
      )}
    </div>
  );
    }


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
  { id: "genius", name: "Gênio", desc: "Alcance o Nível 100", icon: "👑", xp: 5000, condition: (s) => s.level >= 100 },
  { id: "tasks_50", name: "50 Tarefas", desc: "Complete 50 tarefas", icon: "📋", xp: 200, condition: (s) => s.totalTasksDone >= 50 },
  { id: "tasks_100", name: "100 Tarefas", desc: "Complete 100 tarefas", icon: "📊", xp: 400, condition: (s) => s.totalTasksDone >= 100 },
  { id: "master_discipline", name: "Mestre da Disciplina", desc: "Disciplina nível 50", icon: "⚔️", xp: 800, condition: (s) => (s.attributes?.discipline?.level || 0) >= 50 },
  { id: "master_intelligence", name: "Mestre da Inteligência", desc: "Inteligência nível 50", icon: "🧠", xp: 800, condition: (s) => (s.attributes?.intelligence?.level || 0) >= 50 },
  { id: "master_consistency", name: "Mestre da Consistência", desc: "Streak de 60 dias", icon: "💪", xp: 1200, condition: (s) => s.streak >= 60 },
  { id: "evolution_7", name: "7 Evoluções", desc: "Registre 7 evoluções diárias", icon: "📈", xp: 300, condition: (s) => (s.evolutions?.length || 0) >= 7 },
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
  return "Gênio da Sala Branca";
}

function getAttrLevel(xp) {
  let level = 1;
  let rem = xp;
  while (rem >= 50 * level && level < 100) { rem -= 50 * level; level++; }
  return level;
}

// ─── HABIT WEEKDAYS ────────────────────────────────────────────────────────────

const WEEKDAYS = [
  { idx: 0, short: "Dom", full: "Domingo" },
  { idx: 1, short: "Seg", full: "Segunda" },
  { idx: 2, short: "Ter", full: "Terça" },
  { idx: 3, short: "Qua", full: "Quarta" },
  { idx: 4, short: "Qui", full: "Quinta" },
  { idx: 5, short: "Sex", full: "Sexta" },
  { idx: 6, short: "Sáb", full: "Sábado" },
];

// Returns the array of weekday indices (0=Dom ... 6=Sáb) a habit is scheduled for.
// Falls back to the old "freq" field for habits created before this feature existed.
function getHabitDays(h) {
  // Hábitos novos têm o campo days definido (mesmo que vazio)
  if (Array.isArray(h.days)) return h.days;
  // Fallback para hábitos antigos que usavam o campo freq
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
  if (sorted.length === 5 && sorted.join(",") === "1,2,3,4,5") return "Dias Úteis";
  if (sorted.length === 2 && sorted.join(",") === "0,6") return "Fim de Semana";
  return sorted.map(d => WEEKDAYS[d].short).join(", ");
}

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────

const initialState = () => {
  try {
    const saved = localStorage.getItem("cativo_v2");
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
  };
};

// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────

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

// ─── ATTR BAR ─────────────────────────────────────────────────────────────────

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

// ─── HEXAGON RADAR ────────────────────────────────────────────────────────────

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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function CativoApp() {
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
    try { localStorage.setItem("cativo_v2", JSON.stringify({ ...state })); } catch {}
  }, [state]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = state.lastActiveDate === yesterday.toDateString();
      const newStreak = wasYesterday ? state.streak + 1 : (state.lastActiveDate ? 0 : 1);

      // Penalidade: hábitos/tarefas marcados para o último dia ativo e não cumpridos
      // fazem o usuário perder metade do XP que valiam.
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
      if (xpPenalty > 0) showToast(`⚠️ -${xpPenalty} XP por compromissos não cumpridos ontem`);
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
    showToast("✅ Tarefa concluída! XP ganho!");
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
              <div style={{ color: "#ffffff60", fontSize: 14, marginBottom: 40 }}>{task.description || "Foco total. Elimine as distrações."}</div>
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
          <div><label style={styles.label}>Nome da Tarefa</label><input style={styles.input} placeholder="Ex: Estudar matemática" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descrição (opcional)</label><input style={styles.input} placeholder="Detalhes..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Início</label><input type="time" style={styles.input} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
            <div><label style={styles.label}>Término</label><input type="time" style={styles.input} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
          </div>
          {dur && <div style={{ background: "#1f2937", borderRadius: 8, padding: "8px 12px", color: "#10b981", fontSize: 13 }}>⏱ Duração: {dur}</div>}
          <div><label style={styles.label}>Data</label><input type="date" style={styles.input} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div><label style={styles.label}>Atributo</label>
            <select style={styles.input} value={form.attr} onChange={e => setForm(f => ({ ...f, attr: e.target.value }))}>
              {ATTRIBUTES.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>XP de Recompensa</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={15}>15 XP (Fácil)</option>
              <option value={30}>30 XP (Normal)</option>
              <option value={60}>60 XP (Difícil)</option>
              <option value={100}>100 XP (Épico)</option>
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
          <div><label style={styles.label}>Descrição</label><textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={styles.label}>Tipo</label>
              <select style={styles.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="daily">Diária</option><option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option><option value="yearly">Anual</option>
              </select>
            </div>
            <div><label style={styles.label}>Categoria</label>
              <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="disciplina">Disciplina</option><option value="estudo">Estudo</option>
                <option value="saude">Saúde</option><option value="social">Social</option><option value="mental">Mental</option>
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
      setModal(null); showToast("+80 XP — Evolução registrada!");
    };
    return (
      <ModalWrapper title="🌱 Evolução de Hoje">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "learned", label: "O que aprendi hoje?", icon: "📖" },
            { key: "improved", label: "O que melhorei hoje?", icon: "📈" },
            { key: "achieved", label: "O que conquistei hoje?", icon: "🏆" },
            { key: "tomorrow", label: "O que melhorar amanhã?", icon: "🎯" },
          ].map(({ key, label, icon }) => (
            <div key={key}>
              <label style={styles.label}>{icon} {label}</label>
              <textarea style={{ ...styles.input, minHeight: 60, resize: "vertical" }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="Escreva aqui..." />
            </div>
          ))}
          <div style={{ background: "#10b98115", border: "1px solid #10b98140", borderRadius: 10, padding: 10, color: "#10b981", fontSize: 12 }}>+80 XP ao salvar sua evolução diária</div>
          <button style={{ ...styles.btnSolid("#10b981"), width: "100%", marginTop: 4 }} onClick={save}>Salvar Evolução</button>
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
    const categories = ["resumo", "estratégia", "reflexão", "aprendizado", "ideia"];
    return (
      <ModalWrapper title="📚 Cofre de Conhecimento">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Título</label><input style={styles.input} placeholder="Ex: Técnica Pomodoro" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><label style={styles.label}>Categoria</label>
            <select style={styles.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div><label style={styles.label}>Conteúdo</label><textarea style={{ ...styles.input, minHeight: 120, resize: "vertical" }} placeholder="Escreva seu conhecimento aqui..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Salvar no Cofre</button>
        </div>
      </ModalWrapper>
    );
  }

  function SettingsModal() {
    const [name, setName] = useState(state.username);
    return (
      <ModalWrapper title="⚙️ Configurações">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div><label style={styles.label}>Seu Nome</label><input style={styles.input} value={name} onChange={e => setName(e.target.value)} /></div>
          <button style={styles.btnSolid(C.accent)} onClick={() => { setState(s => ({ ...s, username: name })); setModal(null); }}>Salvar</button>
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 12, marginTop: 4 }}>
            <button style={styles.btn("#ef4444")} onClick={() => { if (confirm("Resetar tudo? Esta ação é irreversível.")) { localStorage.removeItem("cativo_v2"); window.location.reload(); } }}>
              🗑 Resetar Progresso
            </button>
          </div>
          <div style={{ background: "#1f2937", borderRadius: 10, padding: 12 }}>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Exportar Dados</div>
            <button style={styles.btn("#6b7280")} onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "cativo_backup.json"; a.click();
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
            { label: "Missão", value: todayTasks.length > 0 ? `${doneTodayCount}/${todayTasks.length} tarefas` : "Sem missões hoje", icon: "🎯" },
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button style={{ ...styles.btn("#10b981"), width: "100%" }} onClick={() => setModal("evolution")}>🌱 Evolução de Hoje</button>
          <button style={{ ...styles.btn("#8b5cf6"), width: "100%" }} onClick={() => { setWhiteTask(null); setWhiteRoom(true); }}>🤍 Sala Branca</button>
        </div>
      </div>
    );
  }

  function TasksTab() {
    const [filter, setFilter] = useState("today");
    const filtered = state.tasks.filter(t => {
      if (filter === "today") return t.date === new Date().toDateString() || !t.date;
      if (filter === "pending") return !t.done;
      if (filter === "done") return t.done;
      return true;
    }).sort((a, b) => {
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
      showToast(`${copies.length} tarefas copiadas para amanhã!`);
    };

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Tarefas</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.btn("#6b7280")} onClick={copyToTomorrow}>📋 Copiar</button>
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newTask")}>+ Nova</button>
          </div>
        </div>

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
            <div style={{ fontSize: 40 }}>📭</div>
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
                    {task.startTime && <span style={{ color: C.muted, fontSize: 11 }}>🕐 {task.startTime}{task.endTime ? ` → ${task.endTime}` : ""}</span>}
                    {dur && <span style={{ color: "#3b82f6", fontSize: 11 }}>⏱ {dur}</span>}
                    {attr && <span style={{ fontSize: 11, color: attr.color }}>{attr.icon} {attr.name}</span>}
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>+{task.xp || 30} XP</span>
                    {!task.done && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ -{Math.floor((task.xp || 30) / 2)} XP se não cumprir</span>}
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

  function GoalsTab() {
    const goalTypes = { daily: "Diária", weekly: "Semanal", monthly: "Mensal", yearly: "Anual" };
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
                  {type === "daily" ? "📅" : type === "weekly" ? "📆" : type === "monthly" ? "🗓" : "📌"}
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
                    {goal.done && <span style={{ color: "#10b981", fontSize: 10 }}>✅ Concluída</span>}
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
                      showToast(`+${goal.xp} XP — Meta concluída!`);
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
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Análise & Progresso</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          <StatCard icon="⚡" label="Total XP" value={state.totalXP.toLocaleString()} color={rank.color} />
          <StatCard icon="🔥" label="Streak" value={state.streak} color="#f59e0b" />
          <StatCard icon="✅" label="Tarefas" value={totalDone} color="#10b981" />
          <StatCard icon="🎯" label="Metas" value={totalGoalsDone} color="#3b82f6" />
          <StatCard icon="🏆" label="Conquistas" value={unlockedAch} color="#a855f7" />
          <StatCard icon="📚" label="No Cofre" value={vaultSize} color="#f59e0b" />
        </div>

        <div style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, letterSpacing: 2 }}>PROGRESSO — NÍVEL {level} → {level + 1}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
            <span>{xpInLevel.toLocaleString()} XP</span>
            <span>{xpNeeded.toLocaleString()} XP necessários</span>
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
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>ÚLTIMAS EVOLUÇÕES</div>
            {[...(state.evolutions || [])].reverse().slice(0, 3).map((ev, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 12, marginBottom: 12 }}>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>📅 {ev.date}</div>
                {ev.learned && <div style={{ fontSize: 12, marginBottom: 2 }}><span style={{ color: "#3b82f6" }}>📖</span> {ev.learned}</div>}
                {ev.achieved && <div style={{ fontSize: 12 }}><span style={{ color: "#10b981" }}>🏆</span> {ev.achieved}</div>}
              </div>
            ))}
          </div>
        )}

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
                <div style={{ fontSize: 28, marginBottom: 6 }}>{isUnlocked ? a.icon : "🔒"}</div>
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
    const catColors = { resumo: "#3b82f6", estratégia: "#ef4444", reflexão: "#8b5cf6", aprendizado: "#10b981", ideia: "#f59e0b" };
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
          {["todos", "resumo", "estratégia", "reflexão", "aprendizado", "ideia"].map(c => (
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
                <span style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>{expanded === item.id ? "▲" : "▼"}</span>
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
      showToast(`Hábitos de ${WEEKDAYS[selectedDay].full} copiados para ${WEEKDAYS[targetDay].full}!`);
    }

    const sorted = [...habits].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    const todayHabits = sorted.filter(h => getHabitDays(h).includes(todayIdx));
    const dayHabits = sorted.filter(h => getHabitDays(h).includes(selectedDay));

    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>🔁 Hábitos</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{todayHabits.filter(h => (h.doneDates || []).includes(today)).length}/{todayHabits.length} concluídos hoje</div>

          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {dayHabits.length > 0 && <button style={styles.btn("#6b7280")} onClick={() => setCopyModal(true)}>📋 Copiar</button>}
            <button style={styles.btnSolid(C.accent)} onClick={() => setModal("newHabit")}>+ Novo</button>
          </div>
        </div>

        {copyModal && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setCopyModal(false)}>
            <div style={{ ...styles.card, width: 300, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📋 Copiar hábitos</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Copiar hábitos de {WEEKDAYS[selectedDay].full} para:</div>
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
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum hábito criado ainda.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie hábitos com horário para construir sua rotina.</div>
            <button style={{ ...styles.btnSolid(C.accent), marginTop: 20 }} onClick={() => setModal("newHabit")}>Criar Hábito</button>
          </div>
        ) : dayHabits.length === 0 ? (
          <div style={{ textAlign: "center", color: C.muted, padding: 40 }}>
            <div style={{ fontSize: 44 }}>📅</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Nenhum hábito em {WEEKDAYS[selectedDay].full}.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Crie um hábito e marque esse dia, ou escolha outro dia acima.</div>
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
            <div key={habit.id} style={{ ...styles.card, marginBottom: 10, border: `1px solid ${doneToday ? (attr?.color || C.accent) + "60" : C.cardBorder}`, transition: "border-color 0.3s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <button onClick={() => canCheck && toggleHabitToday(habit.id)} disabled={!canCheck} title={canCheck ? "" : "Só é possível marcar no dia de hoje"} style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: `2px solid ${doneToday ? (attr?.color || C.accent) : C.muted}`, background: doneToday ? (attr?.color || C.accent) : "transparent", cursor: canCheck ? "pointer" : "not-allowed", opacity: canCheck ? 1 : 0.45, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all 0.2s", marginTop: 2 }}>
                  {doneToday ? "✓" : (habit.icon || "🔁")}
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: doneToday ? (attr?.color || C.accent) : C.text }}>{habit.name}</div>
                      {habit.description && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{habit.description}</div>}
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: 4 }}>✕</button>
                  </div>

                  {habit.startTime && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, background: "#1f2937", borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ fontSize: 13 }}>🕐</span>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{habit.startTime}</span>
                      {habit.endTime && <>
                        <span style={{ color: C.muted, fontSize: 13 }}>→</span>
                        <span style={{ color: C.text, fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{habit.endTime}</span>
                        {dur && <span style={{ color: attr?.color || C.accent, fontSize: 11, marginLeft: 4 }}>⏱ {dur}</span>}
                      </>}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ background: `${col}20`, color: col, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{formatDaysLabel(getHabitDays(habit))}</span>
                    {attr && <span style={{ background: `${attr.color}20`, color: attr.color, borderRadius: 6, padding: "2px 8px", fontSize: 10 }}>{attr.icon} {attr.name}</span>}
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>+{habit.xp || 20} XP</span>
                    {streak > 0 && <span style={{ color: "#f59e0b", fontSize: 11 }}>🔥 {streak} dias</span>}
                    {!doneToday && isViewingToday && <span style={{ color: "#ef4444", fontSize: 10 }}>⚠️ -{Math.floor((habit.xp || 20) / 2)} XP se não cumprir hoje</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (6 - i));
                  const ds = d.toDateString();
                  const done = (habit.doneDates || []).includes(ds);
                  const isToday = ds === today;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>{["D","S","T","Q","Q","S","S"][d.getDay()]}</div>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 4, background: done ? (attr?.color || C.accent) : "#1f2937", border: isToday ? `1px solid ${attr?.color || C.accent}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done && <span style={{ fontSize: 8, color: "#000" }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
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
      setModal(null); showToast("Hábito criado!");
    };

    return (
      <ModalWrapper title="🔁 Novo Hábito">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Ícone</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {icons.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? C.accent : "#374151"}`, background: form.icon === ic ? `${C.accent}20` : "#1f2937", cursor: "pointer", fontSize: 18 }}>{ic}</button>
              ))}
            </div>
          </div>

          <div><label style={styles.label}>Nome do Hábito</label><input style={styles.input} placeholder="Ex: Leitura diária" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label style={styles.label}>Descrição (opcional)</label><input style={styles.input} placeholder="Detalhes do hábito..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>

          <div>
            <label style={styles.label}>⏰ Horário</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Início</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Fim</div>
                <input type="time" style={{ ...styles.input, fontSize: 18, fontWeight: 700, textAlign: "center" }} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            {dur && (
              <div style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "8px 12px", marginTop: 8, color: C.accent, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                ⏱ Duração: {dur}
              </div>
            )}
          </div>

          <div>
            <label style={styles.label}>📅 Dias da Semana</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <button onClick={() => setForm(f => ({ ...f, days: [0,1,2,3,4,5,6] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Todos</button>
              <button onClick={() => setForm(f => ({ ...f, days: [1,2,3,4,5] }))} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid #374151", background: "#1f2937", color: C.muted, fontSize: 11, cursor: "pointer" }}>Dias Úteis</button>
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

          <div><label style={styles.label}>XP por conclusão</label>
            <select style={styles.input} value={form.xp} onChange={e => setForm(f => ({ ...f, xp: Number(e.target.value) }))}>
              <option value={10}>10 XP (Leve)</option>
              <option value={20}>20 XP (Normal)</option>
              <option value={40}>40 XP (Intenso)</option>
              <option value={60}>60 XP (Épico)</option>
            </select>
          </div>

          <button style={{ ...styles.btnSolid(C.accent), width: "100%" }} onClick={save}>Criar Hábito</button>
        </div>
      </ModalWrapper>
    );
  }

  const tabs = [
    { id: "profile", icon: "⚔️", label: "Perfil" },
    { id: "tasks", icon: "📋", label: "Tarefas" },
    { id: "habits", icon: "🔁", label: "Hábitos" },
    { id: "goals", icon: "🎯", label: "Metas" },
    { id: "analytics", icon: "📊", label: "Análise" },
    { id: "achievements", icon: "🏆", label: "Conquistas" },
    { id: "vault", icon: "📚", label: "Cofre" },
  ];

  return (
    <div style={styles.app}>
      <div style={{ background: `linear-gradient(180deg, ${rank.bg}cc, transparent)`, padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
          <div>
            <div style={{ color: rank.color, fontSize: 10, fontWeight: 700, letterSpacing: 3 }}>C A T I V O</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Sistema de Evolução Pessoal</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: `${rank.color}20`, border: `1px solid ${rank.color}40`, borderRadius: 20, padding: "4px 12px" }}>
              <span style={{ color: rank.color, fontSize: 12, fontWeight: 700 }}>Nv. {level}</span>
            </div>
            <button style={{ background: "none", border: "1px solid #374151", borderRadius: 8, color: C.muted, padding: "6px 10px", cursor: "pointer", fontSize: 14 }} onClick={() => setModal("settings")}>⚙️</button>
          </div>
        </div>
      </div>

      <div>
        {tab === "profile" && <ProfileTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "goals" && <GoalsTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "habits" && <HabitsTab />}
        {tab === "achievements" && <AchievementsTab />}
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
            <button style={{ ...styles.btnSolid("#f59e0b"), marginTop: 16 }} onClick={() => setNewAchievement(null)}>Incrível!</button>
          </div>
        </div>
      )}
    </div>
  );
    }
