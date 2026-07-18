import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle } from "lucide-react";

const prompts = [
  {
    task: "Task 1",
    question:
      "The graph below shows the percentage of people in four different age groups who used the internet between 2000 and 2015. Summarize the information by selecting and reporting the main features.",
    minWords: 150,
  },
  {
    task: "Task 2",
    question:
      "Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?",
    minWords: 250,
  },
];

function calculateScore(wordCount, text) {
  if (wordCount < 50) return { overall: 4.0, task: 4.0, coherence: 4.0, lexical: 4.0, grammar: 4.0 };
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const words = text.split(/\s+/).filter(Boolean);
  const avgWordsPerSentence = words.length / Math.max(sentences, 1);
  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / Math.max(words.length, 1);

  let task = 5.0;
  if (wordCount >= prompts[1].minWords) task += 1.0;
  if (wordCount >= prompts[1].minWords * 1.2) task += 0.5;
  if (uniqueRatio > 0.6) task += 0.5;

  let coherence = 5.0;
  if (avgWordsPerSentence > 10 && avgWordsPerSentence < 30) coherence += 1.0;
  if (wordCount >= 200) coherence += 0.5;

  let lexical = 5.0;
  if (uniqueRatio > 0.55) lexical += 1.0;
  if (uniqueRatio > 0.65) lexical += 0.5;

  let grammar = 5.5;
  if (avgWordsPerSentence > 8 && avgWordsPerSentence < 25) grammar += 0.5;

  const overall = +(((task + coherence + lexical + grammar) / 4).toFixed(1));
  return { overall: Math.min(overall, 9.0), task: Math.min(task, 9.0), coherence: Math.min(coherence, 9.0), lexical: Math.min(lexical, 9.0), grammar: Math.min(grammar, 9.0) };
}

export default function WritingTest() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  const prompt = prompts[promptIdx];
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [submitted, timeLeft]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setScore(calculateScore(wordCount, text));

    const reports = JSON.parse(localStorage.getItem("emt_reports") || "[]");
    reports.push({
      type: "Writing",
      task: prompt.task,
      date: new Date().toISOString(),
      wordCount,
      score: calculateScore(wordCount, text),
    });
    localStorage.setItem("emt_reports", JSON.stringify(reports));
  }, [wordCount, text, prompt.task]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (submitted && score) {
    return (
      <Layout title="Writing Result">
        <Card className="border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Test Complete</h2>
            <p className="text-sm text-slate-500">{prompt.task} — Writing</p>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{score.overall}</div>
              <div className="text-xs text-slate-400 mt-1">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-800">{wordCount}</div>
              <div className="text-xs text-slate-400 mt-1">Words</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {[
              { label: "Task Achievement", score: score.task },
              { label: "Coherence & Cohesion", score: score.coherence },
              { label: "Lexical Resource", score: score.lexical },
              { label: "Grammar", score: score.grammar },
            ].map(({ label, score: s }) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5">
                <span className="text-sm text-slate-700">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{s}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => { setSubmitted(false); setScore(null); setText(""); setTimeLeft(60 * 60); }}>
              Retake Test
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Writing Test">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
            <Clock size={14} className="text-slate-500" />
            <span className={`text-sm font-medium ${timeLeft < 300 ? "text-red-500" : "text-slate-700"}`}>
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
          <span className={`text-sm ${wordCount >= prompt.minWords ? "text-teal-600 font-medium" : "text-slate-500"}`}>
            {wordCount} / {prompt.minWords} words
          </span>
        </div>

        <Card className="border-slate-200 rounded-2xl p-6 mb-4">
          <div className="text-xs font-medium text-indigo-600 mb-2">{prompt.task}</div>
          <p className="text-sm text-slate-700 leading-relaxed">{prompt.question}</p>
        </Card>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your essay here..."
          className="w-full h-72 p-4 border border-slate-200 rounded-2xl text-sm text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white"
            onClick={handleSubmit}
            disabled={wordCount < 50}
          >
            Submit Test
          </Button>
        </div>
      </div>
    </Layout>
  );
}
