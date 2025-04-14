import { useState, useRef, useEffect } from "react";

interface VideoStateReturn {
  videoState: {
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    playbackRate: number;
    isFullScreen: boolean;
    showControls: boolean;
    isYouTube: boolean;
    youtubeId: string;
    hasError: boolean;
    errorDetails: string;
    ytPlayerReady: boolean;
    isLoading: boolean;
    isMounted: boolean;
    controlsTimeoutRef: React.RefObject<number | null>;
    setShowControls: (show: boolean) => void;
    setHasError: (hasError: boolean) => void;
    setErrorDetails: (details: string) => void;
    setIsMounted: (mounted: boolean) => void;
    setIsLoading: (loading: boolean) => void;
  };
  handlers: {
    togglePlay: () => void;
    toggleFullScreen: () => void;
    handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePlaybackRateChange: (rate: number) => void;
    handleVideoError: (e: Event) => void;
  };
  refs: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    youtubePlayerRef: React.RefObject<YouTubePlayer | null>;
  };
}

// Type for YouTube player instance with common methods
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars: Record<string, unknown>;
          events: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export function useVideoState(src: string): VideoStateReturn {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isYouTube && !window.YT) {
      // Load the YouTube API script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Set up the callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        initYouTubePlayer();
      };
    } else if (isYouTube && window.YT && window.YT.Player) {
      initYouTubePlayer();
    }
  }, [isYouTube, youtubeId]);

  const initYouTubePlayer = () => {
    if (!youtubeId || !isYouTube) return;

    // Make sure the YouTube div element exists
    const youtubeElement = document.getElementById("youtube-player");
    if (!youtubeElement) {
      setHasError(true);
      setErrorDetails("YouTube player element not found");
      return;
    }

    try {
      // Make sure YT.Player is available
      if (window.YT && typeof window.YT.Player === "function") {
        // Clean up previous player if exists
        if (youtubePlayerRef.current) {
          try {
            if (typeof youtubePlayerRef.current.destroy === "function") {
              youtubePlayerRef.current.destroy();
            }
          } catch (error) {
            // Log but continue execution since this is cleanup
            console.warn("Error cleaning up YouTube player:", error);
          }
        }

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
      } else {
        setHasError(true);
        setErrorDetails("YouTube API not properly loaded");
      }
    } catch (error) {
      setHasError(true);
      setErrorDetails(
        "Failed to initialize YouTube player: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const onYouTubePlayerReady = (event: { target: YouTubePlayer }) => {
    setYtPlayerReady(true);
    setDuration(event.target.getDuration());

    // Set initial volume
    event.target.setVolume(volume * 100);

    // Start the timer to update current time
    startYouTubeTimeUpdater();
  };

  const onYouTubeStateChange = (event: { data: number }) => {
    const state = event.data;

    // YT.PlayerState.PLAYING = 1
    setIsPlaying(state === 1);

    if (state === 1) {
      // Update duration if it wasn't available earlier
      if (duration === 0 && youtubePlayerRef.current) {
        setDuration(youtubePlayerRef.current.getDuration());
      }
    }
  };

  const onYouTubeError = () => {
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
          // Non-critical error, log and continue
          console.warn("Error updating YouTube playback time:", error);
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
      setHasError(true);
      return;
    }

    try {
      // Enhanced YouTube regex detection
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = src.match(youtubeRegex);

      if (match && match[1]) {
        setIsYouTube(true);
        setYoutubeId(match[1]);
      } else {
        // Try another approach for YouTube URLs
        const url = new URL(src);
        if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
          const videoId = url.searchParams.get("v");
          setIsYouTube(true);
          setYoutubeId(videoId || "");
        } else if (url.hostname.includes("youtu.be")) {
          const videoId = url.pathname.substring(1);
          setIsYouTube(true);
          setYoutubeId(videoId);
        } else {
          setIsYouTube(false);
          setYoutubeId("");
        }
      }
      setHasError(false);
    } catch (error) {
      console.error("Error parsing video URL:", error);
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
        // Check if methods exist before calling them
        if (typeof youtubePlayerRef.current.setVolume === "function") {
          // YouTube volume is 0-100, our volume is 0-1
          youtubePlayerRef.current.setVolume(volume * 100);
        }

        if (typeof youtubePlayerRef.current.setPlaybackRate === "function") {
          youtubePlayerRef.current.setPlaybackRate(playbackRate);
        }
      } catch (error) {
        console.error("Error setting YouTube player properties:", error);
        setHasError(true);
        setErrorDetails("Error setting YouTube player properties");
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

  const togglePlay = () => {
    if (isYouTube && youtubePlayerRef.current && ytPlayerReady) {
      try {
        if (isPlaying) {
          youtubePlayerRef.current.pauseVideo();
        } else {
          youtubePlayerRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling YouTube playback:", error);
        setHasError(true);
        setErrorDetails("Error toggling YouTube playback");
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullScreen = () => {
    if (typeof document === "undefined") return;

    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          // Keep this error log as it's important for debugging fullscreen issues
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
          // Keep this error log as it's important for debugging fullscreen issues
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

  // Helper function to format time display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Handle video errors
  const handleVideoError = (e: Event) => {
    // Keep this error log as it's important for debugging video loading issues
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
          codeMessages[mediaError.code] || `Error code: ${mediaError.code}`;
        if (mediaError.message) {
          errorMessage += ` - ${mediaError.message}`;
        }
      }
    }

    setErrorDetails(errorMessage);
    setHasError(true);
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

  return {
    videoState: {
      isPlaying,
      duration,
      currentTime,
      volume,
      playbackRate,
      isFullScreen,
      showControls,
      isYouTube,
      youtubeId,
      hasError,
      errorDetails,
      ytPlayerReady,
      isLoading,
      isMounted,
      controlsTimeoutRef,
      setShowControls,
      setHasError,
      setErrorDetails,
      setIsMounted,
      setIsLoading,
    },
    handlers: {
      togglePlay,
      toggleFullScreen,
      handleSeek,
      handleVolumeChange,
      handlePlaybackRateChange,
      handleVideoError,
    },
    refs: {
      videoRef,
      containerRef,
      youtubePlayerRef,
    },
  };
}
