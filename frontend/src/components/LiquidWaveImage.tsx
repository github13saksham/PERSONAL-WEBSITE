import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  image1: string;
  image2: string;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uDisp;
uniform float uTime;
uniform vec2 uAspects; // x: plane layout aspect (w/h), y: image aspect (w/h)
uniform vec2 uMouse;

// Function to map UVs for 'object-contain' behavior
vec2 containUv(vec2 uv, float planeAspect, float imageAspect) {
   vec2 newUv = uv;
   if (planeAspect > imageAspect) {
      float scale = imageAspect / planeAspect;
      newUv.x = (uv.x - 0.5) / scale + 0.5;
   } else {
      float scale = planeAspect / imageAspect;
      newUv.y = (uv.y - 0.5) / scale + 0.5;
   }
   return newUv;
}

void main() {
  float trailIntensity = texture2D(uDisp, vec2(vUv.x, 1.0 - vUv.y)).r;

  // Add raw mouse hover blob just perfectly guaranteeing tracking
  float distToMouse = distance(vec2(vUv.x, 1.0 - vUv.y), uMouse);
  float rawMouseGlow = smoothstep(0.12, 0.0, distToMouse);
  
  float intensity = max(trailIntensity, rawMouseGlow);

  vec2 baseUv = containUv(vUv, uAspects.x, uAspects.y);
  
  if (baseUv.x < 0.0 || baseUv.x > 1.0 || baseUv.y < 0.0 || baseUv.y > 1.0) {
     gl_FragColor = vec4(0.0);
     return;
  }

  vec2 texel = vec2(1.0 / 512.0);
  float dx = texture2D(uDisp, vec2(vUv.x + texel.x, 1.0 - vUv.y)).r - texture2D(uDisp, vec2(vUv.x - texel.x, 1.0 - vUv.y)).r;
  float dy = texture2D(uDisp, vec2(vUv.x, 1.0 - vUv.y + texel.y)).r - texture2D(uDisp, vec2(vUv.x, 1.0 - vUv.y - texel.y)).r;
  
  vec2 normal = vec2(dx, dy);

  // Distort UV coordinates using the normal (adding water/glass refraction)
  float distortionStrength = 0.5;
  vec2 distortedUv1 = baseUv + normal * distortionStrength;
  vec2 distortedUv2 = baseUv - normal * distortionStrength * 1.2;

  vec4 col1 = texture2D(uTex1, distortedUv1);
  vec4 col2 = texture2D(uTex2, distortedUv2);

  float mixFactor = smoothstep(0.1, 0.4, intensity);

  gl_FragColor = mix(col1, col2, mixFactor);
}
`;

// Types for trail dots
type TrailItem = { x: number; y: number; age: number; force: number };

export const LiquidHoverImage: React.FC<Props> = ({ image1, image2, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    let w = container.offsetWidth;
    let h = container.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const brushSize = 512;
    const brushCanvas = document.createElement('canvas');
    brushCanvas.width = brushSize;
    brushCanvas.height = brushSize;
    const ctx = brushCanvas.getContext('2d')!;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, brushSize, brushSize);
    
    const brushTexture = new THREE.CanvasTexture(brushCanvas);
    brushTexture.minFilter = THREE.LinearFilter;
    brushTexture.magFilter = THREE.LinearFilter;

    const textureLoader = new THREE.TextureLoader();
    
    const uniforms = {
      uTex1: { value: null as THREE.Texture | null },
      uTex2: { value: null as THREE.Texture | null },
      uDisp: { value: brushTexture },
      uTime: { value: 0 },
      uAspects: { value: new THREE.Vector2(w / h, 1.0) }, // [planeAspect, imageAspect]
      uMouse: { value: new THREE.Vector2(0.5, 0.5) } 
    };
    
    textureLoader.load(image1, (tex1: THREE.Texture) => {
        uniforms.uTex1.value = tex1;
        const img = tex1.image as HTMLImageElement;
        uniforms.uAspects.value.y = img.width / img.height;
    });
    textureLoader.load(image2, (tex2: THREE.Texture) => {
        uniforms.uTex2.value = tex2;
    });

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    let trail: TrailItem[] = [];
    const maxAge = 60; 
    const radius = 60; 
    
    let mx = -100;
    let my = -100;
    let targetMx = -100;
    let targetMy = -100;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / w;
      const ny = (e.clientY - rect.top) / h;
      targetMx = nx * brushSize;
      targetMy = ny * brushSize;
      uniforms.uMouse.value.set(nx, ny);
    };
    
    const onTouchMove = (e: TouchEvent) => {
        if(e.touches.length > 0) {
            const rect = container.getBoundingClientRect();
            const nx = (e.touches[0].clientX - rect.left) / w;
            const ny = (e.touches[0].clientY - rect.top) / h;
            targetMx = nx * brushSize;
            targetMy = ny * brushSize;
            uniforms.uMouse.value.set(nx, ny);
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    
    const onMouseLeave = () => {
        targetMx = mx; targetMy = my; 
        uniforms.uMouse.value.set(-10, -10);
    }
    window.addEventListener('mouseleave', onMouseLeave);

    let animationId: number;
    let clock = new THREE.Clock();

    const drawBrushCanvas = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
      ctx.fillRect(0, 0, brushSize, brushSize);

      const dist = Math.hypot(targetMx - mx, targetMy - my);
      if (dist > 0.01) {
        mx += (targetMx - mx) * 0.15;
        my += (targetMy - my) * 0.15;
        trail.push({ x: mx, y: my, age: 0, force: dist });
      }

      ctx.globalCompositeOperation = 'source-over'; // Changed from lighten
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        point.age += 1;
        
        if (point.age < maxAge) {
          const intensity = 1.0 - (point.age / maxAge);
          const r = radius * (1.0 + point.force * 0.02) * intensity;
          
          if(r > 0){
              const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, r);
              gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
          }
        }
      }

      trail = trail.filter((p) => p.age < maxAge);
      brushTexture.needsUpdate = true;
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      drawBrushCanvas();
      
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler via Observer to catch initial DOM layout shifts perfectly
    const onResize = () => {
      w = container.offsetWidth;
      h = container.offsetHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        uniforms.uAspects.value.x = w / h; // Update plane aspect
      }
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      brushTexture.dispose();
      if(container.contains(renderer.domElement)){
          container.removeChild(renderer.domElement);
      }
    };
  }, [image1, image2]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ ...style, width: '100%', height: '100%', padding: 0, margin: 0, display: 'block' }} 
    />
  );
};

export default LiquidHoverImage;
