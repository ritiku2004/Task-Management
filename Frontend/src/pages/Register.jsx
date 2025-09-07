import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      const errMsg = err.response?.data?.message || "An error occurred";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent drop-shadow-sm mb-6">
            Create an Account
          </h3>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label
                className="block text-gray-200 text-sm font-semibold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-200 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
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
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-200 text-sm font-semibold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-gray-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center justify-center shadow-md transition-all"
              disabled={loading}
            >
              {loading ? <Loader /> : "Register"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-300 hover:text-indigo-400 transition"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
