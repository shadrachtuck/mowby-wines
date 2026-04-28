"use client";

import { motion } from "motion/react";
import { DecorativeFish } from "../components/DecorativeFish";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F2] pt-20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative space-y-4"
          >
            <h1 className="text-4xl font-serif mb-6 text-gray-900">
              About "First Crush"
            </h1>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We craft small-batch, low-alcohol wines that are crisp, youthful, and approachable for any occasion. We champion sustainability with a low-intervention winemaking approach, sourcing fruit from organic vineyards to create high-quality natural wines that let the terroir, fruit, and varietal characteristics shine.
              </p>
              
              <p>
                <strong>About First Crush:</strong> In the wine world, "crush" refers to the winemaking process, the time when grapes ripen and the first vintage I've completed under my own label. While it is Mowby Wines' first crush, my personal crush began years ago in South Africa. After college, I immersed in a year-long cultivating culture with sustainable agriculture and international travel, ending my first true "wine crush," and I was hooked! That initial crush has grown into a long-term love that I'm thrilled to now share with you.
              </p>

              <p>
                This is my debut vintage, and quantities are extremely limited. To reserve your allocation, reserve list to reserve your allocation. Bottles will be available upon completion in summer 2025. Stay tuned for more details!
              </p>
            </div>

            {/* Decorative Fish */}
            <div className="absolute -bottom-12 left-8">
              <DecorativeFish variant="blue" size="md" />
            </div>
            <div className="absolute top-12 -right-8">
              <DecorativeFish variant="yellow" size="sm" />
            </div>
          </motion.div>

          {/* Right Column - Bottle Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="max-w-sm relative">
              <img
                src="https://images.unsplash.com/photo-1760920193193-91dd96af7862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwZGFya3xlbnwxfHx8fDE3NzQwNDQ1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="First Crush wine bottle"
                className="w-full h-auto"
              />
              <div className="absolute -top-8 -right-8">
                <DecorativeFish variant="pink" size="lg" />
              </div>
              <div className="absolute -bottom-8 left-4">
                <DecorativeFish variant="green" size="md" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif mb-4 text-gray-900">
              Join the Waitlist
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Be the first to know when First Crush 2025 becomes available
            </p>
            <Link to="/shop">
              <Button className="bg-[#2B9BF4] hover:bg-[#2388D9] text-white rounded-full px-8 py-6 text-lg">
                Reserve a Bottle
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}