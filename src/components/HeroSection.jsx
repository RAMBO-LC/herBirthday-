import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';

const MEMORY_PHOTOS = [
  { src: "/ref/girl.jpg" },
  { src: "/ref/heart.jpg" },
  { src: "/ref/girl1.jpg" },
  { src: "/ref/girl2.jpg" },
  { src: "/ref/girl3.jpg" },
  { src: "/ref/girl4.jpg" },
  { src: "/ref/girl5.jpg" },
  { src: "/ref/girl6.jpg" },
  { src: "/ref/girl7.jpg" },
  { src: "/ref/girl8.jpg" },
  { src: "/ref/girl9.jpg" },
  { src: "/ref/girl10.jpg" },
  { src: "/ref/girl11.jpg" }
];

const CURVE_PATH = "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

function MotionPathCarousel({ items, path = CURVE_PATH, baseVelocity = 6, repeat = 2 }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const progress = useMotionValue(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const dragVelocity = useRef(0);

  useAnimationFrame((_, delta) => {
    if (isDragging.current) {
      progress.set((progress.get() + dragVelocity.current * 0.05 + 100) % 100);
      dragVelocity.current *= 0.95;
      return;
    }
    const speed = isHovered ? baseVelocity * 0.25 : baseVelocity;
    const next = (progress.get() + (speed * delta) / 1000) % 100;
    progress.set(next);
  });

  const totalItems = items.length * repeat;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] select-none cursor-grab active:cursor-grabbing overflow-visible"
      onPointerDown={(e) => {
        isDragging.current = true;
        lastX.current = e.clientX;
        dragVelocity.current = 0;
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        dragVelocity.current = -dx * 0.4;
        progress.set((progress.get() - dx * 0.08 + 100) % 100);
      }}
      onPointerUp={() => { isDragging.current = false; }}
      onPointerLeave={() => { isDragging.current = false; setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
    >
      {Array.from({ length: totalItems }).map((_, idx) => {
        const item = items[idx % items.length];
        const itemSpacing = 100 / totalItems;
        return (
          <PathItem
            key={idx}
            item={item}
            baseOffset={idx * itemSpacing}
            progress={progress}
            pathString={path}
          />
        );
      })}
    </div>
  );
}

function PathItem({ item, baseOffset, progress, pathString }) {
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    return progress.on('change', (p) => {
      const pct = (baseOffset + p) % 100;
      setCurrentPct(pct);
    });
  }, [baseOffset, progress]);

  return (
    <div
      className="absolute top-0 left-0 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-md border border-[#14140F]/15 bg-[#14140F]/5 shadow-md transition-transform duration-300 ease-out hover:scale-110 hover:z-50 will-change-transform"
      style={{
        offsetPath: `path('${pathString}')`,
        offsetDistance: `${currentPct}%`,
        offsetRotate: 'auto',
      }}
    >
      <img
        src={item.src}
        alt="Memory"
        draggable={false}
        className="h-full w-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-300 ease-out"
      />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FAFAF7] text-[#14140F]">
      <div className="flex items-center justify-between px-8 pt-8 text-[11px] font-mono uppercase tracking-[0.25em] text-[#8A8A80] sm:px-14">
        <span>Aug 5</span>
        <span className="tracking-widest">✦ ✦ ✦</span>
      </div>

      <div className="px-8 pt-12 sm:px-14 sm:pt-16 z-10">
        <h1 className="font-display text-[15vw] leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
          <span className="font-light text-[#14140F]">Happy</span><br />
          <span className="font-extrabold text-[#14140F]">Birthday</span><br />
          <span className="font-extrabold text-amber-500">Sweety</span>
        </h1>

        <div className="mt-6 h-px w-16 bg-[#9C7A3F]" />

        <p className="font-sans mt-6 max-w-sm text-base leading-relaxed text-[#4A4A42]">
          wishing you a day filled with love, laughter, and all the happiness your heart can hold. May this year bring you endless joy and unforgettable memories. Happy Birthday!
        </p>
      </div>

      <div className="absolute top-64 sm:top-52 left-1/2 -translate-x-1/2 w-[110vw] -rotate-6 sm:-rotate-10 pointer-events-auto">
        <MotionPathCarousel items={MEMORY_PHOTOS} />
      </div>

      <div className="mt-auto flex items-center justify-between px-8 pb-8 sm:px-14 z-10">
        <div className="h-px flex-1 bg-[#14140F]/10" />
        <span className="font-mono px-4 text-[10px] uppercase tracking-[0.25em] text-[#8A8A80]">
          Made for you
        </span>
      </div>
    </section>
  );
}
