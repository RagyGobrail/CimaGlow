/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Bookmark, Compass, ArrowRight } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import { Movie } from "../types";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton } from "../components/SkeletonLoader";

export const Watchlist: React.FC = () => {
  const { watchlist, navigate } = useMovieContext();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (watchlist.length === 0) {
      setWatchlistMovies([]);
      return;
    }

    async function fetchWatchlist() {
      try {
        setLoading(true);
        setError(null);
        // Dispatch parallel fetches for each watchlisted movie ID
        const requests = watchlist.map((id) =>
          fetch(`/api/movies/${id}`)
            .then((res) => {
              if (!res.ok) {
                return null;
              }
              return res.json();
            })
            .catch(() => null)
        );

        const results = await Promise.all(requests);
        const successMovies = results.filter((m): m is Movie => m !== null);
        setWatchlistMovies(successMovies);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load watchlist records:", err);
        setError("Error syncing watchlist records details.");
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, [watchlist]);

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-2 uppercase flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-blue-500 fill-blue-500" />
          <span>My Discoveries Watchlist</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Bookmark movies and TV series you plan to view or evaluate in the near future.
        </p>
      </div>

      {loading ? (
        /* Loading Shimmers */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: Math.max(watchlist.length, 3) }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : watchlistMovies.length > 0 ? (
        /* Grid list */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {watchlistMovies.map((movie) => (
            <div id={`watchlist-item-cell-${movie.id}`} key={movie.id} className="relative">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty watchlist View */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white/5 border border-white/5 p-8 max-w-xl mx-auto">
          <div className="relative mb-4 flex items-center justify-center h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full animate-bounce">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            Watchlist is Empty
          </h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Mark books, titles, and series files with the bookmark checkbox icon in our list details views to schedule them for review.
          </p>
          <button
            id="btn-watch-goto-explore"
            onClick={() => navigate({ type: "home" })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span>Browse Cinematic Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
