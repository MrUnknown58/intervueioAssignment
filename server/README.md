# Backend Issues & Deferred Changes

## Outstanding Issue

- **Socket.io-client TypeScript Import Issue:**
  - The test script (`testSocket.ts`) fails to run with TypeScript due to import/type mismatches with `socket.io-client` v4+ and its type definitions.
  - Error: `Module '"socket.io-client"' has no exported member 'io'.`

## Temporary Workarounds

- Use the default import in JavaScript:
  ```js
  const socketIOClient = require("socket.io-client");
  const socket = socketIOClient("http://localhost:5000");
  ```
- Or, convert the test script to plain JavaScript for immediate testing.

## Changes To Be Done Later

- Investigate and resolve the correct TypeScript import for `socket.io-client` (v4+).
- Ensure the test script works seamlessly with TypeScript and the current version of `socket.io-client`.
- Optionally, update dependencies or use ESM modules if needed for compatibility.

---

> These changes are not critical for backend functionality, but are needed for a smooth TypeScript developer experience in testing.
