import { useState, useRef, useEffect } from "react";
import { useSocket } from "../lib/socket";
import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
import Modal from "./Modal";

interface ChatMessage {
  senderType: string;
  senderId: string;
  senderName?: string;
  message: string;
  sentAt: string;
}

interface ChatProps {
  sessionId: string;
  senderType: string;
  senderId: string;
}

export default function Chat({
  sessionId,
  senderType,
  senderId,
  senderName,
  participants = [],
  onKickStudent,
}: ChatProps & {
  senderName?: string;
  participants?: { id: string; name: string }[];
  onKickStudent?: (studentId: string) => void;
}) {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !socket) return;
    let mounted = true;
    socket.emit("chat:get_history", sessionId, (msgs: ChatMessage[]) => {
      if (mounted) setMessages(msgs);
    });
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("chat:new_message", handleNewMessage);
    return () => {
      mounted = false;
      socket.off("chat:new_message", handleNewMessage);
    };
  }, [socket, sessionId, open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket?.emit("chat:send_message", {
      sessionId,
      senderType,
      senderId,
      senderName,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        style={{ boxShadow: "0 4px 24px rgba(80,80,180,0.12)" }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.21-1.21l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col h-96">
          <div className="flex border-b bg-gray-100 rounded-t-lg sticky top-0 z-10">
            <button
              className={`px-4 py-2 font-semibold rounded-tl-lg ${
                activeTab === "chat"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-tr-lg ${
                activeTab === "participants"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("participants")}
            >
              Participants
            </button>
          </div>
          {activeTab === "chat" ? (
            <div className="flex-1 overflow-y-auto px-4 pb-2 bg-white rounded-t-lg">
              {messages.length === 0 && (
                <div className="text-gray-400 text-sm text-center mt-8">
                  No messages yet.
                </div>
              )}
              {messages.map((msg, i) => {
                const isSender =
                  msg.senderId === senderId && msg.senderType === senderType;
                return (
                  <div
                    key={i}
                    className={`flex mb-5 ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl text-sm break-words relative flex flex-col items-start ${
                        isSender
                          ? "bg-[#7C5CFA] text-white rounded-br-none items-end"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                      style={{ minWidth: "60px" }}
                    >
                      <div
                        className={`text-xs font-bold mb-1 ${
                          isSender
                            ? "text-white text-right w-full"
                            : "text-[#7C5CFA]"
                        }`}
                      >
                        {isSender ? "You" : msg.senderName || msg.senderId}
                      </div>
                      <span className="block mb-1">{msg.message}</span>
                      <div
                        className={`text-xs ${
                          isSender ? "text-white/70" : "text-gray-400"
                        } text-right w-full`}
                      >
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 rounded text-sm text-gray-700">
              <div className="font-semibold mb-2 flex justify-between items-center">
                <span>Participants</span>
                {onKickStudent && senderType === "teacher" && (
                  <span className="text-xs text-gray-500 font-semibold pr-2">
                    Actions
                  </span>
                )}
              </div>
              {participants.length === 0 ? (
                <div className="text-gray-500">No participants yet.</div>
              ) : (
                <ul className="space-y-2">
                  {participants.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                        <span className="font-medium text-gray-800">
                          {p.name}
                        </span>
                        {p.id === senderId && (
                          <span className="ml-2 text-xs text-indigo-500">
                            (You)
                          </span>
                        )}
                      </div>
                      {onKickStudent &&
                        senderType === "teacher" &&
                        p.name !== "Teacher" &&
                        p.id !== senderId && (
                          <button
                            className="text-xs text-indigo-600 underline hover:text-indigo-800 ml-2 px-0 py-0 bg-transparent border-none shadow-none focus:outline-none"
                            style={{ minWidth: 0 }}
                            onClick={() => onKickStudent(p.id)}
                          >
                            Kick out
                          </button>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-0 p-3 bg-white rounded-b-lg border-t border-gray-200">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-200"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-[#7C5CFA] hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50 transition"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
