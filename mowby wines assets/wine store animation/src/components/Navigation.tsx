"use client";

import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImage from "figma:asset/4ffc4356da247d983cb4eb1e31b413a0528a9baa.png";

export function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffbeb] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-[71px] sm:pr-8">
        <div className="flex justify-between items-center h-16 md:h-[234px] gap-4 md:gap-[52px] flex-wrap md:flex-nowrap py-8">
          {/* Logo - Figma: 229x209 */}
          <Link to="/" className="flex items-center justify-center shrink-0">
            <img
              src={logoImage}
              alt="Mowby Wines"
              className="h-[80px] md:h-[180px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - pill style */}
          <div className="hidden md:flex items-center gap-10 flex-1 justify-end">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <span
                  className={`inline-flex items-center justify-center px-2 py-2 rounded-[10px] text-base transition-colors font-['Rethink_Sans',sans-serif] ${
                    isActive(item.path)
                      ? "bg-[#7fbf75] text-[#1e1e1e] font-bold"
                      : "text-[#1e1e1e] font-normal hover:opacity-80"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA Button - Figma: blue #3b92ce, rounded 12px */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/shop"
              className="flex items-center justify-center h-10 px-4 py-2 bg-[#3b92ce] rounded-[12px] font-['Rethink_Sans',sans-serif] font-bold text-[#f5f5f5] text-base hover:bg-[#2d7ab8] transition-colors"
            >
              Reserve a Bottle
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1e1e1e] hover:opacity-80 transition-opacity"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-[#fffbeb]">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className={`block px-4 py-2 rounded-[10px] transition-colors ${
                    isActive(item.path)
                      ? "bg-[#7fbf75] text-[#1e1e1e] font-bold"
                      : "text-[#1e1e1e] hover:bg-[#fff1c2]"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-center w-full h-10 mt-2 bg-[#3b92ce] rounded-[12px] font-bold text-[#f5f5f5]">
                Reserve a Bottle
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
