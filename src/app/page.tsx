"use client";

import React, { Suspense, lazy } from "react";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

// Lazy load 3D components for better initial performance
const Hero = lazy(() => import("@/components/Hero"));
const About = lazy(() => import("@/components/About"));
const TechStackSpheres = lazy(() => import("@/components/TechStackSpheres"));
const ProjectsCarousel = lazy(() => import("@/components/ProjectsCarousel"));

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        {/* Hero Section */}
        <Hero />

        {/* About / Timeline Section */}
        <About />

        {/* Tech Stack Section */}
        <section className="py-20 bg-slate-950/30 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
            className="container mx-auto px-6"
          >
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                The <span className="text-primary text-glow">Physics</span> of My Stack
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Interactive 3D space highlighting my core technical expertise. 
                Hover to interact with the spheres.
              </p>
            </div>
            
            <TechStackSpheres />
          </motion.div>
        </section>

        {/* Projects Preview */}
        <section id="projects" className="py-20 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.1 }}
            className="container mx-auto px-6"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Recent <span className="text-accent text-glow">Creations</span>
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  Live from my <span className="text-white font-bold tracking-tight">GitHub</span> repository
                </p>
              </div>
              <a 
                href="https://github.com/Tamim544" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-white transition-colors flex items-center gap-2 font-bold"
              >
                Explore All <span className="text-xl">→</span>
              </a>
            </div>

            <ProjectsCarousel />
          </motion.div>
          
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent -z-10" />
        </section>

        {/* Catchy Footer / Contact Section */}
        <footer className="py-20 border-t border-white/5 bg-slate-950">
          <div className="container mx-auto px-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl accent-gradient flex items-center justify-center mb-8 shadow-2xl">
              <span className="text-3xl font-heading font-black text-primary-foreground">TC</span>
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4 text-white">
              Ready to build the future?
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Open for collaborations in Full Stack Development, ML Research, and Creative Technology.
            </p>
            <div className="flex gap-6">
              {[
                { name: "github", url: "https://github.com/Tamim544" },
                { name: "linkedin", url: "https://www.linkedin.com/in/tamim-chowdhury-546a47262" },
                { name: "instagram", url: "https://www.instagram.com/tamimzenith" }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors capitalize transition-transform hover:-translate-y-1"
                >
                  {social.name}
                </a>
              ))}
            </div>
            <p className="mt-12 text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Tamim Chowdhury. Built with Next.js & 3D Physics.
            </p>
          </div>
        </footer>
      </Suspense>
    </main>
  );
}
