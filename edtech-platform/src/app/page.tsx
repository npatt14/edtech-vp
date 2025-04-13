"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Array of arithmetic symbols
const symbols = [
  "×",
  "÷",
  "+",
  "−",
  "=",
  "%",
  "√",
  "π",
  "∑",
  "∫",
  "≠",
  "≤",
  "≥",
];

// Interface for FallingSymbol props
interface FallingSymbolProps {
  id: number;
  symbol: string;
  initialX: number;
  delay: number;
  duration: number;
  fontSize: number;
  initialY: number;
}

// Component for a single falling symbol
function FallingSymbol({
  symbol,
  initialX,
  delay,
  duration,
  fontSize,
  initialY,
}: FallingSymbolProps) {
  return (
    <div
      className="absolute text-white/20 font-bold pointer-events-none"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        fontSize: `${fontSize}rem`,
        animation: `fall ${duration}s linear ${delay}s infinite`,
        opacity: 0.1 + Math.random() * 0.2,
      }}
    >
      {symbol}
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fallingSymbols, setFallingSymbols] = useState<FallingSymbolProps[]>(
    []
  );

  // Generate falling symbols on component mount
  useEffect(() => {
    const symbolsCount = 60;
    const newSymbols: FallingSymbolProps[] = [];

    for (let i = 0; i < symbolsCount; i++) {
      newSymbols.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        initialX: Math.random() * 100,
        initialY: -20 + Math.random() * 20,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        fontSize: 1 + Math.random() * 3,
      });
    }

    setFallingSymbols(newSymbols);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle math symbols in background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        {symbols.map((symbol, index) => (
          <div
            key={index}
            className="absolute text-[#003459] font-bold"
            style={{
              left: `${(index * 7) % 100}%`,
              top: `${(index * 11) % 100}%`,
              fontSize: `${3 + (index % 5)}rem`,
              transform: `rotate(${index * 17}deg)`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

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
              onClick={() => setShowSplash(false)}
              className="px-8 py-4 bg-[#007EA7] text-white font-semibold rounded-lg hover:bg-[#003459] transition-all duration-300 text-lg border border-white/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00171F]/20"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Regular Home Page Content */}
      {/* Hero Section with flowing gradient */}
      <section className="flowing-gradient text-white py-24 md:py-32 relative overflow-hidden">
        {/* Hero Background Symbols */}
        <div className="absolute inset-0 opacity-10">
          {symbols.slice(0, 8).map((symbol, index) => (
            <div
              key={index}
              className="absolute text-white font-bold"
              style={{
                left: `${(index * 13) % 100}%`,
                top: `${(index * 9) % 100}%`,
                fontSize: `${6 + (index % 5)}rem`,
                opacity: 0.1 + (index % 10) / 100,
                transform: `rotate(${index * 20}deg)`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 transform transition-all duration-700 hover:scale-105">
              Learn Anything, Anywhere
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Watch, create, and interact with educational videos on any topic
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/videos"
                className="px-8 py-4 bg-white text-[#003459] font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Browse Videos
              </Link>
              <Link
                href="/videos/create"
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                Share Your Knowledge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#007EA7]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003459]/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <svg
              className="w-16 h-16 text-[#007EA7] mx-auto mb-6 transform transition-all duration-700 hover:rotate-12"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
            </svg>
            <blockquote className="text-2xl md:text-3xl font-medium italic text-[#003459] mb-6 transform transition-all duration-700 hover:scale-105">
              &ldquo;What I cannot create, I do not understand&rdquo;
            </blockquote>
            <cite className="text-lg text-gray-600">― Richard Feynman</cite>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-48 h-48 bg-[#007EA7]/5 rounded-full -translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#003459]/10 rounded-full translate-y-1/4 translate-x-1/4"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative">
            Why Choose Feynman?
            <div className="w-24 h-1 bg-[#007EA7] mx-auto mt-4"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-[#007EA7] group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-[#007EA7] transition-all duration-500 group-hover:text-white"
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

            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-[#007EA7] group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-[#007EA7] transition-all duration-500 group-hover:text-white"
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

            <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group">
              <div className="bg-[#007EA7]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:bg-[#007EA7] group-hover:scale-110">
                <svg
                  className="w-8 h-8 text-[#007EA7] transition-all duration-500 group-hover:text-white"
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
        {/* Add subtle floating symbols */}
        <div className="absolute inset-0 opacity-10">
          {symbols.slice(0, 6).map((symbol, index) => (
            <div
              key={index}
              className="absolute text-white font-bold"
              style={{
                right: `${(index * 15) % 100}%`,
                top: `${(index * 13) % 100}%`,
                fontSize: `${5 + (index % 4)}rem`,
                opacity: 0.05 + (index % 10) / 100,
                transform: `rotate(${index * 25}deg)`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 transform transition-all duration-700 hover:scale-105">
            Ready to start learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of learners and educators today. Discover new
            topics or share your knowledge with others.
          </p>
          <Link
            href="/videos"
            className="px-8 py-4 bg-white text-[#003459] font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-white/30"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
