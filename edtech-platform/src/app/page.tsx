"use client";

import { useState, useEffect } from "react";
import {
  FallingSymbol,
  generateFallingSymbols,
  FallingSymbolProps,
} from "@/components/FallingSymbol";
import { SplashScreen } from "@/components/SplashScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [fallingSymbols, setFallingSymbols] = useState<FallingSymbolProps[]>(
    []
  );

  // Initialize splash screen state based on localStorage
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
    setFallingSymbols(generateFallingSymbols(60));
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Splash Screen Overlay */}
      {showSplash && <SplashScreen onDismiss={dismissSplash} />}

      {/* Background Symbols (always visible) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {fallingSymbols.slice(0, 20).map((symbolProps) => (
          <FallingSymbol
            key={`bg-${symbolProps.id}`}
            {...symbolProps}
            fontSize={symbolProps.fontSize * 0.7}
            duration={symbolProps.duration * 1.5}
          />
        ))}
      </div>

      {/* Main Page Sections */}
      <HeroSection fallingSymbols={fallingSymbols} />
      <FeaturesSection />
      <CTASection fallingSymbols={fallingSymbols} />
    </div>
  );
}
