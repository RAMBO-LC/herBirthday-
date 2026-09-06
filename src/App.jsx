import React, { useState } from 'react';
import MarqueeCountdown from './components/MarqueeCountdown.jsx';
import HeroSection from './components/HeroSection.jsx';
import PolaroidCards from './components/PolaroidCards.jsx';
import ExpandableNotes from './components/ExpandableNotes.jsx';
import BookFlip from './components/BookFlip.jsx';
import ThreeSphereScene from './components/ThreeSphereScene.jsx';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Vintage Cinema Marquee Ticket Lock Screen */}
      <MarqueeCountdown
        targetDate="2026-08-10T18:30:00.000Z"
        showPreviewButton={true}
        marqueeText="SAVE THE DATE · AUGUST 11 ·"
        marqueeTitle="NOW SHOWING"
        marqueeSub="a Pipi production, live August 11th"
        doorsText="doors open at midnight, IST"
        onUnlock={() => setIsUnlocked(true)}
      />

      {/* Main Snap-Scrolling Website Container */}
      <div className="h-full w-full overflow-x-hidden overflow-y-scroll snap-y snap-mandatory select-none scroll-smooth no-scrollbar">
        {/* Section 1: Age Counter & Memory Burn Reveal + Spotify Player */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <iframe
            src="/birthday.html"
            title="Birthday Reveal"
            className="w-full h-full border-none block"
            allow="autoplay"
          />
        </section>

        {/* Section 2: Curved Memory Path Carousel */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <HeroSection />
        </section>

        {/* Section 3: Floating Flutter Butterflies & Draggable Polaroid Scrapbook */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <PolaroidCards />
          <ExpandableNotes />
        </section>

        {/* Section 4: 3D Interactive Scrapbook Flipbook */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <BookFlip />
        </section>

        {/* Section 5: 3D Celestial Photo Cloud Sphere */}
        <section className="h-screen w-full snap-start snap-always shrink-0 overflow-visible relative z-10">
          <ThreeSphereScene />
        </section>
      </div>
    </div>
  );
}
