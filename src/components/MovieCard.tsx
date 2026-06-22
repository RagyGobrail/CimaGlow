/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, Heart, Bookmark, Play } from "lucide-react";
import { motion } from "motion/react";
import { Movie } from "../types";
import { getTMDBImageUrl } from "../data/mockMovies";
import { useMovieContext } from "../context/MovieContext";

interface MovieCardProps {
  movie: Movie;
  onPlayClick?: (e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlayClick }) => {
  const { navigate, toggleFavorite, toggleWatchlist, isFavorite, isWatchlisted } = useMovieContext();

  const id = movie.id;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : movie.first_air_date
    ? movie.first_air_date.substring(0, 4)
    : "N/A";

  const isFav = isFavorite(id);
  const isWatch = isWatchlisted(id);

  const handleCardClick = () => {
    navigate({
      type: "details",
      id,
      mediaType: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
    });
  };

  return (
    <motion.div
      id={`movie-card-${id}`}
      whileHover={{ y: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex-shrink-0 w-36 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg cursor-pointer select-none"
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <img
        src={getTMDBImageUrl(movie.poster_path, "poster")}
        alt={movie.title || "Movie Poster"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Dynamic Overlay Shadow Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top action flags - Badges always visible */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10 transition-transform duration-300">
        {/* Rating Badge */}
        <div className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-amber-400 backdrop-blur-md border border-white/5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>

        {/* Favorite & Watchlist Buttons */}
        <div className="flex gap-1">
          <button
            id={`btn-fav-${id}`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(id);
            }}
            className={`rounded-full p-1.5 backdrop-blur-md border transition-colors cursor-pointer ${
              isFav
                ? "bg-red-500/20 border-red-500 text-red-500"
                : "bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Heart className={`h-3 w-3 ${isFav ? "fill-red-500" : ""}`} />
          </button>
          
          <button
            id={`btn-watch-${id}`}
            title={isWatch ? "Remove from Watchlist" : "Add to Watchlist"}
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(id);
            }}
            className={`rounded-full p-1.5 backdrop-blur-md border transition-colors cursor-pointer ${
              isWatch
                ? "bg-blue-500/20 border-blue-500 text-blue-500"
                : "bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Bookmark className={`h-3 w-3 ${isWatch ? "fill-blue-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Center hovering Play Button indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
        <button
          id={`btn-card-play-${id}`}
          onClick={(e) => {
            if (onPlayClick) {
              e.stopPropagation();
              onPlayClick(e);
            } else {
              handleCardClick();
            }
          }}
          className="rounded-full bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Play Trailer"
        >
          <Play className="h-5 w-5 fill-current ml-0.5" />
        </button>
      </div>

      {/* Text block at bottom of card */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex flex-col justify-end z-10 transition-transform translate-y-2 group-hover:translate-y-0 duration-300">
        <p className="text-[10px] sm:text-[11px] font-mono text-blue-400 font-semibold uppercase tracking-wider mb-0.5">
          {movie.media_type === "tv" ? "TV Series" : "Movie"}
        </p>
        <h4 className="font-display font-bold text-sm sm:text-base text-white truncate group-hover:text-blue-200 transition-colors duration-200">
          {movie.title || movie.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-xs text-slate-400">
          <span>{releaseYear}</span>
        </div>
      </div>
    </motion.div>
  );
};
