import { useState, startTransition } from "react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "How do I start a mock test?",
    a: "Navigate to any skill section (Writing, Speaking, Listening, or Reading) from the sidebar, then select a task and click Start Test.",
  },
  {
    q: "How is my score calculated?",
    a: "Each test is scored instantly based on standard assessment criteria. Your overall band score is shown as soon as you submit.",
  },
  {
    q: "Can I retake a test?",
    a: "Yes. After submitting, click Retake Test to try again. Your previous responses will be cleared.",
  },
  {
    q: "Where can I see my results?",
    a: "Go to the Dashboard and open the Reports tab to see all your past test results and band scores.",
  },
  {
    q: "What is the Lessons section?",
    a: "Lessons provide study materials and tips for each skill. You can browse lessons by category from the sidebar.",
  },
  {
    q: "How do I log out?",
    a: "Click your avatar in the top-right corner of the header and select Log out.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => startTransition(() => setOpen((o) => !o))}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-900">{q}</span>
        {open ? (
          <ChevronUp size={16} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 shrink-0" />
        )}
      </button>
      {open && <p className="text-sm text-slate-600 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function Help() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-slate-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Quick answers about using the English Mock Test platform.
          </p>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} {...faq} />
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Still need help?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Email support</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  support@example.com
                </p>
              </div>
            </div>
            <div className="flex-1 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <MessageCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Live chat
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Available Mon–Fri, 9am–5pm
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
