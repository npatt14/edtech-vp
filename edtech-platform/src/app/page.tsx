"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Array of arithmetic symbols
const symbols = ["×", "÷", "+", "−", "=", "%", "√", "π", "≠", "≤", "≥"];

// Interface for FallingSymbol props
interface FallingSymbolProps {
  id: number;
  symbol: string;
  initialX: number;
  delay: number;
  duration: number;
  fontSize: number;
  initialY: number;
  animationProgress: number;
}

// Component for a single falling symbol
function FallingSymbol({
  symbol,
  initialX,
  delay,
  duration,
  fontSize,
  initialY,
  animationProgress,
}: FallingSymbolProps) {
  return (
    <div
      className="absolute text-white/30 font-bold pointer-events-none"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        fontSize: `${fontSize}rem`,
        opacity: 0.25 + Math.random() * 0.3,
        animation: `fall ${duration}s linear ${delay}s infinite`,
        animationDelay: `-${animationProgress * duration}s`,
      }}
    >
      {symbol}
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [fallingSymbols, setFallingSymbols] = useState<FallingSymbolProps[]>(
    []
  );

  // init splash screen state based on localStorage
  useEffect(() => {
    // For dev/testing purposes, uncomment the next line to always show splash screen
    // localStorage.removeItem('hasVisitedFeynman');

    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedFeynman");

    if (!hasVisitedBefore) {
      // First visit
      setShowSplash(true);
    }
  }, []);

  // Handle splash screen dismissal
  const dismissSplash = () => {
    setShowSplash(false);
    localStorage.setItem("hasVisitedFeynman", "true");
  };

  // Generate falling symbols on component mount
  useEffect(() => {
    const symbolsCount = 75;
    const newSymbols: FallingSymbolProps[] = [];

    for (let i = 0; i < symbolsCount; i++) {
      // Distribute symbols throughout the entire viewport height and add animation progress
      const animationProgress = Math.random(); // Random starting point in animation

      newSymbols.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        initialX: Math.random() * 100,
        initialY: Math.random() * 100, // Random starting position
        delay: 0, // No delay for initial animation
        duration: 8 + Math.random() * 8,
        fontSize: 1 + Math.random() * 3,
        animationProgress,
      });
    }

    setFallingSymbols(newSymbols);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Splash Screen Overlay */}
      {showSplash && (
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
              onClick={dismissSplash}
              className="px-8 py-4 bg-[#007EA7] text-white font-semibold rounded-lg hover:bg-[#003459] transition-all duration-300 text-lg border border-white/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00171F]/20"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* bg Symbols (always visible) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {fallingSymbols.slice(0, 25).map((symbolProps) => (
          <FallingSymbol
            key={`bg-${symbolProps.id}`}
            {...symbolProps}
            fontSize={symbolProps.fontSize * 0.7}
            duration={symbolProps.duration * 1.5}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative flowing-gradient text-white py-24 md:py-32 overflow-hidden">
        {/* Hero Section Falling Symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fallingSymbols.slice(10, 38).map((symbolProps) => (
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

      {/* Features Section */}
      <section className="py-16 bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#003459]">
            Why Learn on Feynman?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#007EA7] group-hover:text-white transition-all duration-300">
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
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#003459]">
                High-Quality Videos
              </h3>
              <p className="text-gray-600">
                Access educational content from trusted creators with seamless
                playback and controls
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#007EA7] group-hover:text-white transition-all duration-300">
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
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#003459]">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Engage with content through comments and discussions with other
                learners
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#007EA7] group-hover:text-white transition-all duration-300">
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
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#003459]">
                Create & Share
              </h3>
              <p className="text-gray-600">
                Easily upload and share your own educational content with the
                community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 flowing-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-80"></div>

        {/* CTA Section Falling Symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fallingSymbols.slice(30, 45).map((symbolProps) => (
            <FallingSymbol
              key={`cta-${symbolProps.id}`}
              {...symbolProps}
              fontSize={symbolProps.fontSize * 0.8}
              duration={symbolProps.duration}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of learners and educators today. Discover new
            topics or share your knowledge with others.
          </p>
          <Link
            href="/videos"
            className="btn bg-white text-[#003459] hover:bg-opacity-90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-transparent"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
