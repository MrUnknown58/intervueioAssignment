Live Polling System: A Comprehensive Project Report

1. Introduction

This report details the design and implementation plan for a Live Polling System, an interactive web application engineered to facilitate real-time polling between a teacher and multiple students. The system is conceived as a dynamic environment where questions can be posed, answers submitted, and results viewed instantaneously. The core objective of this project is to demonstrate proficiency in developing a full-stack, real-time web application, leveraging modern frontend and backend technologies.
The user interface and experience design for this system are meticulously guided by a specific Figma design link.1 The inclusion of this design reference is more than a mere suggestion; it signifies that the project's visual fidelity and user experience are critical assessment criteria for this assignment. The ability to accurately translate design mockups into a functional and aesthetically pleasing user interface is a key skill being evaluated. This emphasis on design extends to the "Proper website design" listed as a "Good-to-have" 1, elevating its importance beyond a simple optional feature.
This assignment is presented within the context of an SDE intern role at Intervue, a company renowned for its expertise in technical interviewing and streamlining hiring processes.2 Given Intervue's core business of evaluating technical talent and fostering efficient hiring, the submission of this project, including its accompanying documentation, must reflect a high standard of engineering practices, clarity in design, and a professional approach to problem-solving. The meticulous structure and technical accuracy of this report aim to convey a deep understanding of the system's design and implementation, aligning with the expectations of a company focused on technical excellence.

2. Functional Requirements

The Live Polling System is designed with two distinct user personas: the Teacher and the Student, each possessing specific functionalities crucial for the system's operation.

2.1. Teacher Persona Features

The Teacher persona is central to initiating and managing polling sessions.
Create New Poll: The teacher is equipped with an interface to formulate and initiate new polling questions. This functionality necessitates a mechanism for inputting the question content and, potentially, defining answer options.1
View Live Polling Results: Teachers require a real-time dashboard that displays responses to the current poll, with results updating dynamically as students submit their answers.1
Conditional Question Asking Logic: A critical piece of business logic dictates when a teacher can ask a new question. A new question can only be posed if no question was asked previously, or if all active students have submitted their answers to the current question.1 This condition implies a robust server-side state management system for the current poll. The backend must meticulously track the status of active students and their submission progress. Furthermore, a mechanism is required for the server to accurately determine when "all students have answered," necessitating the tracking of individual student connections and their respective responses. This directly influences the backend's data model and the architecture for real-time event handling.

2.2. Student Persona Features

The Student persona interacts with the polls and views results.
Unique Name Entry per Tab with Persistence: Upon a student's initial visit to the application in a new browser tab, they should be prompted to enter a unique name. This name is designed to be unique to that specific tab, allowing a user to open multiple tabs and act as different students. However, refreshing the current tab must retain the previously entered name, preventing redundant re-prompting.1 This requirement strongly indicates the use of
sessionStorage on the client-side. sessionStorage is ideal for maintaining state within a single browser tab across refreshes, as its data persists for the duration of the browser session (until the tab is closed) and remains isolated from other tabs. This choice is a subtle yet important technical decision for optimizing user experience and ensuring data isolation.
Submit Answer to Live Question: Once a teacher has posed a question, students must be able to view the question and submit their chosen answer within the designated time frame.1
View Live Polling Results Post-Submission: Immediately following the submission of their answer, students should gain access to the live polling results, mirroring the real-time view available to the teacher.1
60-Second Answer Time Limit: Students are allocated a maximum of 60 seconds to answer a question. After this period, their ability to submit an answer is disabled, and they are automatically redirected to view the live polling results.1 This time limit necessitates a client-side countdown timer to provide immediate user feedback. However, for system robustness and to prevent unauthorized submissions, the server must also strictly enforce this time limit. This means the server should precisely track when a question was asked and reject any answers submitted beyond the 60-second window. This interaction between the client-side user interface and the server-side validation logic is paramount for a fair and functional polling system.
The following table summarizes the functional requirements for both personas:

Feature
Teacher Persona
Student Persona
Description
Create New Poll
✓

Teacher formulates and initiates new polling questions.
View Live Polling Results
✓
✓
Both personas can view real-time results of the current poll.
Conditional Question Asking
✓

Teacher can ask a new question only if no question was asked previously or if all students have answered.
Unique Name Entry (per tab, persistent)

