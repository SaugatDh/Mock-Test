import { useState, startTransition } from "react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Lightbulb, ChevronRight } from "lucide-react";

const tagColors = {
  core: "bg-rose-50 text-rose-700",
  "exam skills": "bg-teal-50 text-teal-700",
  supplementary: "bg-sky-50 text-sky-700",
  ideas: "bg-amber-50 text-amber-700",
  language: "bg-violet-50 text-violet-700",
};

const lessons = [];

export default function Lessons() {
  const [tab, setTab] = useState("Writing Task 2");

  return (
    <Layout>
      <Card className="border-slate-200 rounded-2xl p-5">
        <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-6 flex-wrap">
          {[
            "Writing Task 2",
            "Academic Writing Task 1",
            "General Writing Task 1",
            "Speaking",
          ].map((t) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => (
            <Card
              key={lesson.title}
              className="overflow-hidden border-slate-200 rounded-xl"
            >
              <div className="h-1 bg-indigo-500" />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 leading-snug">
                    {lesson.title}
                  </h3>
                </div>
                <div className="flex gap-1.5 mb-4">
                  {lesson.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-xs rounded-full px-2.5 py-1 ${tagColors[t]}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-end">
                  <button className="flex items-center gap-1 text-sm font-medium text-indigo-600">
                    Start lesson <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
