import { Session } from "../models/Session";
import { Poll } from "../models/Poll";
import { Student } from "../models/Student";

// In-memory storage for sessions (single session for MVP)
export const sessions: Record<string, Session> = {};

// In-memory poll history by sessionId
export const pollHistory: Record<string, Poll[]> = {};

// Utility to generate unique IDs
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

export const chatMessages: Record<
  string,
  Array<{
    senderType: string;
    senderId: string;
    message: string;
    sentAt: string;
  }>
> = {};