✓
Student enters a unique name for a tab; name persists on refresh but not across tabs.
Submit Answer

✓
Student submits an answer to the current live question.
60-Second Answer Time Limit

✓
Student has 60 seconds to answer; then results are shown.

3. Technical Stack

The Live Polling System will be built upon a robust and modern technical stack designed to support real-time interactions and a responsive user experience.

Frontend

React: This JavaScript library is selected for building the user interfaces due to its component-based architecture, declarative views, and efficient DOM updates. These characteristics are particularly well-suited for dynamic and interactive web applications such as a live polling system, where UI updates need to be fast and seamless.
Redux (Optional/Good-to-have): While not strictly mandatory for the core functionality, Redux offers a predictable state container that can be integrated for robust state management.1 Its inclusion would be beneficial if the application's complexity were to grow, for instance, in managing multiple concurrent polls, intricate user states, or integrating advanced features like a chat system. Redux's structured approach can simplify debugging and ensure consistent state synchronization across various components.

Backend

ExpressJs: As a fast, unopinionated, and minimalist web framework for Node.js, ExpressJs provides the ideal foundation for building robust APIs and handling HTTP requests.1 It will serve as the backbone for all server-side logic, managing data flow and interactions.
Socket.io: This powerful library is explicitly required to power the live polling functionality.1 Socket.io enables real-time, bidirectional, event-based communication between the web client and the server. Its explicit mention as the powering technology for polling is a critical architectural directive. This immediately signals that the system's core functionality will rely heavily on WebSockets for instantaneous data synchronization, rather than traditional REST API polling. This choice significantly impacts how data is pushed from the server to connected clients (both Teachers and Students), how real-time events are managed (e.g., a new question being asked, an answer being submitted, a timer expiring), and how the application's state is maintained across all connected clients. It necessitates an event-driven design pattern for the core functionalities, ensuring immediate updates and a truly "live" experience.
The following table provides an overview of the chosen technical stack:

Component
Technology
Purpose/Reasoning
Frontend Framework
React
Component-based UI development for dynamic interactions.
Frontend State Management
Redux (Optional)
Predictable state container for complex application states.
Backend Framework
ExpressJs
Fast, minimalist web framework for robust API development.
Real-time Communication
Socket.io
Enables bidirectional, event-based real-time polling updates.

4. Core Deliverables (Must-Haves)

The successful completion of this project hinges on the full implementation and functionality of several core deliverables, which represent the minimum viable product (MVP).
Functional System: The entire application, encompassing both the frontend and backend components, must be fully operational and devoid of critical bugs. This ensures a complete and smooth user flow for both the Teacher and Student personas.1
Teacher Poll Creation: The teacher must possess the capability to successfully create and initiate new polls, making them readily visible and answerable by students.1
Student Answer Submission: Students must be able to effectively receive poll questions and submit their answers within the system.1
Live Poll Results Viewing: A fundamental requirement is that both teachers and students have the capability to view the real-time results of the ongoing poll, ensuring transparency and immediate feedback.1
Full Solution Hosting: The complete application, including both the frontend website and the backend server, must be deployed and accessible online.1 This requirement elevates deployment from a mere good practice to a fundamental deliverable. Consequently, the project plan must explicitly account for the deployment strategy, including environment configuration (e.g., setting up necessary environment variables, API keys, and potentially a basic database), and considering continuous integration/delivery principles, even at a foundational level. This implies that the solution needs to be production-ready, not merely runnable in a local development environment.

5. Optional Enhancements

Beyond the core "Must-haves," several optional enhancements are identified to demonstrate additional effort, design consideration, and advanced capabilities. These features will be prioritized and implemented after the foundational requirements are fully met.

5.1. Good-to-Haves

Configurable Maximum Poll Time: The teacher should have the flexibility to set the duration for which a poll remains active, moving beyond a fixed 60-second limit.1 This adds a layer of control and adaptability to the polling sessions.
Teacher's Ability to Kick a Student: Functionality allowing the teacher to remove a student from the active polling session could be implemented. This might involve disconnecting their Socket.io connection or marking them as inactive within the system's state.1
Proper Website Design: Ensuring the user interface is aesthetically pleasing, intuitive, and adheres closely to modern web design principles and the provided Figma design.1 While categorized as a "Good-to-have," its presence alongside a specific Figma design link suggests that the quality of the design is a significant consideration. This implies that even for the MVP, the basic UI should be clean and functional, with the "Proper design" serving as an enhancement to refine aesthetics and overall user experience. The project is expected to not only function correctly but also present a polished and professional appearance.

