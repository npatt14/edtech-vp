"use client";

import Image from "next/image";

interface LoadingOverlayProps {
  title: string;
}

export function LoadingOverlay({ title }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-10 bg-black">
      <Image
        src="/placeholder.jpg"
        alt={title}
        fill
        quality={75}
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#007EA7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
