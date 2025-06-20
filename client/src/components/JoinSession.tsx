import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSocket } from "../lib/socket";

export interface Student {
  id: string;
  name: string;
  joinedAt: number;
  hasAnswered: boolean;
}

export default function JoinSession({
  onJoin,
}: {
  onJoin: (student: Student) => void;
}) {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();

  // Check for existing student session on component mount
  useEffect(() => {
    const savedName = sessionStorage.getItem("studentName");
    const savedStudentId = sessionStorage.getItem("studentId");
    const savedJoinCode = sessionStorage.getItem("joinCode");
    if (savedName && savedStudentId && savedJoinCode) {
      setName(savedName);
      setJoinCode(savedJoinCode);
      if (socket) {
        setIsLoading(true);
        fetch(
          (import.meta.env.VITE_API_URL || "") +
            `/session/by-code/${savedJoinCode}`
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.sessionId) throw new Error();
            socket.emit(
              "student:join",
              { name: savedName, sessionId: data.sessionId },
              (student: Student) => {
                setIsLoading(false);
                onJoin(student);
              }
            );
          })
          .catch(() => {
            setIsLoading(false);
            setError("Session not found. Please check the code.");
          });
      }
    }
  }, [socket, onJoin]);

  useEffect(() => {
    if (!socket) return;
    socket.on("server:error", (errorMsg: string) => {
      setError(errorMsg);
      setIsLoading(false);
    });
    return () => {
      socket.off("server:error");
    };
  }, [socket]);

  const handleJoin = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!joinCode.trim()) {
      setError("Session code is required");
      return;
    }
    if (!socket) return;
    setIsLoading(true);
    setError("");
    fetch((import.meta.env.VITE_API_URL || "") + `/session/by-code/${joinCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.sessionId) throw new Error();
        socket.emit(
          "student:join",
          { name, sessionId: data.sessionId },
          (student: Student) => {
            sessionStorage.setItem("studentName", name);
            sessionStorage.setItem("studentId", student.id);
            sessionStorage.setItem("joinCode", joinCode);
            setIsLoading(false);
            onJoin(student);
          }
        );
      })
      .catch(() => {
        setIsLoading(false);
        setError("Session not found. Please check the code.");
      });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Let’s Get Started
          </h1>
          <p className="text-slate-600">
            {" "}
            If you’re a student, you’ll be able to submit your answers,
            participate in live polls, and see how your responses compare with
            your classmates
          </p>
        </div>

        {/* Join Card */}
        <div className="bg-white rounded-2xl w-md shadow-lg border border-slate-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Session Code
              </label>
              <Input
                placeholder="Enter Session code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="intervue-input"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                className="intervue-input"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleJoin}
              disabled={isLoading}
              className="w-full intervue-btn"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining...
                </div>
              ) : (
                "Join Session"
              )}
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Your name will be visible to other participants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
