"use client";

import Image from "next/image";

interface ErrorDisplayProps {
  error: string;
  src: string;
  isMounted: boolean;
  onRetry: () => void;
}

export function ErrorDisplay({
  error,
  src,
  isMounted,
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white p-4 relative">
      {isMounted && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.jpg"
            alt="Video error"
            fill
            quality={75}
            className="object-cover opacity-20"
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Video Error</h3>
        <p className="text-center text-gray-300 mb-2">
          Unable to load the video. The URL may be invalid, restricted, or not
          supported by your browser.
        </p>
        {error && (
          <p className="text-sm text-yellow-300 mb-4 text-center">
            Error details: {error}
          </p>
        )}
        <div className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto max-w-full">
          <code>{src || "No video URL provided"}</code>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.open(src, "_blank")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Open URL directly
          </button>
          <button
            onClick={onRetry}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
