"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { 
  Environment, 
  Float, 
  Sphere, 
  MeshDistortMaterial, 
  Text,
  ContactShadows,
  Html
} from "@react-three/drei";
import * as THREE from "three";

const TECH_STACK = [
  { name: "Python", color: "#3776AB" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Tailwind", color: "#38BDF8" },
  { name: "Node.js", color: "#339933" },
  { name: "PyTorch", color: "#EE4C2C" },
  { name: "TF", color: "#FF6F00" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "MongoDB", color: "#47A248" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Docker", color: "#2496ED" },
];

function InteractiveSphere({ position, name, color, ...props }: any) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [1],
    linearDamping: 0.8,    // High damping for fluid look
    angularDamping: 0.8,   // High damping for rotation stability
    ...props,
  }));

  const velocity = useRef([0, 0, 0]);
  useFrame((state) => {
    const { mouse, viewport } = state;
    
    // Convert mouse range (-1 to 1) to world coordinates
    const mx = (mouse.x * viewport.width) / 2;
    const my = (mouse.y * viewport.height) / 2;
    
    const currPos = ref.current!.position;
    
    // (1) Mouse Repulsion - Slowed down and gentler
    const dx = currPos.x - mx;
    const dy = currPos.y - my;
    const distMouse = Math.sqrt(dx * dx + dy * dy);
    
    if (distMouse < 4) {
      // Strength reduced from 15 to 6 for a much smoother, slower feel
      const strength = (4 - distMouse) * 6;
      api.applyImpulse([dx * strength * 0.05, dy * strength * 0.05, 0], [0, 0, 0]);
    }

    // (2) Cluster Gravity (Pull spheres back to center)
    const distCenter = Math.sqrt(currPos.x * currPos.x + currPos.y * currPos.y);
    const gravityFactor = Math.max(0, distCenter - 2) * 0.8;
    api.applyForce([-currPos.x * gravityFactor, -currPos.y * gravityFactor, 0], [0, 0, 0]);

    // (3) Keep within viewport bounds
    const borderX = viewport.width / 2 - 1.5;
    const borderY = viewport.height / 2 - 1.5;
    
    if (Math.abs(currPos.x) > borderX) {
      api.applyForce([-currPos.x * 20, 0, 0], [0, 0, 0]);
    }
    if (Math.abs(currPos.y) > borderY) {
      api.applyForce([0, -currPos.y * 20, 0], [0, 0, 0]);
    }
  });

  return (
    <mesh ref={ref as any} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.3}
        radius={1}
        metalness={0.8}
        roughness={0.2}
      />
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </mesh>
  );
}

function Borders() {
  const { viewport } = useThree();
  usePlane(() => ({ position: [0, -viewport.height / 2, 0], rotation: [-Math.PI / 2, 0, 0] }));
  usePlane(() => ({ position: [0, viewport.height / 2, 0], rotation: [Math.PI / 2, 0, 0] }));
  usePlane(() => ({ position: [-viewport.width / 2, 0, 0], rotation: [0, Math.PI / 2, 0] }));
  usePlane(() => ({ position: [viewport.width / 2, 0, 0], rotation: [0, -Math.PI / 2, 0] }));
  return null;
}

export default function TechStackSpheres() {
  return (
    <div className="w-full h-[500px] relative bg-slate-950/20 rounded-3xl overflow-hidden border border-white/5">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 15], fov: 35 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} castShadow />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <Borders />
            {TECH_STACK.map((tech, i) => (
              <InteractiveSphere
                key={tech.name}
                position={[
                  (Math.random() - 0.5) * 10,
                  (Math.random() - 0.5) * 10,
                  0
                ]}
                name={tech.name}
                color={tech.color}
              />
            ))}
          </Physics>
          <Environment preset="city" />
          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.4}
            scale={20}
            blur={2.5}
            far={10}
          />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-white/10 text-8xl font-black uppercase tracking-tighter opacity-20 select-none">
          TECH STACK
        </div>
      </div>
    </div>
  );
}
