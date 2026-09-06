import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';

// ============ CONFIG ============
const LINES = [
  'Hey...',
  "I know it's just a screen...",
  'But close your eyes for a second...',
  'Think about the first time we talked...',
  'Now open them.',
  'Because today is about you.',
  'And this is how many reasons\nI have to celebrate you...',
];

const TARGET_NUMBER = 25;
const NUMBER_LABEL = 'reasons to love you';

// ============ PARTICLES ============
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; decay: number }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawnParticle() {
      particles.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        decay: Math.random() * 0.002 + 0.001,
      });
    }

    // Seed some initial particles
    for (let i = 0; i < 40; i++) spawnParticle();

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Spawn new particles slowly
      if (Math.random() < 0.15) spawnParticle();

      particles = particles.filter((p) => p.alpha > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

// ============ APP ============
export default function App() {
  const [currentLine, setCurrentLine] = useState(-1);
  const [textClass, setTextClass] = useState('');
  const [scene, setScene] = useState<'text' | 'number'>('text');
  const [showHint, setShowHint] = useState(true);
  const [numberLanded, setNumberLanded] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);

  const isAnimating = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tensRef = useRef<HTMLDivElement>(null);
  const onesRef = useRef<HTMLDivElement>(null);

  useParticles(canvasRef);

  // ---- Number scroll logic ----
  const scrollToNumber = useCallback(() => {
    const tens = Math.floor(TARGET_NUMBER / 10);
    const ones = TARGET_NUMBER % 10;

    const tensEl = tensRef.current;
    const onesEl = onesRef.current;
    if (!tensEl || !onesEl) return;

    const digitHeight = tensEl.querySelector('span')?.offsetHeight ?? 160;

    // Tens scrolls UP (0 → target digit)
    tensEl.style.transform = `translateY(-${tens * digitHeight}px)`;

    // Ones scrolls DOWN (strip is 9,8,7…0 → index = 9 - ones)
    const onesIndex = 9 - ones;
    setTimeout(() => {
      onesEl.style.transform = `translateY(-${onesIndex * digitHeight}px)`;
    }, 300);

    // Glow + label after landing
    setTimeout(() => {
      setNumberLanded(true);
      setLabelVisible(true);
    }, 2800);
  }, []);

  const transitionToNumber = useCallback(() => {
    isAnimating.current = true;
    setScene('number');

    setTimeout(() => {
      scrollToNumber();
    }, 1000);
  }, [scrollToNumber]);

  // ---- Text advance logic ----
  const advance = useCallback(() => {
    if (isAnimating.current) return;

    const nextLine = currentLine + 1;

    if (nextLine >= LINES.length) {
      transitionToNumber();
      return;
    }

    isAnimating.current = true;
    setShowHint(false);

    // Fade out current
    setTextClass('fade-out');

    const delay = currentLine === -1 ? 100 : 500;

    setTimeout(() => {
      setCurrentLine(nextLine);
      setTextClass('');

      // Wait for DOM update, then fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTextClass('visible');
          isAnimating.current = false;
        });
      });
    }, delay);
  }, [currentLine, transitionToNumber]);

  // ---- Event listeners ----
  useEffect(() => {
    const readyTimeout = setTimeout(() => {
      // Auto-advance if user hasn't tapped after 2.5s
      const autoTimeout = setTimeout(() => {
        if (currentLine === -1) advance();
      }, 2000);

      const handleKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          advance();
        }
      };

      document.addEventListener('keydown', handleKey);

      return () => {
        clearTimeout(autoTimeout);
        document.removeEventListener('keydown', handleKey);
      };
    }, 500);

    return () => clearTimeout(readyTimeout);
  }, [advance]);

  const handleClick = () => {
    if (scene === 'text') advance();
  };

  // ---- Build digit strips ----
  const tensDigits = Array.from({ length: 10 }, (_, i) => i);
  const onesDigits = Array.from({ length: 10 }, (_, i) => 9 - i);

  return (
    <>
      {/* Ambient particles */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Scene 1: Story text */}
      <div
        id="scene-text"
        className={`scene ${scene === 'text' ? 'active' : ''}`}
        onClick={handleClick}
      >
        <p className={`story-text ${textClass}`}>
          {currentLine >= 0 ? LINES[currentLine] : ''}
        </p>
        <span className={`tap-hint ${!showHint ? 'hidden' : ''}`}>
          tap anywhere
        </span>
      </div>

      {/* Scene 2: Number scroll */}
      <div
        id="scene-number"
        className={`scene ${scene === 'number' ? 'active' : ''}`}
      >
        <div className="number-container">
          <div className="digit-wrapper">
            <div
              className={`digit-strip ${numberLanded ? 'landed' : ''}`}
              ref={tensRef}
            >
              {tensDigits.map((d) => (
                <span key={`t-${d}`}>{d}</span>
              ))}
            </div>
          </div>
          <div className="digit-wrapper">
            <div
              className={`digit-strip ${numberLanded ? 'landed' : ''}`}
              ref={onesRef}
              style={{ transitionDelay: '0.3s' }}
            >
              {onesDigits.map((d) => (
                <span key={`o-${d}`}>{d}</span>
              ))}
            </div>
          </div>
        </div>
        <p className={`number-label ${labelVisible ? 'visible' : ''}`}>
          {NUMBER_LABEL}
        </p>
      </div>
    </>
  );
}