import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

// ── DATA ──
const listeningSections = [
  {
    title: "Conversation about university accommodation",
    questions: [
      { id: 1, q: "What type of accommodation does the student prefer?", options: ["A shared dormitory", "A private studio", "A homestay family", "A shared apartment"], correct: 1, explanation: "The student states a preference for a private studio for quiet study." },
      { id: 2, q: "How much is the student willing to pay per week?", options: ["$100–150", "$150–200", "$200–250", "$250–300"], correct: 1, explanation: "The student mentions a budget of $150–200 per week." },
      { id: 3, q: "What is the student's main concern?", options: ["Distance from campus", "Internet speed", "Noise level", "Food availability"], correct: 2, explanation: "The student repeatedly mentions needing a quiet environment." },
    ],
  },
  {
    title: "Monologue about a new library",
    questions: [
      { id: 4, q: "On which floor is the children's section?", options: ["Ground floor", "First floor", "Second floor", "Third floor"], correct: 1, explanation: "The speaker mentions the children's section is on the first floor." },
      { id: 5, q: "What time does the library close on weekdays?", options: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"], correct: 3, explanation: "The speaker states closing time is 8 PM on weekdays." },
    ],
  },
];

const readingPassages = [
  {
    title: "The Rise of Four-Day Work Weeks",
    text: "In recent years, a growing number of companies have experimented with a four-day work week, and the results have been striking. A large-scale trial conducted in the United Kingdom in 2022 involved sixty-one companies and approximately 2,900 workers. Over the six-month trial period, revenue at participating companies rose by an average of 1.4%, while employee stress and burnout dropped significantly. Perhaps most notably, 92% of the companies that participated chose to continue with the shorter schedule after the trial ended.\n\nCritics argue that a four-day model is impractical for industries that require continuous coverage, such as healthcare and emergency services. However, proponents counter that flexible scheduling can still be implemented in these sectors through staggered shifts. The debate ultimately comes down to whether productivity is measured by hours spent at a desk or by outcomes achieved.",
    questions: [
      { id: 1, q: "What happened to revenue at companies in the UK trial?", options: ["It decreased significantly", "It remained exactly the same", "It increased by a small margin", "It doubled"], correct: 2, explanation: "Revenue rose by an average of 1.4%, a small increase." },
      { id: 2, q: "What is the main argument of critics?", options: ["It is too expensive", "It doesn't improve productivity", "Certain industries cannot operate with reduced schedules", "Employees prefer five days"], correct: 2, explanation: "Critics say it is impractical for industries requiring continuous coverage." },
      { id: 3, q: "The word 'proponents' most nearly means:", options: ["Opponents", "Supporters", "Employers", "Researchers"], correct: 1, explanation: "Proponents are people who advocate for or support an idea." },
    ],
  },
];

const writingTasks = [
  {
    type: "Task 1 — Formal Email",
    title: "Write a formal email (minimum 120 words)",
    prompt: "You recently attended a professional development workshop organised by your company. However, you were disappointed with several aspects.\n\nWrite an email to the workshop organiser. In your email:\n• Express your disappointment politely\n• Explain the specific issues you encountered\n• Suggest improvements for future events",
    minWords: 120,
    sample: "Dear Ms. Thompson,\n\nI am writing to share some feedback regarding the Professional Development Workshop held on 15 March.\n\nWhile I appreciated the effort that went into organising the event, I was disappointed by a few aspects. Firstly, the venue was quite cramped for the number of attendees. Additionally, some presentations lacked practical examples.\n\nI also felt there were limited opportunities for networking. Perhaps a dedicated networking session would encourage more interaction.\n\nI hope you find this feedback constructive.\n\nYours sincerely,\n[Your Name]",
  },
  {
    type: "Task 2 — Opinion Essay",
    title: "Write an opinion essay (minimum 200 words)",
    prompt: "Some people believe universities should focus on preparing students for the workforce. Others argue the main purpose is to develop critical thinking.\n\nWrite an essay in which you:\n• Discuss both viewpoints\n• Give your own opinion\n• Provide reasons and examples",
    minWords: 200,
    sample: "The purpose of university education has long been debated. Some argue that higher education should prioritise workforce readiness, while others believe universities should focus on intellectual development.\n\nOn one hand, those who favour career-oriented education point to the rising cost of tuition and the expectation that graduates should be employable.\n\nOn the other hand, critics argue that universities have a broader mission: to cultivate independent thought and analytical reasoning.\n\nIn my view, the two approaches are not mutually exclusive. Universities can equip students with career-relevant skills while also fostering critical thinking.",
  },
];

const speakingTasks = [
  {
    title: "Task 1 — Self Introduction",
    prompt: "Introduce yourself to a new colleague. Talk about:\n• Your background and education\n• Your current role\n• What you enjoy most about your work\n\nYou have 2 minutes.",
    tips: "Speak clearly at a natural pace. Aim for at least 60 seconds of speech.",
    sample: "Hi, it's great to meet you! My name is Alex, and I graduated from the University of Edinburgh with a degree in Computer Science about three years ago. Since then, I've been working as a software developer at a mid-sized tech company that specialises in healthcare applications.\n\nIn my current role, I'm part of a team that builds and maintains the patient records system used by several hospitals across the country. My main responsibilities include writing code, reviewing pull requests, and occasionally meeting with clients.\n\nWhat I enjoy most about my work is the problem-solving aspect. Every day brings a different challenge, and I find it really satisfying to debug a tricky issue or come up with an elegant solution.",
  },
  {
    title: "Task 2 — Opinion Response",
    prompt: "Some people say social media has a negative effect on society. Others believe it is a powerful tool for communication.\n\nWhat is your opinion? Explain with examples.\n\nYou have 2 minutes.",
    tips: "State your position clearly, then support it with two reasons or examples.",
    sample: "I think social media is a double-edged sword, but on balance, I believe its positive potential outweighs the negatives — provided people use it responsibly.\n\nOn the negative side, there's no question that misinformation spreads rapidly on platforms like Twitter and Facebook. During the pandemic, for example, we saw dangerous health advice go viral.\n\nHowever, I think we should also recognise the enormous good that social media has enabled. Movements like the Arab Spring and Black Lives Matter relied heavily on social media to organise and raise awareness.\n\nSo in my view, the key isn't to abandon social media but to promote digital literacy.",
  },
];

const sectionOrder = ["listening", "reading", "writing", "speaking"];
const sectionMeta = {
  listening: { name: "Listening", icon: "🎧", color: "#3b82f6", bg: "#eff6ff" },
  reading: { name: "Reading", icon: "📖", color: "#22c55e", bg: "#f0fdf4" },
  writing: { name: "Writing", icon: "✏️", color: "#eab308", bg: "#fefce8" },
  speaking: { name: "Speaking", icon: "🎙️", color: "#ec4899", bg: "#fdf2f8" },
};

// ── HOISTED DERIVED DATA ──
const allListeningQ = listeningSections.flatMap((s, si) =>
  s.questions.map((q, qi) => ({ ...q, sectionIdx: si, localIdx: qi }))
);
const allReadingQ = readingPassages.flatMap((p, pi) =>
  p.questions.map((q, qi) => ({ ...q, passageIdx: pi, localIdx: qi }))
);
const totalBySection = {
  listening: allListeningQ.length,
  reading: allReadingQ.length,
  writing: writingTasks.length,
  speaking: speakingTasks.length,
};

// ── HELPERS ──
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function isSectionDone(section, state) {
  if (section === "listening") return Object.keys(state.answers.listening).length >= allListeningQ.length;
  if (section === "reading") return Object.keys(state.answers.reading).length >= allReadingQ.length;
  if (section === "writing") return writingTasks.every((_, i) => (state.writingTexts[i] || "").trim().length > 20);
  if (section === "speaking") return speakingTasks.every((_, i) => state.recordings[i]);
  return false;
}

// ── REDUCER ──
const initialState = {
  screen: "test",
  section: "listening",
  qIdx: 0,
  answers: { listening: {}, reading: {} },
  writingTexts: {},
  recordings: {},
  recBlobUrls: {},
  reviewed: {},
  reviewSection: null,
  timerLeft: 3600,
};

function testReducer(state, action) {
  switch (action.type) {
    case "SET_SECTION":
      return { ...state, section: action.section, qIdx: 0 };
    case "SET_QIDX":
      return { ...state, qIdx: action.qIdx };
    case "SET_ANSWER":
      return { ...state, answers: { ...state.answers, [action.section]: { ...state.answers[action.section], [action.qIdx]: action.option } } };
    case "SET_WRITING_TEXT":
      return { ...state, writingTexts: { ...state.writingTexts, [action.qIdx]: action.text } };
    case "SET_RECORDING":
      return { ...state, recordings: { ...state.recordings, [action.qIdx]: action.recording } };
    case "SET_REC_BLOB_URL":
      return { ...state, recBlobUrls: { ...state.recBlobUrls, [action.qIdx]: action.url } };
    case "TOGGLE_REVIEWED":
      return { ...state, reviewed: { ...state.reviewed, [action.key]: !state.reviewed[action.key] } };
    case "SET_REVIEW_SECTION":
      return { ...state, reviewSection: action.section };
    case "TICK_TIMER":
      return { ...state, timerLeft: Math.max(state.timerLeft - 1, 0) };
    case "SHOW_RESULTS":
      return { ...state, screen: "results", timerLeft: 0 };
    case "SHOW_REVIEW":
      return { ...state, screen: "review", reviewSection: null };
    case "RESET":
      return { ...initialState, section: action.section || "listening" };
    default:
      return state;
  }
}

// ── OPTION BUTTON ──
function OptionButton({ letter, text, isSelected, isCorrect, isIncorrect, disabled, onClick }) {
  let cls = "flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-[14px] text-left w-full bg-white text-slate-900 cursor-pointer transition-all hover:bg-slate-50";
  if (disabled) {
    if (isCorrect) cls = "flex items-center gap-3 px-4 py-3 border border-green-500 bg-green-50 rounded-lg text-[14px] text-left w-full text-green-800 cursor-default";
    else if (isIncorrect) cls = "flex items-center gap-3 px-4 py-3 border border-red-400 bg-red-50 rounded-lg text-[14px] text-left w-full text-red-800 cursor-default";
    else cls = "flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg text-[14px] text-left w-full bg-white text-slate-900 cursor-default opacity-60";
  } else if (isSelected) {
    cls = "flex items-center gap-3 px-4 py-3 border border-slate-900 bg-slate-100 rounded-lg text-[14px] text-left w-full text-slate-900 cursor-pointer";
  }

  const letterCls = `flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold ${
    isCorrect ? "bg-green-500 text-white border-green-500"
    : isIncorrect ? "bg-red-500 text-white border-red-500"
    : isSelected ? "bg-slate-900 text-white border-slate-900"
    : "border-slate-300 text-slate-500"
  }`;

  return (
    <button className={cls} disabled={disabled} onClick={onClick}>
      <span className={letterCls}>{letter}</span>
      <span>{text}</span>
    </button>
  );
}

// ── LISTENING SECTION ──
function ListeningSection({ qIdx, answers, dispatch }) {
  const q = allListeningQ[qIdx];
  if (!q) return null;
  const answered = answers.listening[qIdx] !== undefined;
  const letters = ["A", "B", "C", "D"];

  return (
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        🎧 Listening — Question {qIdx + 1}/{totalBySection.listening}
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4">
        <p className="text-[13px] font-medium text-slate-700">{listeningSections[q.sectionIdx].title}</p>
      </div>
      <p className="text-[15px] font-medium text-slate-900 leading-relaxed mb-5">{q.q}</p>
      <div className="flex flex-col gap-2 mb-4">
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            letter={letters[i]}
            text={opt}
            isSelected={answers.listening[qIdx] === i}
            isCorrect={answered && i === q.correct}
            isIncorrect={answered && answers.listening[qIdx] === i && i !== q.correct}
            disabled={answered}
            onClick={() => dispatch({ type: "SET_ANSWER", section: "listening", qIdx, option: i })}
          />
        ))}
      </div>
      {answered && (
        <div className="p-4 bg-slate-50 rounded-lg text-[13px] text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}

// ── READING SECTION ──
function ReadingSection({ qIdx, answers, dispatch }) {
  const q = allReadingQ[qIdx];
  if (!q) return null;
  const answered = answers.reading[qIdx] !== undefined;
  const letters = ["A", "B", "C", "D"];

  return (
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        📖 Reading — Question {qIdx + 1}/{totalBySection.reading}
      </div>
      <div className="bg-slate-100 rounded-lg p-5 mb-4 text-[14px] leading-relaxed text-slate-800">
        <strong className="block mb-2">{readingPassages[q.passageIdx].title}</strong>
        {readingPassages[q.passageIdx].text.split("\n\n").map((p, i) => (
          <p key={i} className="mb-3">{p}</p>
        ))}
      </div>
      <p className="text-[15px] font-medium text-slate-900 leading-relaxed mb-5">{q.q}</p>
      <div className="flex flex-col gap-2 mb-4">
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            letter={letters[i]}
            text={opt}
            isSelected={answers.reading[qIdx] === i}
            isCorrect={answered && i === q.correct}
            isIncorrect={answered && answers.reading[qIdx] === i && i !== q.correct}
            disabled={answered}
            onClick={() => dispatch({ type: "SET_ANSWER", section: "reading", qIdx, option: i })}
          />
        ))}
      </div>
      {answered && (
        <div className="p-4 bg-slate-50 rounded-lg text-[13px] text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}

// ── WRITING SECTION ──
function WritingSection({ qIdx, writingTexts, reviewed, dispatch }) {
  const task = writingTasks[qIdx];
  if (!task) return null;
  const text = writingTexts[qIdx] || "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const meet = words >= task.minWords;
  const showS = reviewed["w" + qIdx];

  return (
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        ✏️ Writing — Task {qIdx + 1}/{totalBySection.writing}
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{task.type}</div>
          <div className="text-sm font-semibold text-slate-900">{task.title}</div>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{task.prompt}</p>
        </div>
      </div>
      <div className="relative mb-3">
        <textarea
          value={text}
          onChange={(e) => dispatch({ type: "SET_WRITING_TEXT", qIdx, text: e.target.value })}
          placeholder="Begin writing here..."
          className="w-full min-h-[200px] p-4 border border-slate-200 rounded-lg text-sm text-slate-800 leading-relaxed outline-none focus:border-slate-900 resize-y"
        />
        <span className={`absolute bottom-2.5 right-3 text-[11px] bg-white px-2 py-0.5 rounded ${meet ? "text-green-600 font-medium" : "text-slate-400"}`}>
          {words}/{task.minWords} words
        </span>
      </div>
      <button
        onClick={() => dispatch({ type: "TOGGLE_REVIEWED", key: "w" + qIdx })}
        className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer bg-transparent border-none mb-4"
      >
        {showS ? "Hide" : "Show"} Sample Answer
      </button>
      {showS && (
        <div className="p-4 bg-slate-50 rounded-lg text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
          <strong className="text-slate-900">Sample Answer:</strong><br /><br />
          {task.sample}
        </div>
      )}
    </div>
  );
}

// ── SPEAKING SECTION ──
function SpeakingSection({ qIdx, recordings, recBlobUrls, reviewed, onToggleRecording, recActive, recElapsed }) {
  const task = speakingTasks[qIdx];
  if (!task) return null;
  const hasRec = !!recordings[qIdx];
  const showS = reviewed["s" + qIdx];

  return (
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        🎙️ Speaking — Task {qIdx + 1}/{totalBySection.speaking}
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-900">
          {task.title}
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">{task.prompt}</p>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onToggleRecording}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                recActive
                  ? "border-red-500 bg-red-500 animate-pulse"
                  : "border-slate-200 bg-white hover:border-red-400 hover:bg-red-50"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={recActive ? "#fff" : "var(--destructive, #ef4444)"}>
                <rect x="8" y="2" width="8" height="12" rx="4" />
                <path d="M5 11a7 7 0 0 0 14 0" fill="none" stroke={recActive ? "#fff" : "var(--destructive, #ef4444)"} strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="18" x2="12" y2="22" stroke={recActive ? "#fff" : "var(--destructive, #ef4444)"} strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="22" x2="16" y2="22" stroke={recActive ? "#fff" : "var(--destructive, #ef4444)"} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <span className="text-[13px] font-medium text-slate-500">
              {recActive ? fmtTime(recElapsed) : hasRec ? `✓ Recorded (${fmtTime(recordings[qIdx].duration)})` : "Click to record"}
            </span>
          </div>
          {hasRec && recBlobUrls[qIdx] && (
            <audio controls className="w-full h-9 mb-3" src={recBlobUrls[qIdx]} />
          )}
          <div className="text-xs text-slate-500 leading-relaxed p-3 bg-slate-50 rounded-lg">
            💡 {task.tips}
          </div>
        </div>
      </div>
      <button
        className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer bg-transparent border-none mb-4"
      >
        {showS ? "Hide" : "Show"} Sample Response
      </button>
      {showS && (
        <div className="p-4 bg-slate-50 rounded-lg text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
          <strong className="text-slate-900">Sample Response:</strong><br /><br />
          {task.sample}
        </div>
      )}
    </div>
  );
}

// ── RESULTS VIEW ──
function ResultsView({ state, dispatch, navigate }) {
  const lc = Object.values(state.answers.listening).filter((v, i) => v === allListeningQ[i]?.correct).length;
  const lt = allListeningQ.length;
  const rc = Object.values(state.answers.reading).filter((v, i) => v === allReadingQ[i]?.correct).length;
  const rt = allReadingQ.length;
  const wd = writingTasks.filter((_, i) => (state.writingTexts[i] || "").trim().length > 20).length;
  const wc = writingTasks.length;
  const sd = speakingTasks.filter((_, i) => state.recordings[i]).length;
  const sc = speakingTasks.length;
  const total = lc + rc + wd + sd;
  const totalP = lt + rt + wc + sc;
  const pct = Math.round((total / totalP) * 100);

  let level, msg;
  if (pct >= 90) { level = "Advanced (C1–C2)"; msg = "Outstanding command of English across all four skills."; }
  else if (pct >= 75) { level = "Upper-Intermediate (B2)"; msg = "Strong performance with solid skills in most areas."; }
  else if (pct >= 55) { level = "Intermediate (B1)"; msg = "Good foundation with room for targeted improvement."; }
  else if (pct >= 35) { level = "Elementary (A2)"; msg = "Basic skills present — focused practice will help."; }
  else { level = "Beginner (A1)"; msg = "Keep practising — structured study will build your foundation."; }

  const secs = useMemo(() => [
    { name: "Listening", e: lc, t: lt, p: Math.round((lc / lt) * 100) },
    { name: "Reading", e: rc, t: rt, p: Math.round((rc / rt) * 100) },
    { name: "Writing", e: wd, t: wc, p: Math.round((wd / wc) * 100) },
    { name: "Speaking", e: sd, t: sc, p: Math.round((sd / sc) * 100) },
  ], [lc, lt, rc, rt, wd, wc, sd, sc]);

  function handleSaveAndReview() {
    const reports = JSON.parse(localStorage.getItem("emt_reports") || "[]");
    reports.push({
      id: Date.now(),
      date: new Date().toISOString(),
      scores: { listening: lc, reading: rc, writing: wd, speaking: sd },
      totals: { listening: lt, reading: rt, writing: wc, speaking: sc },
      percentage: pct,
      level,
    });
    localStorage.setItem("emt_reports", JSON.stringify(reports));
    dispatch({ type: "SHOW_REVIEW" });
  }

  return (
    <div className="pb-16">
      <div className="text-center py-12">
        <div className="text-[72px] font-bold tracking-tight leading-none text-slate-900">
          {pct}<span className="text-[28px] font-medium text-slate-400">%</span>
        </div>
        <div className="text-base font-semibold text-slate-900 mt-2">{level}</div>
        <div className="text-sm text-slate-500 mt-1 max-w-[440px] mx-auto">{msg}</div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
        <div className="px-5 py-3.5 border-b border-slate-200 text-sm font-semibold text-slate-900">
          Section Breakdown
        </div>
        {secs.map((s) => (
          <div key={s.name} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 last:border-b-0">
            <div className="flex-1 mr-5">
              <div className="text-[13px] font-medium text-slate-900 mb-1.5">{s.name}</div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 rounded-full transition-all" style={{ width: `${s.p}%` }} />
              </div>
            </div>
            <div className="text-[13px] font-semibold text-slate-500 whitespace-nowrap">{s.e}/{s.t}</div>
          </div>
        ))}
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-900">Writing Submissions</div>
        <div className="p-5 text-[13px] text-slate-600 leading-relaxed">
          {writingTasks.map((t, i) => {
            const w = (state.writingTexts[i] || "").trim().split(/\s+/).filter(Boolean).length;
            return <p key={i} className="mb-2 last:mb-0"><strong className="text-slate-900">{t.type}:</strong> {w > 20 ? `${w} words submitted ✓` : "Not submitted"}</p>;
          })}
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-900">Speaking Recordings</div>
        <div className="p-5 text-[13px] text-slate-600 leading-relaxed">
          {speakingTasks.map((t, i) => {
            const r = state.recordings[i];
            return <p key={i} className="mb-2 last:mb-0"><strong className="text-slate-900">{t.title}:</strong> {r ? `Recorded (${fmtTime(r.duration)}) ✓` : "Not recorded"}</p>;
          })}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={handleSaveAndReview} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:opacity-90 cursor-pointer border-none">
          Save & Review
        </button>
        <button onClick={() => navigate("/")} className="px-5 py-2.5 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 cursor-pointer bg-white">
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ── REVIEW VIEW ──
function ReviewView({ state, dispatch, navigate }) {
  const letters = ["A", "B", "C", "D"];
  const show = (s) => !state.reviewSection || state.reviewSection === s;

  function makeReviewQ(head, text, options, correct, ans) {
    return (
      <div key={head} className="border border-slate-200 rounded-lg overflow-hidden mb-3">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-900">{head}</div>
        <div className="p-5 text-[13px] text-slate-600 leading-relaxed">
          <p className="font-medium text-slate-900 mb-2">{text}</p>
          {options.map((o, i) => (
            <span key={i} className="block py-0.5" style={{
              color: i === correct ? "#16a34a" : i === ans && i !== correct ? "#ef4444" : undefined,
              fontWeight: i === correct ? 500 : undefined,
              textDecoration: i === ans && i !== correct ? "line-through" : undefined,
            }}>
              {letters[i]}. {o}{i === correct ? " ✅" : i === ans && i !== correct ? " ❌" : ""}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 overflow-x-auto">
        <button
          onClick={() => dispatch({ type: "SET_REVIEW_SECTION", section: null })}
          className={`flex-1 text-center text-[13px] font-medium py-2 px-3 rounded-md transition-colors cursor-pointer border-none ${
            !state.reviewSection ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 bg-transparent hover:text-slate-900"
          }`}
        >
          All
        </button>
        {sectionOrder.map((s) => (
          <button
            key={s}
            onClick={() => dispatch({ type: "SET_REVIEW_SECTION", section: s })}
            className={`flex-1 text-center text-[13px] font-medium py-2 px-3 rounded-md transition-colors cursor-pointer border-none whitespace-nowrap ${
              state.reviewSection === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 bg-transparent hover:text-slate-900"
            }`}
          >
            {sectionMeta[s].name}
          </button>
        ))}
      </div>

      {show("listening") && (
        <>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 mt-6">🎧 Listening</div>
          {listeningSections.flatMap((a, ai) =>
            a.questions.map((q, qi) => {
              const gi = listeningSections.slice(0, ai).reduce((s, sec) => s + sec.questions.length, 0) + qi;
              return makeReviewQ(`${a.title} — Q${qi + 1}`, q.q, q.options, q.correct, state.answers.listening[gi]);
            })
          )}
        </>
      )}

      {show("reading") && (
        <>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 mt-6">📖 Reading</div>
          {readingPassages.flatMap((p, pi) =>
            p.questions.map((q, qi) => {
              const gi = readingPassages.slice(0, pi).reduce((s, pp) => s + pp.questions.length, 0) + qi;
              return makeReviewQ(`${p.title} — Q${qi + 1}`, q.q, q.options, q.correct, state.answers.reading[gi]);
            })
          )}
        </>
      )}

      {show("writing") && (
        <>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 mt-6">✏️ Writing</div>
          {writingTasks.map((t, i) => {
            const text = state.writingTexts[i] || "";
            const w = text.trim() ? text.trim().split(/\s+/).length : 0;
            return (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden mb-3">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-900">{t.type}</div>
                <div className="p-5 text-[13px] text-slate-600 leading-relaxed">
                  <p className="mb-2"><strong className="text-slate-900">Your response:</strong> {w > 20 ? `${w} words submitted` : "Not submitted"}</p>
                  {w > 20 && <div className="bg-slate-50 p-3 rounded-lg mb-3 text-sm max-h-[200px] overflow-y-auto whitespace-pre-line">{text}</div>}
                  <p className="mb-1"><strong className="text-slate-900">Sample Answer:</strong></p>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm whitespace-pre-line">{t.sample}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {show("speaking") && (
        <>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 mt-6">🎙️ Speaking</div>
          {speakingTasks.map((t, i) => {
            const r = state.recordings[i];
            return (
              <div key={i} className="border border-slate-200 rounded-lg overflow-hidden mb-3">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-900">{t.title}</div>
                <div className="p-5 text-[13px] text-slate-600 leading-relaxed">
                  <p className="mb-2"><strong className="text-slate-900">Your recording:</strong> {r ? `Recorded (${fmtTime(r.duration)})` : "Not recorded"}</p>
                  {r && state.recBlobUrls[i] && <audio controls className="w-full h-9 mb-3" src={state.recBlobUrls[i]} />}
                  <p className="mb-1"><strong className="text-slate-900">Sample Response:</strong></p>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm whitespace-pre-line">{t.sample || "No sample available."}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      <div className="flex gap-2 justify-center py-6">
        <button onClick={() => navigate("/")} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:opacity-90 cursor-pointer border-none">
          Back to Home
        </button>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-5 py-2.5 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 cursor-pointer bg-white"
        >
          Retake Test
        </button>
      </div>
    </div>
  );
}

// ── MAIN TEST COMPONENT ──
export default function Test() {
  const navigate = useNavigate();
  const location = useLocation();
  const startSection = location.state?.startSection;

  const [state, dispatch] = useReducer(testReducer, initialState, (init) => ({
    ...init,
    section: startSection || "listening",
  }));

  const timerRef = useRef(null);
  const recTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recElapsedRef = useRef(0);
  const [recActive, setRecActive] = useState(false);
  const [recElapsed, setRecElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (state.screen !== "test") return;
    timerRef.current = setInterval(() => {
      setTimerLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          dispatch({ type: "SHOW_RESULTS" });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state.screen]);

  function setTimerLeft() {
    dispatch({ type: "TICK_TIMER" });
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    };
  }, []);

  const currentTotal = totalBySection[state.section];

  // ── NAVIGATION ──
  function nextQ() {
    if (state.qIdx < currentTotal - 1) {
      dispatch({ type: "SET_QIDX", qIdx: state.qIdx + 1 });
    } else {
      const ci = sectionOrder.indexOf(state.section);
      if (ci < sectionOrder.length - 1) {
        dispatch({ type: "SET_SECTION", section: sectionOrder[ci + 1] });
      } else {
        dispatch({ type: "SHOW_RESULTS" });
      }
    }
  }

  function prevQ() {
    if (state.qIdx > 0) {
      dispatch({ type: "SET_QIDX", qIdx: state.qIdx - 1 });
    } else {
      const ci = sectionOrder.indexOf(state.section);
      if (ci > 0) {
        const prevSection = sectionOrder[ci - 1];
        dispatch({ type: "SET_SECTION", section: prevSection });
        dispatch({ type: "SET_QIDX", qIdx: totalBySection[prevSection] - 1 });
      }
    }
  }

  // ── RECORDING ──
  const handleToggleRecording = useCallback(async () => {
    if (recActive) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      setRecActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        audioChunksRef.current = [];
        recElapsedRef.current = 0;

        mr.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mr.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          const elapsed = recElapsedRef.current;
          dispatch({ type: "SET_RECORDING", qIdx: state.qIdx, recording: { blob, duration: elapsed } });
          dispatch({ type: "SET_REC_BLOB_URL", qIdx: state.qIdx, url });
          stream.getTracks().forEach((t) => t.stop());
        };

        mr.start();
        setRecActive(true);
        setRecElapsed(0);
        recElapsedRef.current = 0;
        recTimerRef.current = setInterval(() => {
          recElapsedRef.current += 1;
          setRecElapsed(recElapsedRef.current);
        }, 1000);
      } catch {
        alert("Microphone access required for speaking tasks.");
      }
    }
  }, [recActive, state.qIdx]);

  // ── RENDER ──
  return (
    <Layout>
      {state.screen === "results" && <ResultsView state={state} dispatch={dispatch} navigate={navigate} />}
      {state.screen === "review" && <ReviewView state={state} dispatch={dispatch} navigate={navigate} />}
      {state.screen === "test" && (
        <div className="pb-16">
          {/* Section tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-5 overflow-x-auto">
            {sectionOrder.map((s) => {
              const meta = sectionMeta[s];
              const active = s === state.section;
              const done = isSectionDone(s, state);
              return (
                <button
                  key={s}
                  onClick={() => dispatch({ type: "SET_SECTION", section: s })}
                  className={`flex-1 text-center text-[13px] font-medium py-2 px-3 rounded-md transition-colors cursor-pointer border-none whitespace-nowrap ${
                    active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 bg-transparent hover:text-slate-900"
                  }`}
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${done ? "bg-green-500" : "bg-slate-300"}`} />
                  {meta.name}
                </button>
              );
            })}
          </div>

          {/* Timer + progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {sectionMeta[state.section].icon} {sectionMeta[state.section].name}
            </span>
            <span className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg tabular-nums ${
              state.timerLeft <= 120 ? "bg-red-50 text-red-500 animate-pulse" : "bg-slate-100 text-slate-700"
            }`}>
              {String(Math.floor(state.timerLeft / 60)).padStart(2, "0")}:{String(state.timerLeft % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full transition-all" style={{ width: `${((state.qIdx + 1) / currentTotal) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-400 font-medium tabular-nums whitespace-nowrap">
              {state.qIdx + 1}/{currentTotal}
            </span>
          </div>

          {/* Section content */}
          <div className="mb-6">
            {state.section === "listening" && <ListeningSection qIdx={state.qIdx} answers={state.answers} dispatch={dispatch} />}
            {state.section === "reading" && <ReadingSection qIdx={state.qIdx} answers={state.answers} dispatch={dispatch} />}
            {state.section === "writing" && <WritingSection qIdx={state.qIdx} writingTexts={state.writingTexts} reviewed={state.reviewed} dispatch={dispatch} />}
            {state.section === "speaking" && (
              <SpeakingSection
                qIdx={state.qIdx}
                recordings={state.recordings}
                recBlobUrls={state.recBlobUrls}
                reviewed={state.reviewed}
                onToggleRecording={handleToggleRecording}
                recActive={recActive}
                recElapsed={recElapsed}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <button
              onClick={prevQ}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer bg-transparent border-none"
              style={{ visibility: state.qIdx === 0 && sectionOrder.indexOf(state.section) === 0 ? "hidden" : "visible" }}
            >
              Back
            </button>
            <button
              onClick={nextQ}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:opacity-90 cursor-pointer border-none"
            >
              {state.section === "speaking" && state.qIdx === totalBySection.speaking - 1 ? "View Results" : "Next"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
