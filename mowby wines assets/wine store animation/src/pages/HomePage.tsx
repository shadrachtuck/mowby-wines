"use client";

import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

// Figma MCP asset URLs (valid for 7 days - consider downloading to /src/assets for permanence)
const WINE_BOTTLE_IMG =
  "https://www.figma.com/api/mcp/asset/d5c90bfe-6c1b-4baf-ba48-776d8ebdd9d4";
const HARVEST_IMAGES = [
  "https://www.figma.com/api/mcp/asset/1e530939-74f5-4d38-ba8c-4a9f2a7fc0fb",
  "https://www.figma.com/api/mcp/asset/2e7f42c1-ca79-4f69-8a04-da0f3cc1088c",
  "https://www.figma.com/api/mcp/asset/a3916901-53fb-4e28-8327-e25d9d7dc5a4",
  "https://www.figma.com/api/mcp/asset/830b306e-7f74-4400-b5ab-3c4ff575e4a8",
  "https://www.figma.com/api/mcp/asset/736ed00d-d424-43de-af32-846a03b77a96",
  "https://www.figma.com/api/mcp/asset/830b306e-7f74-4400-b5ab-3c4ff575e4a8",
];
const FISH_DECORATIVE =
  "https://www.figma.com/api/mcp/asset/cbdc9be9-38f2-482b-baab-508a44404521";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#fffbeb]">
      {/* Hero Section - Figma: bottle, title, subtext, buttons */}
      <div className="bg-[#fffbeb] pt-12 pb-[100px] px-6 flex flex-col items-center">
        <div className="flex flex-col items-center gap-8 max-w-[526px]">
          {/* Wine Bottle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-[280px] md:w-[420px] h-[340px] md:h-[520px] flex items-center justify-center overflow-visible"
          >
            <img
              src={WINE_BOTTLE_IMG}
              alt="First Crush 2025 Syrah"
              className="w-full h-full object-contain object-center"
            />
          </motion.div>

          {/* Title - Patrick Hand SC, 48px */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1
              className="text-4xl md:text-5xl font-[family-name:var(--font-display)] text-[#3b92ce] tracking-[-0.96px] leading-[1.2]"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              &quot;FIRST CRUSH&quot;
              <span className="text-[#3b92ce]"> 2025 </span>
              <span className="text-[#c7242f]"> </span>
              <span className="text-[#3b92ce]">SYRAH</span>
            </h1>
            <p className="mt-2 text-[#757575] text-lg md:text-xl max-w-[600px] mx-auto leading-[1.2]">
              Get on the list to secure a bottle! Very limited quantities one
              of a one-of-a-kind wine-only release!
            </p>
          </motion.div>

          {/* Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 items-center"
          >
            <Link
              to="/about"
              className="px-4 py-3 bg-[#fff1c2] hover:bg-[#ffe8a3] text-[#1e1e1e] rounded-[12px] text-base transition-colors"
            >
              Learn More
            </Link>
            <Link
              to="/shop"
              className="px-5 py-3 bg-[#3b92ce] hover:bg-[#2d7ab8] text-[#f5f5f5] font-bold rounded-[12px] text-base transition-colors"
            >
              Reserve a Bottle
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Views from the Harvest Section */}
      <div className="bg-[#fffbeb] py-12 md:py-16 opacity-90">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-black tracking-[-0.72px] mb-8 md:mb-12 flex items-center gap-2"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              Views from the harvest
              <ChevronRight className="w-6 h-6 rotate-90" />
            </h2>

            {/* Horizontal scrolling image gallery - 6 images */}
            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="flex gap-6 md:gap-12 min-w-max">
                {HARVEST_IMAGES.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex-shrink-0 w-[280px] md:w-[400px] h-[350px] md:h-[500px] rounded-lg overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Harvest view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-[#fffbeb] py-16 md:py-20 relative">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[100px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <h2
              className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-black tracking-[-0.72px] mb-8"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              Our Mission
            </h2>
            <p className="text-[#757575] text-lg md:text-2xl leading-[1.5] tracking-[2.4px] max-w-[966px]">
              Our mission is to craft low-alcohol, youthful, and approachable
              wines that can be enjoyed on any occasion. We champion
              sustainability through a low-intervention winemaking approach,
              sourcing fruit from organic vineyards to create high-quality
              natural wines that let the terroir, fruit, and varietal
              characteristics shine. Our ingredients are simple: organic grapes,
              naturally occurring fermentations, small additions of sulfur
              dioxide for stability, and plenty of love.
            </p>

            {/* Decorative fish - Figma: red & pink fishy */}
            <div className="absolute -bottom-4 right-0 md:right-16 w-32 md:w-[251px] h-12 md:h-24 opacity-90">
              <img
                src={FISH_DECORATIVE}
                alt=""
                className="w-full h-full object-contain scale-x-[-1] scale-y-[-1]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
