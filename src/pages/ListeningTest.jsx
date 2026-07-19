import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Play, Pause } from "lucide-react";

const AUDIO_URL =
  "https://cdn.ng-resource.com/product/resource/notegpt/podcast/2026/07/19/podcast_d3aa244b-7fbb-4a8d-9484-c0e07b5665aa-1784469584.mp3";

const sections = [
  {
    title: "Flight Change Dialogue",
    questions: [
      {
        id: 1,
        q: "What was the original flight time before rescheduling?",
        options: [
          "Tuesday at 2:15 PM",
          "Tuesday at 4:15 PM",
          "Wednesday at 8:30 AM",
          "Wednesday at 1:45 PM",
        ],
      },
      {
        id: 2,
        q: "What was the first reaction to the proposed 8:30 AM flight?",
        options: [
          "Excitement about arriving early",
          "Indifference — it didn't matter",
          "Dread at the idea of waking up so early",
          "Confusion about the departure date",
        ],
      },
      {
        id: 3,
        q: "What two factors made the early flight unappealing?",
        options: [
          "High ticket price and no luggage ready",
          "Waking up early and driving in from outside the city",
          "Long airport queue and traffic jam",
          "No food available and cold weather",
        ],
      },
      {
        id: 4,
        q: "What time range did the person ask for as an alternative?",
        options: [
          "Something in the early morning around 6:00 AM",
          "Something closer to noon",
          "An evening flight after 6:00 PM",
          "Any time on Thursday",
        ],
      },
      {
        id: 5,
        q: "What alternate departure time was looked up?",
        options: [
          "11:30 AM on Wednesday",
          "1:45 PM on Wednesday",
          "3:00 PM on Tuesday",
          "12:00 PM on Thursday",
        ],
      },
      {
        id: 6,
        q: "Why was the 1:45 PM flight ultimately rejected?",
        options: [
          "It was more expensive than the morning flight",
          "It was already fully booked",
          "A lunch meeting at 1:00 PM made it impossible to catch",
          "The airport was too far to reach by that time",
        ],
      },
      {
        id: 7,
        q: "What metaphor does the host use to describe the scheduling problem?",
        options: [
          "A jigsaw puzzle with missing pieces",
          "A game of whack-a-mole",
          "A rolling dice with no clear outcome",
          "A house of cards about to collapse",
        ],
      },
      {
        id: 8,
        q: "Which flight was finally booked after all the deliberation?",
        options: [
          "Tuesday at 4:15 PM",
          "Wednesday at 8:30 AM",
          "Wednesday at 1:45 PM",
          "Thursday at 8:30 AM",
        ],
      },
      {
        id: 9,
        q: "What is the first piece of advice given at the end?",
        options: [
          "Book the cheapest available flight",
          "Always check your calendar for hidden commitments before changing plans",
          "Prefer morning flights over afternoon ones",
          "Ask a friend to help with your booking",
        ],
      },
      {
        id: 10,
        q: "What specific action is recommended for listeners going forward?",
        options: [
          "Only book flights on Tuesdays for the best deals",
          "Set a reminder to review schedule before booking any flight",
          "Cancel all lunch meetings on travel days",
          "Avoid early morning flights under all circumstances",
        ],
      },
    ],
  },
];

const answers = { 1: 1, 2: 2, 3: 1, 4: 1, 5: 1, 6: 2, 7: 1, 8: 1, 9: 1, 10: 1 };

function AudioPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setPlaying(false);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src={url} preload="metadata" />
      <div className="bg-slate-900 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer border-none">
          {playing ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
        </button>
        <span className="text-[13px] text-white/70">Flight Change Dialogue</span>
      </div>
    </>
  );
}

export default function ListeningTest() {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const section = sections[sectionIdx];
  const allAnswered = sections
    .flatMap((s) => s.questions)
    .every((q) => responses[q.id] !== undefined);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    const total = Object.keys(answers).length;
    Object.entries(answers).forEach(([id, ans]) => {
      if (responses[Number(id)] === ans) correct++;
    });
    const band =
      correct === total
        ? 9.0
        : correct >= total * 0.89
          ? 8.0
          : correct >= total * 0.78
            ? 7.0
            : correct >= total * 0.67
              ? 6.0
              : correct >= total * 0.56
                ? 5.0
                : 4.0;
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
            <h2 className="text-xl font-semibold text-slate-900">
              Test Complete
            </h2>
            <p className="text-sm text-slate-500">
              Listening — Flight Change Dialogue
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">
                {score.overall}
              </div>
              <div className="text-xs text-slate-400 mt-1">Overall Band</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-800">
                {score.correct}/{score.total}
              </div>
              <div className="text-xs text-slate-400 mt-1">Correct</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {sections.flatMap((s) => s.questions).map((q) => {
              const isCorrect = responses[q.id] === answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`flex items-start gap-3 rounded-lg px-4 py-2.5 ${isCorrect ? "bg-teal-50" : "bg-red-50"}`}
                >
                  <span
                    className={`text-xs font-medium mt-0.5 ${isCorrect ? "text-teal-600" : "text-red-600"}`}
                  >
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
            <Button
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
              onClick={() => {
                setSubmitted(false);
                setScore(null);
                setResponses({});
                setSectionIdx(0);
              }}
            >
              Retake Test
            </Button>
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
            {Object.keys(responses).length} /{" "}
            {sections.flatMap((s) => s.questions).length} answered
          </span>
        </div>

        <Card className="border-slate-200 rounded-2xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            {section.title}
          </h3>

          <AudioPlayer url={AUDIO_URL} />

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
                        onChange={() =>
                          setResponses((r) => ({ ...r, [q.id]: oi }))
                        }
                        className="sr-only"
                      />
                      <span
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          responses[q.id] === oi
                            ? "border-white text-white"
                            : "border-slate-300 text-transparent"
                        }`}
                      >
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
          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {sectionIdx < sections.length - 1 && (
              <Button
                variant="outline"
                onClick={() => setSectionIdx((i) => i + 1)}
              >
                Next Section
              </Button>
            )}
            {allAnswered ? (
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white"
                onClick={handleSubmit}
              >
                Submit Test
              </Button>
            ) : sectionIdx < sections.length - 1 ? (
              <Button
                variant="outline"
                onClick={() => setSectionIdx((i) => i + 1)}
              >
                Next
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
