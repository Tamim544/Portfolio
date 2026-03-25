"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      <div className="w-64 h-64">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Float speed={4} rotationIntensity={2} floatIntensity={2}>
            <Sphere args={[1, 64, 64]}>
              <MeshDistortMaterial
                color="#06b6d4"
                speed={5}
                distort={0.4}
                radius={1}
              />
            </Sphere>
          </Float>
        </Canvas>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <h2 className="text-2xl font-heading font-bold tracking-tighter text-white">
          LOADING <span className="text-primary animate-pulse">EXPERIENCE</span>
        </h2>
        <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full accent-gradient"
          />
        </div>
      </motion.div>
    </div>
  );
}
