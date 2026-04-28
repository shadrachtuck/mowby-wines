"use client";

import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { DecorativeFish } from "../components/DecorativeFish";

export function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Natural Winemaking",
      excerpt:
        "Discover the fundamentals of low-intervention winemaking and learn how organic practices create authentic wines.",
      author: "Corinne Davidson",
      date: "January 15, 2026",
      category: "Winemaking",
    },
    {
      id: 2,
      title: "Behind the Crush: First Vintage Stories",
      excerpt:
        "Take an exclusive look into Mowby Wines' first crush, from grape selection to fermentation.",
      author: "Corinne Davidson",
      date: "January 8, 2026",
      category: "Production",
    },
    {
      id: 3,
      title: "Sustainable Viticulture in Washington",
      excerpt:
        "Explore how organic vineyards in Washington State are leading the way in sustainable wine production.",
      author: "Corinne Davidson",
      date: "December 28, 2025",
      category: "Sustainability",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F2] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">
            Wine Journal
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Stories and insights from Mowby Wines
          </p>
          
          <div className="absolute -top-8 right-12">
            <DecorativeFish variant="pink" size="md" />
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="overflow-hidden bg-white border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                  <div className="text-4xl">🍷</div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-[#2B9BF4] rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif mb-3 text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#2B9BF4] hover:text-[#2388D9] hover:bg-blue-50"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          <div className="absolute -bottom-12 left-12">
            <DecorativeFish variant="yellow" size="lg" />
          </div>
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center relative"
        >
          <Card className="p-8 bg-white border-gray-200">
            <h3 className="text-xl font-serif text-gray-900 mb-2">
              More Articles Coming Soon
            </h3>
            <p className="text-gray-600">
              We're constantly adding new content. Subscribe to our newsletter to
              stay updated with the latest wine insights and stories.
            </p>
          </Card>
          
          <div className="absolute -top-8 -right-8">
            <DecorativeFish variant="green" size="md" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}