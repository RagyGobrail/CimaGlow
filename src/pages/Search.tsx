/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, Compass, Sparkles, Filter, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMovieContext } from "../context/MovieContext";
import { Movie } from "../types";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton } from "../components/SkeletonLoader";

const GENRES_TAGS = [
  "All",
  "Science Fiction",
  "Drama",
  "Action",
  "Adventure",
  "Animation",
  "TV Series",
];

export const Search: React.FC = () => {
  const { activeView, navigate } = useMovieContext();
  const [query, setQuery] = useState(activeView.searchQuery || "");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Set up debouncing
  useEffect(() => {
    const defaultQuery = activeView.searchQuery || "";
    setQuery(defaultQuery);
    setSelectedGenre("All");
    setPage(1);
  }, [activeView.searchQuery]);

  // Fetch search handler
  useEffect(() => {
    let active = true;
    
    async function searchMovies() {
      if (!query.trim()) {
        // If query is empty, let's show an attractive curation of ALL trending and popular fallbacks so search page starts off looking fully packed
        setLoading(true);
        try {
          const res = await fetch("/api/movies/trending");
          const data = await res.json();
          if (active && data.results) {
            setMovies(data.results);
            setHasMore(true);
          }
          setLoading(false);
        } catch {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (active && data.results) {
          setMovies(data.results);
          // Simulate pagination bounds
          setHasMore(data.results.length > 3);
        }
        setLoading(false);
      } catch (err) {
        console.warn("Failed to retrieve searches:", err);
        setLoading(false);
      }
    }

    // Debounce duration
    const delayDebounce = setTimeout(() => {
      searchMovies();
    }, 450);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [query]);

  // Filtering list by selected genre tags
  useEffect(() => {
    if (selectedGenre === "All") {
      setFilteredMovies(movies);
    } else if (selectedGenre === "TV Series") {
      setFilteredMovies(movies.filter((m) => m.media_type === "tv" || m.first_air_date));
    } else {
      setFilteredMovies(
        movies.filter((m) => {
          if (!m.genres) return false;
          return m.genres.some((g) => {
            const name = typeof g === "string" ? g : g.name;
            return name.toLowerCase() === selectedGenre.toLowerCase();
          });
        })
      );
    }
  }, [movies, selectedGenre]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Infinite Scroll Trigger handler
  const loadMoreIncremental = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    // Simulate appending new titles in scrollbox
    setTimeout(() => {
      // Create duplicate variations with mutated unique handles to prevent key conflicts
      const appended = movies.map((m) => ({
        ...m,
        id: m.id + Math.floor(Math.random() * 100000 + 1), // simulate new entries
      }));
      setMovies((prev) => [...prev, ...appended]);
      setPage((prev) => prev + 1);

      // Stop after 4 paginated cycles
      if (page >= 4) {
        setHasMore(false);
      }
      setLoading(false);
    }, 850);
  };

  // Intersection observer for continuous scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const currentAnchor = observerRef.current;
    if (!currentAnchor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreIncremental();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentAnchor);
    return () => {
      if (currentAnchor) {
        observer.unobserve(currentAnchor);
      }
    };
  }, [hasMore, loading, page, movies]);

  const handleScrollToBottomTrigger = () => {
    loadMoreIncremental();
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Immersive Search input header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-2 uppercase flex items-center gap-2">
          <SearchIcon className="h-6 w-6 text-blue-500" />
          <span>Cinematic Discovery Search</span>
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Query the global database for popular movies, high-definition series, and actors.
        </p>

        {/* Dynamic Search Box Layout */}
        <div className="relative max-w-2xl mb-8">
          <input
            id="search-immersive-input"
            type="text"
            placeholder="Type your movie keyword (e.g. Interstellar, Dune, Oppenheimer, Stranger Things)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedGenre("All");
            }}
            className="w-full text-base sm:text-lg rounded-2xl bg-[#0B1120] border-2 border-white/5 py-3.5 pl-12 pr-6 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/5 shadow-xl transition-all"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>

        {/* Categories / Genre Quick Filter tags */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
          {GENRES_TAGS.map((tag) => (
            <button
              id={`genre-tag-${tag.replace(/\s+/g, "-").toLowerCase()}`}
              key={tag}
              onClick={() => setSelectedGenre(tag)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === tag
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view of matched movies */}
      <div className="relative">
        {filteredMovies.length > 0 ? (
          <div>
            {/* Grid Container */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <motion.div
                  id={`search-grid-cell-${movie.id}`}
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}

              {/* Loader shimmers */}
              {loading &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={`shim-${idx}`} className="animate-pulse">
                    <CardSkeleton />
                  </div>
                ))}
            </div>

            {/* Scroll Observer Target */}
            {hasMore && <div ref={observerRef} className="h-12 w-full flex items-center justify-center py-8 text-xs text-blue-400 font-mono tracking-widest">● ● ● DISCOVERING MORE RELEASES ● ● ●</div>}

            {/* Pagination / infinite scrolling trigger bar */}
            {hasMore && !loading && (
              <div className="flex flex-col items-center justify-center mt-4 pt-6 border-t border-white/5">
                <button
                  id="btn-infinite-scroll"
                  onClick={handleScrollToBottomTrigger}
                  disabled={loading}
                  className="px-8 py-3.5 bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/30 text-slate-300 hover:text-blue-400 rounded-2xl font-semibold transition-all text-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Load More Titles</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty Search results State */
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white/5 border border-white/5 p-8 max-w-xl mx-auto">
            <Compass className="h-10 w-10 text-slate-500 mb-4 animate-spin-slow" />
            <h3 className="font-display font-bold text-lg text-white mb-1">
              No direct matches found
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md">
              Could not match query terms in film title titles or description tags. Try adjusting keywords or resetting filters.
            </p>
            <button
              id="btn-reset-search"
              onClick={() => {
                setQuery("");
                setSelectedGenre("All");
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Search Query</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
