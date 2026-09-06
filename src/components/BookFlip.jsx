import React, { useRef, useEffect } from 'react';
import { PageFlip } from 'page-flip';

export default function BookFlip() {
  const bookRef = useRef(null);

  useEffect(() => {
    if (!bookRef.current) return;

    let pageFlipInstance = null;
    try {
      pageFlipInstance = new PageFlip(bookRef.current, {
        width: 380,
        height: 500,
        size: "fixed",
        showCover: true,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        usePortrait: false,
        startPage: 0,
      });

      pageFlipInstance.loadFromHTML(bookRef.current.querySelectorAll('.book-page'));
    } catch (err) {
      console.warn("PageFlip init warning:", err);
    }

    return () => {
      if (pageFlipInstance) {
        try { pageFlipInstance.destroy(); } catch (_) {}
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-[#0d0d11] overflow-hidden select-none py-12">
      {/* Ambient background spotlight and vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,106,0.08)_0%,transparent_65%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

      {/* Book Container */}
      <div className="relative z-10 scale-[0.82] sm:scale-95 md:scale-100 transition-transform">
        <div ref={bookRef} className="shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-sm">
          {/* Cover */}
          <div className="book-page bg-[#181822] text-white" data-density="hard" style={{ width: 380, height: 500 }}>
            <img
              src="/pages/front.png"
              alt="Front Cover"
              className="h-full w-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Page 1 (Left) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/left.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/fwine.png" alt="Sticker" className="absolute top-8 left-6 w-28 -rotate-12 pointer-events-none" />
            <img src="/elements/side3.png" alt="Sticker" className="absolute top-20 left-12 w-44 pointer-events-none" />
            <img src="/elements/butter.png" alt="Sticker" className="absolute bottom-28 left-8 w-20 rotate-30 pointer-events-none" />
            <img src="/ref/girl.jpg" alt="Photo" className="absolute top-24 right-10 w-28 h-36 object-cover rotate-6 shadow-md border-2 border-white pointer-events-none" />
            <img src="/elements/frame10.png" alt="Frame" className="absolute top-20 right-6 w-36 pointer-events-none" />
            <img src="/elements/text1.png" alt="Note" className="absolute bottom-16 right-10 w-36 pointer-events-none" />
            <img src="/elements/mouse.png" alt="Sticker" className="absolute bottom-6 right-20 w-24 pointer-events-none z-20" />
          </div>

          {/* Page 2 (Right) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/right.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/paper.png" alt="Paper" className="absolute bottom-10 right-6 w-32 rotate-12 pointer-events-none" />
            <img src="/elements/starB.png" alt="Star" className="absolute top-8 left-10 w-16 -rotate-45 pointer-events-none" />
            <img src="/ref/girl2.jpg" alt="Photo" className="absolute top-12 left-16 w-24 h-32 object-cover rotate-12 shadow-md border-2 border-white pointer-events-none" />
            <img src="/ref/girl3.jpg" alt="Photo" className="absolute bottom-24 left-10 w-24 h-32 object-cover -rotate-6 shadow-md border-2 border-white pointer-events-none" />
            <img src="/elements/frame9.png" alt="Frame" className="absolute top-8 left-12 w-32 pointer-events-none" />
            <img src="/elements/text2.png" alt="Note" className="absolute top-10 right-12 w-32 pointer-events-none" />
            <img src="/elements/kit.png" alt="Kit" className="absolute bottom-12 right-12 w-32 pointer-events-none" />
          </div>

          {/* Page 3 (Left) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/left.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/billa6.png" alt="Cat" className="absolute top-10 left-8 w-28 pointer-events-none" />
            <img src="/elements/side1.png" alt="Decor" className="absolute bottom-10 left-6 w-32 rotate-180 pointer-events-none" />
            <img src="/elements/starem.png" alt="Star" className="absolute top-6 right-16 w-10 pointer-events-none" />
            <img src="/ref/girl4.jpg" alt="Photo" className="absolute top-20 right-10 w-28 h-36 object-cover rotate-12 shadow-md border-2 border-white pointer-events-none" />
            <img src="/elements/frame11.png" alt="Frame" className="absolute top-16 right-6 w-36 pointer-events-none" />
            <img src="/elements/moon.png" alt="Moon" className="absolute bottom-16 left-12 w-20 pointer-events-none" />
            <img src="/elements/fits.png" alt="Fits" className="absolute top-36 left-8 w-24 pointer-events-none" />
            <img src="/elements/note1.png" alt="Note" className="absolute bottom-12 right-8 w-32 -rotate-6 pointer-events-none" />
            <img src="/elements/lovetape.png" alt="Tape" className="absolute bottom-28 right-16 w-16 pointer-events-none" />
          </div>

          {/* Page 4 (Right) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/right.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/side2.png" alt="Decor" className="absolute bottom-12 right-10 w-36 pointer-events-none" />
            <img src="/elements/billa.png" alt="Cat" className="absolute top-12 left-10 w-24 pointer-events-none" />
            <img src="/elements/boqey.png" alt="Bouquet" className="absolute bottom-14 left-8 w-28 pointer-events-none" />
            <img src="/ref/girl5.jpg" alt="Photo" className="absolute top-16 right-12 w-28 h-36 object-cover shadow-md border-2 border-white pointer-events-none" />
            <img src="/frames/frame5.png" alt="Frame" className="absolute top-12 right-8 w-36 pointer-events-none" />
            <img src="/elements/miss.png" alt="Sticker" className="absolute bottom-32 right-6 w-24 rotate-12 pointer-events-none" />
          </div>

          {/* Page 5 (Left) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/left.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/side4.png" alt="Decor" className="absolute bottom-12 left-6 w-36 pointer-events-none" />
            <img src="/elements/disk.png" alt="Vinyl" className="absolute top-10 left-6 w-24 pointer-events-none" />
            <img src="/elements/billa5.png" alt="Cat" className="absolute bottom-14 right-10 w-32 pointer-events-none" />
            <img src="/ref/girl6.jpg" alt="Photo" className="absolute top-20 right-12 w-26 h-34 object-cover -rotate-6 shadow-md border-2 border-white pointer-events-none" />
            <img src="/ref/girl10.jpg" alt="Photo" className="absolute top-36 left-16 w-24 h-32 object-cover rotate-6 shadow-md border-2 border-white pointer-events-none" />
            <img src="/elements/frame8.png" alt="Frame" className="absolute top-16 right-8 w-34 pointer-events-none" />
            <img src="/elements/twoStar.png" alt="Stars" className="absolute bottom-28 left-12 w-16 pointer-events-none" />
            <img src="/elements/text3.png" alt="Note" className="absolute top-8 right-12 w-28 pointer-events-none" />
          </div>

          {/* Page 6 (Right) */}
          <div className="book-page relative bg-[#faf7f2] overflow-hidden" style={{ width: 380, height: 500 }}>
            <img src="/pages/right.jpg" alt="Background" className="absolute inset-0 h-full w-full object-cover" />
            <img src="/elements/side5.png" alt="Decor" className="absolute bottom-12 right-8 w-40 pointer-events-none" />
            <img src="/elements/text4.png" alt="Note" className="absolute top-10 left-10 w-32 pointer-events-none" />
            <img src="/ref/girl9.jpg" alt="Photo" className="absolute top-20 left-12 w-26 h-34 object-cover -rotate-4 shadow-md border-2 border-white pointer-events-none" />
            <img src="/ref/girl8.jpg" alt="Photo" className="absolute bottom-20 left-16 w-26 h-34 object-cover rotate-8 shadow-md border-2 border-white pointer-events-none" />
            <img src="/elements/frame7.png" alt="Frame" className="absolute top-16 left-8 w-34 pointer-events-none" />
            <img src="/elements/billa4.png" alt="Cat" className="absolute bottom-8 left-10 w-28 pointer-events-none" />
          </div>

          {/* Back Cover */}
          <div className="book-page bg-[#181822] text-white" data-density="hard" style={{ width: 380, height: 500 }}>
            <img
              src="/pages/back.png"
              alt="Back Cover"
              className="h-full w-full object-cover pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-stone-500 pointer-events-none">
        ← Click or Drag corners to turn pages →
      </div>
    </section>
  );
}
