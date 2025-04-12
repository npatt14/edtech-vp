"use client";

import { useState, useEffect } from "react";
import { useVideo } from "@/context/VideoContext";
import { Video } from "@/types";

interface VideoFormProps {
  video?: Video;
  onClose: () => void;
  isEdit?: boolean;
}

export default function VideoForm({
  video,
  onClose,
  isEdit = false,
}: VideoFormProps) {
  const { createVideo, updateVideo, userId } = useVideo();

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && video) {
      setFormData({
        title: video.title,
        description: video.description,
        video_url: video.video_url,
        user_id: video.user_id,
      });
    } else {
      setFormData((prev) => ({ ...prev, user_id: userId }));
    }
  }, [isEdit, video, userId]);

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      video_url: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.video_url.trim()) {
      newErrors.video_url = "Video URL is required";
    } else {
      try {
        new URL(formData.video_url);
      } catch (e) {
        newErrors.video_url = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEdit && video) {
        await updateVideo({
          video_id: video.video_id,
          title: formData.title,
          description: formData.description,
        });
      } else {
        await createVideo({
          user_id: formData.user_id,
          title: formData.title,
          description: formData.description,
          video_url: formData.video_url,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
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
              {isEdit ? "Edit Video" : "Add New Video"}
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

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#007EA7] text-white font-semibold rounded-lg hover:bg-[#003459] transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Video"
                  : "Create Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
