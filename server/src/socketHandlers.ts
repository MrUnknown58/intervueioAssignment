import { Server as SocketIOServer, Socket } from "socket.io";
import { sessions, pollHistory, chatMessages } from "./utils/storage";
import { v4 as uuidv4 } from "uuid";
import { Poll } from "./models/Poll";
import crypto from "crypto";

// Helper: Persist poll and answers to Supabase for history
function persistPollToSupabase(sessionId: string, poll: any) {
  const { supabase } = require("./utils/supabaseClient");
  supabase
    .from("polls")
    .upsert([
      {
        id: poll.id,
        session_id: sessionId,
        question: poll.question,
        options: poll.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
        })),
        duration: poll.duration,
        created_at: new Date().toISOString(),
      },
    ])
    .then(() => {
      const answerRows = Object.entries(poll.responses).map(
        ([studentId, optionId]) => ({
          id: require("uuid").v4(),
          poll_id: poll.id,
          student_id: studentId,
          option: String(optionId),
          answered_at: new Date().toISOString(),
        })
      );
      if (answerRows.length > 0) {
        supabase
          .from("poll_answers")
          .insert(answerRows)
          .catch((e: any) => {
            console.error("Failed to persist poll answers to Supabase", e);
          });
      }
    })
    .catch((e: any) => {
      console.error("Failed to persist poll to Supabase", e);
    });
}

// Helper: Remove student by socket on disconnect
function removeStudentBySocket(socket: any, io: SocketIOServer) {
  const sessionId = socket.data.studentSessionId;
  const studentId = socket.data.studentId;
  if (sessionId && studentId && sessions[sessionId]) {
    delete sessions[sessionId].students[studentId];
    io.to(sessionId).emit("server:session_update", sessions[sessionId]);
    console.log(`Student ${studentId} removed from session ${sessionId}`);
  }
}

