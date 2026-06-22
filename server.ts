/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { MOCK_MOVIES, MOCK_CASTS } from "./src/data/mockMovies.js"; // Use js local resolution in compiled CJS, standard esm loads TS natively in dev

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Helper function to handle external fetch to TMDB API or fallback to mock data
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint: string, queryParams: string = "") {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === "YOUR_TMDB_API_KEY" || apiKey.trim() === "") {
    return null; // Force mock fallback if no valid key is provided
  }
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${apiKey}${queryParams ? `&${queryParams}` : ""}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`TMDB API returned error: ${res.status} for ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error requesting TMDB at ${endpoint}:`, error);
    return null;
  }
}

// REST APIs
// 1. Trending movies / series
app.get("/api/movies/trending", async (req, res) => {
  const tmdbData = await fetchFromTMDB("/trending/all/week");
  if (tmdbData && tmdbData.results) {
    // Normalise results for series vs movies
    const normalised = tmdbData.results.map((item: any) => ({
      ...item,
      title: item.title || item.name,
      media_type: item.media_type || (item.first_air_date ? "tv" : "movie")
    }));
    return res.json({ results: normalised });
  }

  // Fallback: Use Dune: Part Two, Inception, Game of Thrones, Inception and other trending MOCK titles
  const trendingIds = [693134, 157336, 1399, 569094, 66732];
  const items = MOCK_MOVIES.filter(m => trendingIds.includes(m.id));
  return res.json({ results: items });
});

// 2. Popular movies
app.get("/api/movies/popular", async (req, res) => {
  const tmdbData = await fetchFromTMDB("/movie/popular");
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }

  // Fallback: Popular items
  const popularIds = [157336, 872585, 27205, 502356, 299536, 603];
  const items = MOCK_MOVIES.filter(m => popularIds.includes(m.id));
  return res.json({ results: items });
});

// 3. Top Rated movies
app.get("/api/movies/top-rated", async (req, res) => {
  const tmdbData = await fetchFromTMDB("/movie/top_rated");
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }

  // Fallback: Top Rated (Interstellar, Spiderverse, Dune 2, Game of Thrones, Dark Knight)
  const topRatedIds = [157336, 569094, 693134, 1399, 155, 120];
  const items = MOCK_MOVIES.filter(m => topRatedIds.includes(m.id));
  return res.json({ results: items });
});

// 4. Series (TV shows)
app.get("/api/movies/series", async (req, res) => {
  const tmdbData = await fetchFromTMDB("/tv/popular");
  if (tmdbData && tmdbData.results) {
    const normalised = tmdbData.results.map((item: any) => ({
      ...item,
      title: item.name || item.title,
      media_type: "tv"
    }));
    return res.json({ results: normalised });
  }

  // Fallback: Series
  const items = MOCK_MOVIES.filter(m => m.media_type === "tv");
  return res.json({ results: items });
});

// 5. New Releases
app.get("/api/movies/new", async (req, res) => {
  const tmdbData = await fetchFromTMDB("/movie/now_playing");
  if (tmdbData && tmdbData.results) {
    return res.json({ results: tmdbData.results });
  }

  // Fallback: new release mockups
  const newIds = [693134, 872585, 569094, 100088];
  const items = MOCK_MOVIES.filter(m => newIds.includes(m.id));
  return res.json({ results: items });
});

// 6. Search Results
app.get("/api/movies/search", async (req, res) => {
  const query = req.query.query as string || "";
  if (!query) {
    return res.json({ results: [] });
  }

  const tmdbData = await fetchFromTMDB("/search/multi", `query=${encodeURIComponent(query)}`);
  if (tmdbData && tmdbData.results) {
    const filtered = tmdbData.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => ({
        ...item,
        title: item.title || item.name,
        media_type: item.media_type
      }));
    return res.json({ results: filtered });
  }

  // Fallback: client-side text filtering over mock movie assets
  const lowercaseQuery = query.toLowerCase();
  const searchResults = MOCK_MOVIES.filter(movie => {
    return (
      movie.title.toLowerCase().includes(lowercaseQuery) ||
      (movie.name && movie.name.toLowerCase().includes(lowercaseQuery)) ||
      movie.overview.toLowerCase().includes(lowercaseQuery) ||
      (movie.genres && movie.genres.some(g => (typeof g === "string" ? g : g.name).toLowerCase().includes(lowercaseQuery)))
    );
  });

  return res.json({ results: searchResults });
});

