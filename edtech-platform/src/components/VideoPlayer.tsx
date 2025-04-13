"use client";

import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
}

// Add the YouTube IFrame API type
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeId, setYoutubeId] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [ytPlayerReady, setYtPlayerReady] = useState(false);
  const [ytApiReady, setYtApiReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (isYouTube && !window.YT) {
      // Load the YouTube API script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Set up the callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API ready");
        initYouTubePlayer();
      };
    } else if (isYouTube && window.YT && window.YT.Player) {
      initYouTubePlayer();
    }
  }, [isYouTube, youtubeId]);

  const initYouTubePlayer = () => {
    if (!youtubeId || !isYouTube) return;

    console.log("Initializing YouTube player with ID:", youtubeId);

    // Create the YouTube player
    youtubePlayerRef.current = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubeStateChange,
        onError: onYouTubeError,
      },
    });
  };

  const onYouTubePlayerReady = (event: any) => {
    console.log("YouTube player ready");
    setYtPlayerReady(true);
    setDuration(event.target.getDuration());

    // Set initial volume
    event.target.setVolume(volume * 100);

    // Start the timer to update current time
    startYouTubeTimeUpdater();
  };

  const onYouTubeStateChange = (event: any) => {
    const state = event.data;
    console.log("YouTube state change:", state);

    // YT.PlayerState.PLAYING = 1
    setIsPlaying(state === 1);

    if (state === 1) {
      // Update duration if it wasn't available earlier
      if (duration === 0) {
        setDuration(youtubePlayerRef.current.getDuration());
      }
    }
  };

  const onYouTubeError = (event: any) => {
    console.error("YouTube player error:", event);
    setHasError(true);
  };

  const startYouTubeTimeUpdater = () => {
    // Cancel any existing animation frame first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Update the current time periodically
    const updateYouTubeTime = () => {
      if (youtubePlayerRef.current && ytPlayerReady) {
        try {
          const currentTime = youtubePlayerRef.current.getCurrentTime();
          setCurrentTime(currentTime);
        } catch (error) {
          console.error("Error getting YouTube current time:", error);
        }
      }

      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(updateYouTubeTime);
    };

    // Start the updater
    updateYouTubeTime();
  };

  // Check if URL is a YouTube video and extract the ID
  useEffect(() => {
    if (!src) {
      console.error("No video source provided");
      setHasError(true);
      return;
    }

    console.log("Video source:", src);

    try {
      // Enhanced YouTube regex detection
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = src.match(youtubeRegex);

      if (match && match[1]) {
        setIsYouTube(true);
        setYoutubeId(match[1]);
        console.log("YouTube video ID extracted:", match[1]);
      } else {
        // Try another approach for YouTube URLs
        const url = new URL(src);
        if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
          const videoId = url.searchParams.get("v");
          setIsYouTube(true);
          setYoutubeId(videoId || "");
          console.log("YouTube video ID extracted from searchParams:", videoId);
        } else if (url.hostname.includes("youtu.be")) {
          const videoId = url.pathname.substring(1);
          setIsYouTube(true);
          setYoutubeId(videoId);
          console.log("YouTube video ID extracted from short URL:", videoId);
        } else {
          setIsYouTube(false);
          setYoutubeId("");
          console.log("Not a YouTube URL or couldn't extract ID");
        }
      }
      setHasError(false);
    } catch (error) {
      console.error("Error processing video URL:", error);
      setIsYouTube(false);
      setYoutubeId("");
      setHasError(true);
    }
  }, [src]);

  // Regular HTML5 video controls
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate]);

  // YouTube player volume and playback rate
  useEffect(() => {
    if (youtubePlayerRef.current && ytPlayerReady && isYouTube) {
      try {
        // YouTube volume is 0-100, our volume is 0-1
        youtubePlayerRef.current.setVolume(volume * 100);
        youtubePlayerRef.current.setPlaybackRate(playbackRate);
      } catch (error) {
        console.error("Error setting YouTube volume/playback rate:", error);
      }
    }
  }, [volume, playbackRate, ytPlayerReady, isYouTube]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [isYouTube]);

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (isYouTube && youtubePlayerRef.current && ytPlayerReady) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);

    if (isYouTube && youtubePlayerRef.current && ytPlayerReady) {
      youtubePlayerRef.current.seekTo(time, true);
      setCurrentTime(time);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (isYouTube && youtubePlayerRef.current && ytPlayerReady) {
      youtubePlayerRef.current.setVolume(newVolume * 100);
    } else if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);

    if (isYouTube && youtubePlayerRef.current && ytPlayerReady) {
      youtubePlayerRef.current.setPlaybackRate(rate);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // Start or stop time updater based on play state
  useEffect(() => {
    if (isYouTube && ytPlayerReady) {
      if (isPlaying) {
        startYouTubeTimeUpdater();
      } else if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isYouTube, ytPlayerReady, isPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {hasError ? (
        <div className="flex flex-col items-center justify-center h-full text-white p-4">
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
          {errorDetails && (
            <p className="text-sm text-yellow-300 mb-4 text-center">
              Error details: {errorDetails}
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
              onClick={() => {
                setHasError(false);
                setErrorDetails("");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      ) : isYouTube ? (
        <div className="w-full h-full">
          <div id="youtube-player" className="w-full h-full"></div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            YouTube Video
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          title={title}
          controls={false}
          playsInline
          onLoadStart={() => console.log("Video load started")}
          onLoadedData={() => console.log("Video data loaded")}
          onError={(e) => {
            console.error("Video error:", e);

            // Extract more specific error information if available
            let errorMessage = "Unknown error";
            if (videoRef.current) {
              const mediaError = videoRef.current.error;
              if (mediaError) {
                // MediaError codes: 1=MEDIA_ERR_ABORTED, 2=MEDIA_ERR_NETWORK, 3=MEDIA_ERR_DECODE, 4=MEDIA_ERR_SRC_NOT_SUPPORTED
                const codeMessages: Record<number, string> = {
                  1: "Video loading aborted",
                  2: "Network error while loading video",
                  3: "Video format not supported or corrupted",
                  4: "Video format not supported by browser",
                };

                errorMessage =
                  codeMessages[mediaError.code] ||
                  `Error code: ${mediaError.code}`;
                if (mediaError.message) {
                  errorMessage += ` - ${mediaError.message}`;
                }
              }
            }

            setErrorDetails(errorMessage);
            setHasError(true);
          }}
          autoPlay
        />
      )}

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00171F]/90 to-transparent p-4 transition-opacity duration-300">
          <div className="flex items-center mb-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
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
                  onChange={handleVolumeChange}
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
                        onClick={() => handlePlaybackRateChange(rate)}
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
      )}
    </div>
  );
}
