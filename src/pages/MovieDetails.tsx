/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Star, Heart, Bookmark, Play, Clock, Calendar, ArrowLeft, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMovieContext } from "../context/MovieContext";
import { MovieDetails as MovieDetailsType, Movie } from "../types";
import { getTMDBImageUrl, getCastProfileUrl } from "../data/mockMovies";
import { DetailsSkeleton } from "../components/SkeletonLoader";
import { MovieCarousel } from "../components/MovieCarousel";
import { TrailerModal } from "../components/TrailerModal";

export const MovieDetails: React.FC = () => {
  const { activeView, navigate, goBack, toggleFavorite, toggleWatchlist, isFavorite, isWatchlisted } = useMovieContext();
  const id = activeView.id;
  const mediaType = activeView.mediaType || "movie";

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // User Interactive Rating State
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingFeedback, setRatingFeedback] = useState(false);

  // Sync details from server proxy
  useEffect(() => {
    if (!id) return;

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/movies/${id}?type=${mediaType}`);
        if (!res.ok) {
          throw new Error("Details not found in registry.");
        }
        const data = await res.json();
        setMovie(data);

        // Fetch user's prior locally stored rating if any
        const key = `user_rating_${id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setUserRating(parseInt(stored));
        } else {
          setUserRating(0);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load details:", err);
        setError("Unable to sync details for this cinematic title.");
        setLoading(false);
      }
    }

    fetchMovieDetails();
    // Scroll window back to top when details loads so view does not start half scrolled
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, mediaType]);

  const handleRatingClick = (stars: number) => {
    if (!id) return;
    setUserRating(stars);
    // Persist in local storage
    localStorage.setItem(`user_rating_${id}`, stars.toString());

    // Show sparkling confirmation toast animation
    setRatingFeedback(true);
    setTimeout(() => {
      setRatingFeedback(false);
    }, 3000);
  };

  const handleBackClick = () => {
    goBack();
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-8 bg-[#050816] pt-24">
        <h2 className="text-xl font-display font-bold text-red-500 mb-2">Cinematic Error</h2>
        <p className="text-slate-400 text-sm mb-6">{error || "Movie specifications are missing."}</p>
        <button
          id="btn-error-back-details"
          onClick={() => navigate({ type: "home" })}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Main Dashboard</span>
        </button>
      </div>
    );
  }

  const isFav = isFavorite(movie.id);
  const isWatch = isWatchlisted(movie.id);

  // Helpers to safely dissect different shape TMDB returns
  const title = movie.title || movie.name || "Cinematic Epic";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const genresList = movie.genres
    ? movie.genres.map((g) => (typeof g === "string" ? g : g.name))
    : [];
  
  const movieYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : movie.first_air_date
    ? movie.first_air_date.substring(0, 4)
    : "N/A";

  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 45;

  return (
    <div className="bg-[#050816] min-h-screen pb-24 text-white relative">
      
      {/* 1. Backdrop banner Area */}
      <div className="relative h-[45vh] sm:h-[60vh] w-full overflow-hidden">
        <img
          src={getTMDBImageUrl(movie.backdrop_path, "backdrop")}
          alt={title}
          className="w-full h-full object-cover object-center scale-101"
          referrerPolicy="no-referrer"
        />
        {/* Soft, dark dramatic theatrical blends */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050816] to-transparent" />

        {/* Back navigation chevron button */}
        <button
          id="btn-details-back"
          onClick={handleBackClick}
          className="absolute top-20 sm:top-24 left-4 sm:left-8 z-30 flex items-center justify-center p-3 rounded-2xl bg-black/50 border border-white/10 text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Go Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* 2. Structured movie specifications details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column A: Left High-Res Column Card */}
          <div className="hidden md:block">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3] sticky top-28 bg-[#0B1120]"
            >
              <img
                src={getTMDBImageUrl(movie.poster_path, "poster")}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Column B: Primary Details Block */}
          <div className="md:col-span-2 flex flex-col justify-end pt-20 md:pt-0">
            {/* Title / Header block */}
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight uppercase mb-4">
              {title}
            </h1>

            {/* Quick meta data list row */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mb-6 font-medium">
              {/* Year */}
              <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>{movieYear}</span>
              </div>

              {/* Runtime duration */}
              <div className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{runtimeHours > 0 ? `${runtimeHours}h ${runtimeMins}m` : `${runtimeMins}m`}</span>
              </div>

              {/* Average TMDB rating */}
              <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 py-1 px-3 rounded-full text-amber-400">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{rating} (TMDB)</span>
              </div>

              {/* Media indicator badge */}
              <span className="hidden sm:inline-block px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                {mediaType === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>

            {/* Genres container list of chips */}
            {genresList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genresList.map((genre, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-900 border border-white/10 text-slate-300 px-3 py-1.5 rounded-xl font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis Description and actions */}
            <div className="mb-8">
              <h3 className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider mb-2">
                Synopsis
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
                {movie.overview || "This production currently lacks a descriptive background summary in our local catalog repository."}
              </p>

              {/* Action buttons list */}
              <div className="flex flex-wrap gap-4">
                {/* Trailer button play */}
                <button
                  id="btn-play-details-trailer"
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/15 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Play className="h-5 w-5 fill-current" />
                  <span>Play Film trailer</span>
                </button>

                {/* Favorites button details */}
                <button
                  id="btn-details-favorite"
                  onClick={() => toggleFavorite(movie.id)}
                  className={`flex items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 active:scale-95 ${
                    isFav
                      ? "bg-red-500/10 border-red-500 text-red-500"
                      : "bg-[#0B1120] border-white/10 text-slate-300 hover:text-white"
                  }`}
                  title={isFav ? "Saved Favorites" : "Add Favorites"}
                >
                  <Heart className={`h-5 w-5 ${isFav ? "fill-red-500" : ""}`} />
                </button>

                {/* Watchlist button details */}
                <button
                  id="btn-details-watchlist"
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`flex items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 active:scale-95 ${
                    isWatch
                      ? "bg-blue-500/10 border-blue-500 text-blue-500"
                      : "bg-[#0B1120] border-white/10 text-slate-300 hover:text-white"
                  }`}
                  title={isWatch ? "Saved Watchlist" : "Add Watchlist"}
                >
                  <Bookmark className={`h-5 w-5 ${isWatch ? "fill-blue-500" : ""}`} />
                </button>
              </div>
            </div>

            {/* Interactive User Rating block */}
            <div className="border-t border-b border-white/5 py-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-white text-base">
                  What is your rating for this title?
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Rates are persisted locally to coordinate your custom cinematic preferences.
                </p>
              </div>

              {/* Star controls row */}
              <div className="relative flex items-center gap-2">
                <div className="flex items-center gap-1 bg-black/30 p-2 rounded-xl border border-white/5 h-12">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      id={`star-rating-btn-${star}`}
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className="p-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                      title={`Rate ${star} Stars`}
                    >
                      <Star
                        className={`h-6 w-6 stroke-2 transition-colors duration-150 ${
                          star <= (hoverRating || userRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-500 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Stars confirmation notification */}
                <AnimatePresence>
                  {ratingFeedback && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute left-0 bottom-full mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin" />
                      <span>Rating saved: {userRating}/5 Stars!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Core Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-4">
                <h3 className="font-display font-bold text-slate-200 text-sm uppercase tracking-wider mb-4">
                  Top Billing Cast Roles
                </h3>
                {/* Horizontal grid flex row */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar custom-scrollbar snap-x">
                  {movie.cast.map((member) => (
                    <div
                      key={member.id}
                      className="flex-shrink-0 w-24 sm:w-28 text-center flex flex-col items-center select-none snap-start"
                    >
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-white/10 bg-slate-800 shadow-md mb-2">
                        <img
                          src={getCastProfileUrl(member.profile_path)}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-white text-xs font-semibold leading-tight font-sans truncate w-full">
                        {member.name}
                      </p>
                      <p className="text-slate-400 text-[10px] sm:text-xs leading-normal truncate w-full">
                        {member.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Similar Cinematic Recommendations Carousel */}
        {movie.similar && movie.similar.length > 0 && (
          <div className="mt-12 sm:mt-16 border-t border-white/5 pt-8">
            <MovieCarousel
              title="Similar Movies For You"
              movies={movie.similar}
              onPlayTrailer={(simMovie) => {
                // Instantly open details panel for clicked similar movies
                navigate({
                  type: "details",
                  id: simMovie.id,
                  mediaType: simMovie.media_type || (mediaType as any),
                });
              }}
            />
          </div>
        )}

      </div>

      {/* Trailer Modal Player overlay */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerKey={movie.trailer_key}
        title={title}
      />
    </div>
  );
};
