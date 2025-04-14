"use client";

interface YouTubePlayerProps {
  youtubeId: string;
  isPlaying: boolean;
  togglePlay: () => void;
}

export function YouTubePlayer({
  youtubeId,
  isPlaying,
  togglePlay,
}: YouTubePlayerProps) {
  return (
    <div className="w-full h-full">
      <div id="youtube-player" className="w-full h-full"></div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        YouTube Video
      </div>

      {/* Large Play Button Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="bg-primary/80 hover:bg-primary text-white rounded-full p-6 shadow-lg transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
