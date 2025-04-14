import React from "react";

export interface FallingSymbolProps {
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
export function FallingSymbol({
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

export const MATH_SYMBOLS = [
  "×",
  "÷",
  "+",
  "−",
  "=",
  "%",
  "√",
  "π",
  "≠",
  "≤",
  "≥",
];

export function generateFallingSymbols(count: number): FallingSymbolProps[] {
  const symbols: FallingSymbolProps[] = [];

  for (let i = 0; i < count; i++) {
    const animationProgress = Math.random(); // Random starting point in animation

    symbols.push({
      id: i,
      symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      initialX: Math.random() * 100,
      initialY: Math.random() * 100, // Random starting position
      delay: 0, // No delay for initial animation
      duration: 8 + Math.random() * 8,
      fontSize: 1 + Math.random() * 3,
      animationProgress,
    });
  }

  return symbols;
}