// 7. Movie/Series details by ID (including appending video trailers, cast, similar)
app.get("/api/movies/:id", async (req, res) => {
  const idStr = req.params.id;
  const id = parseInt(idStr);
  const mediaType = req.query.type as string || "movie";

  const endpoint = `/${mediaType}/${id}`;
  const tmdbData = await fetchFromTMDB(endpoint, "append_to_response=videos,credits,similar");

  if (tmdbData) {
    // Normalise fields with robust priority-scored trailer selection
    const videos = tmdbData.videos?.results || [];
    const youtubeVideos = videos.filter((v: any) => v.site === "YouTube" && v.key);

    let trailer = null;
    if (youtubeVideos.length > 0) {
      // Score videos to bubble up the actual official trailer and suppress featurettes, BTS, or interviews
      const scoreVideo = (v: any) => {
        let score = 0;
        const name = (v.name || "").toLowerCase();
        const type = (v.type || "").toLowerCase();
        
        if (type === "trailer") {
          score += 100;
        } else if (type === "teaser") {
          score += 50;
        } else if (type === "clip") {
          score += 20;
        } else if (type === "featurette") {
          score += 5;
        } else if (type === "behind the scenes") {
          score -= 30;
        }
        
        // Exact keyword matching in Title names
        if (name.includes("official trailer")) {
          score += 80;
        } else if (name.includes("trailer 1") || name.includes("trailer #1")) {
          score += 65;
        } else if (name.includes("main trailer") || name.includes("theatrical trailer")) {
          score += 60;
        } else if (name.includes("trailer 2") || name.includes("trailer #2")) {
          score += 55;
        } else if (name.includes("trailer")) {
          score += 40;
        } else if (name.includes("teaser")) {
          score += 15;
        }
        
        if (v.official === true || v.official === "true") {
          score += 35;
        }
        
        // Strict penalty to suppress behind the scenes / interviews / secondary materials
        if (
          name.includes("bts") ||
          name.includes("behind the scenes") ||
          name.includes("interview") ||
          name.includes("review") ||
          name.includes("cast") ||
          name.includes("making of") ||
          name.includes("fan") ||
          name.includes("react")
        ) {
          score -= 150;
        }
        return score;
      };

      // Sort in descending order of weight scores
      youtubeVideos.sort((a: any, b: any) => scoreVideo(b) - scoreVideo(a));
      trailer = youtubeVideos[0];
    }

    const cast = tmdbData.credits?.cast?.slice(0, 8).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ""
    })) || [];

    const similar = tmdbData.similar?.results?.slice(0, 10).map((s: any) => ({
      ...s,
      title: s.title || s.name,
      media_type: mediaType
    })) || [];

    return res.json({
      ...tmdbData,
      title: tmdbData.title || tmdbData.name,
      media_type: mediaType,
      runtime: tmdbData.runtime || (tmdbData.episode_run_time ? tmdbData.episode_run_time[0] : 45),
      genres: tmdbData.genres || [],
      trailer_key: trailer?.key || "",
      cast,
      similar
    });
  }

  // Fallback: Look up in mock db by standard ID
  const movie = MOCK_MOVIES.find(m => m.id === id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found in cinematic directory" });
  }

  // Cast members fallback
  const cast = MOCK_CASTS[id] || [
    { id: 1, name: "Jessica Chastain", character: "Lead Actress", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" },
    { id: 2, name: "Christian Bale", character: "Supporting Actor", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120" },
    { id: 3, name: "Oscar Isaac", character: "Antagonist", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" }
  ];

  // Similar movies lookup
  const similar = MOCK_MOVIES.filter(m => m.id !== id && m.media_type === movie.media_type).slice(0, 6);

  return res.json({
    ...movie,
    cast,
    similar
  });
});

// Configure Vite middleware in development or express static client in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode (Vite Middleware)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode (Static Assets)");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Movie Discovery Server running at http://localhost:${PORT}`);
  });
}

startServer();
