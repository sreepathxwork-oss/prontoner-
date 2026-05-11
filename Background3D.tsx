import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    // Smoothly rotate the group based on mouse position
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;
    
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (-targetY - group.current.rotation.x) * 0.05;
  });
  
  return <group ref={group}>{children}</group>;
}

function AbstractShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[-3, 1, -5]} scale={1.5}>
          <MeshDistortMaterial color="#FF2A85" attach="material" distort={0.5} speed={2} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} position={[3, -2, -4]} scale={1.2}>
          <MeshDistortMaterial color="#7A00FF" attach="material" distort={0.6} speed={3} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[1, 64, 64]} position={[0, 2, -6]} scale={1}>
          <MeshDistortMaterial color="#FF9900" attach="material" distort={0.4} speed={1.5} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
    </>
  );
}

export const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#FF2A85" />
        <pointLight position={[10, -10, -5]} intensity={2} color="#7A00FF" />
        
        <InteractiveRig>
          <AbstractShapes />
          <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#FF2A85" />
          <Sparkles count={100} scale={12} size={1.5} speed={0.3} opacity={0.5} color="#7A00FF" />
          <Sparkles count={100} scale={12} size={1} speed={0.5} opacity={0.5} color="#FF9900" />
          <Stars radius={10} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        </InteractiveRig>
      </Canvas>
    </div>
  );
};
