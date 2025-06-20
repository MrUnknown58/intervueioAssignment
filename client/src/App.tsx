import { useEffect, useState } from "react";
import { SocketProvider, useSocket } from "./lib/socket";
import JoinSession from "./components/JoinSession";
import { PollQuestion } from "./components/PollQuestion";
import type { Poll } from "./components/PollQuestion";
import { PollResults } from "./components/PollResults";
import Chat from "./components/Chat";
import "./App.css";
import type { Student } from "./components/JoinSession";

function StudentApp() {
  const socket = useSocket();
  const [student, setStudent] = useState<Student | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [answeredOptionId, setAnsweredOptionId] = useState<string | undefined>(
    undefined
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState<string>("");
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (!socket) return;

    const handlePollUpdate = (p: Poll) => {
      setPoll(p);

      // Check if this student has already answered
      const hasAnswered = !!p.responses[student?.id || ""];

      if (hasAnswered) {
        // Student has answered - show live results with real-time updates
        setAnsweredOptionId(p.responses[student?.id || ""]);
        setShowResults(true);
        // Clear timer since they've already answered
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        return;
      }

      // Student hasn't answered yet
      if (!p.isActive) {
        // Poll is not active - show results
        setShowResults(true);
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        return;
      }

      // Poll is active and student hasn't answered - show question interface
      setShowResults(false);
      setAnsweredOptionId(undefined);

      // Clear existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      if (p.isActive && p.startTime) {
        const endTime = p.startTime + p.duration * 1000;

        const updateTimer = () => {
          const remaining = Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
          );
          setTimeLeft(remaining);

          if (remaining === 0) {
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
            setShowResults(true);
          }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        setTimerInterval(interval);
      } else {
        setTimeLeft(0);
      }
    };

    const handleResultsUpdate = (p: Poll) => {
      setPoll(p);
      setShowResults(true);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    };

    socket.on("server:poll_update", handlePollUpdate);
    socket.on("server:results_update", handleResultsUpdate);

    return () => {
      socket.off("server:poll_update", handlePollUpdate);
      socket.off("server:results_update", handleResultsUpdate);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [socket, student, timerInterval]);

  useEffect(() => {
    if (!socket) return;

    const handleKicked = () => {
      sessionStorage.clear();
      window.location.href = "/student/kicked";
    };
    socket.on("student:kicked", handleKicked);
    return () => {
      socket.off("student:kicked", handleKicked);
    };
  }, [socket]);

  // @ts-expect-error - cleanup function is valid for React useEffect
  useEffect(() => {
    if (!socket) return;

    const handleError = (msg: string) => {
      if (msg.includes("kicked")) {
        sessionStorage.clear();
        window.location.href = "/student/kicked";
      }
    };

    socket.on("server:error", handleError);
    return () => socket.off("server:error", handleError);
  }, [socket]);

  const handleJoin = (s: Student, joinedSessionId: string, code: string) => {
    setStudent(s);
    setSessionId(joinedSessionId);
    setJoinCode(code);
  };

  const handleSubmit = (optionId: string) => {
    if (!socket || !poll || !student || !sessionId) return;
    socket.emit("student:submit_answer", {
      sessionId,
      pollId: poll.id,
      studentId: student.id,
      optionId,
    });
    setAnsweredOptionId(optionId);
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  useEffect(() => {
    if (!socket || !sessionId) return;
    const handleSessionUpdate = (s: any) => {
      setParticipants([
        ...Object.values(s.students || {}).map((stu) => ({
          id: (stu as Student).id,
          name: (stu as Student).name,
        })),
        { id: s.teacherId || "teacher1", name: "Teacher" },
      ]);
    };
    socket.on("server:session_update", handleSessionUpdate);
    return () => {
      socket.off("server:session_update", handleSessionUpdate);
    };
  }, [socket, sessionId]);

  if (!student)
    return (
      <JoinSession
        onJoin={(s: Student) => {
          // get joinCode from sessionStorage or prompt
          const code = sessionStorage.getItem("joinCode") || joinCode;
          fetch(
            (import.meta.env.VITE_API_URL || "") + `/session/by-code/${code}`
          )
            .then((res) => res.json())
            .then((data) => {
              setSessionId(data.sessionId);
              setJoinCode(code);
              handleJoin(s, data.sessionId, code);
            });
        }}
      />
    );

  if (!poll) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--intervue-bg)" }}
      >
        <div className="text-center">
          <div className="mb-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: "var(--intervue-gradient)" }}
            >
              <svg
                className="w-8 h-8 text-white animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text mb-4"
            style={{ backgroundImage: "var(--intervue-gradient)" }}
          >
            INTERVUE
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Wait for the teacher to ask questions.....
          </h2>
          <p className="text-gray-600">
            Connected as: <span className="font-medium">{student.name}</span>
          </p>
          <div className="mt-6">
            <div className="animate-pulse flex justify-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mx-1"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full mx-1 animation-delay-200"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full mx-1 animation-delay-400"></div>
            </div>
          </div>
          <div className="mt-8">
            <Chat
              sessionId={sessionId || "session1"}
              senderType="student"
              senderId={student.id}
              senderName={student.name}
              participants={participants}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showResults || !poll.isActive || answeredOptionId) {
    return (
      <>
        <PollResults poll={poll} studentId={student.id} />
        <div className="mt-8">
          <Chat
            sessionId={sessionId || "session1"}
            senderType="student"
            senderId={student.id}
            senderName={student.name}
            participants={participants}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PollQuestion
        poll={poll}
        studentId={student.id}
        onSubmit={handleSubmit}
        answeredOptionId={answeredOptionId}
        timeLeft={timeLeft}
        onTimeUp={handleTimeUp}
      />
      <div className="mt-8">
        <Chat
          sessionId={sessionId || "session1"}
          senderType="student"
          senderId={student.id}
          senderName={student.name}
          participants={participants}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <SocketProvider>
      <StudentApp />
    </SocketProvider>
  );
}

export default App;
