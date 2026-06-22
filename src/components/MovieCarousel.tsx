/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types";
import { MovieCard } from "./MovieCard";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onPlayTrailer?: (movie: Movie) => void;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  onPlayTrailer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to dynamically show/hide arrows
  const checkScrollState = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollState);
      // Run once on load / render resize
      checkScrollState();

      // Setup a resize observer to refresh arrow bounds
      const observer = new ResizeObserver(() => checkScrollState());
      observer.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScrollState);
        observer.disconnect();
      };
    }
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="relative py-4 group/carousel">
      {/* Category Heading Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
          {title}
        </h2>
        {movies.length > 4 && (
          <div className="hidden sm:flex gap-1.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            <button
              id={`carousel-prev-${title.replace(/\s+/g, "-").toLowerCase()}`}
              disabled={!showLeftArrow}
              onClick={() => scroll("left")}
              className={`rounded-full p-2 border border-white/10 bg-slate-900/60 transition-all cursor-pointer ${
                showLeftArrow ? "text-white hover:bg-slate-800/80 hover:border-white/20 hover:scale-105 active:scale-95" : "text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              id={`carousel-next-${title.replace(/\s+/g, "-").toLowerCase()}`}
              disabled={!showRightArrow}
              onClick={() => scroll("right")}
              className={`rounded-full p-2 border border-white/10 bg-slate-900/60 transition-all cursor-pointer ${
                showRightArrow ? "text-white hover:bg-slate-800/80 hover:border-white/20 hover:scale-105 active:scale-95" : "text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Scroll View Area Slider */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start select-none">
              <MovieCard
                movie={movie}
                onPlayClick={() => onPlayTrailer && onPlayTrailer(movie)}
              />
            </div>
          ))}
        </div>

        {/* Floating gradient controls (Desktop hover indicators) */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#050816] via-[#050816]/70 to-transparent pointer-events-none hidden sm:flex items-center justify-start z-10">
            <button
              id={`floating-prev-${title.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => scroll("left")}
              className="pointer-events-auto rounded-full p-2 bg-black/60 border border-white/10 text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all ml-1 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#050816] via-[#050816]/70 to-transparent pointer-events-none hidden sm:flex items-center justify-end z-10">
            <button
              id={`floating-next-${title.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => scroll("right")}
              className="pointer-events-auto rounded-full p-2 bg-black/60 border border-white/10 text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all mr-1 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
