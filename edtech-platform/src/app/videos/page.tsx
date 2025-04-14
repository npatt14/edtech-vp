"use client";

import { useState, useEffect, useRef } from "react";
import { useVideo } from "@/context/VideoContext";
import VideoForm from "@/components/VideoForm";

// Import modularized components
import { sampleVideos, SampleVideo } from "@/components/videos/SampleVideos";
import { VideosHeader } from "@/components/videos/VideosHeader";
import { SearchBar } from "@/components/videos/SearchBar";
import { LoadingSpinner } from "@/components/videos/LoadingSpinner";
import { ErrorDisplay } from "@/components/videos/ErrorDisplay";
import { EmptyState } from "@/components/videos/EmptyState";
import { VideoGrid } from "@/components/videos/VideoGrid";

export default function VideosPage() {
  const { videos, loading, error, fetchVideos, userId } = useVideo();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState<SampleVideo | null>(
    null
  );
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (userId && userId !== previousUserIdRef.current) {
      previousUserIdRef.current = userId;
      fetchVideos(userId);
    }
  }, [userId, fetchVideos]);

  // Ensure videos is ALWAYS an array before filtering
  const filteredVideos = Array.isArray(videos)
    ? videos.filter(
        (video) =>
          video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Show videos if we have any videos from the API
  const hasVideos = Array.isArray(videos) && videos.length > 0;

  const handleAddSampleVideo = (sample: SampleVideo) => {
    setSelectedSample(sample);
    setShowForm(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    if (userId) {
      fetchVideos(userId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <VideosHeader
        hasVideos={hasVideos}
        onAddVideoClick={() => setShowForm(true)}
      />

      {/* Search Bar - only shown if there are videos */}
      {hasVideos && (
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      )}

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay error={error} userId={userId} onRetry={handleRetry} />
      ) : (
        <>
          {filteredVideos.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              onAddVideo={() => setShowForm(true)}
              sampleVideos={sampleVideos}
              onAddSampleVideo={handleAddSampleVideo}
            />
          ) : (
            <VideoGrid videos={filteredVideos} />
          )}
        </>
      )}

      {/* Video Form Modal */}
      {showForm && (
        <VideoForm
          onClose={() => setShowForm(false)}
          initialData={selectedSample}
        />
      )}
    </div>
  );
}
