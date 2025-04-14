import React from "react";
import Link from "next/link";
import { FallingSymbol, FallingSymbolProps } from "../FallingSymbol";

interface HeroSectionProps {
  fallingSymbols: FallingSymbolProps[];
}

export function HeroSection({ fallingSymbols }: HeroSectionProps) {
  return (
    <section className="relative flowing-gradient text-white py-24 md:py-32 overflow-hidden">
      {/* Hero Section Falling Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fallingSymbols.slice(10, 30).map((symbolProps) => (
          <FallingSymbol
            key={`hero-${symbolProps.id}`}
            {...symbolProps}
            fontSize={symbolProps.fontSize * 0.9}
            duration={symbolProps.duration * 0.8}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Learn Anything, Anywhere
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in-up animation-delay-150">
            Watch, create, and interact with educational videos on any topic
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link
              href="/videos"
              className="btn btn-primary border border-white/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Browse Videos
            </Link>
            <Link
              href="/videos/create"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-[#003459] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Share Your Knowledge
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
