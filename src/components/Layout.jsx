import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarContext";

export default function Layout({ title, children }) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex text-slate-900">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft
                size={16}
                className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
              />
            </button>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-full hover:bg-slate-100"
            >
              {title}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500">
              <Bell size={18} />
            </button>
            <Avatar className="h-9 w-9 ring-2 ring-slate-100">
              <AvatarFallback className="bg-slate-900 text-white text-xs">
                SD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
