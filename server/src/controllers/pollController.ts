import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient";
import { Poll } from "../models/Poll";

// Create a new poll
export const createPoll = async (req: Request, res: Response) => {
  const poll: Poll = req.body;
  const { data, error } = await supabase.from("polls").insert([poll]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Get all polls
export const getPolls = async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("polls").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// The following REST endpoints are not used in the Socket.io-based backend and can be removed for code cleanliness.
// export const getPollById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { data, error } = await supabase
//     .from("polls")
//     .select("*")
//     .eq("id", id)
//     .single();
//   if (error) return res.status(404).json({ error: error.message });
//   res.json(data);
// };

// export const updatePoll = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updates = req.body;
//   const { data, error } = await supabase
//     .from("polls")
//     .update(updates)
//     .eq("id", id)
//     .single();
//   if (error) return res.status(500).json({ error: error.message });
//   res.json(data);
// };

// export const deletePoll = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { error } = await supabase.from("polls").delete().eq("id", id);
//   if (error) return res.status(500).json({ error: error.message });
//   res.status(204).send();
// };

// Get all polls for a session
export const getPollsBySession = async (sessionId: string) => {
  return await supabase.from("polls").select("*").eq("session_id", sessionId);
};
