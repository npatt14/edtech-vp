import React from "react";
import { SampleVideo } from "./SampleVideos";

interface EmptyStateProps {
  searchTerm: string;
  onAddVideo: () => void;
  sampleVideos: SampleVideo[];
  onAddSampleVideo: (sample: SampleVideo) => void;
}

export function EmptyState({
  searchTerm,
  onAddVideo,
  sampleVideos,
  onAddSampleVideo,
}: EmptyStateProps) {
  if (searchTerm) {
    return (
      <p className="text-gray-600 text-center py-8">
        No videos matching &quot;{searchTerm}&quot;
      </p>
    );
  }

  return (
    <div className="py-8">
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
            This is where your educational videos will appear. Start by adding
            your first video to begin building your collection.
          </p>
          <button
            onClick={onAddVideo}
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
              <SampleVideoCard
                key={index}
                sample={sample}
                onClick={() => onAddSampleVideo(sample)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SampleVideoCardProps {
  sample: SampleVideo;
  onClick: () => void;
}

function SampleVideoCard({ sample, onClick }: SampleVideoCardProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:border-[#007EA7] hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
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
          <h4 className="font-semibold text-[#003459] mb-1">{sample.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {sample.description}
          </p>
        </div>
      </div>
    </div>
  );
}
