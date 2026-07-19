import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, Settings, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Practice", to: "/test" },
  { label: "Account", to: "/account" },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  function isActive(to) {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  }

  function handleSignOut() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-[1080px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[13px] font-bold tracking-tight">
                EPT
              </div>
              <span className="text-[15px] font-semibold text-slate-900 tracking-tight">
                English Test
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-medium no-underline transition-colors ${
                    isActive(link.to)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-[34px] h-[34px] rounded-full bg-slate-900 text-white flex items-center justify-center text-[13px] font-semibold border-2 border-transparent hover:opacity-85 transition-opacity cursor-pointer"
            >
              {getInitials(user?.name || "U")}
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all ${
                dropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-1"
              }`}
            >
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="text-[13px] font-semibold text-slate-900">
                  {user?.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/account");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] font-medium text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer bg-transparent border-none"
              >
                <User size={16} />
                My Account
              </button>
              <button
                onClick={() => {
                  navigate("/account?tab=settings");
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] font-medium text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer bg-transparent border-none"
              >
                <Settings size={16} />
                Settings
              </button>
              <div className="h-px bg-slate-200 my-1" />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors text-left cursor-pointer bg-transparent border-none"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-900 cursor-pointer bg-transparent border-none"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-white border-b border-slate-200 px-4 py-2 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive(link.to)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="pt-14">
        <div className="max-w-[1080px] mx-auto px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
