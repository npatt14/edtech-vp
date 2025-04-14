import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FallingSymbol,
  generateFallingSymbols,
  FallingSymbolProps,
} from "./FallingSymbol";

interface SplashScreenProps {
  onDismiss: () => void;
}

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [fallingSymbols, setFallingSymbols] = useState<FallingSymbolProps[]>(
    []
  );

  // Generate falling symbols on component mount
  useEffect(() => {
    setFallingSymbols(generateFallingSymbols(60));
  }, []);

  return (
    <div className="fixed inset-0 flowing-gradient flex flex-col items-center justify-center z-50 transition-opacity duration-500 ease-in-out overflow-hidden">
      {/* Falling Symbols */}
      {fallingSymbols.map((symbolProps) => (
        <FallingSymbol key={symbolProps.id} {...symbolProps} />
      ))}

      {/* Content */}
      <div className="flex flex-col items-center px-4 z-10">
        <Image
          src="/book.png"
          alt="Book icon"
          width={150}
          height={150}
          className="h-36 w-auto mb-8"
          priority
        />
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-10">
          Feynman
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl text-center italic">
          &ldquo;What I cannot create, I do not understand&rdquo;
        </p>
        <p className="text-gray-400 -mt-10 mb-12">- Richard Feynman</p>
        <button
          onClick={onDismiss}
          className="px-8 py-4 bg-[#007EA7] text-white font-semibold rounded-lg hover:bg-[#003459] transition-all duration-300 text-lg border border-white/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00171F]/20"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