export function registerSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    // ...existing code from index.ts socket connection handler...
    // Teacher joins session (for dashboard)
    socket.on("teacher:join", async (sessionId = "session1") => {
      socket.join(sessionId);
      // Optionally, send current session state to teacher
      if (sessions[sessionId]) {
        socket.emit("server:session_update", sessions[sessionId]);
      }
    });
    // Student joins session
    socket.on("student:join", async (data, callback) => {
      const { name, sessionId } = data;
      if (!name || !sessionId) {
        if (callback) callback(null);
        socket.emit("server:error", "Missing name or session ID");
        return;
      }
      const session = sessions[sessionId];
      if (!session) {
        if (callback) callback(null);
        socket.emit("server:error", "Session not found");
        return;
      }
      // Initialize kickedStudents if not present
      if (!session.kickedStudents) session.kickedStudents = [];
      // Check if student is blacklisted (by name or by ID in sessionStorage)
      // For now, only by name (since new ID is generated on join)
      if (session.kickedStudents.includes(name)) {
        if (callback) callback(null);
        socket.emit(
          "server:error",
          "You have been kicked from this session and cannot rejoin."
        );
        return;
      }
      // Check for unique name in this session
      const nameTaken = Object.values(session.students).some(
        (student) => student.name === name
      );
      if (nameTaken) {
        if (callback) callback(null);
        socket.emit("server:error", "Name already taken in this session");
        return;
      }
      // Create student
      const studentId = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
      const student = {
        id: studentId,
        name,
        joinedAt: Date.now(),
        hasAnswered: false,
      };
      session.students[studentId] = student;
      socket.data.studentSessionId = sessionId;
      socket.data.studentId = studentId;
      socket.join(sessionId);
      // Notify all clients in session
      io.to(sessionId).emit("server:session_update", session);
      if (callback) callback(student);
    });
    // Teacher creates poll
    socket.on("teacher:create_poll", async (data, callback) => {
      const { question, options, duration, sessionId } = data;
      if (!question || !options || !Array.isArray(options) || !sessionId) {
        if (callback) callback(null);
        socket.emit("server:error", "Missing poll data or session ID");
        return;
      }
      const session = sessions[sessionId];
      if (!session) {
        if (callback) callback(null);
        socket.emit("server:error", "Session not found");
        return;
      }
      // Create poll object with correct PollOption structure
      const pollId = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
      const poll = {
        id: pollId,
        question,
        options: options.map((text: string, idx: number) => ({
          id: `${pollId}_opt${idx}`,
          text,
          votes: 0,
        })),
        isActive: true, // Make poll active immediately
        startTime: Date.now(), // Set start time to now
        duration: duration || 60,
        responses: {},
      };
      session.polls.push(poll);
      session.currentPollIndex = session.polls.length - 1;
      // Notify all clients in session
      io.to(sessionId).emit("server:poll_update", poll);
      io.to(sessionId).emit("server:session_update", session);
      if (callback) callback(poll);
    });
    // Teacher starts poll
    socket.on("teacher:start_poll", (data) => {
      const { pollId, sessionId } = data;
      const session = sessions[sessionId];
      if (!session) return;
      const poll = session.polls.find((p) => p.id === pollId);
      if (!poll) return;
      // Activate poll
      poll.isActive = true;
      poll.startTime = Date.now();
      poll.responses = {};
      poll.options.forEach((opt) => (opt.votes = 0));
      // Mark all students as not answered
      Object.values(session.students).forEach((student) => {
        student.hasAnswered = false;
      });
      // Broadcast updated poll and session to all clients
      io.to(sessionId).emit("server:poll_update", poll);
      io.to(sessionId).emit("server:session_update", session);
    }); // Student submits answer
    socket.on("student:submit_answer", async (data) => {
      const { sessionId, pollId, studentId, optionId } = data;
      const session = sessions[sessionId];
      if (!session) return;
      const poll = session.polls.find((p) => p.id === pollId);
      if (!poll || !poll.isActive) return;

      // Check if student already answered (prevent duplicate votes)
      if (poll.responses[studentId]) return;

      // Record answer
      poll.responses[studentId] = optionId;

      // Update vote counts for the selected option
      const selectedOption = poll.options.find((opt) => opt.id === optionId);
      if (selectedOption) {
        selectedOption.votes++;
      }

      // Mark student as answered
      if (session.students[studentId]) {
        session.students[studentId].hasAnswered = true;
      }

      // Broadcast updated poll to all clients (including vote counts)
      io.to(sessionId).emit("server:poll_update", poll);
      io.to(sessionId).emit("server:session_update", session);

      // Check if all online students have answered
      const onlineStudentIds = Object.keys(session.students);
      const allAnswered =
        onlineStudentIds.length > 0 &&
        onlineStudentIds.every((id) => poll.responses[id]);
      if (allAnswered) {
        poll.isActive = false;
        io.to(sessionId).emit("server:results_update", poll);
        // Store poll in in-memory pollHistory
        if (!pollHistory[sessionId]) pollHistory[sessionId] = [];
        pollHistory[sessionId].push({ ...poll });
        persistPollToSupabase(sessionId, poll);
      }
    });
    // Student requests current poll status
    socket.on("student:poll_status", (data, callback) => {
      // ...existing code...
    });

    // Chat: get history
    socket.on("chat:get_history", (sessionId, callback) => {
      if (!chatMessages[sessionId]) chatMessages[sessionId] = [];
      if (typeof callback === "function") {
        callback(chatMessages[sessionId]);
      }
    });

    // Chat: send message
    socket.on("chat:send_message", (data) => {
      const { sessionId, senderType, senderId, message } = data;
      if (!sessionId || !senderType || !senderId || !message) return;
      const msg = {
        senderType,
        senderId,
        senderName: data.senderName,
        message,
        sentAt: new Date().toISOString(),
      };
      if (!chatMessages[sessionId]) chatMessages[sessionId] = [];
      chatMessages[sessionId].push(msg);
      io.to(sessionId).emit("chat:new_message", msg);
    }); // Teacher kicks a student
    socket.on("teacher:kick_student", ({ sessionId, studentId }) => {
      const session = sessions[sessionId];
      if (!session || !session.students[studentId]) return;
      // Initialize kickedStudents if not present
      if (!session.kickedStudents) session.kickedStudents = [];
      // Add the student's name to kickedStudents blacklist
      const kickedName = session.students[studentId]?.name;
      if (kickedName && !session.kickedStudents.includes(kickedName)) {
        session.kickedStudents.push(kickedName);
      }
      // Find and disconnect the student's socket
      const sockets = Array.from(io.sockets.sockets.values());
      const studentSocket = sockets.find(
        (s) =>
          s.data.studentId === studentId &&
          s.data.studentSessionId === sessionId
      );
      if (studentSocket) {
        // Send dedicated kick event directly to the student
        studentSocket.emit(
          "student:kicked",
          "You have been kicked from the session by the teacher."
        );
        // Optionally, keep the old error event for backward compatibility
        studentSocket.emit(
          "server:error",
          "You have been kicked from the session by the teacher."
        );
        // Disconnect the student
        studentSocket.disconnect(true);
      }
      // Remove student from session
      delete session.students[studentId];
      // Broadcast session update to remaining participants
      io.to(sessionId).emit("server:session_update", session);
      console.log(`Student ${studentId} was kicked from session ${sessionId}`);
    });
    // Cleanup on disconnect
    socket.on("disconnect", () => {
      removeStudentBySocket(socket, io);
    });
  });
}
