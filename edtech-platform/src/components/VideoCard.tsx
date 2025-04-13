"use client";

import Link from "next/link";
import { Video } from "@/types";

interface VideoCardProps {
  video: Video & { id?: string };
}

export default function VideoCard({ video }: VideoCardProps) {
  // Handle potentially missing properties
  const video_id = video.video_id || video.id;
  const title = video.title || "Untitled Video";
  const description = video.description || "No description available";
  const video_url = video.video_url || "";

  // Log the video info for debugging
  console.log("Video card rendering:", { video_id, title, video });

  // Get thumbnail from video URL
  const getThumbnail = (url: string) => {
    // For YouTube videos
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtube.com")
        ? url.split("v=")[1]?.split("&")[0]
        : url.split("youtu.be/")[1]?.split("?")[0];

      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }

    // Default placeholder if not a YouTube video
    return "/placeholder-thumbnail.jpg";
  };

  // Only treat undefined, null, or empty string as invalid
  if (video_id === undefined || video_id === null || video_id === "") {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-[#00171F] shadow-lg transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getThumbnail(video_url)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00171F]/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {title}
            </h3>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              Invalid Video ID
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/videos/${video_id}`} passHref>
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-[#00171F] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getThumbnail(video_url)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00171F]/60 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {title}
            </h3>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-[#007EA7] rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
