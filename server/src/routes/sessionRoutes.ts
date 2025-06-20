import express from "express";
import { v4 as uuidv4 } from "uuid";
import { sessions, pollHistory } from "../utils/storage";
import { generateJoinCode } from "./../utils/generateJoinCode";

const router = express.Router();

// Placeholder Helper route
router.get("/", (req, res) => {
  res.send("Polling system backend is running.");
});

// Create a new session and return its ID and join code
router.post("/session", (req, res) => {
  const { teacher_name } = req.body;
  const sessionId = uuidv4();
  const joinCode = generateJoinCode();
  sessions[sessionId] = {
    id: sessionId,
    teacherId: "teacher1",
    students: {},
    polls: [],
    currentPollIndex: -1,
    joinCode,
  };
  res.json({ sessionId, joinCode });
});

router.get("/session/by-code/:joinCode", async (req, res) => {
  const { joinCode } = req.params;
  const sessionEntry = Object.entries(sessions).find(
    ([, session]) => session.joinCode === joinCode
  );
  if (sessionEntry) {
    return res.json({ sessionId: sessionEntry[0] });
  }
  try {
    const { supabase } = require("../utils/supabaseClient");
    const { data, error } = await supabase
      .from("sessions")
      .select("id, join_code")
      .eq("join_code", joinCode)
      .single();
    if (data && data.id) {
      return res.json({ sessionId: data.id });
    }
  } catch (e) {
    // ignore
  }
  return res
    .status(404)
    .json({ error: "Session not found. Please check the code." });
});

// Get poll history for a session
router.get("/session/:sessionId/poll-history", (req, res) => {
  const { sessionId } = req.params;
  const history = pollHistory[sessionId] || [];
  res.json({ polls: history });
});

export default router;
