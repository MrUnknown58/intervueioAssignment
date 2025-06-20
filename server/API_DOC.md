# Polling System Backend API Documentation

## Overview

This backend provides real-time polling functionality for teachers and students using Socket.io events. All communication is via WebSockets, not REST endpoints (except for a health check route).

---

## Health Check

**GET /**

- Returns: `Polling system backend is running.`

---

## Socket.io Events

### Student Events

- **student:join**

  - Payload: `{ name: string, sessionId: string }`
  - Callback: `Student` object
  - Description: Join a session with a unique name per tab. Emits `server:session_update` to all in session.

- **student:submit_answer**
  - Payload: `{ sessionId: string, pollId: string, studentId: string, optionId: string }`
  - Description: Submit an answer to the current poll. Emits `server:poll_update` and, if all answered or time is up, `server:results_update`.

### Teacher Events

- **teacher:create_poll**

  - Payload: `{ question: string, options: string[], duration: number }`
  - Callback: `Poll` object
  - Description: Create a new poll for the session. Emits `server:poll_update`.

- **teacher:start_poll**

  - Payload: `pollId: string`
  - Description: Start a poll (activates timer, resets answers). Emits `server:poll_update` and, after duration, `server:results_update`.

- **teacher:next_question**
  - Payload: none
  - Description: (Reserved for future use)

### Server Events (Emitted to Clients)

- **server:poll_update**

  - Payload: `Poll` object
  - Description: Sent when poll state changes (new poll, answer submitted, poll started).

- **server:results_update**

  - Payload: `Poll` object
  - Description: Sent when poll ends (all answered or time up).

- **server:session_update**

  - Payload: `Session` object
  - Description: Sent when session state changes (student joins, etc).

- **server:error**
  - Payload: `string` (error message)
  - Description: Sent on errors (e.g., duplicate name).

---

## Data Models

- **Student**: `{ id, name, joinedAt, hasAnswered }`
- **Poll**: `{ id, question, options, isActive, startTime, duration, responses }`
- **Session**: `{ id, teacherId, students, polls, currentPollIndex }`

---

## Testing

- Use [Socket.io Client](https://socket.io/docs/v4/client-api/) or Postman (WebSocket tab) to connect to `ws://localhost:5000`.
- Emit events as described above and observe server responses.
- Example join event:
  ```js
  socket.emit(
    "student:join",
    { name: "Alice", sessionId: "session1" },
    (student) => console.log(student)
  );
  ```
- Example create poll:
  ```js
  socket.emit(
    "teacher:create_poll",
    { question: "Q?", options: ["A", "B"], duration: 60 },
    (poll) => console.log(poll)
  );
  ```

---

## Notes

- All data is in-memory (no persistence).
- Only one session is supported for MVP.
- Time limit is enforced server-side.
- Names must be unique per session/tab.
