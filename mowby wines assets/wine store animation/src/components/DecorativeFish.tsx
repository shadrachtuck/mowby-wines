"use client";

import { motion } from "motion/react";
import fishImage from "figma:asset/38bc036b3c780dd98dedcf267f7320b652214e92.png";

interface FishProps {
  variant?: "green" | "blue" | "yellow";
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export function DecorativeFish({ 
  variant = "blue", 
  size = "md",
  className = "",
  animate = true
}: FishProps) {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  // Position in sprite: green top-left, blue top-right, yellow bottom
  const positionMap = {
    green: "object-[0%_0%]",
    blue: "object-[100%_0%]",
    yellow: "object-[50%_100%]"
  };

  const Component = animate ? motion.img : "img";
  const animationProps = animate ? {
    animate: { 
      y: [0, -10, 0],
      x: [0, 5, 0]
    },
    transition: { 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <Component 
      src={fishImage}
      alt="Decorative fish"
      className={`${sizeMap[size]} ${positionMap[variant]} ${className} object-cover`}
      style={{
        objectPosition: variant === "green" ? "0% 0%" : 
                       variant === "blue" ? "100% 0%" : 
                       "50% 100%",
        scale: 1.5
      }}
      {...animationProps}
    />
  );
}