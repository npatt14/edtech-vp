"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useVideo } from "@/context/VideoContext";

export default function Header() {
  const { userId, setUserId } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [isUserIdModalOpen, setIsUserIdModalOpen] = useState(false);

  useEffect(() => {
    setTempUserId(userId);
  }, [userId]);

  const handleSaveUserId = () => {
    if (tempUserId.trim()) {
      setUserId(tempUserId);
      localStorage.setItem("userId", tempUserId);
    }
    setIsUserIdModalOpen(false);
  };

  return (
    <header className="bg-[#00171F] text-white sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#007EA7]">EduStream</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-white hover:text-[#007EA7] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/videos"
            className="text-white hover:text-[#007EA7] transition-colors"
          >
            Videos
          </Link>
          <button
            onClick={() => setIsUserIdModalOpen(true)}
            className="flex items-center space-x-1 text-white hover:text-[#007EA7] transition-colors"
          >
            <span>@{userId || "Set User ID"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#00171F] px-4 py-4 border-t border-[#003459]">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-white hover:text-[#007EA7] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/videos"
              className="text-white hover:text-[#007EA7] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Videos
            </Link>
            <button
              onClick={() => {
                setIsUserIdModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-1 text-white hover:text-[#007EA7] transition-colors"
            >
              <span>@{userId || "Set User ID"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* User ID Modal */}
      {isUserIdModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-gray-800">
            <h2 className="text-2xl font-bold text-[#003459] mb-6">
              Set Your User ID
            </h2>

            <div className="mb-6">
              <label
                htmlFor="userId"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                type="text"
                id="userId"
                value={tempUserId}
                onChange={(e) => setTempUserId(e.target.value)}
                placeholder="Your user ID (e.g., john_smith)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent"
              />
              <p className="mt-2 text-xs text-gray-500">
                This ID will be used when creating videos and adding comments.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsUserIdModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserId}
                className="px-4 py-2 bg-[#007EA7] text-white font-medium rounded-lg hover:bg-[#003459] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
