import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const sections = [
  {
    title: "Section 1 — Conversation about university accommodation",
    audio: "[Audio: Two speakers discuss accommodation options near campus]",
    questions: [
      { id: 1, q: "What type of accommodation does the student prefer?", options: ["A shared dormitory", "A private studio", "A homestay family", "A shared apartment"] },
      { id: 2, q: "How much is the student willing to pay per week?", options: ["$100–150", "$150–200", "$200–250", "$250–300"] },
      { id: 3, q: "What is the student's main concern?", options: ["Distance from campus", "Internet speed", "Noise level", "Food availability"] },
    ],
  },
  {
    title: "Section 2 — Monologue about a new library",
    audio: "[Audio: A guide describes the layout of a newly built city library]",
    questions: [
      { id: 4, q: "On which floor is the children's section?", options: ["Ground floor", "First floor", "Second floor", "Third floor"] },
      { id: 5, q: "What time does the library close on weekdays?", options: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"] },
    ],
  },
];

const answers = { 1: 0, 2: 1, 3: 2, 4: 1, 5: 3 };

export default function ListeningTest() {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const section = sections[sectionIdx];
  const allAnswered = sections.flatMap((s) => s.questions).every((q) => responses[q.id] !== undefined);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    const total = Object.keys(answers).length;
    Object.entries(answers).forEach(([id, ans]) => {
      if (responses[Number(id)] === ans) correct++;
    });
    const band = correct === total ? 9.0 : correct >= total * 0.89 ? 8.0 : correct >= total * 0.78 ? 7.0 : correct >= total * 0.67 ? 6.0 : correct >= total * 0.56 ? 5.0 : 4.0;
    const s = { overall: band, correct, total };
    setScore(s);
    setSubmitted(true);

    const reports = JSON.parse(localStorage.getItem("emt_reports") || "[]");
    reports.push({ type: "Listening", date: new Date().toISOString(), score: s });
    localStorage.setItem("emt_reports", JSON.stringify(reports));
  }, [responses]);

  if (submitted && score) {
    return (
      <Layout title="Listening Result">
        <Card className="border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Test Complete</h2>
            <p className="text-sm text-slate-500">Listening</p>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{score.overall}</div>
              <div className="text-xs text-slate-400 mt-1">Overall Band</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-800">{score.correct}/{score.total}</div>
              <div className="text-xs text-slate-400 mt-1">Correct</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {sections.flatMap((s) => s.questions).map((q) => {
              const isCorrect = responses[q.id] === answers[q.id];
              return (
                <div key={q.id} className={`flex items-start gap-3 rounded-lg px-4 py-2.5 ${isCorrect ? "bg-teal-50" : "bg-red-50"}`}>
                  <span className={`text-xs font-medium mt-0.5 ${isCorrect ? "text-teal-600" : "text-red-600"}`}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">{q.q}</p>
                    {!isCorrect && (
                      <p className="text-xs text-slate-500 mt-1">
                        Correct: {q.options[answers[q.id]]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>Back to Home</Button>
            <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => { setSubmitted(false); setScore(null); setResponses({}); setSectionIdx(0); }}>Retake Test</Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Listening Test">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-700">
            Section {sectionIdx + 1} of {sections.length}
          </span>
          <span className="text-sm text-slate-500">
            {Object.keys(responses).length} / {sections.flatMap((s) => s.questions).length} answered
          </span>
        </div>

        <Card className="border-slate-200 rounded-2xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">{section.title}</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-slate-500 italic">{section.audio}</p>
          </div>

          <div className="space-y-5">
            {section.questions.map((q) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-slate-800 mb-2">
                  <span className="text-slate-400 mr-1">Q{q.id}.</span> {q.q}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        responses[q.id] === oi
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={responses[q.id] === oi}
                        onChange={() => setResponses((r) => ({ ...r, [q.id]: oi }))}
                        className="sr-only"
                      />
                      <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                        responses[q.id] === oi ? "border-white text-white" : "border-slate-300 text-transparent"
                      }`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
          <div className="flex gap-2">
            {sectionIdx < sections.length - 1 && (
              <Button variant="outline" onClick={() => setSectionIdx((i) => i + 1)}>
                Next Section
              </Button>
            )}
            {allAnswered ? (
              <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleSubmit}>
                Submit Test
              </Button>
            ) : sectionIdx < sections.length - 1 ? (
              <Button variant="outline" onClick={() => setSectionIdx((i) => i + 1)}>
                Next
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
