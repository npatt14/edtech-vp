"use client";

import { useState, useEffect, useRef } from "react";
import { useVideo } from "@/context/VideoContext";
import VideoCard from "@/components/VideoCard";
import VideoForm from "@/components/VideoForm";

// Sample video interface
interface SampleVideo {
  title: string;
  description: string;
  video_url: string;
}

// Sample educational videos users can add
const sampleVideos: SampleVideo[] = [
  {
    title: "Introduction to Neural Networks",
    description:
      "Learn the fundamentals of neural networks and how they form the basis of modern AI systems.",
    video_url: "https://www.youtube.com/watch?v=aircAruvnKk",
  },
  {
    title: "The Physics of Black Holes",
    description:
      "Explore the fascinating physics behind black holes and their impact on our understanding of the universe.",
    video_url: "https://www.youtube.com/watch?v=e-P5IFTqB98",
  },
  {
    title: "Understanding Blockchain Technology",
    description:
      "A beginner-friendly explanation of blockchain technology and its applications beyond cryptocurrency.",
    video_url: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
  },
  {
    title: "The Science of Climate Change",
    description:
      "An evidence-based overview of climate science and how human activities are affecting our planet.",
    video_url: "https://www.youtube.com/watch?v=ifrHogDujXw",
  },
];

export default function VideosPage() {
  const { videos, loading, error, fetchVideos, userId } = useVideo();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState<SampleVideo | null>(
    null
  );
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (userId && userId !== previousUserIdRef.current) {
      previousUserIdRef.current = userId;
      fetchVideos(userId);
    }
  }, [userId, fetchVideos]);

  // Ensure videos is always an array before filtering
  const filteredVideos = Array.isArray(videos)
    ? videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const hasVideos = Array.isArray(videos) && videos.length > 0;

  const handleAddSampleVideo = (sample: SampleVideo) => {
    setSelectedSample(sample);
    setShowForm(true);
  };

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
        {hasVideos && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add New Video
            </button>
          </div>
        )}
      </div>

      {hasVideos && (
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
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007EA7]"></div>
        </div>
      ) : error ? (
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
                  console.log("Manually refreshing videos for:", userId);
                  fetchVideos(userId);
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
      ) : (
        <>
          {filteredVideos.length === 0 ? (
            <div className="py-8">
              {searchTerm ? (
                <p className="text-gray-600 text-center">
                  No videos matching &quot;{searchTerm}&quot;
                </p>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="bg-[#007EA7]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-[#007EA7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#003459] mb-3">
                      Welcome to Your Video Library
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      This is where your educational videos will appear. Start
                      by adding your first video to begin building your
                      collection.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn btn-primary px-8 py-3 text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                      Add Your First Video
                    </button>
                  </div>

                  <div className="mt-12 border-t pt-8">
                    <h3 className="text-xl font-bold text-[#003459] mb-6 text-center">
                      Or try one of these sample videos to get started
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sampleVideos.map((sample, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#007EA7] hover:shadow-md transition-all duration-300 cursor-pointer"
                          onClick={() => handleAddSampleVideo(sample)}
                        >
                          <div className="flex items-start">
                            <div className="bg-[#007EA7]/10 rounded-md p-2 mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-[#007EA7]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#003459] mb-1">
                                {sample.title}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {sample.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <VideoCard
                  key={video.video_id || `video-${index}`}
                  video={video}
                />
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <VideoForm
          onClose={() => setShowForm(false)}
          initialData={selectedSample}
        />
      )}
    </div>
  );
}
