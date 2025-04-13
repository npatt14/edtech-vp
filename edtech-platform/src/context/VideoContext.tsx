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

  // Log API endpoint for debugging
  useEffect(() => {
    console.log("Using API URL:", API_URL);
  }, [API_URL]);

  // Load user ID from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserId = localStorage.getItem("userId");
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }
  }, []);

  const fetchVideos = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching videos for user: ${userId}`);
      const response = await fetch(`${API_URL}/videos?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      console.log("Fetched videos API response:", data);

      // Extract videos from response
      let videosArray = [];

      if (data && typeof data === "object") {
        // Check if data is already an array of videos
        if (Array.isArray(data)) {
          console.log("API returned array directly:", data);
          videosArray = data;
        }
        // Check if videos are in a videos property
        else if (data.videos && Array.isArray(data.videos)) {
          console.log("API returned videos in videos property:", data.videos);
          videosArray = data.videos;
        }
        // Try other common API response patterns
        else {
          // Look for any array in the response
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Found videos in '${key}' property:`, data[key]);
              videosArray = data[key];
              break;
            }
          }
        }
      }

      console.log("Raw videos before processing:", videosArray);

      // Ensure each video has required properties
      const processedVideos = videosArray.map(
        (video: Partial<Video> & { id?: string }) => {
          // Log each video for debugging
          console.log("Processing video:", video);

          // Ensure video has an id
          if (!video.video_id && video.id) {
            console.log("Converting id to video_id:", video);
            return { ...video, video_id: video.id };
          }

          return video;
        }
      );

      setVideos(processedVideos);
      console.log("Final videos for UI:", processedVideos);
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
        console.log(
          `Request for video ${videoId} already in progress, skipping`
        );
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
      setCurrentVideo(data);
    } catch (err) {
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
      console.log("Creating video with data:", video);
      const response = await fetch(`${API_URL}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video),
      });

      const responseText = await response.text();
      console.log("Create video response:", responseText);

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
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
        console.log(
          `Request for comments of video ${videoId} already in progress, skipping`
        );
        return;
      }

      // Add to active requests
      activeRequests.current.add(requestKey);

      setLoading(true);
      setError(null);
      console.log(`Fetching comments for video ID: ${videoId}`);
      const response = await fetch(
        `${API_URL}/videos/comments?video_id=${videoId}`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      console.log("Raw comments data from API:", data);

      // Handle different API response formats for comments
      let commentsArray = [];

      if (data && typeof data === "object") {
        // Direct array of comments
        if (Array.isArray(data)) {
          console.log("API returned comments as array:", data);
          commentsArray = data;
        }
        // Comments in a comments property
        else if (data.comments && Array.isArray(data.comments)) {
          console.log(
            "API returned comments in comments property:",
            data.comments
          );
          commentsArray = data.comments;
        }
        // Look for any array in the response
        else {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Found comments in '${key}' property:`, data[key]);
              commentsArray = data[key];
              break;
            }
          }
        }
      }

      console.log("Processed comments for UI:", commentsArray);
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

      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/videos/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      if (!response.ok) throw new Error("Failed to create comment");
      await fetchComments(comment.video_id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
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
