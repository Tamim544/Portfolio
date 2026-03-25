"use client";

import React, { Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ChevronDown } from "lucide-react";

const CuteFloatingRobot = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // The arm on the visitor's right side (robot's left)
  const leftArmRef = useRef<THREE.Group>(null);

  // The arm on the visitor's left side (robot's right)
  const rightArmRef = useRef<THREE.Group>(null);

  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // States for animation
  const [waveStartTime, setWaveStartTime] = React.useState(0);
  const [isWaving, setIsWaving] = React.useState(false);

  // Trigger wave on start and on parent click
  React.useEffect(() => {
    const triggerWave = () => {
      setIsWaving(true);
      setWaveStartTime(performance.now() / 1000);
      // Stop waving after 2.5 seconds
      setTimeout(() => setIsWaving(false), 2500);
    };

    // Wait for the heavy Canvas initialization to finish before starting the jump.
    // By delaying the start by 1 second, we guarantee the jump doesn't skip frames.
    const initialWaveTimer = setTimeout(() => {
      triggerWave();
    }, 1000);

    // Listen for custom click event from parent
    const handleTrigger = () => triggerWave();
    window.addEventListener('robot-wave', handleTrigger);

    return () => {
      clearTimeout(initialWaveTimer);
      window.removeEventListener('robot-wave', handleTrigger);
    };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current || !leftArmRef.current || !rightArmRef.current || !mouthRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;

    // Responsive Body Tilt - Smooth Follow
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.3, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.1, 0.05);

    // Head Follow - Cute bouncy follow
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, x * 0.4, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -y * 0.2, 0.1);

    // Digital "Blink" Animation
    const isBlinking = Math.sin(t * 3) > 0.98;
    const eyeScaleY = isBlinking ? 0.05 : 1;
    leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeScaleY, 0.4);
    rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeScaleY, 0.4);

    // Wave Animation Logic - VISITOR'S RIGHT ARM (Robot's left arm, position: +0.32)
    if (isWaving) {
      const elapsed = t - waveStartTime;

      // One Single Cheering Jump (happens in first 1.0s)
      const jumpTime = 1.0;
      if (elapsed < jumpTime) {
        const jumpProgress = elapsed / jumpTime;
        const jumpArc = Math.sin(jumpProgress * Math.PI);
        groupRef.current.position.y = -0.25 + jumpArc * 0.4;
      } else {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.25, 0.1);
      }

      // Lift arm lateral (Z axis, positive values move outward to the right side of the screen)
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, Math.PI / 1.5, 0.1);
      // Lift arm forward so it stays in front of the body
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, Math.PI / 10, 0.1);

      // The actual side-to-side wave (Y axis)
      leftArmRef.current.rotation.y = Math.sin(t * 12) * 0.5;

      // Dynamic Smile during wave
      mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1.5, 0.1);
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1.2, 0.1);

      // Animate fingers waving
      const fingerGroup = leftArmRef.current.children[1];
      if (fingerGroup) {
        fingerGroup.children.forEach((finger, i) => {
          finger.rotation.z = Math.sin(t * 15 + i) * 0.3;
        });
      }
    } else {
      // Static vertical position
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.25, 0.1);

      // Return BOTH arms to resting position tightly hugging the body
      // Left Arm (Visitor's Right, +x) -> hugs inward with positive Z
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.15, 0.1);
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
      leftArmRef.current.rotation.y = THREE.MathUtils.lerp(leftArmRef.current.rotation.y, 0, 0.1);

      // Normal Smile
      mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1, 0.1);
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 1, 0.1);

      // Reset fingers
      const fingerGroup = leftArmRef.current.children[1];
      if (fingerGroup) {
        fingerGroup.children.forEach((finger) => {
          finger.rotation.z = THREE.MathUtils.lerp(finger.rotation.z, 0, 0.1);
        });
      }
    }

    // Right Arm (Visitor's Left, -x) always rests hugging the body with negative Z
    rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, 0.1);
    rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
    rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, 0, 0.1);
  });

  const bodyMaterial = {
    metalness: 0.1,
    roughness: 0.1,
    color: "#ffffff", // White Ceramic
  };

  const grayAccent = {
    metalness: 0.4,
    roughness: 0.2,
    color: "#9ca3af", // Lighter Gray Details
  };

  const screenMaterial = {
    metalness: 1,
    roughness: 0.1,
    color: "#000000", // Deep Black Screen
  };

  const eyeMaterial = {
    emissive: "#06b6d4", // Cyan
    emissiveIntensity: 6,
    color: "#ffffff",
  };

  return (
    // fine-tuned position to perfectly align visual center with text block
    <group ref={groupRef} position={[0, -0.25, 0]} scale={2.5}>
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.4}>

        {/* Head Unit */}
        <group ref={headRef} position={[0, 0.5, 0]}>
          {/* Outer Head Shell */}
          <RoundedBox args={[0.8, 0.55, 0.5]} radius={0.2} smoothness={4}>
            <meshStandardMaterial {...bodyMaterial} />
          </RoundedBox>

          {/* Top Antenna Bump */}
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.12, 0.1, 16, 16]} />
            <meshStandardMaterial {...grayAccent} />
          </mesh>

          {/* Side Ear Hubs */}
          {[1, -1].map((side) => (
            <mesh key={`ear-${side}`} position={[0.42 * side, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.1, 32]} />
              <meshStandardMaterial {...grayAccent} />
            </mesh>
          ))}

          {/* Face Screen (Black inset) */}
          <RoundedBox args={[0.7, 0.45, 0.1]} position={[0, 0, 0.21]} radius={0.1} smoothness={4}>
            <meshStandardMaterial {...screenMaterial} />
          </RoundedBox>

          {/* Face Features inside screen */}
          <group position={[0, 0, 0.27]}>
            {/* Left Eye */}
            <mesh ref={leftEyeRef} position={[-0.15, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.035, 0.08, 16, 16]} />
              <meshStandardMaterial {...eyeMaterial} />
            </mesh>
            {/* Right Eye */}
            <mesh ref={rightEyeRef} position={[0.15, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.035, 0.08, 16, 16]} />
              <meshStandardMaterial {...eyeMaterial} />
            </mesh>
            {/* Cute Smile / Mouth */}
            <mesh ref={mouthRef} position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.02, 0.06, 16, 16]} />
              <meshStandardMaterial {...eyeMaterial} />
            </mesh>
          </group>
        </group>

        {/* Floating Body */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.25, 0.3, 32, 32]} />
          <meshStandardMaterial {...bodyMaterial} />
        </mesh>

        {/* Accent line around body */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.255, 0.255, 0.03, 32]} />
          <meshStandardMaterial {...grayAccent} />
        </mesh>

        {/* Floating Detached Arms */}
        {/* ROBOT'S RIGHT ARM (Visitor's Left) */}
        <group ref={rightArmRef} position={[-0.32, -0.15, 0]}>
          {/* The group is what rotates in useFrame. The mesh below just centers the geometry down from the pivot */}
          <mesh position={[0, -0.1, 0]} rotation={[0, 0, -0.15]}>
            <capsuleGeometry args={[0.06, 0.22, 16, 16]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          {/* Hand with tiny fingers appended at the bottom of the arm */}
          <group position={[-0.02, -0.28, 0]}>
            {[1, 0, -1].map((i) => (
              <mesh key={i} position={[0.035 * i, -0.05, 0]}>
                <capsuleGeometry args={[0.012, 0.04, 8, 8]} />
                <meshStandardMaterial {...bodyMaterial} />
              </mesh>
            ))}
          </group>
        </group>

        {/* ROBOT'S LEFT ARM (Visitor's Right - The Waving Arm) */}
        <group ref={leftArmRef} position={[0.32, -0.15, 0]}>
          <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0.15]}>
            <capsuleGeometry args={[0.06, 0.22, 16, 16]} />
            <meshStandardMaterial {...bodyMaterial} />
          </mesh>
          {/* Hand with tiny fingers appended at the bottom of the arm */}
          <group position={[0.02, -0.28, 0]}>
            {[1, 0, -1].map((i) => (
              <mesh key={i} position={[0.035 * i, -0.05, 0]}>
                <capsuleGeometry args={[0.012, 0.04, 8, 8]} />
                <meshStandardMaterial {...bodyMaterial} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Tiny Thruster / Anti-Gravity Base under body */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.08, 0, 0.1, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} transparent opacity={0.5} />
        </mesh>
      </Float>

      <pointLight position={[0, 5, 5]} intensity={10} color="#ffffff" />
      <pointLight position={[3, 2, 5]} intensity={4} color="#06b6d4" />
      <pointLight position={[-3, 2, 5]} intensity={4} color="#8b5cf6" />
      <Environment preset="city" />

      <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={6} blur={2.5} far={4} />
    </group>
  );
};

