import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const passages = [
  {
    title: "The History of Coffee",
    text: `Coffee is one of the world's most popular beverages, with millions of people consuming it daily. The origins of coffee can be traced back to the ancient coffee forests on the Ethiopian plateau. According to legend, a goat herder named Kaldi discovered the potential of these beloved beans when he noticed that after eating berries from a certain tree, his goats became so energetic that they did not want to sleep at night.

The cultivation of coffee spread to the Arabian Peninsula, and by the 15th century, coffee was being grown in the Yemeni district of Arabia. By the 16th century, it was known in Persia, Egypt, Syria, and Turkey. Coffee houses became important social centers, often called schools of the learned.

Today, Brazil is the world's largest producer of coffee, followed by Vietnam and Colombia. The global coffee industry is worth over $100 billion annually. Despite its popularity, the coffee industry faces challenges including climate change, price volatility, and sustainability concerns.`,
    questions: [
      { id: 1, q: "Who is credited with discovering coffee according to legend?", options: ["An Arabian merchant", "A goat herder named Kaldi", "A Yemeni farmer", "An Egyptian scholar"] },
      { id: 2, q: "Where did coffee cultivation spread first after Ethiopia?", options: ["Egypt", "Turkey", "Arabian Peninsula", "Persia"] },
      { id: 3, q: "What were coffee houses called in the Middle East?", options: ["Trading centers", "Schools of the learned", "Social academies", "Cultural halls"] },
      { id: 4, q: "Which country is the largest coffee producer today?", options: ["Vietnam", "Colombia", "Ethiopia", "Brazil"] },
      { id: 5, q: "What is NOT mentioned as a challenge facing the coffee industry?", options: ["Climate change", "Price volatility", "Water pollution", "Sustainability concerns"] },
    ],
  },
];

const answers = { 1: 1, 2: 2, 3: 1, 4: 3, 5: 2 };

export default function ReadingTest() {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const passage = passages[0];
  const allAnswered = passage.questions.every((q) => responses[q.id] !== undefined);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    const total = passage.questions.length;
    passage.questions.forEach((q) => {
      if (responses[q.id] === answers[q.id]) correct++;
    });
    const band = correct === total ? 9.0 : correct >= total * 0.8 ? 8.0 : correct >= total * 0.6 ? 7.0 : correct >= total * 0.4 ? 6.0 : 5.0;
    const s = { overall: band, correct, total };
    setScore(s);
    setSubmitted(true);

    const reports = JSON.parse(localStorage.getItem("emt_reports") || "[]");
    reports.push({ type: "Reading", date: new Date().toISOString(), score: s });
    localStorage.setItem("emt_reports", JSON.stringify(reports));
  }, [responses, passage.questions]);

  if (submitted && score) {
    return (
      <Layout title="Reading Result">
        <Card className="border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Test Complete</h2>
            <p className="text-sm text-slate-500">Reading</p>
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
            {passage.questions.map((q) => {
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
            <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => { setSubmitted(false); setScore(null); setResponses({}); }}>Retake Test</Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Reading Test">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-700">The History of Coffee</span>
          <span className="text-sm text-slate-500">
            {Object.keys(responses).length} / {passage.questions.length} answered
          </span>
        </div>

        <Card className="border-slate-200 rounded-2xl p-6 mb-4">
          <div className="text-xs font-medium text-indigo-600 mb-2">Passage</div>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3 max-h-64 overflow-y-auto pr-2">
            {passage.text.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Card>

        <div className="space-y-5 mb-6">
          {passage.questions.map((q) => (
            <Card key={q.id} className="border-slate-200 rounded-xl p-4">
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
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Test
          </Button>
        </div>
      </div>
    </Layout>
  );
}
