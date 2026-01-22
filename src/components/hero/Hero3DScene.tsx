import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

// Hook to track scroll progress
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}

// Floating geometric shape with scroll interaction
function FloatingShape({ 
  position, 
  shape, 
  color, 
  speed = 1,
  distort = 0.3,
  scale = 1,
  scrollProgress = 0,
  scrollIntensity = 1
}: { 
  position: [number, number, number]; 
  shape: 'sphere' | 'box' | 'torus' | 'icosahedron';
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
  scrollProgress?: number;
  scrollIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(position);

  useFrame((state) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
      
      // Scroll-based transformations
      const scrollOffset = scrollProgress * scrollIntensity;
      
      // Move shapes outward and rotate more as user scrolls
      meshRef.current.position.x = initialPosition.current[0] * (1 + scrollOffset * 0.5);
      meshRef.current.position.y = initialPosition.current[1] - scrollOffset * 2;
      meshRef.current.position.z = initialPosition.current[2] - scrollOffset * 3;
      
      // Add extra rotation based on scroll
      meshRef.current.rotation.z = scrollProgress * Math.PI * 2 * scrollIntensity;
      
      // Scale down slightly as we scroll
      const scaleModifier = 1 - scrollProgress * 0.3;
      meshRef.current.scale.setScalar(scale * scaleModifier);
    }
  });

  const ShapeComponent = {
    sphere: Sphere,
    box: Box,
    torus: Torus,
    icosahedron: Icosahedron
  }[shape];

  const args = shape === 'torus' ? [0.8, 0.3, 16, 32] : shape === 'icosahedron' ? [1, 0] : [1, 32, 32];

  return (
    <Float speed={speed * 2} rotationIntensity={0.5 - scrollProgress * 0.3} floatIntensity={1 - scrollProgress * 0.5}>
      <ShapeComponent ref={meshRef} args={args as any} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort + scrollProgress * 0.2}
          speed={2 + scrollProgress * 3}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7 - scrollProgress * 0.3}
        />
      </ShapeComponent>
    </Float>
  );
}

// Particle field with scroll interaction
function ParticleField({ count = 200, scrollProgress = 0 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      // Base rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
      
      // Scroll-based explosion effect
      const explosionScale = 1 + scrollProgress * 2;
      pointsRef.current.scale.setScalar(explosionScale);
      
      // Fade out particles as we scroll
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 - scrollProgress * 0.4;
      
      // Increase rotation speed with scroll
      pointsRef.current.rotation.z = scrollProgress * Math.PI;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03 + scrollProgress * 0.02}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Animated ring with scroll interaction
function AnimatedRing({ radius = 3, color = "#8b5cf6", scrollProgress = 0, index = 0 }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      // Base animation
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      
      // Scroll-based expansion
      const expandedRadius = radius * (1 + scrollProgress * 0.5);
      ringRef.current.scale.setScalar(expandedRadius / radius);
      
      // Tilt based on scroll
      ringRef.current.rotation.y = scrollProgress * Math.PI * (index % 2 === 0 ? 1 : -1);
      
      // Fade out
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 - scrollProgress * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

// Glowing core with scroll interaction
function GlowingCore({ scrollProgress = 0 }) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      // Pulse effect
      const baseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Shrink and intensify with scroll
      const scrollScale = 1 - scrollProgress * 0.5;
      coreRef.current.scale.setScalar(baseScale * scrollScale);
      
      // Move backward with scroll
      coreRef.current.position.z = -3 - scrollProgress * 5;
      
      // Update material
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.4 + scrollProgress * 0.3;
      }
    }
  });

  return (
    <mesh ref={coreRef} position={[0, 0, -3]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshWobbleMaterial
        color="#8b5cf6"
        factor={0.3 + scrollProgress * 0.5}
        speed={2 + scrollProgress * 2}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// Camera controller for scroll-based movement
function CameraController({ scrollProgress = 0 }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Move camera based on scroll
    camera.position.z = 6 + scrollProgress * 2;
    camera.position.y = scrollProgress * -1;
    camera.lookAt(0, scrollProgress * -0.5, 0);
  });
  
  return null;
}

// Scene wrapper that handles scroll
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#06b6d4" />

      <CameraController scrollProgress={scrollProgress} />

      {/* Floating geometric shapes */}
      <FloatingShape position={[-3.5, 1.5, -1]} shape="icosahedron" color="#8b5cf6" speed={0.8} scale={0.6} distort={0.4} scrollProgress={scrollProgress} scrollIntensity={1.2} />
      <FloatingShape position={[3.5, -1, 0]} shape="sphere" color="#06b6d4" speed={1.2} scale={0.5} distort={0.5} scrollProgress={scrollProgress} scrollIntensity={0.8} />
      <FloatingShape position={[-2, -2, 1]} shape="torus" color="#d946ef" speed={0.6} scale={0.4} distort={0.2} scrollProgress={scrollProgress} scrollIntensity={1.5} />
      <FloatingShape position={[2.5, 2, -2]} shape="box" color="#8b5cf6" speed={1} scale={0.4} distort={0.3} scrollProgress={scrollProgress} scrollIntensity={1.0} />
      <FloatingShape position={[0, -2.5, -1]} shape="icosahedron" color="#06b6d4" speed={0.9} scale={0.35} distort={0.4} scrollProgress={scrollProgress} scrollIntensity={1.3} />
      <FloatingShape position={[-4, 0, -2]} shape="sphere" color="#d946ef" speed={0.7} scale={0.3} distort={0.6} scrollProgress={scrollProgress} scrollIntensity={0.9} />
      <FloatingShape position={[4, 1, -1]} shape="torus" color="#8b5cf6" speed={1.1} scale={0.35} distort={0.2} scrollProgress={scrollProgress} scrollIntensity={1.1} />

      {/* Ambient elements */}
      <ParticleField count={300} scrollProgress={scrollProgress} />
      <AnimatedRing radius={4} color="#8b5cf6" scrollProgress={scrollProgress} index={0} />
      <AnimatedRing radius={3.2} color="#06b6d4" scrollProgress={scrollProgress} index={1} />
      <GlowingCore scrollProgress={scrollProgress} />
    </>
  );
}

export function Hero3DScene() {
  const scrollProgress = useScrollProgress();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

export default Hero3DScene;
