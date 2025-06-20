// Session model
import { Poll } from "./Poll";
import { Student } from "./Student";

export interface Session {
  id: string;
  teacherId: string;
  students: Record<string, Student>; // studentId -> Student
  polls: Poll[];
  currentPollIndex: number;
  joinCode?: string; // Add joinCode for session lookup by code
  kickedStudents?: string[]; // Track kicked students by ID
}