export default function Hero() {
  const { scrollYProgress } = useScroll();
  
  // Vanish effect as we scroll down: fade out and slightly scale up
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const filter = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(10px)"]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25, 
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 lg:pt-0 overflow-hidden">
      <motion.div 
        style={{ opacity, scale, filter }}
        className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full h-full"
      >

        {/* Left Side: Information */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col space-y-6 lg:justify-center items-start h-full"
        >
          <motion.h2 variants={item} className="text-primary font-heading font-medium tracking-widest uppercase text-xs sm:text-sm">
            Creative Technologist
          </motion.h2>

          <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold leading-tight">
            Hello! I&apos;m <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Tamim Chowdhury</span>
          </motion.h1>

          <motion.div variants={item} className="flex flex-col space-y-4">
            <p className="text-xl sm:text-2xl text-muted-foreground font-light">
              <span className="inline-block border-r-2 border-primary pr-2 animate-pulse">
                Full Stack Developer & ML Engineer
              </span>
            </p>
            <p className="max-w-md text-muted-foreground/80 leading-relaxed text-sm sm:text-base">
              B.Tech CSE student at **IIIT-Delhi**, ICCR Scholar.
              Specializing in Web Development, Machine Learning, and Databases.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full accent-gradient text-primary-foreground font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
            >
              View Projects
            </button>
            <a
              href="mailto:tamim.choudhury2890@gmail.com"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/10 glass text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center active:scale-95"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Cute Floating Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} // No delay, perfectly in sync with the left-side text!
          onClick={() => window.dispatchEvent(new CustomEvent('robot-wave'))}
          className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full flex items-center justify-center cursor-pointer overflow-visible group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[140px] rounded-full scale-150 opacity-30 animate-pulse-slow" />
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <Canvas
              camera={{ position: [0, 0, 10], fov: 40 }}
              gl={{ alpha: true, antialias: true }}
              className="bg-transparent"
            >
              <ambientLight intensity={0.5} />
              <Suspense fallback={null}>
                <CuteFloatingRobot />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground animate-bounce cursor-pointer group"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] mb-2 group-hover:text-white transition-colors">Discover</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
