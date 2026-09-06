import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

const NOTES = [
  {
    id: "n1",
    title: "01",
    text: "Every butterfly escapes... except me. I've been happily stuck with you since day one. 🤍",
    accent: "#D98E7E"
  },
  {
    id: "n2",
    title: "02",
    text: "Is butterfly ki tarah meri har khushi ka raasta bhi aakhir tum tak hi aakar rukta hai. 🫶",
    accent: "#C9A15E"
  },
  {
    id: "n3",
    title: "03",
    text: "Tumne butterfly ko touch kiya... aur meri heartbeat phir se skip kar gayi. 😭❤️",
    accent: "#7E9C68"
  },
  {
    id: "n4",
    title: "04",
    text: "Looks like you're really good at catching butterflies... no wonder you caught my heart so easily. ❤️",
    accent: "#B27A94"
  },
  {
    id: "n5",
    title: "05",
    text: "This butterfly landed in your hands for a moment... my heart chose to stay there forever. 🦋",
    accent: "#7C8FA6"
  }
];

function ButterflyWing({ side, idPrefix, accent, flapMs }) {
  const gradId = `${idPrefix}-grad-${side}`;
  const isLeft = side === "left";
  return (
    <motion.svg
      viewBox="0 0 84 120"
      style={{
        position: "absolute",
        left: isLeft ? undefined : "50%",
        right: isLeft ? "50%" : undefined,
        top: 0,
        width: 32,
        height: 48,
        transformOrigin: isLeft ? "100% 20%" : "0% 20%",
        overflow: "visible",
        transform: isLeft ? "scaleX(-1)" : undefined
      }}
      animate={{ rotateY: [10, 65, 10], rotateZ: [0, -4, 0] }}
      transition={{ duration: flapMs / 1000, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
          <stop offset="100%" stopColor={accent} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <path
        d="M4 14 C 18 2, 45 4, 76 18 C 82 40, 74 65, 52 82 C 42 74, 30 76, 22 96 C 14 84, 8 68, 6 48 Z"
        fill={`url(#${gradId})`}
        stroke={accent}
        strokeOpacity={0.4}
        strokeWidth={0.8}
      />
    </motion.svg>
  );
}

function Butterfly({ note, bounds, onOpen }) {
  const controls = useAnimationControls();
  const flapSpeed = useRef(260 + Math.random() * 140).current;
  const isRunning = useRef(true);

  useEffect(() => {
    isRunning.current = true;
    let active = true;

    async function flightLoop() {
      // Pick random initial coordinate inside bounds
      let currX = Math.random() * (bounds.width - 120) + 60;
      let currY = Math.random() * (bounds.height - 120) + 60;
      controls.set({ x: currX, y: currY, opacity: 1 });

      while (active && isRunning.current) {
        const targetX = Math.random() * (bounds.width - 140) + 70;
        const targetY = Math.random() * (bounds.height - 140) + 70;
        const dist = Math.hypot(targetX - currX, targetY - currY);
        const duration = Math.min(Math.max(dist / 90, 2.5), 6.5);

        await controls.start({
          x: targetX,
          y: targetY,
          rotate: (targetX > currX ? 12 : -12) + (Math.random() - 0.5) * 8,
          transition: { duration, ease: "easeInOut" }
        });

        currX = targetX;
        currY = targetY;

        // Brief pause or hover flutter
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1500));
      }
    }

    flightLoop();

    return () => {
      active = false;
      isRunning.current = false;
    };
  }, [bounds, controls]);

  return (
    <motion.div
      animate={controls}
      onClick={() => onOpen(note)}
      whileHover={{ scale: 1.25 }}
      whileTap={{ scale: 0.9 }}
      className="absolute top-0 left-0 cursor-pointer z-30 pointer-events-auto filter drop-shadow-md select-none"
    >
      <div className="relative w-16 h-12">
        <ButterflyWing side="left" idPrefix={note.id} accent={note.accent} flapMs={flapSpeed} />
        <ButterflyWing side="right" idPrefix={note.id} accent={note.accent} flapMs={flapSpeed} />
        {/* Butterfly body */}
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 w-1.5 h-6 rounded-full bg-stone-900/80"
        />
      </div>
    </motion.div>
  );
}

function NoteModal({ note, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-[#1E1A17] p-8 text-[#EDE6DA] shadow-2xl border border-white/10"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-sm font-mono text-stone-400 hover:text-white transition-colors"
        >
          close
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: note.accent }}>
            NOTE {note.title}
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <p className="font-newsreader text-xl leading-relaxed italic text-stone-100 font-light">
          "{note.text}"
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ExpandableNotes() {
  const rootRef = useRef(null);
  const [bounds, setBounds] = useState({ width: 1200, height: 800 });
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const updateSize = () => {
      if (rootRef.current) {
        setBounds({
          width: rootRef.current.clientWidth || window.innerWidth,
          height: rootRef.current.clientHeight || window.innerHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {NOTES.map((note) => (
        <Butterfly key={note.id} note={note} bounds={bounds} onOpen={setActiveNote} />
      ))}

      <AnimatePresence>
        {activeNote && (
          <NoteModal note={activeNote} onClose={() => setActiveNote(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
