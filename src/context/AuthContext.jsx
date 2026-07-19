import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AuthContext = createContext();

const USERS = [
  { email: "admin@example.com", password: "admin123", name: "Admin", role: "admin" },
  { email: "student1@example.com", password: "student123", name: "Saugat", role: "student" },
  { email: "student2@example.com", password: "student123", name: "Ram", role: "student" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("emt_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email, password) => {
    const found = USERS.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const userData = { email: found.email, name: found.name, role: found.role };
    setUser(userData);
    localStorage.setItem("emt_user", JSON.stringify(userData));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("emt_user");
    localStorage.removeItem("emt_reports");
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
