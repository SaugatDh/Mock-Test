import { useState, startTransition } from "react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";

const criteria = [
  {
    key: "Task Achievement",
    dot: "bg-sky-500",
    score: "6.0",
    sub: [
      { label: "Overview", score: "6.0" },
      { label: "Key features", score: "6.0" },
      { label: "Data support", score: "6.0" },
    ],
    note: "The response gives a clear overall trend and some key comparisons, but it includes inaccurate details and unsupported interpretation such as reasons for the changes.",
  },
  { key: "Coherence", dot: "bg-teal-500", score: "7.0" },
  { key: "Lexical Resource", dot: "bg-amber-500", score: "6.0" },
  { key: "Grammatical Range and Accuracy", dot: "bg-rose-500", score: "7.0" },
];

const errors = [
  {
    n: 1,
    title: "Missing Overview",
    body: 'The overview should report the main trends shown by the graph, not personal opinion. A stronger overview should clearly mention the sharp fall in whole milk, the rise and then stability of low-fat milk, and the shift in which type was more popular.',
  },
  {
    n: 2,
    title: "Wrong Unit",
    body: 'The graph uses gallons for both lines, so "10 liters" should be corrected to gallons throughout.',
  },
];

export default function SampleReports() {
  const [tab, setTab] = useState("Academic Writing Task 1");
  const [criteriaTab, setCriteriaTab] = useState("Task Achievement");
  const [expanded, setExpanded] = useState("Task Achievement");
  const [showVisual, setShowVisual] = useState(false);
  const [view, setView] = useState("Feedback");

  return (
    <Layout title="Sample Reports">
      <div className="space-y-4">
        <div className="inline-flex bg-slate-100 rounded-lg p-1 flex-wrap">
          {[
            "Academic Writing Task 1",
            "General Writing Task 1",
            "Writing Task 2",
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

        {/* Score summary */}
        <Card className="border-slate-200 rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-8 mb-5">
            <div className="text-3xl font-bold text-slate-900">
              6.5<span className="text-lg text-slate-400">/9.0</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800">B2</div>
              <div className="text-xs text-slate-400">CEFR</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800">226</div>
              <div className="text-xs text-slate-400">Words</div>
            </div>
          </div>

          <div className="space-y-2">
            {criteria.map((c) => (
              <div
                key={c.key}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    startTransition(() => setExpanded(expanded === c.key ? null : c.key))
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${c.dot}`}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {c.key}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {c.score}
                    </span>
                    {expanded === c.key ? (
                      <ChevronUp
                        size={16}
                        className="text-slate-400"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-slate-400"
                      />
                    )}
                  </div>
                </button>
                {expanded === c.key && c.sub && (
                  <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mt-3 mb-2">
                      What examiners look for
                    </p>
                    {c.sub.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between py-1 text-sm"
                      >
                        <span className="text-slate-600">{s.label}</span>
                        <span className="font-medium text-slate-800">
                          {s.score}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                      {c.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Detailed feedback */}
        <Card className="border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-3">
            Detailed Feedback
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Academic Writing Task 1
            </p>
            <p className="text-sm text-slate-700">
              The graph below shows the per capita consumption of whole milk
              and low-fat milk in the United States between 1970 and 2015.
              Summarize the information by selecting and reporting the main
              features, and make comparisons where relevant.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Switch
              checked={showVisual}
              onCheckedChange={setShowVisual}
            />
            <span className="text-sm text-slate-600">
              Show the task visual
            </span>
          </div>

          <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-5 flex-wrap">
            {["Task Achievement", "Coherence", "Vocabulary", "Grammar"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => startTransition(() => setCriteriaTab(t))}
                  className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                    criteriaTab === t
                      ? "bg-slate-900 text-white font-medium"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Essay */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-800">
                  Your Writing
                </h4>
                <div className="inline-flex bg-slate-100 rounded-lg p-1">
                  {["Original", "Feedback"].map((v) => (
                    <button
                      key={v}
                      onClick={() => startTransition(() => setView(v))}
                      className={`px-3 py-1 text-xs rounded-md ${view === v ? "bg-slate-900 text-white font-medium" : "text-slate-500"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3 max-h-96 overflow-y-auto pr-2">
                <p>
                  The line graph shows how much milk people in the US drink
                  per person from 1970 to 2015, comparing whole milk and the
                  low-fat one.
                </p>
                <p className="bg-sky-50">
                  Overall, it is clear that people prefer low-fat milk more
                  and more while whole milk consumption declines steadily.
                </p>
                <p>
                  In 1970, Americans drank about 25 gallons of whole milk but
                  only around 6 of low-fat. By 1980 the figure for whole milk
                  had dropped to roughly 20 while low-fat milk increased to
                  about 10 gallons.
                </p>
              </div>
            </div>

            {/* Errors */}
            <div>
              <h4 className="font-medium text-slate-800 mb-3">
                Task Achievement Errors
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {errors.map((e) => (
                  <div
                    key={e.n}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-5 w-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-medium">
                        {e.n}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {e.title}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {e.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-right text-xs text-slate-300 mt-4">
            v2.11.6
          </p>
        </Card>
      </div>
    </Layout>
  );
}
