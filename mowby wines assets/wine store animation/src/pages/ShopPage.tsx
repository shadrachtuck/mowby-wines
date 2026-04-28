"use client";

import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { DecorativeFish } from "../components/DecorativeFish";
import { Check } from "lucide-react";
import wineBottleImage from "figma:asset/198fb0c4350725a5baa598bb1420ffeb8d43003e.png";

export function ShopPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bottles: "1",
    message: ""
  });
  const [reserved, setReserved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.email.includes("@") && formData.name) {
      // Store reservation in localStorage
      const existingReservations = JSON.parse(
        localStorage.getItem("wineReservations") || "[]"
      );
      localStorage.setItem(
        "wineReservations",
        JSON.stringify([
          ...existingReservations,
          { 
            ...formData,
            timestamp: Date.now(), 
            product: "First Crush 2025 Syrah" 
          },
        ])
      );
      setReserved(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F2] pt-16">
      {/* Hero Section with Bottle */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {!reserved ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Wine Bottle Image - Centered */}
            <div className="max-w-xs mx-auto mb-8 relative">
              <motion.img
                src={wineBottleImage}
                alt="First Crush 2025 Syrah wine bottle"
                className="w-full h-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              {/* Decorative Fish */}
              <div className="absolute -top-4 -right-8">
                <DecorativeFish variant="blue" size="md" />
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 text-center">
              "FIRST CRUSH" 2025 SYRAH
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed px-4 text-center">
              Reserve your bottle now! Very limited quantities of this one-of-a-kind wine-only release.
            </p>

            {/* Reservation Form */}
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 relative">
              {/* Decorative Fish */}
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <DecorativeFish variant="yellow" size="md" />
              </div>

              <h2 className="text-xl md:text-2xl font-serif mb-6 text-gray-900 text-center">
                Reserve Your Bottles
              </h2>

              <form onSubmit={handleReserve} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-gray-300 rounded-full px-6 py-3 text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border-gray-300 rounded-full px-6 py-3 text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border-gray-300 rounded-full px-6 py-3 text-gray-900"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="bottles" className="text-sm font-medium text-gray-700 mb-2 block">
                    Number of Bottles *
                  </Label>
                  <select
                    id="bottles"
                    name="bottles"
                    value={formData.bottles}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 rounded-full px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B9BF4] focus:border-transparent"
                  >
                    <option value="1">1 bottle</option>
                    <option value="2">2 bottles</option>
                    <option value="3">3 bottles</option>
                    <option value="4">4 bottles</option>
                    <option value="5">5 bottles</option>
                    <option value="6">6 bottles (half case)</option>
                    <option value="12">12 bottles (full case)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                    Additional Notes (Optional)
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B9BF4] focus:border-transparent resize-none"
                    placeholder="Any questions or special requests?"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#2B9BF4] hover:bg-[#2388D9] text-white rounded-full px-8 py-6 text-lg"
                  >
                    Reserve My Bottles
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2">
                  * No payment required at this time. We'll contact you when our wine is available for purchase (estimated May 2025).
                </p>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white border-2 border-green-300 rounded-2xl p-8 md:p-12 text-center relative">
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-serif text-green-900 mb-4">
                Reservation Confirmed!
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Thank you, <span className="font-semibold">{formData.name}</span>!
                </p>
                <p>
                  We've reserved <span className="font-semibold">{formData.bottles} {formData.bottles === "1" ? "bottle" : "bottles"}</span> of First Crush 2025 Syrah for you.
                </p>
                <p className="text-sm pt-4 border-t border-gray-200">
                  We'll reach out to <span className="font-semibold">{formData.email}</span> once our licenses are approved and the wine is ready for purchase (estimated May 2025).
                </p>
              </div>

              {/* Decorative Fish */}
              <div className="absolute -top-6 -right-6 hidden md:block">
                <DecorativeFish variant="green" size="md" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <DecorativeFish variant="blue" size="sm" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}