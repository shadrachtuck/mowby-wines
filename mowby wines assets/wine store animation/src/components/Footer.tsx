"use client";

import { Link } from "react-router";
import { useState } from "react";

// Figma MCP asset URLs
const LOGO_IMG =
  "https://www.figma.com/api/mcp/asset/ee54e7d3-b8cc-426e-b4c3-600dce978ef9";
const INSTAGRAM_IMG =
  "https://www.figma.com/api/mcp/asset/696c100e-aa6a-4dca-b035-d85b9dd0b94e";
const FACEBOOK_IMG =
  "https://www.figma.com/api/mcp/asset/c8719406-4ce0-4133-9d3c-119c42eba99d";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      const existingSubscribers = JSON.parse(
        localStorage.getItem("newsletterSubscribers") || "[]"
      );
      localStorage.setItem(
        "newsletterSubscribers",
        JSON.stringify([
          ...existingSubscribers,
          { email, timestamp: Date.now() },
        ])
      );
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#fffbeb] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-[100px] pt-12 pb-16">
        {/* Four columns: Social | Navigation | Logo | Legal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Social Column */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-[32px] text-black tracking-[-0.64px]"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              Social
            </h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <img src={INSTAGRAM_IMG} alt="" className="w-full h-full" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <img src={FACEBOOK_IMG} alt="" className="w-full h-full" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-[32px] text-black tracking-[-0.64px]"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#1e1e1e] text-base hover:opacity-80 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Logo Column */}
          <div className="flex items-center justify-center md:col-span-1">
            <Link to="/" className="block">
              <img
                src={LOGO_IMG}
                alt="Mowby Wines"
                className="h-24 md:h-32 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-6">
            <h3
              className="text-[32px] text-black tracking-[-0.64px] text-right"
              style={{ fontFamily: "'Patrick Hand SC', cursive" }}
            >
              Legal
            </h3>
            <ul className="flex flex-col gap-2 text-right">
              <li>
                <a
                  href="#"
                  className="text-[#1e1e1e] text-base hover:opacity-80 transition-opacity"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#1e1e1e] text-base hover:opacity-80 transition-opacity"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#1e1e1e] text-base hover:opacity-80 transition-opacity"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#1e1e1e] text-base hover:opacity-80 transition-opacity"
                >
                  Other
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-base font-semibold text-black mb-3">
            Subscribe to our newsletter!
          </p>
          {!subscribed ? (
            <form
              onSubmit={handleSubscribe}
              className="flex gap-3 w-full max-w-[340px]"
            >
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-[120px] px-4 py-3 bg-[#ffe8a3] border-none rounded-[12px] text-[#1e1e1e] text-base placeholder:text-[#1e1e1e]/70 focus:outline-none focus:ring-2 focus:ring-[#3b92ce]/50"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-[#3b92ce] hover:bg-[#2d7ab8] text-[#f5f5f5] font-semibold rounded-[12px] text-base transition-colors"
              >
                Submit
              </button>
            </form>
          ) : (
            <p className="text-base text-green-700 font-medium">
              Thanks for subscribing!
            </p>
          )}
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-black tracking-[-0.28px]">
          2026 Mowby Wines; Site built, designed, & maintained by Mishap Creative
          Works
        </p>
      </div>
    </footer>
  );
}
