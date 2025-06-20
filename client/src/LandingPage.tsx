import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Live Polling System
          </h1>
          <p className="text-slate-600 text-lg">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 max-w-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Choose your role
            </h2>
            <p className="text-slate-600">
              Select how you want to join the session
            </p>
          </div>

          <div className="space-x-3 flex">
            <button
              className="w-full p-4 text-left bg-white border-2 border-slate-300! hover:border-indigo-300 rounded-xl transition-all duration-200 hover:shadow-md group"
              onClick={() => navigate("/student")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-slate-800 transition-colors">
                    Student
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Join a poll session with a code
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            <button
              className="w-full p-4 text-left bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 hover:shadow-lg text-white"
              onClick={() => navigate("/teacher")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-white">Teacher</h3>
                  <p className="text-sm text-indigo-100 mt-1">
                    Create and manage poll sessions
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-white text-opacity-80"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
