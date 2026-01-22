import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Floating geometric shape with mouse interaction
function FloatingShape({ 
  position, 
  shape, 
  color, 
  speed = 1,
  distort = 0.3,
  scale = 1
}: { 
  position: [number, number, number]; 
  shape: 'sphere' | 'box' | 'torus' | 'icosahedron';
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
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
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <ShapeComponent ref={meshRef} args={args as any} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </ShapeComponent>
    </Float>
  );
}

// Particle field for depth
function ParticleField({ count = 200 }) {
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
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
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
        size={0.03}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Animated ring
function AnimatedRing({ radius = 3, color = "#8b5cf6" }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

// Glowing core
function GlowingCore() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={coreRef} position={[0, 0, -3]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshWobbleMaterial
        color="#8b5cf6"
        factor={0.3}
        speed={2}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[10, -10, 5]} intensity={0.5} color="#06b6d4" />

        {/* Floating geometric shapes */}
        <FloatingShape position={[-3.5, 1.5, -1]} shape="icosahedron" color="#8b5cf6" speed={0.8} scale={0.6} distort={0.4} />
        <FloatingShape position={[3.5, -1, 0]} shape="sphere" color="#06b6d4" speed={1.2} scale={0.5} distort={0.5} />
        <FloatingShape position={[-2, -2, 1]} shape="torus" color="#d946ef" speed={0.6} scale={0.4} distort={0.2} />
        <FloatingShape position={[2.5, 2, -2]} shape="box" color="#8b5cf6" speed={1} scale={0.4} distort={0.3} />
        <FloatingShape position={[0, -2.5, -1]} shape="icosahedron" color="#06b6d4" speed={0.9} scale={0.35} distort={0.4} />
        <FloatingShape position={[-4, 0, -2]} shape="sphere" color="#d946ef" speed={0.7} scale={0.3} distort={0.6} />
        <FloatingShape position={[4, 1, -1]} shape="torus" color="#8b5cf6" speed={1.1} scale={0.35} distort={0.2} />

        {/* Ambient elements */}
        <ParticleField count={300} />
        <AnimatedRing radius={4} color="#8b5cf6" />
        <AnimatedRing radius={3.2} color="#06b6d4" />
        <GlowingCore />
      </Canvas>
    </div>
  );
}

export default Hero3DScene;
