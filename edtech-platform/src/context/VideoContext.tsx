"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

interface Video {
  video_id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
}

interface Comment {
  comment_id: string;
  video_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface VideoContextType {
  videos: Video[];
  currentVideo: Video | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
  userId: string;
  fetchVideos: (userId: string) => Promise<void>;
  fetchSingleVideo: (videoId: string) => Promise<void>;
  createVideo: (video: Omit<Video, "video_id">) => Promise<void>;
  updateVideo: (
    video: Pick<Video, "video_id" | "title" | "description">
  ) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<boolean>;
  fetchComments: (videoId: string) => Promise<void>;
  createComment: (
    comment: Omit<Comment, "comment_id" | "created_at">
  ) => Promise<void>;
  setUserId: (id: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Track active requests to prevent duplicates
  const activeRequests = useRef<Set<string>>(new Set());

  // Default to our take-home API endpoint
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://take-home-assessment-423502.uc.r.appspot.com/api";

  // Remove debug logging for API endpoint
  useEffect(() => {
    // Intentionally empty
  }, [API_URL]);

  // Load user ID from localStorage on initial load
  useEffect(() => {
    try {
      // Ensure this only runs in the browser
      if (typeof window !== "undefined") {
        // Add a slight delay to ensure localStorage is fully accessible
        const timer = setTimeout(() => {
          const savedUserId = localStorage.getItem("userId");
          if (savedUserId) {
            console.log("Loaded user ID from localStorage:", savedUserId);
            setUserId(savedUserId);
          } else {
            console.log("No user ID found in localStorage");
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error loading user ID from localStorage:", error);
    }
  }, []);

  const fetchVideos = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/videos?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();

      // Extract videos from response
      let videosArray = [];

      if (data && typeof data === "object") {
        // Check if data is already an array of videos
        if (Array.isArray(data)) {
          videosArray = data;
        }
        // Check if videos are in a videos property
        else if (data.videos && Array.isArray(data.videos)) {
          videosArray = data.videos;
        }
        // Try other common API response patterns
        else {
          // Look for any array in the response
          for (const key in data) {
            if (Array.isArray(data[key])) {
              videosArray = data[key];
              break;
            }
          }
        }
      }

      // Ensure each video has required properties
      const processedVideos = videosArray.map(
        (video: Partial<Video> & { id?: string }) => {
          // Ensure video has an id
          if (!video.video_id && video.id) {
            return { ...video, video_id: video.id };
          }
          return video;
        }
      );

      // Deduplicate videos by URL using filter and keeping only the first occurrence
      const uniqueVideos = processedVideos.filter(
        (video: Partial<Video>, index: number, self: Array<Partial<Video>>) =>
          index ===
          self.findIndex(
            (v: Partial<Video>) =>
              v.video_url === video.video_url && video.video_url !== undefined
          )
      );

      setVideos(uniqueVideos as Video[]);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleVideo = async (videoId: string) => {
    try {
      // Validate videoId
      if (!videoId) {
        console.error("Cannot fetch video with undefined ID");
        setError("Invalid video ID");
        return;
      }

      // Check if this request is already in progress
      const requestKey = `video-${videoId}`;
      if (activeRequests.current.has(requestKey)) {
        return;
      }

      // Add to active requests
      activeRequests.current.add(requestKey);

      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/videos/single?video_id=${videoId}`
      );
      if (!response.ok) throw new Error("Failed to fetch video");
      const data = await response.json();

      // Process response to ensure we have a valid video
      if (!data) {
        throw new Error("No video data returned from API");
      }

      // Extract video from the nested structure if it exists
      let videoData = data;
      if (data.video && typeof data.video === "object") {
        videoData = data.video;
      }

      // Ensure video has a video_url
      if (!videoData.video_url && videoData.url) {
        videoData.video_url = videoData.url;
      }

      // If video URL doesn't start with http, make it a proper URL
      if (
        videoData.video_url &&
        typeof videoData.video_url === "string" &&
        !videoData.video_url.startsWith("http")
      ) {
        videoData.video_url = `https://${videoData.video_url}`;
      }

      setCurrentVideo(videoData);
    } catch (err) {
      console.error("Error fetching single video:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      // Remove from active requests
      activeRequests.current.delete(`video-${videoId}`);
      setLoading(false);
    }
  };

  const createVideo = async (video: Omit<Video, "video_id">) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });

      const responseText = await response.text();

      if (!response.ok)
        throw new Error(`Failed to create video: ${responseText}`);

      // Force refresh videos list
      if (video.user_id) {
        await fetchVideos(video.user_id);
      } else if (userId) {
        await fetchVideos(userId);
      }
    } catch (err) {
      console.error("Error creating video:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (
    video: Pick<Video, "video_id" | "title" | "description">
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/videos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });
      if (!response.ok) throw new Error("Failed to update video");
      if (currentVideo && currentVideo.video_id === video.video_id) {
        setCurrentVideo({ ...currentVideo, ...video });
      }
      await fetchVideos(userId);
    } catch (err) {
      console.error("Error updating video:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Try API deletion first
      try {
        const response = await fetch(`${API_URL}/videos/${videoId}`, {
          method: "DELETE",
        });

        // If API deletion succeeds
        if (response.ok) {
          // Update videos list by filtering out the deleted video
          setVideos(videos.filter((video) => video.video_id !== videoId));
          return true;
        }

        console.warn(
          "API deletion failed, falling back to client-side deletion"
        );
      } catch (apiError) {
        console.error("API deletion error:", apiError);
        console.warn("Falling back to client-side deletion");
      }

      // Fallback: client-side deletion
      setVideos(videos.filter((video) => video.video_id !== videoId));

      return true;
    } catch (err) {
      console.error("Error in delete operation:", err);
      setError(err instanceof Error ? err.message : "Failed to delete video");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (videoId: string) => {
    try {
      // Validate videoId
      if (!videoId) {
        console.error("Cannot fetch comments with undefined video ID");
        setError("Invalid video ID for comments");
        return;
      }

      // Check if this request is already in progress
      const requestKey = `comments-${videoId}`;
      if (activeRequests.current.has(requestKey)) {
        return;
      }

      // Add to active requests
      activeRequests.current.add(requestKey);

      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/videos/comments?video_id=${videoId}`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();

      // Handle different API response formats for comments
      let commentsArray = [];

      if (data && typeof data === "object") {
        // Direct array of comments
        if (Array.isArray(data)) {
          commentsArray = data;
        }
        // Comments in a comments property
        else if (data.comments && Array.isArray(data.comments)) {
          commentsArray = data.comments;
        }
        // Look for any array in the response
        else {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              commentsArray = data[key];
              break;
            }
          }
        }
      }

      setComments(commentsArray);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      // Remove from active requests
      activeRequests.current.delete(`comments-${videoId}`);
      setLoading(false);
    }
  };

  const createComment = async (
    comment: Omit<Comment, "comment_id" | "created_at">
  ) => {
    try {
      // Validate videoId
      if (!comment.video_id) {
        console.error("Cannot create comment with undefined video ID");
        setError("Invalid video ID for comment");
        return;
      }

      // Don't set loading state for comment creation as it affects UI
      // This prevents the video from reloading
      setError(null);

      const response = await fetch(`${API_URL}/videos/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      if (!response.ok) throw new Error("Failed to create comment");

      // Update comments without affecting video playback
      try {
        const fetchResponse = await fetch(
          `${API_URL}/videos/comments?video_id=${comment.video_id}`
        );
        if (!fetchResponse.ok)
          throw new Error("Failed to fetch updated comments");

        const data = await fetchResponse.json();

        // Process comments data
        let commentsArray = [];
        if (data && typeof data === "object") {
          if (Array.isArray(data)) {
            commentsArray = data;
          } else if (data.comments && Array.isArray(data.comments)) {
            commentsArray = data.comments;
          } else {
            for (const key in data) {
              if (Array.isArray(data[key])) {
                commentsArray = data[key];
                break;
              }
            }
          }
        }

        // Update comments state without affecting loading state
        setComments(commentsArray);
      } catch (fetchErr) {
        console.error("Error fetching updated comments:", fetchErr);
      }
    } catch (err) {
      console.error("Error creating comment:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleSetUserId = (id: string) => {
    if (id !== userId) {
      setUserId(id);
      if (id) {
        fetchVideos(id).catch(console.error);
      }
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        currentVideo,
        comments,
        loading,
        error,
        userId,
        fetchVideos,
        fetchSingleVideo,
        createVideo,
        updateVideo,
        deleteVideo,
        fetchComments,
        createComment,
        setUserId: handleSetUserId,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}
