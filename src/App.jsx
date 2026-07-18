import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SidebarProvider } from "./components/SidebarContext";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WritingTasks = lazy(() => import("./pages/WritingTasks"));
const SpeakingTasks = lazy(() => import("./pages/SpeakingTasks"));
const ListeningTasks = lazy(() => import("./pages/ListeningTasks"));
const ReadingTasks = lazy(() => import("./pages/ReadingTasks"));
const WritingTest = lazy(() => import("./pages/WritingTest"));
const SpeakingTest = lazy(() => import("./pages/SpeakingTest"));
const ListeningTest = lazy(() => import("./pages/ListeningTest"));
const ReadingTest = lazy(() => import("./pages/ReadingTest"));
const SampleReports = lazy(() => import("./pages/SampleReports"));
const Lessons = lazy(() => import("./pages/Lessons"));
const Help = lazy(() => import("./pages/Help"));

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/writing" element={<WritingTasks />} />
        <Route path="/writing/test" element={<WritingTest />} />
        <Route path="/speaking" element={<SpeakingTasks />} />
        <Route path="/speaking/test" element={<SpeakingTest />} />
        <Route path="/listening" element={<ListeningTasks />} />
        <Route path="/listening/test" element={<ListeningTest />} />
        <Route path="/reading" element={<ReadingTasks />} />
        <Route path="/reading/test" element={<ReadingTest />} />
        <Route path="/sample-reports" element={<SampleReports />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-4 border-slate-300 border-t-slate-900 animate-spin" />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
