import { useEffect, useState } from "react";
import { SocketProvider, useSocket } from "../lib/socket";
import { PollForm } from "../components/PollForm";
import { TeacherPanel } from "../components/TeacherPanel";
import Chat from "../components/Chat";
import PollHistoryPage from "../components/PollHistoryPage";
// import { PollResults } from "../components/PollResults";
import type { Poll } from "../components/PollQuestion";

interface Student {
  id: string;
  name: string;
  joinedAt: number;
  hasAnswered: boolean;
}

interface Session {
  id: string;
  teacherId: string;
  students: Record<string, Student>;
  polls: Poll[];
  currentPollIndex: number;
}

function TeacherDashboard() {
  const socket = useSocket();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Create session on mount
  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "") + "/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacher_name: "Teacher" }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSessionId(data.sessionId);
        setJoinCode(data.joinCode);
      });
  }, []);

  useEffect(() => {
    if (!socket || !sessionId) return;

    // Teacher joins the session room to receive updates
    socket.emit("teacher:join", sessionId);

    socket.on("server:session_update", (s: Session) => {
      setSession(s);
      if (s.currentPollIndex >= 0) {
        setCurrentPoll(s.polls[s.currentPollIndex]);
      }
    });

    socket.on("server:poll_update", (p: Poll) => {
      setCurrentPoll(p);
      setShowResults(false);
      setError("");
    });

    socket.on("server:results_update", (p: Poll) => {
      setCurrentPoll(p);
      setShowResults(true);
    });

    socket.on("server:error", (errorMsg: string) => {
      setError(errorMsg);
    });

    return () => {
      socket.off("server:session_update");
      socket.off("server:poll_update");
      socket.off("server:results_update");
      socket.off("server:error");
    };
  }, [socket, sessionId]);

  const handleCreatePoll = (data: {
    question: string;
    options: string[];
    duration: number;
  }) => {
    if (!socket) return;
    setError("");
    socket.emit("teacher:create_poll", { ...data, sessionId }, (poll: Poll) => {
      setCurrentPoll(poll);
      setShowResults(false);
      // Instantly start the poll after creation
      handleStartPoll(poll.id);
    });
  };

  const handleStartPoll = (pollId: string) => {
    if (!socket) return;
    setError("");
    socket.emit("teacher:start_poll", { pollId, sessionId });
  };

  const handleNextQuestion = () => {
    // For MVP, just clear current poll/results to allow new poll creation
    setCurrentPoll(null);
    setShowResults(false);
    setError("");
  };

  const handleKickStudent = (studentId: string) => {
    if (!socket || !sessionId) return;
    socket.emit("teacher:kick_student", { sessionId, studentId });
  };

  const canCreateNewPoll =
    !currentPoll || (!currentPoll.isActive && showResults);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="mb-5">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Let’s Get Started
                </h2>
                <p className="text-slate-600 text-sm">
                  you’ll have the ability to create and manage polls, ask
                  questions, and monitor your students' responses in real-time.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Session Active
                </div>
                <div className="text-sm text-slate-600">
                  Join Code:{" "}
                  <span className="font-mono font-bold text-lg text-indigo-600">
                    {joinCode}
                  </span>
                </div>
              </div>
              {/* <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Teacher Dashboard
              </h1> */}
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">
                Connected Students:{" "}
                <span className="font-semibold">
                  {Object.keys(session?.students || {}).length}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <TeacherPanel
              students={session?.students || {}}
              poll={currentPoll}
              onStartPoll={handleStartPoll}
              onNextQuestion={handleNextQuestion}
              sessionId={sessionId}
              onKickStudent={handleKickStudent}
            />
            {/* {sessionId != "" && <PollHistoryCard sessionId={sessionId} />} */}
          </div>

          {/* Middle and Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* <div className="intervue-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="intervue-title mb-0">Create Poll</h2>
                <div className="text-sm text-gray-500">
                  {!canCreateNewPoll && (
                    <span className="flex items-center text-yellow-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {currentPoll?.isActive
                        ? "Poll is currently active"
                        : "Wait for all students to answer"}
                    </span>
                  )}
                </div>
              </div> */}

            <PollForm
              onCreate={handleCreatePoll}
              disabled={!canCreateNewPoll}
              disabledReason={
                currentPoll?.isActive
                  ? "Poll is currently active"
                  : "Wait for all students to answer"
              }
            />
            {/* </div> */}

            {currentPoll && (
              <div className="intervue-card">
                <h2 className="intervue-title">Poll Results</h2>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="font-medium mb-1">{currentPoll.question}</div>
                  <div className="text-sm text-gray-500">
                    {Object.keys(currentPoll.responses).length} responses
                  </div>
                </div>

                <div className="space-y-3">
                  {currentPoll.options.map((opt, index) => {
                    const totalVotes = currentPoll.options.reduce(
                      (sum, o) => sum + o.votes,
                      0
                    );
                    const percent =
                      totalVotes > 0
                        ? ((opt.votes / totalVotes) * 100).toFixed(1)
                        : "0.0";

                    // Create color variations for bars
                    const colors = [
                      "bg-indigo-500",
                      "bg-purple-500",
                      "bg-violet-500",
                      "bg-blue-500",
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <div key={opt.id} className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{opt.text}</span>
                          <span className="text-sm text-gray-600">
                            {opt.votes} ({percent}%)
                          </span>
                        </div>
                        <div className="intervue-progress">
                          <div
                            className={`intervue-progress-bar ${color}`}
                            style={{
                              width: `${
                                parseFloat(percent) > 0 ? percent : 3
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Component */}
            <Chat
              sessionId={session?.id || "session1"}
              senderType="teacher"
              senderId={session?.teacherId || "teacher1"}
              senderName="Teacher"
              participants={Object.values(session?.students || {})
                .map((s) => ({ id: s.id, name: s.name }))
                .concat([
                  { id: session?.teacherId || "teacher1", name: "Teacher" },
                ])}
              onKickStudent={handleKickStudent}
            />

            <div className="flex justify-end mb-4">
              <button
                className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm flex items-center gap-2 shadow hover:bg-indigo-700 transition"
                onClick={() => setShowHistory(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                View Poll history
              </button>
            </div>
          </div>
        </div>

        {showHistory && (
          <PollHistoryPage
            sessionId={sessionId}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function TeacherApp() {
  return (
    <SocketProvider>
      <TeacherDashboard />
    </SocketProvider>
  );
}
