'use client';

import { useEffect, useState } from "react";

export function ScrollBars() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate color based on scroll - light at top, dark at bottom
  const getColor = () => {
    // Light gold at top: #ffe866
    // Dark gold at bottom: #c4a522
    const lightGold = { r: 255, g: 232, b: 102 };
    const darkGold = { r: 196, g: 165, b: 34 };

    const r = Math.round(
      lightGold.r + (darkGold.r - lightGold.r) * scrollProgress
    );
    const g = Math.round(
      lightGold.g + (darkGold.g - lightGold.g) * scrollProgress
    );
    const b = Math.round(
      lightGold.b + (darkGold.b - lightGold.b) * scrollProgress
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <>
      {/* Left outer bar */}
      <div
        className="fixed top-0 bottom-0 w-[8px] z-50 pointer-events-none transition-colors duration-20"
        style={{
          left: "20px",
          backgroundColor: getColor(),
        }}
      />

      {/* Left inner bar */}
      <div
        className="fixed top-0 bottom-0 w-[8px] z-50 pointer-events-none transition-colors duration-20"
        style={{
          left: "40px",
          backgroundColor: getColor(),
        }}
      />

      {/* Right inner bar */}
      <div
        className="fixed top-0 bottom-0 w-[8px] z-50 pointer-events-none transition-colors duration-20"
        style={{
          right: "40px",
          backgroundColor: getColor(),
        }}
      />

      {/* Right outer bar */}
      <div
        className="fixed top-0 bottom-0 w-[8px] z-50 pointer-events-none transition-colors duration-20"
        style={{
          right: "20px",
          backgroundColor: getColor(),
        }}
      />
    </>
  );
}