import React from "react";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <VideoCard key={video.video_id || `video-${index}`} video={video} />
      ))}
    </div>
  );
}
