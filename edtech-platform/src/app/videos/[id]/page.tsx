"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useVideo } from "@/context/VideoContext";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";
import VideoForm from "@/components/VideoForm";

export default function VideoPage() {
  const { id } = useParams();
  const videoId = Array.isArray(id) ? id[0] : id;

  const { currentVideo, fetchSingleVideo, fetchComments, loading, error } = useVideo();
  const [showEditForm, setShowEditForm] = useState(false);
  const initialFetchMade = useRef(false);

  useEffect(() => {
    if (videoId && !initialFetchMade.current) {
      initialFetchMade.current = true;
      fetchSingleVideo(videoId);
      fetchComments(videoId);
    }
  }, [videoId, fetchSingleVideo, fetchComments]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007EA7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link
            href="/videos"
            className="mt-4 inline-block text-[#007EA7] hover:underline"
          >
            &larr; Back to videos
          </Link>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Video Not Found</h2>
          <p>
            The requested video could not be found or may have been removed.
          </p>
          <Link
            href="/videos"
            className="mt-4 inline-block text-[#007EA7] hover:underline"
          >
            &larr; Back to videos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/videos"
          className="text-[#007EA7] hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to videos
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-[#003459]">
              {currentVideo.title}
            </h1>
            <button
              onClick={() => setShowEditForm(true)}
              className="text-[#007EA7] hover:text-[#003459] p-2"
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>

          <div className="text-gray-500 mb-6">
            <span>Uploaded by </span>
            <span className="font-medium">@{currentVideo.user_id}</span>
          </div>

          <VideoPlayer
            src={currentVideo.video_url}
            title={currentVideo.title}
          />

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-[#003459]">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {currentVideo.description}
            </p>
          </div>
        </div>
      </div>

      <CommentSection videoId={videoId || ""} />

      {showEditForm && (
        <VideoForm
          video={currentVideo}
          onClose={() => setShowEditForm(false)}
          isEdit={true}
        />
      )}
    </div>
  );
}
