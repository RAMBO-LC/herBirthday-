import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './marquee.css';

export default function MarqueeCountdown({
  targetDate = "2026-08-10T18:30:00.000Z",
  showPreviewButton = true,
  marqueeText = "SAVE THE DATE · AUGUST 11 ·",
  marqueeTitle = "NOW SHOWING",
  marqueeSub = "a Pipi production, live August 11th",
  doorsText = "doors open at midnight, IST",
  onUnlock,
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const rootRef = useRef(null);
  const bgLayersRef = useRef(null);
  const flickerRef = useRef(null);
  const curtainLRef = useRef(null);
  const curtainRRef = useRef(null);
  const contentRef = useRef(null);
  const topBulbRailRef = useRef(null);
  const bottomBulbRailRef = useRef(null);

  const daysRef = useRef(null);
  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);

  const digitInitialized = useRef({ days: false, hours: false, minutes: false, seconds: false });
  const hasUnlocked = useRef(false);
  const reducedMotion = useRef(false);
  const timerInterval = useRef(null);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsRendered(true);
  }, []);

  // Lock body scroll while locked
  useEffect(() => {
    if (unlocked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [unlocked]);

  // Generate 22 bulb dots for top and bottom rails
  useEffect(() => {
    if (unlocked || !isRendered) return;
    const populate = (el, count) => {
      if (!el) return;
      el.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'bulb-dot';
        el.appendChild(dot);
      }
    };
    populate(topBulbRailRef.current, 22);
    populate(bottomBulbRailRef.current, 22);
  }, [unlocked, isRendered]);

  // Animate bulb dots and flicker
  useEffect(() => {
    if (unlocked || !isRendered || reducedMotion.current) return;
    const dots = rootRef.current?.querySelectorAll('.bulb-dot');
    const bulbTween = dots
      ? gsap.to(dots, {
          opacity: 1,
          scale: 1.5,
          duration: 0.5,
          ease: 'power1.inOut',
          stagger: { each: 0.045, repeat: -1, yoyo: true },
        })
      : null;

    let stopped = false;
    const flickerLoop = () => {
      if (stopped || !flickerRef.current) return;
      gsap.to(flickerRef.current, {
        opacity: () => 0.045 * Math.random(),
        duration: () => 0.06 + 0.18 * Math.random(),
        ease: 'power1.inOut',
        onComplete: flickerLoop,
      });
    };
    flickerLoop();

    return () => {
      stopped = true;
      bulbTween?.kill();
      if (flickerRef.current) gsap.killTweensOf(flickerRef.current);
    };
  }, [unlocked, isRendered]);

  // Build odometer columns
  const buildOdometer = useCallback((container, digits) => {
    container.innerHTML = '';
    for (let d of digits) {
      const col = document.createElement('span');
      col.className = 'od-col';
      const strip = document.createElement('span');
      strip.className = 'od-strip';
      for (let i = 0; i < 10; i++) {
        const digit = document.createElement('span');
        digit.className = 'od-digit';
        digit.textContent = String(i);
        strip.appendChild(digit);
      }
      col.appendChild(strip);
      container.appendChild(col);
    }
  }, []);

  // Update odometer digits with GSAP roll
  const rollOdometer = useCallback((container, digits, animate) => {
    [...container.children].forEach((col, idx) => {
      const h = col.getBoundingClientRect().height || 36;
      const strip = col.querySelector('.od-strip');
      if (strip) {
        if (animate && !reducedMotion.current) {
          gsap.to(strip, { y: -digits[idx] * h, duration: 0.5, ease: 'power3.out' });
        } else {
          gsap.set(strip, { y: -digits[idx] * h });
        }
      }
    });
  }, []);

  const updateSegment = useCallback(
    (el, key, valStr) => {
      if (!el) return;
      const digits = valStr.split('').map(Number);
      if (!digitInitialized.current[key]) {
        buildOdometer(el, digits);
        digitInitialized.current[key] = true;
        requestAnimationFrame(() => rollOdometer(el, digits, false));
        return;
      }
      rollOdometer(el, digits, true);
    },
    [buildOdometer, rollOdometer]
  );

  // Unlock sequence: curtains open, elements fade, main view becomes active
  const triggerUnlock = useCallback(() => {
    if (hasUnlocked.current) return;
    hasUnlocked.current = true;
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }

    gsap.killTweensOf(rootRef.current?.querySelectorAll('.bulb-dot') ?? []);
    if (flickerRef.current) gsap.killTweensOf(flickerRef.current);

    const finish = () => {
      setUnlocked(true);
      if (onUnlock) onUnlock();
    };

    const curtainL = curtainLRef.current;
    const curtainR = curtainRRef.current;

    if (!reducedMotion.current && curtainL && curtainR) {
      gsap
        .timeline({ onComplete: finish })
        .to(contentRef.current, { opacity: 0, y: -10, duration: 0.35, ease: 'power2.inOut' })
        .addLabel('open', '+=0.05')
        .to(curtainL, { xPercent: -100, duration: 1, ease: 'power3.inOut', force3D: true }, 'open')
        .to(curtainR, { xPercent: 100, duration: 1, ease: 'power3.inOut', force3D: true }, 'open')
        .to(bgLayersRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 'open')
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    } else {
      finish();
    }
  }, [onUnlock]);

  // Tick countdown timer
  useEffect(() => {
    if (unlocked) return;

    const calcTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        total: diff,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    const tick = () => {
      const t = calcTime();
      updateSegment(daysRef.current, 'days', String(Math.min(t.days, 99)).padStart(2, '0'));
      updateSegment(hoursRef.current, 'hours', String(t.hours).padStart(2, '0'));
      updateSegment(minutesRef.current, 'minutes', String(t.minutes).padStart(2, '0'));
      updateSegment(secondsRef.current, 'seconds', String(t.seconds).padStart(2, '0'));

      if (t.total <= 0) {
        triggerUnlock();
      }
    };

    tick();
    timerInterval.current = setInterval(tick, 1000);
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [unlocked, targetDate, updateSegment, triggerUnlock]);

  if (unlocked) return null;

  return (
    <div className="showtime-root" ref={rootRef}>
      <div ref={bgLayersRef}>
        <div className="rail left" />
        <div className="rail right" />
        <div className="flicker" ref={flickerRef} />
        <div className="vignette" />
        <div className="spotlight" />
        <div className="grain" />
      </div>

      {showPreviewButton && (
        <button type="button" className="preview-btn" onClick={triggerUnlock}>
          Preview Pass ✦
        </button>
      )}

      <div className="lock">
        <div className="curtain-l" ref={curtainLRef} />
        <div className="curtain-r" ref={curtainRRef} />

        <div className="screen">
          <span className="corner corner-tl" aria-hidden="true">✦</span>
          <span className="corner corner-tr" aria-hidden="true">✦</span>
          <span className="corner corner-bl" aria-hidden="true">✦</span>
          <span className="corner corner-br" aria-hidden="true">✦</span>

          <div className="lock-content" ref={contentRef}>
            <div className="bulb-rail top" ref={topBulbRailRef} />

            <div className="ticker">
              <div className="ticker-track">
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
              </div>
            </div>

            <div className="bulb-rail bottom" ref={bottomBulbRailRef} />

            <h1 className="marquee-title">
              <span className="marquee-title-star" aria-hidden="true">✦</span>
              {marqueeTitle}
              <span className="marquee-title-star" aria-hidden="true">✦</span>
            </h1>

            <p className="marquee-sub">{marqueeSub}</p>

            <div className="hero-days">
              <div className="od-number" ref={daysRef} />
              <div className="hero-caption">days to curtain</div>
            </div>

            <div className="rest-row">
              <div className="bulb-tile">
                <div className="od-number" ref={hoursRef} />
                <span className="bulb-label">hrs</span>
              </div>
              <div className="bulb-tile">
                <div className="od-number" ref={minutesRef} />
                <span className="bulb-label">min</span>
              </div>
              <div className="bulb-tile">
                <div className="od-number" ref={secondsRef} />
                <span className="bulb-label">sec</span>
              </div>
            </div>

            <div className="perforation" aria-hidden="true" />
            <p className="lock-foot">{doorsText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
