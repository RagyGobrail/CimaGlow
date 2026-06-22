/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { MovieProvider, useMovieContext } from "./context/MovieContext";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { Home } from "./pages/Home";
import { MovieDetails } from "./pages/MovieDetails";
import { Search } from "./pages/Search";
import { Favorites } from "./pages/Favorites";
import { Watchlist } from "./pages/Watchlist";
import { Profile } from "./pages/Profile";
import { AuthModal } from "./components/AuthModal";

const AppContent: React.FC = () => {
  const { activeView } = useMovieContext();

  // Route Views Switcher
  const renderPage = () => {
    switch (activeView.type) {
      case "home":
      case "tv":
      case "movie":
      case "new":
      case "trending":
        return <Home />;
      case "details":
        return <MovieDetails />;
      case "search":
        return <Search />;
      case "favorites":
        return <Favorites />;
      case "watchlist":
        return <Watchlist />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-blue-600 selection:text-white flex flex-col pt-16 sm:pt-20">
      {/* Fixed top header */}
      <Navbar />

      {/* Primary Animated Canvas Body */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView.type + (activeView.id ? `-${activeView.id}` : "")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Command deck on mobile */}
      <BottomNav />

      {/* Global Auth Modal overlay */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}
