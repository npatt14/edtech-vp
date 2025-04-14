import React from "react";
import Link from "next/link";
import { FallingSymbol, FallingSymbolProps } from "../FallingSymbol";

interface CTASectionProps {
  fallingSymbols: FallingSymbolProps[];
}

export function CTASection({ fallingSymbols }: CTASectionProps) {
  return (
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
  );
}
