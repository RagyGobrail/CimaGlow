/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Play, Plus, Check, Star, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Movie } from "../types";
import { useMovieContext } from "../context/MovieContext";
import { MovieCarousel } from "../components/MovieCarousel";
import { HeroSkeleton, CarouselRowSkeleton } from "../components/SkeletonLoader";
import { getTMDBImageUrl } from "../data/mockMovies";
import { TrailerModal } from "../components/TrailerModal";

export const Home: React.FC = () => {
  const { activeView, navigate, toggleWatchlist, isWatchlisted } = useMovieContext();

  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hero section carousel slider state
  const [heroIndex, setHeroIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchAllMovies() {
      try {
        setLoading(true);
        setError(null);
        // Execute parallel requests to our server proxy
        const [resTrending, resPopular, resTopRated, resNew, resSeries] = await Promise.all([
          fetch("/api/movies/trending").then((r) => r.json()),
          fetch("/api/movies/popular").then((r) => r.json()),
          fetch("/api/movies/top-rated").then((r) => r.json()),
          fetch("/api/movies/new").then((r) => r.json()),
          fetch("/api/movies/series").then((r) => r.json()),
        ]);

        if (resTrending.results) setTrending(resTrending.results);
        if (resPopular.results) setPopular(resPopular.results);
        if (resTopRated.results) setTopRated(resTopRated.results);
        if (resNew.results) setNewReleases(resNew.results);
        if (resSeries.results) setSeries(resSeries.results);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load catalog data:", err);
        setError("Unable to sync catalog data. Check server connectivity or refresh.");
        setLoading(false);
      }
    }

    fetchAllMovies();
  }, []);

  // Reset slider index back to zero when category shifts
  useEffect(() => {
    setHeroIndex(0);
  }, [activeView.type]);

  // Set automatic cycling of the Hero Banner slides every 8 seconds
  useEffect(() => {
    const bannerLength = getBannerMovies().length;
    if (bannerLength > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % Math.min(bannerLength, 5));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [trending, series, popular, activeView.type]);

  // Dynamically select our banner movies list based on active category
  const getBannerMovies = () => {
    switch (activeView.type) {
      case "tv":
        return series;
      case "movie":
        return popular;
      case "new":
        return newReleases;
      case "trending":
        return trending;
      default:
        return trending;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 sm:pt-24 space-y-8 bg-[#050816] min-h-screen px-4 sm:px-8 max-w-7xl mx-auto">
        <HeroSkeleton />
        <CarouselRowSkeleton />
        <CarouselRowSkeleton />
      </div>
    );
  }

  if (error || trending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-[#050816]">
        <div id="error-screen" className="max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-xl font-display font-bold text-red-500 mb-2">Cinematic Sync Error</h2>
          <p className="text-slate-400 text-sm mb-6">{error || "No films found inside current catalog registry."}</p>
          <button
            id="btn-retry-sync"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const heroMovies = getBannerMovies().slice(0, 5);
  const currentHero = heroMovies[heroIndex] || heroMovies[0] || trending[0];

  const triggerTrailerPlay = (movie: Movie) => {
    // If the movie has a trailer key (either loaded locally or to be queried), open modal
    setSelectedMovie(movie);
    
    // We can fetch details first to retrieve real tmdb trailer if empty
    fetch(`/api/movies/${movie.id}?type=${movie.media_type || (movie.first_air_date ? "tv" : "movie")}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.trailer_key) {
          movie.trailer_key = data.trailer_key;
        }
        setSelectedMovie({ ...movie, trailer_key: data.trailer_key || movie.trailer_key });
        setTrailerOpen(true);
      })
      .catch((err) => {
        console.warn("Failed to retrieve real-time trailer from node:", err);
        setTrailerOpen(true);
      });
  };

  const handleHeroWatchlistToggle = () => {
    toggleWatchlist(currentHero.id);
  };

  const inWatchlist = isWatchlisted(currentHero.id);

  return (
    <div className="pb-24 pt-0">
      {/* 1. Large viewport Hero Banner */}
      <div className="relative h-[65vh] sm:h-[75vh] w-full overflow-hidden flex items-end">
        {/* Carousel slide image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={getTMDBImageUrl(currentHero.backdrop_path, "backdrop")}
              alt={currentHero.title || currentHero.name}
              className="w-full h-full object-cover object-center scale-102 animate-fade-in"
              referrerPolicy="no-referrer"
            />
            {/* Multi-layered custom backdrop gradients for true theatrical integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/45 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/95 via-[#050816]/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero details container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-16 relative z-10">
          <div className="max-w-2xl">
            {/* Release state details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-3 text-xs sm:text-sm"
            >
              <span className="bg-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                {currentHero.media_type === "tv" || currentHero.first_air_date ? "Series Feature" : "Blockbuster Feature"}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur border border-white/5">
                <Star className="h-3 w-3 fill-current" />
                <span>{currentHero.vote_average?.toFixed(1) || "8.5"}</span>
              </div>
              <span className="text-slate-300 font-medium">
                {currentHero.release_date?.substring(0, 4) || currentHero.first_air_date?.substring(0, 4) || "2024"}
              </span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-shih font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter mb-4 leading-tight uppercase drop-shadow"
            >
              {currentHero.title || currentHero.name}
            </motion.h1>

            {/* Short review description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-300 text-sm sm:text-base md:text-lg mb-6 line-clamp-3 leading-relaxed drop-shadow-md"
            >
              {currentHero.overview}
            </motion.p>

            {/* CTA Option Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              {/* Play trailer button */}
              <button
                id="btn-hero-play-trailer"
                onClick={() => triggerTrailerPlay(currentHero)}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                <span>Play Trailer</span>
              </button>

              {/* Add/Remove lists */}
              <button
                id="btn-hero-watchlist"
                onClick={handleHeroWatchlistToggle}
                className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all border cursor-pointer ${
                  inWatchlist
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{inWatchlist ? "In Watchlist" : "Add Watchlist"}</span>
              </button>

              {/* More info button */}
              <button
                id="btn-hero-details"
                onClick={() =>
                  navigate({
                    type: "details",
                    id: currentHero.id,
                    mediaType: currentHero.media_type || (currentHero.first_air_date ? "tv" : "movie"),
                  })
                }
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-sm cursor-pointer"
                title="View Full Cast and Similar Releases"
              >
                <Info className="h-4 w-4" />
                <span>More Details</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Carousel indicators dots / manual slides */}
        {heroMovies.length > 1 && (
          <div className="absolute right-4 bottom-4 sm:right-12 sm:bottom-12 z-20 flex items-center gap-2">
            {heroMovies.map((_, index) => (
              <button
                id={`hero-indicator-${index}`}
                key={index}
                onClick={() => setHeroIndex(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  heroIndex === index ? "w-6 bg-blue-500" : "w-2 bg-slate-600 hover:bg-slate-500"
                }`}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Structured Content Carousels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 mt-8">
        {(activeView.type === "home" || activeView.type === "movie") && (
          <MovieCarousel
            title="Most Popular Blockbusters"
            movies={popular}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}

        {(activeView.type === "home" || activeView.type === "movie" || activeView.type === "trending") && (
          <MovieCarousel
            title="Top Rated Classics"
            movies={topRated}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}

        {(activeView.type === "home" || activeView.type === "trending") && (
          <MovieCarousel
            title="Trending This Week"
            movies={trending}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}

        {(activeView.type === "home" || activeView.type === "tv") && (
          <MovieCarousel
            title="Popular TV Series"
            movies={series}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}

        {/* Spec TV category custom sub-genres */}
        {activeView.type === "tv" && (
          <MovieCarousel
            title="Immersive Science Fiction & Fantasy Hits"
            movies={series.filter(s => s.genres?.some((g: any) => {
              const name = typeof g === "string" ? g : g.name;
              return name.includes("Fantasy") || name.includes("Sci-Fi") || name.includes("Drama");
            }))}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}

        {(activeView.type === "home" || activeView.type === "new" || activeView.type === "movie") && (
          <MovieCarousel
            title="New Cinematic Releases"
            movies={newReleases}
            onPlayTrailer={triggerTrailerPlay}
          />
        )}
      </div>

      {/* Trailer Lightbox Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerKey={selectedMovie?.trailer_key}
        title={selectedMovie?.title || selectedMovie?.name || "Film Selection"}
      />
    </div>
  );
};
