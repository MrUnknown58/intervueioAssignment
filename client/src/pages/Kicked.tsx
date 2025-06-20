import React from "react";
import { useNavigate } from "react-router-dom";

const Kicked: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#fff" }}
    >
      <div className="text-center">
        <button
          className="px-4 py-1 rounded-full text-white text-xs mb-6"
          style={{ background: "#5B2EFF" }}
          onClick={() => navigate("/student")}
        >
          ✦ Intervue Poll
        </button>
        <h1 className="text-3xl font-bold mb-2">You’ve been Kicked out !</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Looks like the teacher had removed you from the poll system. Please
          <br />
          Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default Kicked;
