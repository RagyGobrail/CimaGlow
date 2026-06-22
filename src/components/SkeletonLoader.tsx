/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-48 aspect-[2/3] rounded-2xl bg-[#0B1120] border border-white/5 p-2 flex flex-col justify-end overflow-hidden animate-pulse">
      <div className="h-full w-full bg-white/5 rounded-xl mb-3 flex items-center justify-center">
        <svg className="w-8 h-8 text-white/5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-white/5 rounded w-1/2"></div>
    </div>
  );
};

export const CarouselRowSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => {
  return (
    <div className="py-2">
      <div className="h-6 bg-white/10 rounded-md w-48 mb-4 animate-pulse"></div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="h-[60vh] sm:h-[70vh] w-full bg-gradient-to-b from-transparent via-[#0B1120]/40 to-[#050816] animate-pulse relative flex items-end">
      <div className="absolute inset-0 bg-white/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 relative z-10">
        <div className="h-10 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/4 mb-6"></div>
        <div className="h-16 bg-white/5 rounded w-2/3 mb-6"></div>
        <div className="flex gap-4">
          <div className="h-12 bg-white/10 rounded-xl w-32"></div>
          <div className="h-12 bg-white/5 rounded-xl w-40"></div>
        </div>
      </div>
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050816] animate-pulse">
      {/* Backdrop Area */}
      <div className="h-[50vh] w-full bg-white/5 relative"></div>
      
      {/* Content box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster Shimmer */}
          <div className="aspect-[2/3] bg-white/10 rounded-2xl hidden md:block"></div>
          
          {/* Text fields */}
          <div className="md:col-span-2 flex flex-col justify-end pt-32 md:pt-0">
            <div className="h-12 bg-white/10 rounded w-3/4 mb-4"></div>
            <div className="flex gap-2 mb-6">
              <div className="h-5 bg-white/5 rounded w-16"></div>
              <div className="h-5 bg-white/5 rounded w-16"></div>
              <div className="h-5 bg-white/5 rounded w-16"></div>
            </div>
            <div className="h-4 bg-white/10 rounded w-full mb-3"></div>
            <div className="h-4 bg-white/10 rounded w-full mb-3"></div>
            <div className="h-4 bg-white/10 rounded w-2/3 mb-12"></div>

            {/* Cast Area */}
            <div className="h-6 bg-white/10 rounded-md w-32 mb-4"></div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/5 mb-2"></div>
                  <div className="h-3 bg-white/5 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
