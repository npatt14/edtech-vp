import React from "react";

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003459]">
          Why Learn on Feynman?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="High-Quality Videos"
            description="Access educational content from trusted creators with seamless playback and controls"
            icon={<VideoIcon />}
          />

          <FeatureCard
            title="Interactive Learning"
            description="Engage with content through comments and discussions with other learners"
            icon={<CommentIcon />}
          />

          <FeatureCard
            title="Create & Share"
            description="Easily upload and share your own educational content with the community"
            icon={<PlusIcon />}
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
      <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#007EA7] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-[#003459]">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function VideoIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#007EA7] group-hover:text-white transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#007EA7] group-hover:text-white transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="w-8 h-8 text-[#007EA7] group-hover:text-white transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
}
