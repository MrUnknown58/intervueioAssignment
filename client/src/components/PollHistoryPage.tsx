import { useEffect, useState } from "react";
import type { Poll } from "./PollQuestion";

export default function PollHistoryPage({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "";
    fetch(`${API_URL}/session/${sessionId}/poll-history`)
      .then((res) => res.json())
      .then((data) => {
        setPolls(data.polls || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <div
      className="fixed inset-0 bg-transparent  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">
          View <span className="text-indigo-600">Poll History</span>
        </h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : polls.length === 0 ? (
          <div className="text-gray-500">No poll history yet.</div>
        ) : (
          <div className="space-y-8">
            {polls.map((poll, idx) => {
              const totalVotes =
                poll.options.reduce((sum, o) => sum + (o.votes || 0), 0) || 1;
              return (
                <div key={poll.id} className="bg-gray-50 rounded-xl p-6 shadow">
                  <div className="mb-2 font-semibold text-gray-700">
                    Question {idx + 1}
                  </div>
                  <div className="font-bold text-lg mb-2">{poll.question}</div>
                  <div className="space-y-2">
                    {poll.options.map((opt, i) => {
                      const percent = Math.round(
                        ((opt.votes || 0) / totalVotes) * 100
                      );
                      const colors = [
                        "bg-indigo-500",
                        "bg-purple-500",
                        "bg-violet-500",
                        "bg-blue-500",
                      ];
                      const color = colors[i % colors.length];
                      return (
                        <div key={opt.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{opt.text}</span>
                            <span className="text-sm text-gray-600">
                              {opt.votes} ({percent}%)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`${color} h-3 rounded-full`}
                              style={{ width: `${percent > 0 ? percent : 3}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
