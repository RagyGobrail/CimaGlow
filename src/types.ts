/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: number;
  title: string;
  name?: string; // TMDB series uses "name" instead of "title"
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string; // TMDB series uses "first_air_date"
  vote_average: number;
  vote_count?: number;
  runtime?: number;
  genres?: string[] | { id: number; name: string }[];
  trailer_key?: string; // Youtube video ID
  media_type?: "movie" | "tv";
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface MovieDetails extends Movie {
  cast: CastMember[];
  similar: Movie[];
}

export type CategoryTab = "home" | "tv" | "movie" | "new" | "trending";

export interface AppState {
  favorites: number[];
  watchlist: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  addWatchlist: (id: number) => void;
  removeWatchlist: (id: number) => void;
}
