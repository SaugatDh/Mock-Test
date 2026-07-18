import { NavLink } from "react-router-dom";
import {
  Home,
  PenTool,
  Mic,
  Headphones,
  BookOpen,
  Star,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Writing", icon: PenTool, to: "/writing" },
  { label: "Speaking", icon: Mic, to: "/speaking" },
  { label: "Listening", icon: Headphones, to: "/listening" },
  { label: "Reading", icon: BookOpen, to: "/reading" },
  { label: "Sample Reports", icon: Star, to: "/sample-reports" },
  { label: "Lessons", icon: GraduationCap, to: "/lessons" },
];

const secondaryNavItems = [{ label: "Help", icon: HelpCircle, to: "/help" }];

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`${collapsed ? "w-[76px]" : "w-[264px]"} shrink-0 bg-slate-900 text-slate-200 flex flex-col transition-all duration-200 h-screen sticky top-0`}
    >
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-semibold text-white text-sm tracking-wide">
              English Mock Test
            </div>
          </div>
        )}
        {collapsed && (
          <div className="font-semibold text-white text-sm">EMT</div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-amber-400 text-slate-900 font-medium"
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        <div className="my-3 border-t border-white/10" />

        {secondaryNavItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-amber-400 text-slate-900 font-medium"
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
