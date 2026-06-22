/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Film, Tv, Compass, Flame, Clock, Heart, Bookmark, User } from "lucide-react";
import { motion } from "motion/react";
import { useMovieContext, ActiveView } from "../context/MovieContext";
import { CategoryTab } from "../types";

export const Navbar: React.FC = () => {
  const { activeView, navigate } = useMovieContext();
  const [searchInput, setSearchInput] = useState("");

  const tabs: { key: CategoryTab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Compass className="h-4 w-4" /> },
    { key: "tv", label: "Series", icon: <Tv className="h-4 w-4" /> },
    { key: "movie", label: "Movies", icon: <Film className="h-4 w-4" /> },
    { key: "new", label: "New Releases", icon: <Clock className="h-4 w-4" /> },
    { key: "trending", label: "Trending", icon: <Flame className="h-4 w-4" /> },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate({ type: "search", searchQuery: searchInput });
    }
  };

  const handleTabClick = (tabKey: CategoryTab) => {
    navigate({ type: tabKey });
  };

  const isTabActive = (tabKey: CategoryTab) => {
    return activeView.type === tabKey;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand Title */}
          <div
            id="brand-logo"
            onClick={() => navigate({ type: "home" })}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-tighter bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              Cima<span className="text-blue-500">Glow</span>
            </span>
          </div>

          {/* Desktop Core Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {tabs.map((tab) => {
              const active = isTabActive(tab.key);
              return (
                <button
                  id={`nav-tab-${tab.key}`}
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                    active ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-[-10px] left-4 right-4 h-[3px] bg-blue-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Header Controls (Search, Favorites Shortcuts & Profile) */}
          <div className="flex items-center gap-3">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                id="search-navbar-input"
                type="text"
                placeholder="Search movies, shows..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-48 lg:w-64 rounded-xl bg-white/5 border border-white/10 py-1.5 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>

            {/* Mobile Search Button shortcut */}
            <button
              id="mobile-search-nav-btn"
              onClick={() => navigate({ type: "search", searchQuery: "" })}
              className="sm:hidden rounded-xl p-2.5 bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Open Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Watchlist shortcut button */}
            <button
              id="shortcuts-watchlist-btn"
              onClick={() => navigate({ type: "watchlist" })}
              className={`rounded-xl p-2.5 bg-white/5 border transition-colors relative cursor-pointer ${
                activeView.type === "watchlist"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10"
                  : "border-white/5 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="My Watchlist"
            >
              <Bookmark className="h-4 w-4" />
            </button>

            {/* Favorites shortcut button */}
            <button
              id="shortcuts-favorites-btn"
              onClick={() => navigate({ type: "favorites" })}
              className={`rounded-xl p-2.5 bg-white/5 border transition-colors relative cursor-pointer ${
                activeView.type === "favorites"
                  ? "border-red-500 text-red-400 bg-red-400/10"
                  : "border-white/5 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title="My Favorites"
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* User Profile Avatar Frame */}
            <div
              id="user-profile-badge"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 p-[1.5px] cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all overflow-hidden"
              onClick={() => navigate({ type: "profile" })}
              title="User Account"
            >
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <User className="h-4 w-4 text-slate-300" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};
