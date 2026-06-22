/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Home, Heart, Search, Bookmark, User } from "lucide-react";
import { useMovieContext } from "../context/MovieContext";

export const BottomNav: React.FC = () => {
  const { activeView, navigate } = useMovieContext();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      action: () => navigate({ type: "home" }),
      isActive: ["home", "tv", "movie", "new", "trending"].includes(activeView.type),
    },
    {
      id: "search",
      label: "Search",
      icon: <Search className="h-5 w-5" />,
      action: () => navigate({ type: "search", searchQuery: "" }),
      isActive: activeView.type === "search",
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: <Bookmark className="h-5 w-5" />,
      action: () => navigate({ type: "watchlist" }),
      isActive: activeView.type === "watchlist",
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <Heart className="h-5 w-5" />,
      action: () => navigate({ type: "favorites" }),
      isActive: activeView.type === "favorites",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      action: () => navigate({ type: "profile" }),
      isActive: activeView.type === "profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-t border-white/10 md:hidden px-4 py-2 flex justify-around items-center pb-safe">
      {navItems.map((item) => (
        <button
          key={item.id}
          id={`bottom-nav-${item.id}`}
          onClick={item.action}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            item.isActive ? "text-blue-500 scale-105" : "text-slate-400 active:scale-95"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium tracking-wide">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
