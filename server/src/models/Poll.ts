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
  startTime?: number;
  duration: number;
  responses: Record<string, string>;
}
