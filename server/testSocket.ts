// Simple test script for Socket.io backend
// Run with: ts-node testSocket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected as", socket.id);

  // Join as student
  socket.emit(
    "student:join",
    { name: "TestUser", sessionId: "session1" },
    (student: any) => {
      console.log("Joined as student:", student);
      // Create poll as teacher (for test)
      socket.emit(
        "teacher:create_poll",
        { question: "Test Q?", options: ["A", "B"], duration: 10 },
        (poll: any) => {
          console.log("Poll created:", poll);
          // Start poll
          socket.emit("teacher:start_poll", poll.id);
          // Submit answer as student
          setTimeout(() => {
            socket.emit("student:submit_answer", {
              sessionId: "session1",
              pollId: poll.id,
              studentId: student.id,
              optionId: poll.options[0].id,
            });
          }, 1000);
        }
      );
    }
  );
});

socket.on("server:poll_update", (poll: any) => {
  console.log("Poll update:", poll);
});
socket.on("server:results_update", (poll: any) => {
  console.log("Results update:", poll);
});
socket.on("server:session_update", (session: any) => {
  console.log("Session update:", session);
});
socket.on("server:error", (msg: any) => {
  console.error("Server error:", msg);
});

// testSocket.ts moved to dev-scripts/testSocket.ts for clarity. No longer needed here.
