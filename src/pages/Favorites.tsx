/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Heart, Compass, ArrowRight, Star } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import { Movie } from "../types";
import { MovieCard } from "../components/MovieCard";
import { CardSkeleton } from "../components/SkeletonLoader";

export const Favorites: React.FC = () => {
  const { favorites, navigate } = useMovieContext();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteMovies([]);
      return;
    }

    async function fetchFavorites() {
      try {
        setLoading(true);
        setError(null);
        // Dispatch parallel fetches for each favorited movie ID
        const requests = favorites.map((id) =>
          fetch(`/api/movies/${id}`)
            .then((res) => {
              if (!res.ok) {
                // If it fails (e.g. TMDB key missing or rate limit), returns null/ignores
                return null;
              }
              return res.json();
            })
            .catch(() => null)
        );

        const results = await Promise.all(requests);
        // Exclude failing/null records
        const successMovies = results.filter((m): m is Movie => m !== null);
        setFavoriteMovies(successMovies);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load favorites records:", err);
        setError("Error syncing favorites catalog details.");
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-2 uppercase flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          <span>My Favorite Selection</span>
        </h1>
        <p className="text-slate-400 text-sm">
          A dedicated collection of films and series you marked as absolute favorites.
        </p>
      </div>

      {loading ? (
        /* Loading Row */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: Math.max(favorites.length, 3) }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : favoriteMovies.length > 0 ? (
        /* Favorites Grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {favoriteMovies.map((movie) => (
            <div id={`fav-item-cell-${movie.id}`} key={movie.id} className="relative">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty Favorites Layout */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white/5 border border-white/5 p-8 max-w-xl mx-auto">
          <div className="relative mb-4 flex items-center justify-center h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full animate-bounce">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            No Saved Favorites Yet
          </h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Click the heart button on any poster overlay or detail page banner to gather your beloved films and shows in this view.
          </p>
          <button
            id="btn-fav-goto-explore"
            onClick={() => navigate({ type: "home" })}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span>Explore Cinema Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
