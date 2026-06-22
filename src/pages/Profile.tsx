/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { User, LogOut, Heart, Bookmark, Sparkles, Plus, Check, Compass, Eye, ShieldAlert } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";
import { Movie } from "../types";
import { MovieCard } from "../components/MovieCard";

const AVAILABLE_GENRES = [
  "Action",
  "Sci-Fi",
  "Fantasy",
  "Drama",
  "Thriller",
  "Adventure",
  "Comedy",
  "Romance",
  "Animation"
];

export const Profile: React.FC = () => {
  const {
    user,
    setAuthModalOpen,
    favorites,
    watchlist,
    favoriteGenres,
    saveFavoriteGenres,
    logout,
    navigate
  } = useMovieContext();

  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Recommendations Generation engine based on favorite genres
  useEffect(() => {
    async function fetchAndFilterRecs() {
      try {
        setLoadingRecs(true);
        // Get popular, top-rated and trending movies parallelly to get a rich selection
        const [resPopular, resTopRated] = await Promise.all([
          fetch("/api/movies/popular").then((r) => r.json()),
          fetch("/api/movies/top-rated").then((r) => r.json())
        ]);

        const allMovies: Movie[] = [];
        const seenIds = new Set<number>();

        const addMovie = (m: any) => {
          if (m && m.id && !seenIds.has(m.id)) {
            seenIds.add(m.id);
            allMovies.push(m);
          }
        };

        if (resPopular.results) resPopular.results.forEach(addMovie);
        if (resTopRated.results) resTopRated.results.forEach(addMovie);

        // Filter based on preferred genres
        const filtered = allMovies.filter((movie) => {
          // Genres can be a list of strings or list of objects
          const movieGenres: string[] = (movie.genres || []).map((g: any) =>
            typeof g === "string" ? g : g.name
          );

          // Standard mapping logic in case TMDB doesn't return full genre strings (but ids)
          // Popular lists from tmdb might have genre_ids, let's map standard ones if we can
          const genreIdsMap: Record<number, string> = {
            28: "Action",
            12: "Adventure",
            16: "Animation",
            35: "Comedy",
            18: "Drama",
            14: "Fantasy",
            10749: "Romance",
            878: "Sci-Fi",
            53: "Thriller"
          };

          const mappedIds: string[] = ((movie as any).genre_ids || [])
            .map((id: number) => genreIdsMap[id])
            .filter(Boolean);

          const combinedGenres = [...movieGenres, ...mappedIds];

          return combinedGenres.some((g) =>
            favoriteGenres.some((fav) => g.toLowerCase().includes(fav.toLowerCase()))
          );
        });

        // Take top 6
        setRecommended(filtered.slice(0, 6));
        setLoadingRecs(false);
      } catch (err) {
        console.error("Failed to generate recommendations:", err);
        setLoadingRecs(false);
      }
    }

    if (favoriteGenres.length > 0) {
      fetchAndFilterRecs();
    } else {
      setRecommended([]);
    }
  }, [favoriteGenres]);

  const handleGenreToggle = async (genre: string) => {
    let updatedGenres: string[];
    if (favoriteGenres.includes(genre)) {
      updatedGenres = favoriteGenres.filter((g) => g !== genre);
    } else {
      updatedGenres = [...favoriteGenres, genre];
    }
    await saveFavoriteGenres(updatedGenres);
  };

  if (!user) {
    /* If Logged Out: Elegant Sign In Call to Action */
    return (
      <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-[#0b101e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative mb-6 mx-auto flex items-center justify-center h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl">
            <User className="h-8 w-8" />
          </div>

          <h2 className="font-display font-black text-2xl text-white mb-2 uppercase">
            Sync Cinematic Universe
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Create an account or sign in to save your ratings, store personalized watchlists, and unlock automated suggestions tailored directly to your preferences.
          </p>

          <button
            id="btn-profile-cta-login"
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer mb-4"
          >
            Access Profile Portal
          </button>

          <button
            id="btn-profile-guest-explore"
            onClick={() => navigate({ type: "home" })}
            className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl font-semibold transition-all cursor-pointer"
          >
            Browse as Guest
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* 2-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center">
            {/* Avatar representation */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] mb-4 shadow-lg shadow-blue-500/10">
              <div className="h-full w-full bg-[#050816] rounded-[14px] flex items-center justify-center">
                <User className="h-10 w-10 text-blue-400" />
              </div>
            </div>

            {/* User Identity Details */}
            <h2 className="text-lg font-bold text-white truncate max-w-full mb-1">
              {user.email}
            </h2>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-6">
              Verified Cinema Curator
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 gap-4 w-full border-y border-white/10 py-6 mb-6">
              <div
                className="text-center cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
                onClick={() => navigate({ type: "favorites" })}
              >
                <div className="text-2xl font-black text-rose-500 leading-tight">
                  {favorites.length}
                </div>
                <div className="text-xs text-slate-400 font-medium">Favorites</div>
              </div>
              <div
                className="text-center cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
                onClick={() => navigate({ type: "watchlist" })}
              >
                <div className="text-2xl font-black text-teal-400 leading-tight">
                  {watchlist.length}
                </div>
                <div className="text-xs text-slate-400 font-medium">Watchlist</div>
              </div>
            </div>

            {/* Logout button form */}
            <button
              id="btn-logout-profile"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/30 text-red-400 rounded-2xl font-semibold text-sm transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Right Column - Preferences and Personal recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Preferred Genres Selection (Personalized Survey) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400/20" />
              <span>Preferred Genres Selection</span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Select your favorite storytelling genres to feed our dynamic recommendation engine.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_GENRES.map((genre) => {
                const active = favoriteGenres.includes(genre);
                return (
                  <button
                    id={`profile-genre-${genre}`}
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{genre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personalized Recommendations Shelf */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <span>Personalized Recommendations</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Smart matchings based on your curated movie tags and select genres.
                </p>
              </div>
            </div>

            {favoriteGenres.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center text-slate-500">
                <ShieldAlert className="h-8 w-8 mb-2 text-slate-400" />
                <span className="text-sm font-medium">Select preferred genres above to customize suggestions</span>
              </div>
            ) : loadingRecs ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : recommended.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {recommended.map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-500 py-6 border border-dashed border-white/10 rounded-2xl">
                We're tailoring suggestions... select more genres for broader exploration options.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
