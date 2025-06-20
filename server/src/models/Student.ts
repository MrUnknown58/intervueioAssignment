// Student model
export interface Student {
  id: string; // unique per tab/session
  name: string;
  joinedAt: number;
  hasAnswered: boolean;
}
