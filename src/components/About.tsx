"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, Cpu, Cloud, Globe } from "lucide-react";

const TIMELINE_DATA = [
  {
    title: "Computer Science Student",
    company: "IIIT-Delhi, India",
    date: "2023 - 2027 (Expected)",
    description: "ICCR Scholar pursuing B.Tech in CSE. Focusing on high-performance algorithms, web systems, and database management.",
    icon: <GraduationCap className="text-primary" />,
    tech: ["Java", "Python", "C", "Data Structures"]
  },
  {
    title: "Full Stack Developer",
    company: "Personal Projects",
    date: "2025 - Present",
    description: "Building robust applications like 'Safe-pass' (Kotlin) and 'Service-Booking-Apps' (Python/Java). Expert in creating seamless GUI experiences with Next.js and Django.",
    icon: <Globe className="text-accent" />,
    tech: ["Next.js", "Java", "Kotlin", "Django", "PostgreSQL"]
  },
  {
    title: "ML & Game Researcher",
    company: "Academic Projects",
    date: "2024 - Present",
    description: "Developing interactive simulations like 'Angry-Bird-game' (Java) and exploring Machine Learning optimizations for system schedulers and image recognition.",
    icon: <Cpu className="text-primary" />,
    tech: ["Machine Learning", "Java", "Python", "Kotlin"]
  }
];

const TimelineItem = ({ item, index }: { item: typeof TIMELINE_DATA[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`relative flex items-center justify-between mb-8 w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
    >
      <div className="hidden md:block w-5/12" />

      <div className="z-20 flex items-center order-1 bg-slate-900 border border-white/10 shadow-xl w-10 h-10 rounded-full justify-center">
        {item.icon}
      </div>

      <div className="order-1 glass rounded-2xl shadow-xl w-full md:w-5/12 px-6 py-6 border border-white/5 hover:border-primary/30 transition-colors group">
        <span className="mb-3 font-bold text-primary text-sm uppercase tracking-widest">{item.date}</span>
        <h3 className="mb-2 font-bold text-white text-xl group-hover:text-primary transition-colors">{item.title}</h3>
        <p className="text-sm font-medium leading-snug tracking-wide text-muted-foreground text-opacity-100 mb-4">
          {item.company} — {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <span key={t} className="text-[10px] uppercase font-bold px-2 py-1 bg-white/5 rounded-md text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.6, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.6, 0.9], [1, 1.1]);
  const filter = useTransform(scrollYProgress, [0.6, 0.9], ["blur(0px)", "blur(20px)"]);

  return (
    <section id="about" ref={containerRef} className="py-20 relative overflow-hidden bg-slate-950/50">
      <motion.div
        style={{ opacity, scale, filter }}
        className="container mx-auto px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            The <span className="text-primary text-glow font-heading">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A timeline of building, scaling, and researching at the intersection of web technology and artificial intelligence.
          </p>
        </motion.div>

        <div className="relative wrap overflow-hidden p-0 h-full">
          <div className="absolute border-opacity-20 border-white h-full border left-1/2 hidden md:block" />

          {TIMELINE_DATA.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </motion.div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[150px] -z-10 rounded-full" />
    </section>
  );
}
