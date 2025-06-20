import { Button } from "./ui/button";
import type { Poll } from "./PollQuestion";

interface Student {
  id: string;
  name: string;
  joinedAt: number;
  hasAnswered: boolean;
}

interface TeacherPanelProps {
  students: Record<string, Student>;
  poll: Poll | null;
  onStartPoll: (pollId: string) => void;
  onNextQuestion: () => void;
  sessionId: string;
  onKickStudent: (studentId: string) => void;
}

export function TeacherPanel({
  students,
  poll,
  onStartPoll,
  // onNextQuestion,
  onKickStudent,
}: TeacherPanelProps) {
  const studentList = Object.values(students);
  const answeredCount = studentList.filter((s) => s.hasAnswered).length;
  const totalStudents = studentList.length;

  return (
    <div className="intervue-card">
      {/* Students Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            Students
          </h3>
          <div className="flex items-center space-x-2">
            <div className="intervue-badge intervue-badge-primary">
              {totalStudents} online
            </div>
            {poll && poll.isActive && (
              <div
                className={`intervue-badge ${
                  answeredCount === totalStudents && totalStudents > 0
                    ? "intervue-badge-success"
                    : "intervue-badge-warning"
                }`}
              >
                {answeredCount}/{totalStudents} answered
              </div>
            )}
          </div>
        </div>

        {totalStudents === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">
              No students connected yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Students will appear here when they join
            </p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-3">
            {studentList.map((student) => (
              <div
                key={student.id}
                className={`intervue-student-card ${
                  student.hasAnswered ? "answered" : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="intervue-avatar mr-3">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      {student.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      Joined {new Date(student.joinedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => onKickStudent(student.id)}
                  >
                    Kick
                  </Button>
                </div>
                <div
                  className={`intervue-badge text-xs ${
                    student.hasAnswered
                      ? "intervue-badge-success"
                      : "intervue-badge-warning"
                  }`}
                >
                  {student.hasAnswered ? (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Answered
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Waiting
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Poll Status & Controls */}
      {poll && (
        <div className="border-t border-gray-100 pt-6">
          {/* Current Poll Info */}
          <div
            className="border-l-4 rounded-lg p-4 mb-6"
            style={{
              borderLeftColor: poll.isActive ? "#10b981" : "#6366f1",
              backgroundColor: poll.isActive ? "#f0fdf4" : "#f8fafc",
            }}
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
              Current Poll
            </div>
            <div className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {poll.question}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {poll.isActive ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center text-indigo-600">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="font-medium">Ready</span>
                  </div>
                )}
              </div>
              {poll.isActive && (
                <span className="text-gray-600 font-medium">
                  {answeredCount}/{totalStudents} responded
                </span>
              )}
            </div>

            {/* Progress bar for active polls */}
            {poll.isActive && totalStudents > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(answeredCount / totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!poll.isActive && (
              <Button
                onClick={() => onStartPoll(poll.id)}
                disabled={totalStudents === 0}
                className={`w-full intervue-btn ${
                  totalStudents > 0 ? "intervue-btn-success" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                {totalStudents === 0 ? "Waiting for students..." : "Start Poll"}
              </Button>
            )}

            {/* {!poll.isActive && Object.keys(poll.responses).length > 0 && (
              <Button
                onClick={onNextQuestion}
                className="w-full intervue-btn intervue-btn-outline"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Prepare Next Question
              </Button>
            )} */}

            {poll.isActive && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center text-blue-600 mb-2">
                  <svg
                    className="w-5 h-5 mr-2 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Poll is active</span>
                </div>
                <p className="text-blue-600 text-sm">
                  Students are answering the question
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
