// Session model
import { Poll } from "./Poll";
import { Student } from "./Student";

export interface Session {
  id: string;
  teacherId: string;
  students: Record<string, Student>;
  polls: Poll[];
  currentPollIndex: number;
  joinCode?: string;
  kickedStudents?: string[];
}