5.2. Brownie Points (Tasks for Brownie Points)

These features represent advanced functionalities that would earn additional recognition.
Chat Popup for Interaction: Integrating a real-time chat feature, potentially as a popup, would allow students and teachers to communicate during the polling session, fostering greater interaction.1
Teacher's View of Past Poll Results (Persistent Storage): Enabling the teacher to access and review results from previous polls is a valuable addition. Crucially, these results must be stored persistently (e.g., in a database) and not merely in local browser storage.1 The explicit instruction "not from localstorage" for viewing past poll results serves as a clear indication that if this feature is implemented, it necessitates a robust, persistent database solution on the backend. This moves beyond transient, in-memory state management and implies a more comprehensive data storage strategy (e.g., using MongoDB or PostgreSQL) for historical data, adding significant architectural complexity and demonstrating a deeper understanding of data persistence and scalability.
Teacher and Student Authentication: Implementing a robust authentication system for both teacher and student personas. For teachers, this would involve secure login credentials to manage polls, ensuring only authorized individuals can create and control sessions. For students, authentication could provide persistent identities across sessions, allowing for tracking of individual progress or participation in specific classes. This would require a database to store user credentials and session management on the server-side.
Polling Rooms/Sessions: Introducing the concept of "rooms" or distinct polling sessions. This would allow teachers to create unique sessions that students can join using a specific room ID or link. Questions and results would then be confined to that particular room, preventing questions from being broadcast to all logged-in students and enabling multiple concurrent polling sessions for different groups or classes. This would involve managing room states and student connections within specific room contexts on the server.

6. Project Development Phases & Timeline

The development of the Live Polling System will follow a structured, phased approach, demonstrating a clear understanding of project management and iterative development principles. This phased breakdown ensures systematic progress and efficient resource allocation.

Phase
Estimated Duration
Key Activities
Deliverables
1: Core Backend & API Development
25%
Initialize Node.js/ExpressJs project; Define API routes; Design data models for polls, questions, answers, users; Set up basic Socket.io server and connection handling; Implement rudimentary user session management.
Functional ExpressJs server with defined API endpoints, basic Socket.io setup, preliminary data model.
2: Core Frontend Development
30%
Initialize React application; Develop distinct UI for Teacher (poll creation, results placeholder) and Student (name entry, question display, answer form); Integrate React components with backend APIs; Implement Socket.io client-side; Implement sessionStorage for student name persistence.
Basic, interactive React application with separate Teacher and Student views, capable of backend communication and student name persistence.
3: Feature Implementation & Refinements
25%
Implement teacher's conditional question asking logic (track active polls, student responses); Develop client-side timer and server-side validation for 60-second limit; Enhance real-time results display for both personas via Socket.io; Implement basic error handling.
Fully functional core system meeting all "Must-have" functional requirements, with robust real-time updates and adherence to business logic.
4: Deployment & Testing
10%
Select and configure hosting platforms (frontend/backend); Establish basic deployment process; Conduct comprehensive functional testing (real-time updates, concurrency, timer accuracy); Address bugs and optimize performance.
Fully deployed, accessible, and thoroughly tested Live Polling System online.
5: Optional Enhancements (Iterative)
Remaining Time
Prioritize "Good-to-haves" and "Brownie points"; Iteratively develop selected features (e.g., configurable poll time, chat, persistent past results, authentication, rooms); Integrate persistent database if needed for "Brownie Points"; Refine UI/UX based on Figma design.
Enhanced application with selected optional features, demonstrating advanced capabilities and attention to detail.

6.1. Phase 1: Core Backend & API Development

