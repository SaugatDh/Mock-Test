import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Headphones, Play, Info } from "lucide-react";

const badgeStyles = [
  { bg: "bg-sky-50", ring: "ring-sky-200", icon: "text-sky-700" },
  { bg: "bg-violet-50", ring: "ring-violet-200", icon: "text-violet-700" },
  { bg: "bg-rose-50", ring: "ring-rose-200", icon: "text-rose-700" },
  { bg: "bg-amber-50", ring: "ring-amber-200", icon: "text-amber-700" },
];

// TODO: Replace with API data — GET /api/listening/tasks
const tasks = [
  { id: "a-1", title: "Listening Test 1" },
];

export default function ListeningTasks() {
  const navigate = useNavigate();

  return (
    <Layout title="Listening">
      <Card className="border-slate-200 rounded-2xl p-5">
        <Badge className="bg-slate-900 text-white mb-4 px-3 py-1.5 rounded-full hover:bg-slate-900">Mock Test</Badge>

        <div className="flex gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mb-5">
          <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-sky-900">New tasks coming soon!</p>
            <p className="text-xs text-sky-700 mt-0.5">More high-quality listening tests will be added regularly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ contentVisibility: "auto" }}>
          {tasks.map((task, i) => {
            const style = badgeStyles[i % badgeStyles.length];
            return (
              <Card key={task.id} className="p-4 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`h-11 w-11 rounded-full ${style.bg} ring-1 ${style.ring} flex items-center justify-center shrink-0`}>
                    <Headphones size={18} className={style.icon} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="text-sm font-medium text-slate-900 leading-snug">{task.title}</h3>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] mt-1 px-2 py-0">Full Mock Test</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">No attempts yet</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-full px-4"
                    onClick={() => navigate("/listening/test")}
                  >
                    <Play size={13} />
                    Start
                  </Button>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 mb-2">Practice by part:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Part 1", "Part 2", "Part 3", "Part 4"].map((p) => (
                      <span key={p} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">{p}</span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </Layout>
  );
}
