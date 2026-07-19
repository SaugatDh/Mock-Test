import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, User } from "lucide-react";

const demoAccounts = [
  {
    label: "Admin",
    email: "admin@example.com",
    password: "admin123",
    icon: Shield,
    color: "bg-violet-50 text-violet-700 ring-violet-200",
    desc: "Full access",
  },
  {
    label: "Student",
    email: "student1@example.com",
    password: "student123",
    icon: User,
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    desc: "Practice mode",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        navigate("/");
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 300);
  }

  function fillDemo(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-bold tracking-tight mx-auto mb-4">
            EPT
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            English Proficiency Test
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Sign in to start practising
          </p>
        </div>

        {/* Demo accounts */}
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <button
                key={account.email}
                onClick={() => fillDemo(account)}
                type="button"
                className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-200 text-left transition-all hover:border-slate-300 hover:shadow-sm cursor-pointer bg-white ${email === account.email ? "ring-2 ring-slate-900 border-slate-900" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ${account.color}`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-slate-900">
                    {account.label}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {account.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