This initial phase focuses on establishing the robust foundation of the application. Project setup involves initializing a Node.js project with ExpressJs. Subsequently, basic server structures will be defined, including API routes necessary for poll creation, question retrieval, and answer submission. A fundamental aspect of this phase is the definition of data models for polls, questions, answers, and user sessions, which will differentiate between Teacher and Student connections. Basic Socket.io integration will also commence, focusing on setting up the server, handling initial client connections, and implementing preliminary event broadcasting for new questions. A rudimentary system for user session management will be implemented to differentiate personas and maintain unique student identities, potentially using session IDs or identifiers passed from the frontend. Starting with the backend ensures that the core logic and data flow are robust and well-defined before the user interface is constructed. Establishing basic Socket.io and session management early is crucial because the "live" aspect and the differentiation between Teacher and Student personas are fundamental to the application's core functionality. Without a solid backend, the frontend cannot effectively interact in real-time or enforce critical business rules.

6.2. Phase 2: Core Frontend Development

Following the backend foundation, this phase concentrates on building the user-facing components. It begins with the setup of the React application. Distinct user interfaces will be developed for both the Teacher (including a poll creation form and a placeholder for results display) and the Student (featuring a name entry screen, question display, and an answer submission form). Crucially, these React components will be integrated with the backend ExpressJs APIs for initial data fetching and submission. Socket.io client-side integration will also be implemented, establishing connections to the backend and listening for core events such as newQuestion and pollResultsUpdate. A key activity in this phase is the implementation of logic to store and retrieve unique student names using sessionStorage, fulfilling the requirement for names to be unique per tab but persistent on refresh. This phase focuses on building the interactive user interface, with a strong emphasis on integrating with the backend's real-time capabilities via Socket.io. The UI must be highly reactive to events pushed from the server, such as a new question appearing or results changing, which is a direct consequence of the Socket.io requirement. The sessionStorage implementation for student names is a specific client-side detail addressed here, ensuring proper user experience.

6.3. Phase 3: Feature Implementation & Refinements

This phase is dedicated to implementing the core interactive features and refining existing functionalities to meet all "Must-have" requirements. The backend logic will be developed to enforce the teacher's conditional question asking rule, requiring meticulous tracking of active polls and student response statuses. A client-side countdown timer will be implemented for students, complemented by server-side validation to ensure answers are accepted only within the 60-second window. The results viewing components for both Teacher and Student will be enhanced to dynamically update in real-time as answers are submitted, leveraging Socket.io for efficient data push. Finally, basic error handling will be implemented for API calls, Socket.io disconnections, and various edge cases. This phase brings the core "live polling" and interactive logic to fruition. The teacher's question logic and the student's 60-second timer are highly interdependent and demand careful synchronization between the client and server. The success of this phase relies heavily on effective real-time communication and robust state management, highlighting the challenges and solutions inherent in building a "live" system.

6.4. Phase 4: Deployment & Testing

Given that hosting the full solution is a "Must-have" 1, this phase is non-negotiable and focuses on making the application accessible and reliable. It involves selecting and configuring a suitable hosting platform for both the frontend (e.g., Vercel, Netlify) and the backend (e.g., Render, Heroku, AWS EC2). This includes setting up necessary environment variables, domain configuration, and potentially a simple database if persistent storage is required for the MVP. A basic deployment process will be established. Comprehensive functional testing will be conducted across all "Must-have" features for both personas, with particular attention to real-time updates, concurrency with multiple students, and timer accuracy. Any identified bugs will be addressed, and minor performance optimizations will be performed to ensure responsiveness. This phase demonstrates the ability to not only build but also deploy and maintain a functional application. The rigorous testing aspect is crucial for ensuring that the "functional system" must-have is genuinely met, especially for real-time interactions and concurrent users, which can often introduce complex and subtle bugs.

6.5. Phase 5: Optional Enhancements (Iterative)

This final phase focuses on iteratively adding value beyond the core requirements. "Good-to-haves" and "Brownie points" will be evaluated and prioritized based on remaining time and effort, with a focus on features that offer the most value or demonstrate unique skills. Selected enhancements will be implemented, such as configurable poll time, the ability for a teacher to kick a student, a chat popup, teacher/student authentication, or the implementation of polling rooms. If the "view past poll results (not from localstorage)" brownie point is pursued, a persistent database (e.g., MongoDB, PostgreSQL) will be integrated, and the necessary schema and API endpoints will be designed. Concurrently, the "Proper website design" will be addressed by enhancing styling, responsiveness, and overall user experience, adhering to the provided Figma design. This phase demonstrates an understanding of iterative development and scope management. By clearly separating "must-haves" from "good-to-haves" and "brownie points," it illustrates the ability to prioritize and deliver a core product first, then incrementally add value. The "not from localstorage" requirement for past results also highlights a significant architectural consideration (database integration) if pursuing that specific advanced feature, showcasing foresight into scalability and robust data management.

