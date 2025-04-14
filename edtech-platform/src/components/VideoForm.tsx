"use client";

import { useState, useEffect } from "react";
import { useVideo } from "@/context/VideoContext";
import { Video } from "@/types";

interface VideoFormProps {
  video?: Video;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: {
    title: string;
    description: string;
    video_url: string;
  } | null;
}

export default function VideoForm({
  video,
  onClose,
  isEdit = false,
  initialData = null,
}: VideoFormProps) {
  const { createVideo, userId } = useVideo();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    user_id: userId,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    video_url: "",
    user_id: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
        video_url: video.video_url || "",
        user_id: video.user_id || userId || "",
      });
    } else if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        video_url: initialData.video_url || "",
        user_id: userId || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        video_url: "",
        user_id: userId || "",
      });
    }
  }, [isEdit, video, userId, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it has one
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({
      title: "",
      description: "",
      video_url: "",
      user_id: "",
      general: "",
    });

    // Validate user ID
    if (!formData.user_id || formData.user_id.trim() === "") {
      setErrors({
        ...errors,
        user_id: "User ID is required",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await createVideo({
        user_id: formData.user_id,
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
      });

      // If we get here, assume success
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        ...errors,
        general: "Failed to create video. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#003459]">
              {isEdit
                ? "Edit Video"
                : initialData
                ? "Add Sample Video"
                : "Add New Video"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {initialData && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    We&apos;ve pre-filled the form with the sample video
                    information. Feel free to edit any details before adding it
                    to your collection.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter video description"
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {!isEdit && (
              <div>
                <label
                  htmlFor="video_url"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Video URL
                </label>
                <input
                  type="text"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="Enter URL for the video (YouTube, Vimeo, etc.)"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#007EA7] focus:border-transparent ${
                    errors.video_url ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {initialData && (
                  <p className="mt-1 text-xs text-green-600">
                    This is a valid YouTube URL that will work with our video
                    player
                  </p>
                )}
                {errors.video_url && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.video_url}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="user_id"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                disabled={isEdit}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">
                {isEdit
                  ? "User ID cannot be changed when editing"
                  : "Use your first_last format (e.g., john_smith)"}
              </p>
            </div>

            {errors.user_id && (
              <p className="mt-1 text-sm text-red-500">{errors.user_id}</p>
            )}
            {errors.general && (
              <p className="mt-2 text-sm text-red-500">{errors.general}</p>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#007EA7] text-white font-medium rounded-lg hover:bg-[#003459] transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>{isEdit ? "Update Video" : "Add Video"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
