"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Sparkles, RefreshCw, Wine, Mail } from "lucide-react";
import wineBottleImage from "figma:asset/198fb0c4350725a5baa598bb1420ffeb8d43003e.png";
import { Link } from "react-router";

interface WineMessage {
  message: string;
  wine: string;
  notes: string[];
}

const wineMessages: WineMessage[] = [
  {
    message: "Bold, vibrant, and full of life - just like the journey ahead.",
    wine: "First Crush 2025 Syrah",
    notes: ["Blackberry", "Black Pepper", "Smoke"],
  },
  {
    message: "Natural, authentic, and crafted with love.",
    wine: "First Crush 2025 Syrah",
    notes: ["Wild Berry", "Earth", "Spice"],
  },
  {
    message: "Low intervention, high reward - the best things are simple.",
    wine: "First Crush 2025 Syrah",
    notes: ["Dark Fruit", "Herbs", "Mineral"],
  },
];

type BottleState = "unopened" | "uncorking" | "opened" | "joined";

export function WineBottle() {
  const [state, setState] = useState<BottleState>("unopened");
  const [currentMessage, setCurrentMessage] = useState<WineMessage | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const uncorkBottle = () => {
    if (state !== "unopened") return;

    setState("uncorking");
    const randomMessage =
      wineMessages[Math.floor(Math.random() * wineMessages.length)];
    setCurrentMessage(randomMessage);

    // Show uncorking animation for 2.5 seconds, then reveal message
    setTimeout(() => {
      setState("opened");
    }, 2500);
  };

  const handleJoinWaitlist = () => {
    setShowEmailForm(true);
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      // Store email in localStorage for demo purposes
      const existingEmails = JSON.parse(
        localStorage.getItem("wineWaitlist") || "[]"
      );
      localStorage.setItem(
        "wineWaitlist",
        JSON.stringify([...existingEmails, { email, timestamp: Date.now() }])
      );
      setState("joined");
    }
  };

  const getNewBottle = () => {
    setState("unopened");
    setCurrentMessage(null);
    setEmail("");
    setShowEmailForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FBF9F2]">
      <AnimatePresence mode="wait">
        {state === "unopened" && (
          <motion.div
            key="unopened"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.6,
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              onClick={uncorkBottle}
              className="cursor-pointer mb-8 max-w-xs"
            >
              <div className="relative">
                {/* Bottle Shadow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-black/10 rounded-full blur-lg" />

                {/* Wine Bottle Image */}
                <img
                  src={wineBottleImage}
                  alt="First Crush 2025 Syrah"
                  className="w-full h-auto relative z-10"
                />

                {/* Sparkle effects */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-6 h-6 text-[#2B9BF4] drop-shadow-lg" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute bottom-12 left-4"
                >
                  <Sparkles className="w-4 h-4 text-[#F4D93B] drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center relative max-w-md"
            >
              {/* Title */}
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.7,
                  duration: 0.8,
                  ease: "backOut",
                }}
                className="text-4xl md:text-5xl mb-3 text-[#2B9BF4] font-serif relative z-10"
              >
                <motion.span
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  First Crush
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-gray-700 mb-4 relative z-10"
              >
                Tap the bottle to uncork your exclusive preview
              </motion.p>

              {/* Magic text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200"
                >
                  <Sparkles className="w-4 h-4 text-[#2B9BF4]" />
                  <span className="text-sm text-gray-900 font-medium">
                    Limited release wine awaits
                  </span>
                  <Sparkles className="w-4 h-4 text-[#F4D93B]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {state === "uncorking" && (
          <motion.div
            key="uncorking"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 0.95, 1.05] }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                rotate: [0, -3, 3, -2, 2, 0],
              }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="relative mb-8 max-w-xs"
            >
              <div className="relative">
                {/* Popping particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: (Math.cos((i * Math.PI * 2) / 12) * 80),
                      y: (Math.sin((i * Math.PI * 2) / 12) * 80) - 60,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + i * 0.05,
                      ease: "easeOut",
                    }}
                    className="absolute top-0 left-1/2 w-2 h-2 bg-[#2B9BF4] rounded-full"
                  />
                ))}

                {/* Mist effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 2, 3],
                    y: [0, -50, -100],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#2B9BF4]/20 rounded-full blur-md"
                />

                {/* Bottle Image */}
                <img
                  src={wineBottleImage}
                  alt="First Crush 2025 Syrah"
                  className="w-full h-auto relative z-10"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ duration: 2.5 }}
              className="text-gray-700 text-center"
            >
              Uncorking your exclusive preview...
            </motion.p>
          </motion.div>
        )}

        {state === "opened" && currentMessage && !showEmailForm && (
          <motion.div
            key="opened"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.2,
            }}
            className="w-full max-w-md"
          >
            <Card className="p-8 bg-white border-gray-200 shadow-xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6 relative"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    scale: {
                      delay: 0.5,
                      duration: 0.8,
                      ease: "backOut",
                    },
                  }}
                  className="inline-block mb-4 relative z-10"
                >
                  <Wine className="w-12 h-12 text-[#2B9BF4]" />
                </motion.div>

                <motion.h2
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.6,
                    ease: "backOut",
                  }}
                  className="text-2xl md:text-3xl mb-4 text-gray-900 font-serif relative z-10"
                >
                  {currentMessage.wine}
                </motion.h2>
              </motion.div>

              <motion.blockquote
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-gray-700 mb-6 italic leading-relaxed"
              >
                "{currentMessage.message}"
              </motion.blockquote>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mb-6"
              >
                <h3 className="text-sm text-gray-900 font-medium mb-3">Tasting Notes</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentMessage.notes.map((note, index) => (
                    <motion.div
                      key={note}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1 + index * 0.1,
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="px-4 py-2 bg-blue-50 rounded-full shadow-sm border border-blue-100"
                    >
                      <span className="text-[#2B9BF4] font-medium text-sm">
                        {note}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="space-y-3"
              >
                <Link to="/shop" className="block">
                  <Button
                    className="w-full bg-[#2B9BF4] hover:bg-[#2388D9] text-white px-6 py-6 rounded-full text-lg"
                  >
                    Reserve a Bottle
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}