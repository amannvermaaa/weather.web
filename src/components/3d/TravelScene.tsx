'use client';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// Global scroll state to avoid React re-renders on every scroll tick
const scrollState = {
  progress: 0,
};

function ScrollTracker() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    
    // Setup resize listener to recalculate maxScroll if content height changes
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  
  return null;
}

function PaperAirplane() {
  const airplaneRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!airplaneRef.current) return;
    
    // Progress ranges from 0 to 1
    const p = scrollState.progress;
    
    // Smooth interpolation (lerp) for the 3D values toward the target based on scroll progress
    const targetX = Math.sin(p * Math.PI * 2) * 4;
    const targetY = 2 - p * 10; // Fly downward
    const targetZ = Math.cos(p * Math.PI * 2) * 2 - 2;

    airplaneRef.current.position.x = THREE.MathUtils.lerp(airplaneRef.current.position.x, targetX, 0.05);
    airplaneRef.current.position.y = THREE.MathUtils.lerp(airplaneRef.current.position.y, targetY, 0.05);
    airplaneRef.current.position.z = THREE.MathUtils.lerp(airplaneRef.current.position.z, targetZ, 0.05);

    // Animate rotation based on scroll speed and curve
    const targetRotationZ = -Math.sin(p * Math.PI * 2) * 0.5;
    // We don't have exact curve function from drei here, so we simulate it with Math.sin
    const curve = Math.sin(p * Math.PI); 
    const targetRotationX = curve * 0.5 + 0.2; 
    const targetRotationY = -p * Math.PI * 2;
    
    airplaneRef.current.rotation.z = THREE.MathUtils.lerp(airplaneRef.current.rotation.z, targetRotationZ, 0.05);
    airplaneRef.current.rotation.x = THREE.MathUtils.lerp(airplaneRef.current.rotation.x, targetRotationX, 0.05);
    airplaneRef.current.rotation.y = THREE.MathUtils.lerp(airplaneRef.current.rotation.y, targetRotationY, 0.05);
  });

  return (
    <group ref={airplaneRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Simple Paper Airplane Shape */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.5, 1.5, 4]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.2} wireframe />
        </mesh>
        {/* Glowing core inside the paper airplane */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight color="#00ffff" intensity={2} distance={5} />
      </Float>
    </group>
  );
}

function Clouds() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (group.current) {
      // Move clouds up slightly as user scrolls down to enhance parallax
      const targetY = scrollState.progress * 5;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 20, 
            (Math.random() - 0.5) * 30 - 5, 
            (Math.random() - 0.5) * 15 - 5
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <torusGeometry args={[Math.random() * 2 + 0.5, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} wireframe={Math.random() > 0.5} />
        </mesh>
      ))}
    </group>
  );
}

interface TravelSceneProps {
  children: React.ReactNode;
}

export default function TravelScene({ children }: TravelSceneProps) {
  return (
    <div className="relative w-full min-h-screen">
      <ScrollTracker />
      
      {/* 3D Background */}
      <div className="fixed inset-0 w-full h-screen z-0 bg-[#020617] overflow-hidden pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00ffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#ff00ff" />
          
          <Stars radius={100} depth={50} count={3000} factor={3} fade speed={2} />
          
          <PaperAirplane />
          <Clouds />
        </Canvas>
        {/* Radial Gradient overlay to darken edges */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] z-10" />
      </div>

      {/* HTML Content (scrolls naturally) */}
      <div className="relative z-10 w-full pb-24">
        {children}
      </div>
    </div>
  );
}