7. How to Run the Project Locally

To set up and run the Live Polling System in a local development environment, follow these steps:

Prerequisites

Node.js: Version 18 or higher.
npm or yarn: A package manager for Node.js.

Installation Steps

Clone the Repository:
Bash
git clone <repository_url>
cd <project_directory>

Install Backend Dependencies:
Bash
cd backend
npm install # or yarn install

Install Frontend Dependencies:
Bash
cd../frontend
npm install # or yarn install

Environment Variable Setup:
In the backend directory, create a .env file.
Add any necessary environment variables (e.g., PORT=5000).
Similarly, in the frontend directory, create a .env file for any frontend-specific environment variables (e.g., REACT_APP_BACKEND_URL=http://localhost:5000).

Running the Application

Start the Backend Server:
Navigate to the backend directory in your terminal.
Run the command:
Bash
npm start # or yarn start

The backend server should start, typically on http://localhost:5000.
Start the Frontend Development Server:
Open a new terminal window.
Navigate to the frontend directory.
Run the command:
Bash
npm start # or yarn start

The frontend development server should start and automatically open the application in your browser, typically on http://localhost:3000.
Access the Interfaces:
Teacher Interface: Access via http://localhost:3000/teacher (or similar route, depending on implementation).
Student Interface: Access via http://localhost:3000/student (or similar route, depending on implementation). Open multiple tabs to simulate multiple students.

8. Future Scope & Potential Improvements

The Live Polling System, while meeting its core requirements, presents numerous opportunities for future expansion and refinement, demonstrating a forward-thinking approach to software development.

Scalability Enhancements

For handling a larger number of concurrent students or polls, future work could focus on:
Database Indexing and Optimization: Implementing proper database indexing and query optimization to ensure efficient retrieval and storage of poll data, especially if the volume of historical data grows.
Load Balancing: Introducing load balancing mechanisms for the backend server to distribute incoming traffic across multiple instances, improving responsiveness and availability under heavy load.
Robust State Management: Exploring more sophisticated server-side state management solutions beyond in-memory storage for active polls and student sessions, potentially integrating with distributed caching systems.

Security Considerations

Enhancing the system's security posture would involve:
Teacher Authentication: Implementing a robust authentication system for teachers to ensure only authorized individuals can create and manage polls.
Input Validation and Sanitization: Strengthening input validation on both the client and server sides to prevent common web vulnerabilities such as Cross-Site Scripting (XSS) and SQL injection (if a relational database is used).
Rate Limiting: Applying rate limiting to API endpoints and Socket.io events to mitigate denial-of-service attacks and prevent abuse.

User Experience Refinements

Further enhancing the user experience could include:
Real-time Participant List: Displaying a real-time list of connected students for the teacher, providing better oversight of the active participants.
Improved Error Messages: Providing more informative and user-friendly error messages to guide users through issues.
Accessibility Features: Ensuring the application adheres to accessibility guidelines (WCAG) to make it usable for individuals with disabilities.

Additional Features

Beyond the current scope, the system could be extended with:
Different Poll Types: Introducing various poll types beyond simple multiple-choice, such as open-ended questions, ranking, or image-based polls.
Analytics Dashboard: Developing a comprehensive analytics dashboard for teachers to review poll performance, student engagement, and historical trends.
Integration with External Services: Exploring integration with learning management systems (LMS) or communication platforms for seamless classroom integration.
Including a "Future Scope" section, even for an intern assignment, conveys a proactive mindset and an understanding of the software lifecycle beyond initial development. It demonstrates the ability to consider scalability, long-term maintenance, and potential feature growth, qualities highly valued in a professional engineering environment. This section also provides an opportunity to showcase knowledge of broader software engineering principles and the potential evolution of the product.
Works cited
accessed on January 1, 1970,
Intervue: Interview Outsourcing, Interview as a Service Platform, accessed on June 18, 2025, https://www.intervue.io/
CodeInterview - The Online Code Interview Tool & Code Editor, accessed on June 18, 2025, https://codeinterview.io/
