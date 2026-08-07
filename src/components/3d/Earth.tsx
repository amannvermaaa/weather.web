'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, DoubleSide, Mesh, Group } from 'three';
import { useTexture } from '@react-three/drei';

export default function Earth() {
  const earthGroupRef = useRef<Group>(null);
  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);

  // High-res textures from Three.js examples
  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // 360 degrees in ~210 seconds -> (2 * Math.PI) / 210
    const rotationSpeed = (Math.PI * 2) / 210;
    
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsedTime * rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsedTime * (rotationSpeed * 1.2); // Clouds move slightly faster
    }
  });

  return (
    // Move Earth upward by 1.5 units and scale it up by ~40% (2.8 vs 2.0 previously)
    <group ref={earthGroupRef} position={[0, 1.5, 0]}>
      {/* Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.1}
          emissiveMap={lightsMap}
          emissive={"#ffffff"}
          emissiveIntensity={0.6} // Controls the brightness of city lights
        />
      </mesh>
      
      {/* Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.82, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>

      {/* Primary Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[2.9, 64, 64]} />
        <meshBasicMaterial 
          color="#00aaff"
          transparent={true}
          opacity={0.15}
          side={BackSide}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Faint Outer Radial Glow for Premium Look */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial 
          color="#0066ff"
          transparent={true}
          opacity={0.05}
          side={BackSide}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
