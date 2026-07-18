import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { PenTool, Play } from "lucide-react";

const badgeStyles = [
  { bg: "bg-teal-50", ring: "ring-teal-200", icon: "text-teal-700" },
  { bg: "bg-indigo-50", ring: "ring-indigo-200", icon: "text-indigo-700" },
  { bg: "bg-rose-50", ring: "ring-rose-200", icon: "text-rose-700" },
  { bg: "bg-cyan-50", ring: "ring-cyan-200", icon: "text-cyan-700" },
  { bg: "bg-amber-50", ring: "ring-amber-200", icon: "text-amber-700" },
];

// TODO: Replace with API data — GET /api/writing/tasks
const tasks = [
  { id: "gen-1", title: "General Writing Mock Test 1" },
  { id: "gen-2", title: "General Writing Mock Test 2" },
  { id: "gen-3", title: "General Writing Mock Test 3" },
  { id: "aca-1", title: "Academic Writing Mock Test 1" },
  { id: "aca-2", title: "Academic Writing Mock Test 2" },
  { id: "aca-3", title: "Academic Writing Mock Test 3" },
];

export default function WritingTasks() {
  const navigate = useNavigate();

  return (
    <Layout title="Writing">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Writing Mock Tests</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pick a test to start your timed writing practice</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, i) => {
          const style = badgeStyles[i % badgeStyles.length];
          return (
            <Card
              key={task.id}
              className="p-4 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className={`h-11 w-11 rounded-full ${style.bg} ring-1 ${style.ring} flex items-center justify-center shrink-0`}>
                  <PenTool size={18} className={style.icon} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-sm font-medium text-slate-900 leading-snug">{task.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">No attempts yet</p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-full px-4"
                  onClick={() => navigate("/writing/test")}
                >
                  <Play size={13} />
                  Start
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}
