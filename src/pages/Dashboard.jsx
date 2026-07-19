import { useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const sections = [
  {
    key: "listening",
    icon: "🎧",
    name: "Listening",
    desc: "Listen to audio clips and answer questions",
    time: "12 min",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    key: "reading",
    icon: "📖",
    name: "Reading",
    desc: "Read passages and analyse texts",
    time: "15 min",
    color: "#22c55e",
    bg: "#f0fdf4",
  },
  {
    key: "writing",
    icon: "✏️",
    name: "Writing",
    desc: "Complete structured writing tasks",
    time: "25 min",
    color: "#eab308",
    bg: "#fefce8",
  },
  {
    key: "speaking",
    icon: "🎙️",
    name: "Speaking",
    desc: "Record spoken responses to prompts",
    time: "8 min",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history] = useState(() =>
    JSON.parse(localStorage.getItem("emt_reports") || "[]")
  );

  const lastResult = history.length > 0 ? history[history.length - 1] : null;

  return (
    <Layout>
      <div className="pb-16">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-[22px] font-bold tracking-tight text-slate-900 mb-1.5">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h2>
          <p className="text-sm text-slate-500">
            Test all four core skills or practise individually
          </p>
        </div>

        {/* Last result banner */}
        {lastResult && (
          <div className="bg-slate-100 rounded-lg px-5 py-4 mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-0.5">
                Last Test Result
              </div>
              <div className="text-lg font-bold text-slate-900">
                {lastResult.percentage}% · {lastResult.level}
              </div>
            </div>
            <button
              onClick={() => navigate("/account?tab=history")}
              className="px-3.5 py-2 text-[13px] font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View History
            </button>
          </div>
        )}

        {/* Section cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {sections.map((s) => (
            <div
              key={s.key}
              onClick={() => navigate("/test", { state: { startSection: s.key } })}
              className="border border-slate-200 rounded-lg p-5 cursor-pointer transition-all hover:border-slate-400 hover:shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="text-sm font-semibold text-slate-900 mb-1">
                {s.name}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {s.desc}
              </div>
              <div className="mt-2.5 text-[11px] text-slate-400 font-medium">
                {s.time}
              </div>
            </div>
          ))}
        </div>

        {/* Start Full Test */}
        <button
          onClick={() => navigate("/test")}
          className="w-full py-2.5 px-5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer border-none"
        >
          Start Full Test
        </button>
      </div>
    </Layout>
  );
}
