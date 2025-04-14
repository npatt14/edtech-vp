"use client";

import { useEffect } from "react";
import {
  YouTubePlayer,
  HTML5Player,
  VideoControls,
  ErrorDisplay,
  LoadingOverlay,
} from "./video";
import { useVideoState } from "@/hooks/useVideoState";

interface VideoPlayerProps {
  src: string;
  title: string;
}

// Remove conflicting Window.YT declaration
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  // Use the custom hook to manage video state
  const { videoState, handlers, refs } = useVideoState(src);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    videoState.setShowControls(true);

    if (videoState.controlsTimeoutRef.current) {
      clearTimeout(videoState.controlsTimeoutRef.current);
    }

    videoState.controlsTimeoutRef.current = setTimeout(() => {
      if (videoState.isPlaying) {
        videoState.setShowControls(false);
      }
    }, 3000);
  };

  // Set mounted state on client-side
  useEffect(() => {
    videoState.setIsMounted(true);
  }, [videoState]);

  return (
    <div
      ref={refs.containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() =>
        videoState.isPlaying && videoState.setShowControls(false)
      }
    >
      {videoState.hasError ? (
        <ErrorDisplay
          error={videoState.errorDetails}
          src={src}
          isMounted={videoState.isMounted}
          onRetry={() => {
            videoState.setHasError(false);
            videoState.setErrorDetails("");
          }}
        />
      ) : videoState.isYouTube ? (
        <YouTubePlayer
          youtubeId={videoState.youtubeId}
          isPlaying={videoState.isPlaying}
          togglePlay={handlers.togglePlay}
        />
      ) : (
        <>
          {videoState.isLoading && videoState.isMounted && (
            <LoadingOverlay title={title} />
          )}
          <HTML5Player
            src={src}
            title={title}
            videoRef={refs.videoRef}
            isPlaying={videoState.isPlaying}
            togglePlay={handlers.togglePlay}
            onLoadStart={() => videoState.setIsLoading(true)}
            onLoadedData={() => videoState.setIsLoading(false)}
            onError={(e: Event) => handlers.handleVideoError(e)}
          />
        </>
      )}

      {videoState.showControls && (
        <VideoControls
          duration={videoState.duration}
          currentTime={videoState.currentTime}
          volume={videoState.volume}
          playbackRate={videoState.playbackRate}
          isPlaying={videoState.isPlaying}
          isFullScreen={videoState.isFullScreen}
          onSeek={handlers.handleSeek}
          onVolumeChange={handlers.handleVolumeChange}
          onPlaybackRateChange={handlers.handlePlaybackRateChange}
          togglePlay={handlers.togglePlay}
          toggleFullScreen={handlers.toggleFullScreen}
        />
      )}
    </div>
  );
}
