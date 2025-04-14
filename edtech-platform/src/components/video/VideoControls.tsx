"use client";

interface VideoControlsProps {
  duration: number;
  currentTime: number;
  volume: number;
  playbackRate: number;
  isPlaying: boolean;
  isFullScreen: boolean;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaybackRateChange: (rate: number) => void;
  togglePlay: () => void;
  toggleFullScreen: () => void;
}

export function VideoControls({
  duration,
  currentTime,
  volume,
  playbackRate,
  isPlaying,
  isFullScreen,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  togglePlay,
  toggleFullScreen,
}: VideoControlsProps) {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) {
      return "0:00";
    }

    // Handle hours for videos longer than 60 minutes
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${
        secs < 10 ? "0" : ""
      }${secs}`;
    } else {
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00171F]/90 to-transparent p-4 transition-opacity duration-300">
      <div className="flex items-center mb-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={onSeek}
          className="w-full h-1 bg-[#003459] rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full hover:bg-[#007EA7]/20"
          >
            {isPlaying ? (
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
                  d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                />
              </svg>
            ) : (
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
                  d="M5 5v14l14-7-14-7z"
                />
              </svg>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5L6 9H2v6h4l5 4V5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.07 4.93a10 10 0 0 1 0 14.14"
              />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="w-16 h-1 bg-[#003459] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <span className="text-sm font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="text-sm font-medium hover:text-[#007EA7] px-2 py-1">
              {playbackRate}x
            </button>
            <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#00171F] rounded-lg shadow-lg p-2 min-w-[60px] z-10">
              <div className="flex flex-col space-y-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onPlaybackRateChange(rate)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      playbackRate === rate
                        ? "bg-[#007EA7] text-white"
                        : "hover:bg-[#003459]/30"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-[#007EA7]/20"
          >
            {isFullScreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 9V4.5M9 9H4.5M15 9H19.5M15 9V4.5M15 15v4.5M15 15H4.5M15 15h4.5M9 15v4.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
