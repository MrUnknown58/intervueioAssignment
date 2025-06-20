import type { Poll, PollOption } from "./PollQuestion";

interface PollResultsProps {
  poll: Poll;
  studentId: string;
}

export function PollResults({ poll, studentId }: PollResultsProps) {
  const totalVotes =
    poll.options.reduce((sum: number, o: PollOption) => sum + o.votes, 0) || 1;
  const studentAnswer = poll.responses[studentId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Poll Results
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Results Available
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              {poll.question}
            </h2>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 616 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>
                  {totalVotes} response{totalVotes !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    poll.isActive ? "bg-green-500" : "bg-slate-500"
                  }`}
                ></div>
                <span>Poll {poll.isActive ? "Active" : "Ended"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {poll.options.map((opt: PollOption, index: number) => {
              const percent =
                totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              const isStudentChoice = studentAnswer === opt.id;
              const isCorrect = poll.correctOptionId === opt.id;

              // Color variations for bars
              const colors = [
                "bg-gradient-to-r from-indigo-500 to-indigo-600",
                "bg-gradient-to-r from-purple-500 to-purple-600",
                "bg-gradient-to-r from-pink-500 to-pink-600",
                "bg-gradient-to-r from-blue-500 to-blue-600",
                "bg-gradient-to-r from-cyan-500 to-cyan-600",
              ];

              return (
                <div
                  key={opt.id}
                  className={`w-full ${
                    isCorrect ? "border-2 border-green-500 rounded-xl" : ""
                  }`}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mr-4 flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-semibold text-lg text-slate-900">
                        {opt.text}
                      </span>
                      {isStudentChoice && (
                        <div className="ml-3 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
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
                          Your choice
                        </div>
                      )}
                      {isCorrect && (
                        <div className="ml-3 inline-flex items-center px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
                          Correct Answer
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-slate-900">
                        {opt.votes}
                      </div>
                      <div className="text-sm text-slate-600">{percent}%</div>
                    </div>
                  </div>

                  <div className="relative mb-2">
                    <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-6 rounded-full transition-all duration-1000 ease-out ${
                          colors[index % colors.length]
                        }`}
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                    {percent > 20 && (
                      <div className="absolute inset-0 flex items-center px-3">
                        <span className="text-white font-medium text-sm">
                          {percent}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-slate-200">
            <div className="inline-flex items-center py-3 px-6 bg-slate-50 rounded-xl text-slate-600">
              <svg
                className="w-5 h-5 mr-2 text-slate-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Wait for the teacher to ask a new question..
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
