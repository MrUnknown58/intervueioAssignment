import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PollFormProps {
  onCreate: (data: {
    question: string;
    options: string[];
    duration: number;
    correctIndex: number;
  }) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function PollForm({
  onCreate,
  disabled = false,
  disabledReason,
}: PollFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState("");
  const [correctIndex, setCorrectIndex] = useState<number>(0);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions((opts) => [...opts, ""]);
  const removeOption = (idx: number) =>
    setOptions((opts) => opts.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (
      !question.trim() ||
      options.some((o) => !o.trim()) ||
      options.length < 2
    ) {
      setError("Please enter a question and at least two options.");
      return;
    }
    onCreate({ question, options, duration, correctIndex });
    setQuestion("");
    setOptions(["", ""]);
    setDuration(60);
    setCorrectIndex(0);
    setError("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      {/* <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Let’s Get Started
        </h2>
        <p className="text-slate-600 text-sm">
          you’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div> */}

      {disabled && disabledReason && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0"
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
              <p className="text-amber-800 font-medium">
                Poll creation disabled
              </p>
              <p className="text-amber-700 text-sm">{disabledReason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Question Input */}
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-slate-700">
            Poll Question
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="ml-4 border border-slate-300 rounded-lg px-2 py-1 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={disabled}
            title="Set time limit for this poll"
          >
            {[30, 45, 60, 90, 120, 180, 300].map((sec) => (
              <option key={sec} value={sec}>
                {sec} seconds
              </option>
            ))}
          </select>
        </div>
        <Input
          placeholder="What would you like to ask your students?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="intervue-input"
          disabled={disabled}
        />

        {/* Options */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Answer Options
          </label>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctIndex === idx}
                  onChange={() => setCorrectIndex(idx)}
                  className="accent-green-600 w-5 h-5"
                  disabled={disabled}
                  aria-label="Mark as correct answer"
                  title="Mark this as the correct answer"
                />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-sm font-medium flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={`Enter option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    disabled={disabled}
                    className="intervue-input"
                  />
                </div>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(idx)}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 mt-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Option
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          className="w-full intervue-btn py-3"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Poll
        </Button>
      </div>
    </div>
  );
}
