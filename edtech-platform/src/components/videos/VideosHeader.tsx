import React from "react";

interface VideosHeaderProps {
  hasVideos: boolean;
  onAddVideoClick: () => void;
}

export function VideosHeader({
  hasVideos,
  onAddVideoClick,
}: VideosHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Educational Videos
        </h1>
        <p className="text-gray-600">
          Explore and learn from our collection of educational videos
        </p>
      </div>
      {hasVideos && (
        <div className="mt-4 md:mt-0">
          <button onClick={onAddVideoClick} className="btn btn-primary">
            Add New Video
          </button>
        </div>
      )}
    </div>
  );
}
