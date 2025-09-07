import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate]);

  // Auto dismiss error after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/users/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent drop-shadow-sm mb-6">
            Sign In
          </h3>

          {error && <Message variant="danger">{error}</Message>}

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                className="block text-gray-200 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-200 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center shadow-md transition-all"
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign In"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-300 hover:text-indigo-400 transition"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
