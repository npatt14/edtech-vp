"use client";

import { useState } from "react";
import { useVideo } from "@/context/VideoContext";
import { Comment as CommentType } from "@/types";

export default function CommentSection({ videoId }: { videoId: string }) {
  const { comments, createComment, userId } = useVideo();
  const [commentText, setCommentText] = useState("");
  const [commentorId, setCommentorId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    const commentUserId = commentorId.trim() || userId;

    await createComment({
      video_id: videoId,
      content: commentText,
      user_id: commentUserId,
    });

    setCommentText("");
    setCommentorId("");
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#003459]">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label
            htmlFor="commentorId"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Your User ID (optional)
          </label>
          <input
            type="text"
            id="commentorId"
            value={commentorId}
            onChange={(e) => setCommentorId(e.target.value)}
            placeholder={`Default: ${userId || "anonymous"}`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Add a comment
          </label>
          <textarea
            id="comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#007EA7] text-white font-semibold rounded-lg hover:bg-[#003459] transition-colors duration-300"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment: CommentType) => (
            <div
              key={comment.comment_id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-[#003459]">
                  @{comment.user_id}
                </h4>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
