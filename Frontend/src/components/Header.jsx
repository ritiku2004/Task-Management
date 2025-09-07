import React, { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { toast } from "react-toastify";

const Header = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <header className="bg-gradient-to-r from-indigo-600/40 via-violet-600/40 to-indigo-600/40 backdrop-blur-lg text-white w-full shadow-lg fixed top-0 z-50 border-b border-white/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-indigo-400 drop-shadow-md"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* Stacked task list / columns */}
                                <rect x="3" y="4" width="18" height="3" rx="1.5" stroke="currentColor" />
                                <rect x="3" y="10.5" width="18" height="3" rx="1.5" stroke="currentColor" />
                                <rect x="3" y="17" width="12" height="3" rx="1.5" stroke="currentColor" />
                            </svg>


                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent drop-shadow-sm">
                                TaskManager
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-2">
                        {/* Desktop */}
                        <div className="hidden md:block">
                            {userInfo && (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
                                        <UserCircleIcon className="h-6 w-6 text-indigo-300" />
                                        <span className="font-semibold text-white">Hi, {userInfo.name}</span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-100 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-100 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-gray-800 backdrop-blur-lg border border-white/20 focus:outline-none z-50">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={logoutHandler}
                                                        className={`${active ? "bg-indigo-600/20 text-white" : "text-gray-200"} group flex rounded-md items-center w-full px-4 py-2 text-sm transition`}
                                                    >
                                                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            )}
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden">
                            {userInfo && (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                                        <UserCircleIcon className="h-8 w-8 text-indigo-300" />
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
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-xl shadow-lg py-1 bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none z-50">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={logoutHandler}
                                                        className={`${active ? "bg-indigo-600/60 text-white" : "text-gray-200"} group flex rounded-md items-center w-full px-4 py-2 text-sm transition`}
                                                    >
                                                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" />
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            )}
                        </div>
                    </nav>

                </div>
            </div>
        </header>
    );
};

export default Header;
