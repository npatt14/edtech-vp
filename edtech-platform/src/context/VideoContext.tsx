"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://takehome.io/";

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
      const response = await fetch(`${API_URL}/videos?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleVideo = async (videoId: string) => {
    try {
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
      if (!response.ok) throw new Error("Failed to create video");
      await fetchVideos(userId);
    } catch (err) {
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
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/videos/comments?video_id=${videoId}`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (
    comment: Omit<Comment, "comment_id" | "created_at">
  ) => {
    try {
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
    setUserId(id);
    if (id) {
      fetchVideos(id).catch(console.error);
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
