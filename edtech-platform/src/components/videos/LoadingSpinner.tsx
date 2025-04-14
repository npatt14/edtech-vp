import React from "react";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007EA7]"></div>
    </div>
  );
}
