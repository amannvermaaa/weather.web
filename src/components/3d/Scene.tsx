'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import { Suspense } from 'react';
import * as THREE from 'three';

function CameraParallax() {
  useFrame((state) => {
    // Soft parallax effect: slight camera movement based on mouse pointer
    const targetX = (state.pointer.x * 0.5);
    const targetY = (state.pointer.y * 0.5);
    
    // Smoothly interpolate current camera position toward target
    state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 1.5, 0); // Keep looking at the Earth's new center
  });
  return null;
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        
        {/* Ambient light for the night side */}
        <ambientLight intensity={0.05} />
        
        {/* Main sun light */}
        <directionalLight position={[5, 3, 5]} intensity={2.5} />
        
        <Suspense fallback={null}>
          <Earth />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
        </Suspense>
        
        <CameraParallax />
        
        {/* OrbitControls are now used purely for manual interaction (if enabled), but autoRotate is off 
            since Earth rotates internally. We disable zoom and pan to keep the composition fixed. */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false} // Disable orbit rotation so parallax handles movement cleanly
        />
      </Canvas>
    </div>
  );
}
