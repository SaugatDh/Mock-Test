import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Mic, Play } from "lucide-react";

const badgeStyles = [
  { bg: "bg-teal-50", ring: "ring-teal-200", icon: "text-teal-700" },
  { bg: "bg-indigo-50", ring: "ring-indigo-200", icon: "text-indigo-700" },
  { bg: "bg-rose-50", ring: "ring-rose-200", icon: "text-rose-700" },
  { bg: "bg-cyan-50", ring: "ring-cyan-200", icon: "text-cyan-700" },
  { bg: "bg-amber-50", ring: "ring-amber-200", icon: "text-amber-700" },
];

// TODO: Replace with API data — GET /api/speaking/tasks
const tasks = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Complete Speaking Mock Test ${i + 1}`,
}));

export default function SpeakingTasks() {
  const navigate = useNavigate();

  return (
    <Layout title="Speaking">
      <Card className="border-slate-200 rounded-2xl p-5">
        <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-4 flex-wrap">
          {["Mock Test", "Part 1", "Part 2", "Part 3"].map((t) => (
            <button key={t} className="px-4 py-1.5 text-sm rounded-md text-slate-500 hover:text-slate-800 transition-colors">
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ contentVisibility: "auto" }}>
          {tasks.map((task, i) => {
            const style = badgeStyles[i % badgeStyles.length];
            return (
              <Card key={task.id} className="p-4 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all rounded-xl">
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-full ${style.bg} ring-1 ${style.ring} flex items-center justify-center shrink-0`}>
                    <Mic size={18} className={style.icon} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="text-sm font-medium text-slate-900 leading-snug">{task.title}</h3>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] mt-1 px-2 py-0">Full Mock Test</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400">No attempts yet</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-full px-4"
                    onClick={() => navigate("/speaking/test")}
                  >
                    <Play size={13} />
                    Start
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </Layout>
  );
}
