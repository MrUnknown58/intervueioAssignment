import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  startTime?: number;
  duration: number;
  responses: Record<string, string>;
}

interface PollQuestionProps {
  poll: Poll;
  studentId: string;
  onSubmit: (optionId: string) => void;
  answeredOptionId?: string;
  timeLeft: number;
  onTimeUp?: () => void;
}

export function PollQuestion({
  poll,
  onSubmit,
  answeredOptionId,
  timeLeft,
  onTimeUp,
}: PollQuestionProps) {
  const [selected, setSelected] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setSelected(answeredOptionId || "");
    setIsSubmitted(!!answeredOptionId);
  }, [answeredOptionId]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && poll.isActive) {
      onTimeUp?.();
    }
  }, [timeLeft, isSubmitted, poll.isActive, onTimeUp]);

  const handleSubmit = () => {
    if (selected && !isSubmitted) {
      setIsSubmitted(true);
      onSubmit(selected);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && selected && !isSubmitted) {
      handleSubmit();
    }
  };

  const isDisabled = !poll.isActive || isSubmitted || timeLeft === 0;
  const canSubmit = selected && !isSubmitted && poll.isActive && timeLeft > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Question 1</h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Live Poll Active
          </div>
        </div>

        {/* Poll Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              {poll.question}
            </h2>
            <p className="text-slate-600">
              Choose your answer from the options below
            </p>
          </div>

          {/* Timer Display */}
          <div className="mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Time remaining
                </span>
                <span
                  className={`font-bold text-lg ${
                    timeLeft <= 10 ? "text-red-500" : "text-slate-700"
                  }`}
                >
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 10
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500"
                  }`}
                  style={{
                    width: `${(timeLeft / poll.duration) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mb-8 space-y-3" onKeyPress={handleKeyPress}>
            {poll.options.map((opt, index) => (
              <button
                key={opt.id}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                  selected === opt.id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                } ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => !isDisabled && setSelected(opt.id)}
                disabled={isDisabled}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mr-4 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selected === opt.id
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-slate-300"
                    }`}
                  >
                    {selected === opt.id && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Status and Submit Area */}
          <div className="flex flex-col gap-4">
            {isSubmitted ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center text-green-700">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">
                      Answer submitted successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      Waiting for other participants...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full py-3 ${
                  canSubmit
                    ? "intervue-btn"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                {timeLeft === 0 ? (
                  "Time's Up!"
                ) : !selected ? (
                  "Select an answer to submit"
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Submit Answer
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
