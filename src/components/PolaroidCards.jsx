import React from 'react';
import { motion } from 'framer-motion';

const PHOTOS = [
  "/ref/girl2.jpg",
  "/ref/girl3.jpg",
  "/ref/girl4.jpg",
  "/ref/girl5.jpg",
  "/ref/girl6.jpg",
  "/ref/girl7.jpg",
  "/ref/girl8.jpg",
  "/ref/girl9.jpg",
  "/ref/girl10.jpg",
  "/ref/girl11.jpg"
];

const CAPTIONS = [
  "Cutie 🥹",
  "Baddie 😎",
  "Pretty ✨",
  "My Love 🤍",
  "Sunshine ☀️",
  "Beautiful 🌸",
  "Dream Girl 💫",
  "Queen 👑",
  "Adorable 💖",
  "Iconic 🌟"
];

const POSITIONS = [
  "top-[8%] left-[8%] rotate-[-8deg]",
  "top-[15%] left-[35%] rotate-[6deg]",
  "top-[10%] right-[10%] rotate-[-5deg]",
  "top-[45%] left-[10%] rotate-[7deg]",
  "top-[48%] left-[40%] rotate-[-6deg]",
  "top-[40%] right-[12%] rotate-[10deg]",
  "bottom-[10%] left-[16%] rotate-[-10deg]",
  "bottom-[12%] left-[45%] rotate-[5deg]",
  "bottom-[8%] right-[14%] rotate-[-7deg]",
  "top-[28%] right-[28%] rotate-[3deg]"
];

export default function PolaroidCards() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#d9d3c7] before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(rgba(120,110,90,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,110,90,0.12)_1px,transparent_1px)] before:bg-[size:40px_40px] after:absolute after:inset-0 after:pointer-events-none after:bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.08))]">
      {/* Decorative Doodles */}
      <div className="absolute top-16 left-16 text-5xl opacity-30 pointer-events-none select-none">✿</div>
      <div className="absolute bottom-16 right-16 text-5xl opacity-30 pointer-events-none select-none">♡</div>
      <div className="absolute top-[45%] right-[5%] text-4xl opacity-30 pointer-events-none select-none">✨</div>

      {PHOTOS.map((src, i) => (
        <motion.div
          key={src}
          drag
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          whileHover={{ scale: 1.05, zIndex: 40 }}
          whileTap={{ scale: 0.98, cursor: "grabbing" }}
          className={`
            absolute
            ${POSITIONS[i % POSITIONS.length]}
            bg-white
            rounded-xl
            shadow-2xl
            p-3
            cursor-grab
            touch-none
            select-none
            z-10
          `}
        >
          <div className="relative overflow-visible">
            <img
              src={src}
              alt={CAPTIONS[i % CAPTIONS.length]}
              draggable={false}
              className="h-48 w-48 sm:h-56 sm:w-56 rounded-lg object-cover pointer-events-none select-none"
            />
            <div className="absolute -top-6 -right-6 text-4xl drop-shadow-md pointer-events-none select-none">
              ❤️
            </div>
            <p className="mt-3 text-center text-neutral-800 text-2xl sm:text-3xl font-semibold font-caveat pointer-events-none select-none">
              {CAPTIONS[i % CAPTIONS.length]}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
