import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const sectionOrder = ["listening", "reading", "writing", "speaking"];
const sectionMeta = {
  listening: { name: "Listening", color: "#3b82f6" },
  reading: { name: "Reading", color: "#22c55e" },
  writing: { name: "Writing", color: "#eab308" },
  speaking: { name: "Speaking", color: "#ec4899" },
};

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(s) {
  const colors = ["#18181b", "#2563eb", "#7c3aed", "#db2777", "#059669", "#d97706", "#dc2626"];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcStreak(history) {
  if (!history.length) return 0;
  const dates = [...new Set(history.map((h) => new Date(h.date).toDateString()))].sort(
    (a, b) => new Date(b) - new Date(a)
  );
  let streak = 0;
  let check = new Date();
  check.setHours(0, 0, 0, 0);
  const today = check.toDateString();
  const yesterday = new Date(check - 86400000).toDateString();
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(check - i * 86400000).toDateString();
    if (dates[i] === expected) streak++;
    else break;
  }
  return streak;
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [history] = useState(() => JSON.parse(localStorage.getItem("emt_reports") || "[]"));
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profile, setProfile] = useState(() => {
    const p = JSON.parse(localStorage.getItem("emt_profile") || "null");
    if (p) return p;
    const defaultP = { name: user?.name || "User", email: user?.email || "", joined: new Date().toISOString().slice(0, 10) };
    localStorage.setItem("emt_profile", JSON.stringify(defaultP));
    return defaultP;
  });

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) setTab(t);
  }, [searchParams]);

  function handleSaveProfile() {
    if (!editName.trim() || !editEmail.trim()) return;
    const updated = { ...profile, name: editName.trim(), email: editEmail.trim() };
    setProfile(updated);
    localStorage.setItem("emt_profile", JSON.stringify(updated));
    setEditing(false);
  }

  function handleExport() {
    const data = JSON.stringify({ profile, history }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ept-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearData() {
    if (!confirm("Are you sure? This will permanently delete all your data.")) return;
    localStorage.removeItem("emt_reports");
    localStorage.removeItem("emt_profile");
    const defaultP = { name: user?.name || "User", email: user?.email || "", joined: new Date().toISOString().slice(0, 10) };
    setProfile(defaultP);
    window.location.reload();
  }

  function handleSignOut() {
    if (!confirm("Sign out? This will clear all local data.")) return;
    logout();
    navigate("/");
  }

  const total = history.length;
  const avgScore = useMemo(() => total ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / total) : 0, [history, total]);
  const streak = useMemo(() => calcStreak(history), [history]);
  const lastScore = total ? history[total - 1].percentage : null;

  const reversedHistory = useMemo(() => [...history].reverse(), [history]);

  const skillBreakdown = useMemo(() => {
    const totals = { listening: 0, reading: 0, writing: 0, speaking: 0 };
    const scores = { listening: 0, reading: 0, writing: 0, speaking: 0 };
    history.forEach((h) => {
      sectionOrder.forEach((s) => {
        scores[s] += h.scores?.[s] || 0;
        totals[s] += h.totals?.[s] || 0;
      });
    });
    return sectionOrder.map((s) => ({
      key: s,
      name: sectionMeta[s].name,
      color: sectionMeta[s].color,
      pct: totals[s] ? Math.round((scores[s] / totals[s]) * 100) : 0,
    }));
  }, [history]);

  return (
    <Layout>
      <div className="pb-16">
        {/* Avatar header */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-200 mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0"
            style={{ background: stringToColor(profile.name) }}
          >
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold tracking-tight text-slate-900">{profile.name}</div>
            <div className="text-sm text-slate-500 mt-0.5">{profile.email}</div>
            <div className="text-xs text-slate-400 mt-1">Joined {formatDate(profile.joined)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-8 overflow-x-auto">
          {["overview", "history", "settings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-center text-[13px] font-medium py-2 px-3 rounded-md transition-colors cursor-pointer border-none capitalize ${
                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 bg-transparent hover:text-slate-900"
              }`}
            >
              {t === "overview" ? "Overview" : t === "history" ? "Test History" : "Settings"}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Tests Taken", value: total },
                { label: "Avg Score", value: total ? `${avgScore}%` : "—" },
                { label: "Day Streak", value: streak },
                { label: "Last Score", value: lastScore !== null ? `${lastScore}%` : "—" },
              ].map((s) => (
                <div key={s.label} className="border border-slate-200 rounded-lg p-4 text-center">
                  <div className="text-[28px] font-bold tracking-tight leading-none text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {total ? (
              <>
                {/* Performance trend */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-slate-900">Performance Trend</div>
                  <span className="text-xs text-slate-400">{total} total</span>
                </div>
                <div className="flex gap-1 items-end h-[120px] mb-8 px-2">
                  {history.slice(-10).map((h) => {
                    const color = h.percentage >= 75 ? "#22c55e" : h.percentage >= 50 ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={h.id} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-[10px] text-slate-500 font-medium">{h.percentage}%</div>
                        <div
                          className="w-full max-w-[48px] rounded-t transition-all"
                          style={{ height: `${Math.max(h.percentage * 0.9, 4)}px`, background: color }}
                        />
                        <div className="text-[10px] text-slate-400">
                          {new Date(h.date).getDate()}/{new Date(h.date).getMonth() + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Skill breakdown */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-slate-900">Skill Breakdown</div>
                </div>
                <div className="space-y-2.5">
                  {skillBreakdown.map((s) => (
                    <div key={s.key} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-[70px] text-slate-700">{s.name}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${s.pct}%`, background: s.color }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 w-[36px] text-right">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-sm font-medium">No test data yet</div>
                <div className="text-xs mt-1">Complete your first test to see performance trends</div>
              </div>
            )}
          </>
        )}

        {/* History */}
        {tab === "history" && (
          <>
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-3">📝</div>
                <div className="text-sm font-medium">No tests completed yet</div>
                <div className="text-xs mt-1">Take a test to see your history here</div>
                <button
                  onClick={() => navigate("/test")}
                  className="mt-4 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:opacity-90 cursor-pointer border-none"
                >
                  Start a Test
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-slate-900">All Test Results</div>
                  <span className="text-xs text-slate-400">{history.length} total</span>
                </div>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {["Date", "Listen", "Read", "Write", "Speak", "Score", "Level"].map((c) => (
                          <th
                            key={c}
                            className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-2.5 border-b border-slate-200 bg-slate-50"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reversedHistory.map((h) => {
                        const badgeColor =
                          h.percentage >= 75
                            ? "bg-green-50 text-green-700"
                            : h.percentage >= 50
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-blue-50 text-blue-700";
                        return (
                          <tr key={h.id}>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200 font-medium">{formatDate(h.date)}</td>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200">{h.scores?.listening ?? 0}/{h.totals?.listening ?? 0}</td>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200">{h.scores?.reading ?? 0}/{h.totals?.reading ?? 0}</td>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200">{h.scores?.writing ?? 0}/{h.totals?.writing ?? 0}</td>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200">{h.scores?.speaking ?? 0}/{h.totals?.speaking ?? 0}</td>
                            <td className="text-[13px] px-4 py-3 border-b border-slate-200 font-semibold">{h.percentage}%</td>
                            <td className="px-4 py-3 border-b border-slate-200">
                              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                                {(h.level || "").split("(")[0].trim()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <>
            {editing ? (
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-4">Edit Profile</div>
                <div className="border border-slate-200 rounded-lg p-5 mb-6">
                  <div className="flex gap-3 items-center mb-3">
                    <span className="text-[13px] font-medium w-20 shrink-0 text-slate-700">Name</span>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-4">
                    <span className="text-[13px] font-medium w-20 shrink-0 text-slate-700">Email</span>
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3.5 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer bg-transparent border-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-3.5 py-2 bg-slate-900 text-white text-[13px] font-medium rounded-lg hover:opacity-90 cursor-pointer border-none"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-4">Account Settings</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 last:border-b-0">
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Profile</div>
                      <div className="text-xs text-slate-500 mt-0.5">{profile.name} · {profile.email}</div>
                    </div>
                    <button
                      onClick={() => { setEditing(true); setEditName(profile.name); setEditEmail(profile.email); }}
                      className="px-3 py-1.5 text-[13px] font-medium border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer bg-white"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Test History</div>
                      <div className="text-xs text-slate-500 mt-0.5">{history.length} test{history.length !== 1 ? "s" : ""} recorded</div>
                    </div>
                    <button
                      onClick={() => setTab("history")}
                      className="px-3 py-1.5 text-[13px] font-medium border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer bg-white"
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-900 mb-4">Data</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
                    <div>
                      <div className="text-[13px] font-medium text-slate-900">Export Data</div>
                      <div className="text-xs text-slate-500 mt-0.5">Download your profile and test history as JSON</div>
                    </div>
                    <button
                      onClick={handleExport}
                      className="px-3 py-1.5 text-[13px] font-medium border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer bg-white"
                    >
                      Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <div className="text-[13px] font-medium text-red-500">Clear All Data</div>
                      <div className="text-xs text-slate-500 mt-0.5">Permanently delete all test history and profile data</div>
                    </div>
                    <button
                      onClick={handleClearData}
                      className="px-3 py-1.5 text-[13px] font-medium bg-red-500 text-white border border-red-500 rounded-lg hover:opacity-90 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 text-[13px] font-medium bg-red-500 text-white border border-red-500 rounded-lg hover:opacity-90 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
