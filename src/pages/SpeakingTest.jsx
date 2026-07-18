import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Mic, Square, CheckCircle, Play } from "lucide-react";

const parts = [
  {
    part: "Part 1",
    cue: "Let's talk about your hometown. What do you like most about it?",
    duration: 60,
  },
  {
    part: "Part 2",
    cue: "Describe a book that you have read recently. You should say: what the book was about, why you decided to read it, and explain whether you would recommend it to others.",
    duration: 120,
  },
  {
    part: "Part 3",
    cue: "Do you think reading is becoming less popular? Why or why not?",
    duration: 60,
  },
];

function calculateSpeakingScore(responses) {
  let fluency = 5.5, lexical = 5.0, grammar = 5.0, pronunciation = 5.5;
  responses.forEach((r) => {
    const dur = r.duration;
    if (dur > 30) fluency += 0.5;
    if (dur > 60) fluency += 0.5;
  });
  const totalDuration = responses.reduce((a, r) => a + r.duration, 0);
  if (totalDuration > 150) { lexical += 1.0; grammar += 0.5; }
  const clamp = (v) => Math.min(Math.max(v, 4.0), 9.0);
  fluency = clamp(fluency); lexical = clamp(lexical);
  grammar = clamp(grammar); pronunciation = clamp(pronunciation);
  const overall = +(((fluency + lexical + grammar + pronunciation) / 4).toFixed(1));
  return { overall: clamp(overall), fluency, lexical, grammar, pronunciation };
}

export default function SpeakingTest() {
  const [partIdx, setPartIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const part = parts[partIdx];

  useEffect(() => {
    if (!recording || countdown <= 0) {
      if (recording && countdown <= 0) {
        clearInterval(timerRef.current);
        setRecording(false);
      }
      return;
    }
    timerRef.current = setInterval(() => setCountdown((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [recording, countdown]);

  const startRecording = useCallback(() => {
    setCountdown(part.duration);
    setRecording(true);
  }, [part.duration]);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    setRecording(false);
    const duration = part.duration - countdown;
    const newResponses = [...responses, { part: part.part, duration, cue: part.cue }];
    setResponses(newResponses);

    if (partIdx < parts.length - 1) {
      setTimeout(() => setPartIdx((i) => i + 1), 500);
    } else {
      setSubmitted(true);
      setScore(calculateSpeakingScore(newResponses));
      const reports = JSON.parse(localStorage.getItem("emt_reports") || "[]");
      reports.push({
        type: "Speaking",
        date: new Date().toISOString(),
        score: calculateSpeakingScore(newResponses),
      });
      localStorage.setItem("emt_reports", JSON.stringify(reports));
    }
  }, [countdown, part, partIdx, responses]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  if (submitted && score) {
    return (
      <Layout title="Speaking Result">
        <Card className="border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Test Complete</h2>
            <p className="text-sm text-slate-500">Speaking — All Parts</p>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{score.overall}</div>
              <div className="text-xs text-slate-400 mt-1">Overall</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {[
              { label: "Fluency & Coherence", score: score.fluency },
              { label: "Lexical Resource", score: score.lexical },
              { label: "Grammatical Range", score: score.grammar },
              { label: "Pronunciation", score: score.pronunciation },
            ].map(({ label, score: s }) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5">
                <span className="text-sm text-slate-700">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{s}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>Back to Home</Button>
            <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" onClick={() => { setSubmitted(false); setScore(null); setResponses([]); setPartIdx(0); }}>Retake Test</Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Speaking Test">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-700">{part.part} of {parts.length}</span>
          {recording && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <Card className="border-slate-200 rounded-2xl p-6 mb-6">
          <div className="text-xs font-medium text-indigo-600 mb-2">{part.part}</div>
          <p className="text-sm text-slate-700 leading-relaxed">{part.cue}</p>
          <p className="text-xs text-slate-400 mt-3">You have {part.duration} seconds to respond.</p>
        </Card>

        <div className="flex justify-center mb-6">
          {!recording ? (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
              onClick={startRecording}
            >
              <Mic size={24} />
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 animate-pulse"
              onClick={stopRecording}
            >
              <Square size={24} />
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          {!recording ? "Tap to start recording" : "Tap to stop and continue"}
        </p>

        {responses.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-slate-500 mb-2">Completed parts:</p>
            {responses.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                <span className="text-sm text-teal-700">{r.part}</span>
                <span className="text-xs text-teal-600">{r.duration}s recorded</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
