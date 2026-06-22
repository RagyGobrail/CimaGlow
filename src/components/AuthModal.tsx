/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Mail, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useMovieContext } from "../context/MovieContext";

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen } = useMovieContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAuthModalOpen(false);
    setError(null);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose();
    } catch (err: any) {
      console.error("Auth failed:", err);
      let errMsg = "An unexpected auth error occurred.";
      if (err.code === "auth/email-already-in-use") {
        errMsg = "This email is already in use.";
      } else if (err.code === "auth/invalid-credential") {
        errMsg = "Incorrect email or password.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password is too weak (min 6 characters).";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      } else {
        errMsg = err.message || errMsg;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-[#0b101e]/95 border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden z-10 shadow-2xl"
          >
            {/* Ambient visual background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Header Dialog elements */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="text-xl font-display font-bold text-white">
                  {isSignUp ? "Create Account" : "Welcome to CimaGlow"}
                </h3>
              </div>
              <button
                id="btn-close-auth-modal"
                onClick={handleClose}
                className="p-1 px-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selector tabs login vs sign up */}
            <div className="flex border-b border-white/10 mb-6 bg-white/5 rounded-xl p-1">
              <button
                id="tab-toggle-login"
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  !isSignUp ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
              >
                Sign In
              </button>
              <button
                id="tab-toggle-register"
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  isSignUp ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Errors messaging panel */}
            {error && (
              <div
                id="auth-error-banner"
                className="mb-4 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign in and Registration form input fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <button
                id="btn-auth-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-98 cursor-pointer mt-6"
              >
                {loading ? "Syncing Identity..." : isSignUp ? "Create My Account" : "Access Catalog"}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
              {isSignUp
                ? "By registering, you sync your favorite releases & watchlists continuously across devices."
                : "Enter your movie catalog credentials to synchronize your preferences live."}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
