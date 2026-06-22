/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { CategoryTab } from "../types";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

export interface ActiveView {
  type: CategoryTab | "details" | "favorites" | "watchlist" | "search" | "profile";
  id?: number; // movie/series ID for details page
  mediaType?: "movie" | "tv"; // for details lookup
  searchQuery?: string; // search queries
}

interface MovieContextProps {
  activeView: ActiveView;
  navigate: (view: ActiveView) => void;
  goBack: () => void;
  favorites: number[];
  watchlist: number[];
  toggleFavorite: (id: number) => void;
  toggleWatchlist: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isWatchlisted: (id: number) => boolean;
  
  // Custom Auth properties
  user: User | null;
  userLoading: boolean;
  logout: () => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  
  // Profiles and Personalized Recommendations
  favoriteGenres: string[];
  setFavoriteGenres: (genres: string[]) => void;
  saveFavoriteGenres: (genres: string[]) => Promise<void>;
}

const MovieContext = createContext<MovieContextProps | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Custom Hash Routing
  const [activeView, setActiveView] = useState<ActiveView>({ type: "home" });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Maintain custom routing history stack for robust Back button behavior
  const historyRef = React.useRef<ActiveView[]>([]);

  useEffect(() => {
    const history = historyRef.current;
    const current = history[history.length - 1];
    
    if (
      !current ||
      current.type !== activeView.type ||
      current.id !== activeView.id ||
      current.searchQuery !== activeView.searchQuery
    ) {
      // Push current location onto internal history stack
      history.push(activeView);
      if (history.length > 50) {
        history.shift();
      }
    }
  }, [activeView]);

  const goBack = () => {
    const history = historyRef.current;
    if (history.length > 1) {
      history.pop(); // Pop current view (since we are leaving it)
      const prev = history.pop(); // Pop target previous view to re-navigate
      if (prev) {
        navigate(prev);
        return;
      }
    }
    // Default fallback routing
    navigate({ type: "home" });
  };

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Favorites & Watchlist & Genres state
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [favoriteGenres, setFavoriteGenresRef] = useState<string[]>([]);

  // Initial load navigation from window hash
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash || "#home";
      if (hash.startsWith("#movie/")) {
        const id = parseInt(hash.replace("#movie/", ""));
        setActiveView({ type: "details", id, mediaType: "movie" });
      } else if (hash.startsWith("#tv/")) {
        const id = parseInt(hash.replace("#tv/", ""));
        setActiveView({ type: "details", id, mediaType: "tv" });
      } else if (hash.startsWith("#search")) {
        const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
        const query = params.get("q") || "";
        setActiveView({ type: "search", searchQuery: query });
      } else if (hash === "#favorites") {
        setActiveView({ type: "favorites" });
      } else if (hash === "#watchlist") {
        setActiveView({ type: "watchlist" });
      } else if (hash === "#profile") {
        setActiveView({ type: "profile" });
      } else {
        const tab = hash.replace("#", "") as CategoryTab;
        if (["home", "tv", "movie", "new", "trending"].includes(tab)) {
          setActiveView({ type: tab });
        } else {
          setActiveView({ type: "home" });
        }
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  // Hash navigation helper
  const navigate = (view: ActiveView) => {
    let hash = "#home";
    if (view.type === "details") {
      hash = `#${view.mediaType || "movie"}/${view.id}`;
    } else if (view.type === "search") {
      hash = `#search?q=${encodeURIComponent(view.searchQuery || "")}`;
    } else if (view.type === "favorites") {
      hash = "#favorites";
    } else if (view.type === "watchlist") {
      hash = "#watchlist";
    } else if (view.type === "profile") {
      hash = "#profile";
    } else {
      hash = `#${view.type}`;
    }
    window.location.hash = hash;
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);

      if (currentUser) {
        // Logged In: Set up dynamic listener for user's Firestore document
        const userDocRef = doc(db, "users", currentUser.uid);
        
        // Listen to Firestore updates in real-time
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFavorites(data.favorites || []);
            setWatchlist(data.watchlist || []);
            setFavoriteGenresRef(data.favoriteGenres || []);
          } else {
            // First time login - initialize user's Firestore data using current local states if exists
            const localFavs = getLocalData("tmdb_favorites");
            const localWatch = getLocalData("tmdb_watchlist");
            const initialData = {
              favorites: localFavs,
              watchlist: localWatch,
              favoriteGenres: ["Sci-Fi", "Action"]
            };
            setDoc(userDocRef, initialData);
            setFavorites(localFavs);
            setWatchlist(localWatch);
            setFavoriteGenresRef(["Sci-Fi", "Action"]);
          }
        });

        return () => unsubDoc();
      } else {
        // Logged Out: Load from standard localstorage
        setFavorites(getLocalData("tmdb_favorites"));
        setWatchlist(getLocalData("tmdb_watchlist"));
        setFavoriteGenresRef(getLocalData("preferred_genres") || ["Sci-Fi", "Action"]);
      }
    });

    return () => unsubscribe();
  }, []);

  const getLocalData = (key: string): any[] => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Sync to local storage only when logged out
  useEffect(() => {
    if (!user) {
      localStorage.setItem("tmdb_favorites", JSON.stringify(favorites));
    }
  }, [favorites, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("tmdb_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("preferred_genres", JSON.stringify(favoriteGenres));
    }
  }, [favoriteGenres, user]);

  // Actions
  const toggleFavorite = async (id: number) => {
    const isPresent = favorites.includes(id);
    const updated = isPresent ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(updated);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { favorites: updated }, { merge: true });
      } catch (err) {
        console.error("Firestore favorite sync failed:", err);
      }
    }
  };

  const toggleWatchlist = async (id: number) => {
    const isPresent = watchlist.includes(id);
    const updated = isPresent ? watchlist.filter((x) => x !== id) : [...watchlist, id];
    setWatchlist(updated);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { watchlist: updated }, { merge: true });
      } catch (err) {
        console.error("Firestore watchlist sync failed:", err);
      }
    }
  };

  const favoriteGenresChange = (genres: string[]) => {
    setFavoriteGenresRef(genres);
  };

  const saveFavoriteGenres = async (genres: string[]) => {
    setFavoriteGenresRef(genres);
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { favoriteGenres: genres }, { merge: true });
      } catch (err) {
        console.error("Firestore genre update failed:", err);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFavorites([]);
    setWatchlist([]);
    navigate({ type: "home" });
  };

  const isFavorite = (id: number) => favorites.includes(id);
  const isWatchlisted = (id: number) => watchlist.includes(id);

  return (
    <MovieContext.Provider
      value={{
        activeView,
        navigate,
        goBack,
        favorites,
        watchlist,
        toggleFavorite,
        toggleWatchlist,
        isFavorite,
        isWatchlisted,
        user,
        userLoading,
        logout,
        authModalOpen,
        setAuthModalOpen,
        favoriteGenres,
        setFavoriteGenres: favoriteGenresChange,
        saveFavoriteGenres
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
