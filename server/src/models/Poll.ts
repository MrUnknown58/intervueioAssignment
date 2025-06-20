// Poll model
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
  startTime?: number; // timestamp when poll started
  duration: number; // in seconds
  responses: Record<string, string>; // studentId -> optionId
}
