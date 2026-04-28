"use client";

import { motion } from "motion/react";
import { Wine, Home } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 to-red-50/80 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <Wine className="w-24 h-24 mx-auto text-red-800" />
        </motion.div>

        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-900 via-red-800 to-pink-900 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! It seems this bottle has been misplaced. Let's get you back to our
          collection.
        </p>

        <Link to="/">
          <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
