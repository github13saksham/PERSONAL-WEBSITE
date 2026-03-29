import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DownloadIcon, ArrowRightIcon, GithubIcon, LinkedinIcon } from 'lucide-react';
import { LiquidHoverImage } from '../components/LiquidWaveImage';

/**
 * Canvas-based background removal to strip white/light-grey backgrounds and halos.
 * High threshold used to protect subject highlights (face).
 */
function useWhiteBgRemoved(src: string, threshold = 250) {
  const [dataUrl, setDataUrl] = useState<string>('');
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const avg = (r + g + b) / 3;
        
        // Remove pixels that are very bright (background)
        if (avg > threshold) {
          d[i + 3] = 0;
        } else if (avg > threshold - 20) {
          // Feathering: Smoothly transition fringe pixels to transparency
          // to remove the "white outline" without eating the face.
          const factor = (threshold - avg) / 20;
          d[i + 3] = Math.min(255, Math.max(0, d[i + 3] * Math.pow(factor, 3)));
          // Darken edges slightly to blend into the dark theme
          d[i] *= factor; d[i+1] *= factor; d[i+2] *= factor;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
  }, [src, threshold]);
  return dataUrl;
}

const Hero = () => {
  const imgBoxRef = useRef<HTMLDivElement>(null);

  const portrait = useWhiteBgRemoved('/image2.jpg', 248);
  const helmet   = useWhiteBgRemoved('/image1.jpg', 248);

  return (
    <section
      className="relative w-full bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-end"
      id="hero"
      style={{ height: '100vh' }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-primary-dark/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Behind-image glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-primary-main/15 blur-[130px] rounded-[100%] pointer-events-none z-0" />

      {/* 1. BACKGROUND TEXT LAYER - "FULL STACK DEV" (z-0) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0 pb-[10vh]">
        <div className="w-full flex justify-center px-12">
          <motion.span 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[12vw] lg:text-[10vw] font-black tracking-tighter text-white uppercase leading-none text-center max-w-[90vw] overflow-hidden"
          >
            FULL STACK DEV
          </motion.span>
        </div>
      </div>

      {/* 2. FOREGROUND NAME LAYER — Positioned on sides of subject (z-50) */}
      <div className="absolute inset-x-0 top-[40%] md:top-[35%] -translate-y-1/2 flex justify-between items-center px-[2vw] md:px-[33vw] pointer-events-none select-none z-50">
        <motion.h1 
          initial={{ opacity: 0, x: -60, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-2xl md:text-2xl lg:text-[2vw] font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          Saksham
        </motion.h1>
        <motion.h1 
          initial={{ opacity: 0, x: 100, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[2vw] font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          Makhija
        </motion.h1>
      </div>

      {/* 3. IMAGE CONTAINER (z-10) */}
      <div
        ref={imgBoxRef}
        className="relative z-10 flex items-end justify-center mt-auto pointer-events-auto group"
        style={{ height: '95vh', width: '60vw', maxWidth: '750px', minWidth: '320px', cursor: 'crosshair' }}
      >
        {/* WebGL High-End Awwwards Liquid Distortion Hover Reveal */}
        {portrait && helmet ? (
          <LiquidHoverImage 
            image1={portrait} 
            image2={helmet} 
            className="absolute inset-0 h-full w-full pointer-events-auto"
          />
        ) : (
          <div className="h-full w-48 bg-white/5 rounded-3xl animate-pulse" />
        )}
      </div>

      {/* 4. BOTTOM CONTENT AREA — Absolutely positioned to overlap image (z-20) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full pt-8 pb-8 flex" style={{ background: 'linear-gradient(to bottom, transparent 0%, #0A0A0A 60%)' }}>
        <div className="w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-end justify-between gap-12">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col">
              <span className="text-primary-light font-mono text-sm tracking-widest uppercase mb-1">Portfolio 2024</span>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                Saksham<br />Makhija
              </h1>
            </div>
            <div className="flex gap-4">
              <a href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}/`} target="_blank" rel="noreferrer" 
                 className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary-main hover:border-primary-main transition-all duration-300">
                <GithubIcon size={20} />
              </a>
              <a href="https://linkedin.com/in/saksham-makhija13/" target="_blank" rel="noreferrer" 
                 className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </motion.div>

          {/* Right info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start md:items-end gap-6 max-w-sm"
          >
            <p className="text-gray-400 text-lg leading-relaxed text-left md:text-right">
              Architecting high-performance digital experiences through modern Full Stack engineering and creative design.
            </p>
            <div className="flex gap-4">
              <a href="#projects" className="px-8 py-4 rounded-full bg-primary-main text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary-main/20">
                Explore Projects <ArrowRightIcon size={20} />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:scale-105 transition-all flex items-center gap-2">
                <DownloadIcon size={20} /> Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes brushWiggle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2px, -2px) rotate(0.5deg); }
          75% { transform: translate(-2px, 2px) rotate(-0.5deg); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
