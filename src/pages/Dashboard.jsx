import { useState, startTransition, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  PenTool,
  Mic,
  Headphones,
  BookOpen,
  ChevronRight,
  LogOut,
  FileText,
} from "lucide-react";

const skills = [
  { label: "Writing", icon: PenTool, desc: "Task 1 & Task 2 essays", to: "/writing" },
  { label: "Reading", icon: BookOpen, desc: "Academic & General passages", to: "/reading" },
  { label: "Listening", icon: Headphones, desc: "Sections 1–4 with audio", to: "/listening" },
  { label: "Speaking", icon: Mic, desc: "Parts 1, 2 & 3 interviews", to: "/speaking" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("Home");
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("emt_reports") || "[]");
    setReports(saved);
  }, [tab]);

  return (
    <Layout title="Dashboard">
      <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-6">
        {["Home", "Reports"].map((t) => (
          <button
            key={t}
            onClick={() => startTransition(() => setTab(t))}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              tab === t
                ? "bg-slate-900 text-white font-medium"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Home" && (
        <>
          {/* Welcome */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Welcome{user?.name ? `, ${user.name}` : ""}
              </h2>
              <p className="text-sm text-slate-500">Choose a skill to start practicing</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-slate-600"
              onClick={logout}
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {skills.map(({ label, icon: Icon, desc, to }) => (
              <Card
                key={label}
                className="p-4 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => navigate(to)}
              >
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 mb-3">
                  <Icon size={15} />
                </div>
                <h4 className="text-sm font-medium text-slate-900">{label}</h4>
                <p className="text-xs text-slate-500 mt-1 mb-3">{desc}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                  Start Practice <ChevronRight size={13} />
                </div>
              </Card>
            ))}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tests Taken", value: reports.length },
              { label: "Avg Score", value: reports.length > 0 ? (reports.reduce((a, r) => a + (r.score?.overall || 0), 0) / reports.length).toFixed(1) : "—" },
              { label: "Writing Tests", value: reports.filter((r) => r.type === "Writing").length },
              { label: "Speaking Tests", value: reports.filter((r) => r.type === "Speaking").length },
            ].map(({ label, value }) => (
              <Card key={label} className="p-4 border-slate-200 rounded-xl text-center">
                <div className="text-xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "Reports" && (
        <Card className="border-slate-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 bg-slate-50 border-y border-slate-200 px-5 py-3 text-xs font-medium text-slate-500">
            {["Date", "Type", "Task", "Score", "Details"].map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>

          {reports.length === 0 ? (
            <div className="py-16 text-center px-5">
              <FileText size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-800">No reports yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Complete a mock test to see your results here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {[...reports].reverse().map((r, i) => (
                <div key={i} className="grid grid-cols-5 items-center px-5 py-3 text-sm">
                  <span className="text-slate-500">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-slate-100 text-slate-700"
                  >
                    {r.type}
                  </Badge>
                  <span className="text-slate-700">{r.task || "—"}</span>
                  <span className="font-semibold text-slate-900">
                    {r.score?.overall ?? "—"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {r.wordCount ? `${r.wordCount} words` : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-400">
              {reports.length} record{reports.length !== 1 ? "s" : ""}
            </p>
          </div>
        </Card>
      )}
    </Layout>
  );
}
