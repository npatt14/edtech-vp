"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VideoForm from "@/components/VideoForm";

export default function CreateVideoPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(true);

  const handleClose = () => {
    setShowForm(false);
    router.push("/videos");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Video</h1>
      {showForm && <VideoForm onClose={handleClose} />}
    </div>
  );
}
