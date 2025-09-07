import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";
import { Menu, Transition, Dialog } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  ChevronDownIcon as ChevronDownSolid,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : true);

  // Modal state
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/tasks/view?search=${encodeURIComponent(search)}&status=${status}&sortBy=${sortBy}&page=${page}&limit=${limit}`
      );
      setTasks(data.tasks || []);
      setPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount ?? (data.tasks ? data.tasks.length : 0));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, page, limit]);

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate, fetchTasks]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const deleteTaskHandler = async (id) => {
    if (!id) return;
    setError("");
    setSuccessMsg("");
    setDeletingId(id);

    try {
      await api.delete(`/tasks/delete/${id}`);
      await fetchTasks();
      toast.success("Task deleted successfully");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete task";
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
    setSortBy(`${key}_${direction}`);
    setPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ChevronUpDownIcon className="inline-block w-4 h-4 ml-1.5 text-blue-300" />;
    if (sortConfig.direction === "asc")
      return <ChevronUpIcon className="inline-block w-4 h-4 ml-1.5 text-blue-400" />;
    return <ChevronDownSolid className="inline-block w-4 h-4 ml-1.5 text-blue-400" />;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const pageStart = tasks.length > 0 ? (page - 1) * limit + 1 : 0;
  const pageEnd = tasks.length > 0 ? pageStart + tasks.length - 1 : 0;

  const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm";
    if (status === "done")
      return <span className={`${baseClasses} bg-emerald-500/20 text-emerald-300`}>Done</span>;
    return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-300`}>Pending</span>;
  };

  const openTaskDetail = (task) => {
    if (isDesktop) {
      setSelectedTask(task);
    } else {
      navigate(`/task/${task._id}/edit`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-2xl shadow-2xl bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-blue-400/20">
            <h4 className="text-lg font-semibold text-white">All Tasks</h4>
            <Link to="/task/new" className="w-full sm:w-auto">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-medium py-2 px-5 rounded-full shadow-lg shadow-blue-500/30 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                Add New Task
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Limit Dropdown */}
              <Menu as="div" className="relative inline-block text-left w-full md:w-auto">
                <Menu.Button className="inline-flex justify-center w-full rounded-full border border-blue-600/40 px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none">
                  Show: {limit}
                  <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 mt-2 w-28 rounded-xl shadow-lg bg-gray-800 border border-gray-700 focus:outline-none z-10">
                    <div className="py-1">
                      {[2, 5, 10, 20, 50].map((val) => (
                        <Menu.Item key={val}>
                          {({ active }) => (
                            <button
                              onClick={() => handleLimitChange(val)}
                              className={`block px-4 py-2 text-sm w-full text-left rounded-md ${active ? "bg-gray-700 text-white" : "text-gray-200"}`}
                            >
                              {val} entries
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* Status Dropdown */}
              <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
                <Menu.Button className="inline-flex justify-center w-full rounded-full border border-blue-600/40 px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none">
                  Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                  <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-gray-800 border border-gray-700 focus:outline-none z-10">
                    <div className="py-1">
                      {["all", "pending", "done"].map((s) => (
                        <Menu.Item key={s}>
                          {({ active }) => (
                            <button
                              onClick={() => handleStatusChange(s)}
                              className={`block px-4 py-2 text-sm w-full text-left rounded-md ${active ? "bg-gray-700 text-white" : "text-gray-200"}`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Search */}
              <input
                type="search"
                placeholder="Search tasks..."
                value={search}
                onChange={handleSearchChange}
                className="p-2 border border-blue-400/30 rounded-full bg-gray-800 text-gray-100 focus:outline-none w-full sm:w-auto placeholder-gray-400"
              />

            </div>

            {error && <Message variant="danger">{error}</Message>}
            {successMsg && <Message variant="success">{successMsg}</Message>}

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-xl">
              <table className="w-full text-sm text-left bg-gray-900/40 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3">S.No.</th>
                    <th onClick={() => handleSort("title")} className="px-6 py-3 cursor-pointer">
                      <span className="flex items-center">Title {getSortIcon("title")}</span>
                    </th>
                    <th className="px-6 py-3">Description</th>
                    <th onClick={() => handleSort("createdAt")} className="px-6 py-3 cursor-pointer">
                      <span className="flex items-center">Created On {getSortIcon("createdAt")}</span>
                    </th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <Loader />
                      </td>
                    </tr>
                  ) : tasks.length > 0 ? (
                    tasks.map((task, i) => (
                      <tr
                        key={task._id}
                        className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        onClick={() => openTaskDetail(task)}
                      >
                        <td className="px-6 py-4 text-gray-200">{pageStart + i}</td>
                        <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                        <td className="px-6 py-4 text-gray-300 max-w-xs truncate">{task.description}</td>
                        <td className="px-6 py-4 text-gray-300">{new Date(task.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-4">
                            <Link to={`/task/${task._id}/edit`} onClick={(e) => e.stopPropagation()} className="text-blue-300 hover:text-cyan-400">
                              <PencilSquareIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTaskHandler(task._id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile List (for small screens) */}
            <div className="block md:hidden space-y-4">
              {loading ? (
                <Loader />
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-700 shadow hover:bg-gray-800/70 transition-colors cursor-pointer"
                    onClick={() => openTaskDetail(task)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold text-white">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 mt-3">
                      <Link
                        to={`/task/${task._id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-300 hover:text-cyan-400"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTaskHandler(task._id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-400">No tasks found.</p>
              )}
            </div>


            {/* Pagination */}
            {!loading && tasks.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-300 gap-4">
                <p>
                  Showing {pageStart} to {pageEnd} of {totalCount} entries
                </p>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Transition appear show={!!selectedTask} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedTask(null)}>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 shadow-xl">

              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                  {selectedTask?.title || "Add"}
                </Dialog.Title>
                <p className="text-sm text-gray-400">Full task details</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-sm">
                {/* Description */}
                <div>
                  <p className="font-medium text-gray-400 mb-1">Description</p>
                  <p className="text-gray-200">{selectedTask?.description || "—"}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="font-medium text-gray-400 mb-1">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedTask?.status === "done"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-yellow-500/20 text-yellow-300"
                      }`}
                  >
                    {selectedTask?.status || "Pending"}
                  </span>
                </div>

                {/* Dates */}
                <div>
                  <p className="font-medium text-gray-400 mb-1">Dates</p>
                  <p className="text-gray-400">
                    Created: {selectedTask ? new Date(selectedTask.createdAt).toLocaleString() : "—"}
                  </p>
                  <p className="text-gray-400">
                    Updated: {selectedTask ? new Date(selectedTask.updatedAt).toLocaleString() : "—"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
                <Link
                  to={`/task/${selectedTask?._id}/edit`}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit
                </Link>
                <button
                  onClick={() => { deleteTaskHandler(selectedTask._id); setSelectedTask(null); }}
                  className="px-4 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Dashboard;
