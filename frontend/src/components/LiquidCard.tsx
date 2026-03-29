import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const LiquidCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse absolute position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 1. Main cursor blob (Fast tracking)
  const springConfigFast = { damping: 20, stiffness: 300, mass: 0.5 };
  const cxFast = useSpring(mouseX, springConfigFast);
  const cyFast = useSpring(mouseY, springConfigFast);

  // 2. Trailing blob (Slow tracking)
  // This trails behind and fuses with the fast blob via Gooey filter,
  // naturally creating velocity-based stretching and liquid deformation!
  const springConfigSlow = { damping: 30, stiffness: 100, mass: 1.5 };
  const cxSlow = useSpring(mouseX, springConfigSlow);
  const cySlow = useSpring(mouseY, springConfigSlow);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Ensure initial render doesn't show blobs at top-left
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const hw = rect.width / 2;
      const hh = rect.height / 2;
      mouseX.set(hw);
      mouseY.set(hh);
    }
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden bg-zinc-900 flex items-center justify-center cursor-none group"
    >
      {/* 1. Underlying Base Content (Text) */}
      <div className="z-0 p-12 text-center pointer-events-none select-none">
        <h2 className="text-6xl md:text-8xl font-black text-white/10 tracking-tighter uppercase transition-colors duration-500 group-hover:text-white/20">
          HOVER ME
        </h2>
        <p className="text-zinc-500 mt-4 text-xl md:text-2xl font-light">
          Liquid blob cursor mask reveal
        </p>
      </div>

      {/* 2. Hidden SVG Filter & Mask Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          {/* Gooey Filter: Blur + High Contrast ColorMatrix */}
          <filter id="liquidBlobFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 40 -20"
              result="goo"
            />
            {/* Soften the edges a bit so mask is anti-aliased */}
            <feGaussianBlur in="goo" stdDeviation="2" result="softGoo" />
          </filter>

          <mask id="liquidBlobMask">
            {/* Groups the circles and applies gooey merging, white == visible */}
            <motion.g filter="url(#liquidBlobFilter)" fill="white">
              {/* Main Blob */}
              <motion.circle cx={cxFast} cy={cyFast} r="100" />
              {/* Trailing stretch blob */}
              <motion.circle cx={cxSlow} cy={cySlow} r="70" />
            </motion.g>
          </mask>
        </defs>
      </svg>

      {/* 3. Revealed Image Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          // Apply the SVG Mask
          mask: 'url(#liquidBlobMask)',
          WebkitMask: 'url(#liquidBlobMask)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Revealed Canvas"
          className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
        
        {/* Subtle overlay over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent mix-blend-overlay" />

        {/* Dynamic content revealed inside the blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase drop-shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 ease-out">
            SURPRISE
          </h2>
        </div>
      </motion.div>
    </div>
  );
};

export default LiquidCard;
