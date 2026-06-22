/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrailerModalProps {
  trailerKey: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  trailerKey,
  isOpen,
  onClose,
  title,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="trailer-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            id="trailer-modal-content"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0B1120] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <h3 className="font-display text-lg font-semibold text-white truncate max-w-[80%]">
                {title} — Official Trailer
              </h3>
              <button
                id="btn-close-trailer"
                onClick={onClose}
                className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Close Trailer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Body */}
            <div className="relative aspect-video w-full bg-black">
              {trailerKey ? (
                <iframe
                  id="trailer-youtube-iframe"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`}
                  title={`${title} Trailer`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-slate-400">
                  <p className="mb-2 font-semibold text-white">Trailer not found</p>
                  <p className="text-sm text-slate-500">
                    TMDB does not have a registered YouTube video code for this movie currently.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
