import React from "react";

const Loader = () => (
  <div className="flex justify-center items-center space-x-2 py-6">
    <span className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></span>
    <span className="w-3 h-3 bg-violet-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
    <span className="w-3 h-3 bg-pink-600 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
  </div>
);

export default Loader;
