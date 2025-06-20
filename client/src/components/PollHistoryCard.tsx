import { useEffect, useState } from "react";

interface PollHistoryItem {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  answers: { student_id: string; option: string; answered_at: string }[];
  created_at?: string;
}

export default function PollHistoryCard({ sessionId }: { sessionId: string }) {
  const [history, setHistory] = useState<PollHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "";
    fetch(`${API_URL}/poll-history/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="intervue-card mt-6">
      <div className="mb-2 font-bold text-gray-800">Poll History</div>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-sm">No past polls yet.</div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {history.map((poll) => (
            <div
              key={poll.id}
              className="border-b pb-2 last:border-b-0 last:pb-0"
            >
              <div className="font-medium text-gray-700 mb-1">
                {poll.question}
              </div>
              <ul className="text-sm text-gray-600 mb-1">
                {poll.options.map((opt) => {
                  const count = poll.answers.filter(
                    (a) => a.option === opt.id
                  ).length;
                  return (
                    <li key={opt.id}>
                      {opt.text}{" "}
                      <span className="ml-2 text-xs text-gray-400">
                        ({count} votes)
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="text-xs text-gray-400">
                {poll.created_at && new Date(poll.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
