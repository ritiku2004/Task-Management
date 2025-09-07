import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskForm from "./pages/TaskForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />

          {/* Route for creating a NEW task */}
          <Route path="/task/new" element={<TaskForm />} />

          {/* Route for editing an existing task */}
          <Route path="/task/:id/edit" element={<TaskForm />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 1000 }}
        toastClassName={() =>
          "relative flex p-4 rounded-2xl justify-between items-center backdrop-blur-lg " +
          "bg-gradient-to-r from-indigo-600/40 via-violet-600/40 to-indigo-500/40 " +
          "text-white shadow-lg shadow-indigo-500/40 border border-white/20"
        }
        bodyClassName={() => "text-sm font-medium"}
        closeButton={false}
      />
    </Router>
  );
}

export default App;
