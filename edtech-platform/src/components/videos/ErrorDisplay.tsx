import React from "react";

interface ErrorDisplayProps {
  error: string;
  userId: string | null;
  onRetry: () => void;
}

export function ErrorDisplay({ error, userId, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
      <p className="font-semibold">{error}</p>
      <p className="mt-2 text-sm">
        {!userId && "Please set your User ID to view videos."}
      </p>
      <p className="mt-2 text-sm">
        The API should be available at
        https://take-home-assessment-423502.uc.r.appspot.com/api
      </p>
      <div className="mt-4">
        <button
          onClick={() => {
            if (userId) {
              onRetry();
            } else {
              alert("Please set your User ID first");
            }
          }}
          className="px-4 py-2 bg-red-200 hover:bg-red-300 rounded-md text-red-800 text-sm font-medium"
        >
          Retry Loading Videos
        </button>
      </div>
    </div>
  );
}
