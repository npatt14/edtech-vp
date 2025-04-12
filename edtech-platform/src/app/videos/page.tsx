"use client";

import { useState, useEffect } from "react";
import { useVideo } from "@/context/VideoContext";
import VideoCard from "@/components/VideoCard";
import VideoForm from "@/components/VideoForm";

export default function VideosPage() {
  const { videos, loading, error, fetchVideos, userId } = useVideo();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (userId) {
      fetchVideos(userId);
    }
  }, [userId, fetchVideos]);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Educational Videos
          </h1>
          <p className="text-gray-600">
            Explore and learn from our collection of educational videos
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add New Video
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search videos by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007EA7]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <p className="mt-2 text-sm">
            {!userId && "Please set your User ID to view videos."}
          </p>
        </div>
      ) : (
        <>
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              {searchTerm ? (
                <p className="text-gray-600">
                  No videos matching "{searchTerm}"
                </p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No videos found</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary"
                  >
                    Add Your First Video
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.video_id} video={video} />
              ))}
            </div>
          )}
        </>
      )}

      {showForm && <VideoForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
