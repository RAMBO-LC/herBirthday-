import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import { Download, Heart, X } from 'lucide-react';
import * as THREE from 'three';

const CARDS = [
  { id: "2", imageUrl: "/ref/girl.jpg", alt: "Baddie", title: "Baddie" },
  { id: "3", imageUrl: "/ref/girl2.jpg", alt: "Angel", title: "Angel" },
  { id: "4", imageUrl: "/ref/girl3.jpg", alt: "Dreamgirl", title: "Dreamgirl" },
  { id: "5", imageUrl: "/ref/girl4.jpg", alt: "Sweetheart", title: "Sweetheart" },
  { id: "6", imageUrl: "/ref/girl5.jpg", alt: "Icon", title: "Icon" },
  { id: "7", imageUrl: "/ref/girl6.jpg", alt: "Stunner", title: "Stunner" },
  { id: "8", imageUrl: "/ref/girl7.jpg", alt: "Babe", title: "Babe" },
  { id: "9", imageUrl: "/ref/girl8.jpg", alt: "Darling", title: "Darling" },
  { id: "10", imageUrl: "/ref/girl9.jpg", alt: "Sunshine", title: "Sunshine" },
  { id: "11", imageUrl: "/ref/girl10.jpg", alt: "Queen", title: "Queen" },
  { id: "12", imageUrl: "/ref/girl11.jpg", alt: "Heartbreaker", title: "Heartbreaker" }
];

// Starfield background
function Starfield() {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const coords = new Float32Array(15000);
    for (let i = 0; i < 5000; i++) {
      coords[3 * i] = (Math.random() - 0.5) * 1200;
      coords[3 * i + 1] = (Math.random() - 0.5) * 1200;
      coords[3 * i + 2] = (Math.random() - 0.5) * 1200;
    }
    return coords;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
      pointsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={1.2} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function Card3D({ card, position, onSelect }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Html
        transform
        distanceFactor={12}
        position={[0, 0, 0.01]}
        style={{
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          cursor: "pointer",
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(card);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-36 h-48 rounded-xl overflow-hidden shadow-2xl bg-[#1F2121] p-2.5 select-none"
          style={{
            boxShadow: hovered
              ? "0 25px 50px rgba(49, 184, 198, 0.5), 0 0 30px rgba(49, 184, 198, 0.3)"
              : "0 15px 30px rgba(0, 0, 0, 0.6)",
            border: hovered ? "2px solid rgba(49, 184, 198, 0.6)" : "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.alt}
            className="w-full h-36 object-cover rounded-lg pointer-events-none"
            loading="lazy"
            draggable={false}
          />
          <div className="mt-1.5 text-center">
            <p className="text-white text-xs font-semibold tracking-wide truncate">{card.title}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function CardSphere({ cards, onSelect }) {
  // Fibonacci spiral sphere distribution
  const positions = useMemo(() => {
    const pts = [];
    const count = cards.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const sphereRadius = 13 + (i % 3) * 3.5;

      pts.push({
        x: x * sphereRadius,
        y: y * sphereRadius,
        z: z * sphereRadius,
      });
    }
    return pts;
  }, [cards]);

  return (
    <>
      {/* Concentric glowing wireframe spheres */}
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} wireframe />
      </Sphere>
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.06} wireframe />
      </Sphere>
      <Sphere args={[16, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.03} wireframe />
      </Sphere>
      <Sphere args={[20, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.02} wireframe />
      </Sphere>

      {cards.map((card, idx) => (
        <Card3D
          key={card.id}
          card={card}
          position={positions[idx]}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function CardModal({ card, onClose }) {
  const [liked, setLiked] = useState(false);
  const cardRef = useRef(null);

  if (!card) return null;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${(y - centerY) / 15}deg) rotateY(${(centerX - x) / 15}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out";
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div style={{ perspective: "1000px" }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-[20px] bg-[#1F2121] p-5 shadow-2xl border border-white/10 transition-transform duration-200"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
            }}
          >
            <div className="relative w-full mb-4 aspect-[3/4] overflow-hidden rounded-[16px] bg-black">
              <img
                src={card.imageUrl}
                alt={card.alt}
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-white text-xl font-bold mb-4 text-center tracking-wide">
              {card.title}
            </h3>

            <div className="flex gap-2">
              <a
                href={card.imageUrl}
                download
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold text-black bg-[#31b8c6] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-black bg-[#31b8c6] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThreeSphereScene() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 16], fov: 60 }}
        className="absolute inset-0 z-10"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <Starfield />
          <CardSphere cards={CARDS} onSelect={setSelectedCard} />
          <OrbitControls
            enablePan={true}
            enableZoom={false}
            enableRotate={true}
            minDistance={5}
            maxDistance={40}
            rotateSpeed={0.5}
            panSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 font-mono text-xs uppercase tracking-widest text-cyan-400/80 pointer-events-none">
        ✦ Drag to explore memory galaxy · Click photo to inspect ✦
      </div>

      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </section>
  );
}
