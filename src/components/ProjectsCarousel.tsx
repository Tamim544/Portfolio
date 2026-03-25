"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Star, Code2, Terminal } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  homepage: string;
}

const ProjectCard = ({ repo }: { repo: Repo }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full min-h-[340px] w-full rounded-2xl bg-slate-900/40 border border-white/5 p-8 glass flex flex-col justify-between group cursor-pointer hover:bg-slate-800/60 transition-colors"
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Code2 size={24} />
          </div>
          <div className="flex gap-2">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Terminal size={20} />
            </a>
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
          {repo.name.replace(/-/g, " ")}
        </h3>
        <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
          {repo.description || "No description provided for this project."}
        </p>
      </div>

      <div style={{ transform: "translateZ(50px)" }} className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
          {repo.language || "Unknown"}
        </span>
        {repo.stargazers_count > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
            <Star size={12} fill="currentColor" /> {repo.stargazers_count}
          </span>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default function ProjectsCarousel() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/users/Tamim544/repos?sort=updated&per_page=30", { cache: 'no-store' });
        const data = await res.json();
        // Filter out forks and grab the top 6 most recently updated repositories
        setRepos(Array.isArray(data) ? data.filter((r: any) => !r.fork).slice(0, 6) : []);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div id="projects" className="w-full py-10 px-4 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repos.length > 0 ? (
          repos.map((repo) => <ProjectCard key={repo.id} repo={repo} />)
        ) : (
          <div className="col-span-full text-center w-full text-muted-foreground py-20">
            No public repositories found.
          </div>
        )}
      </div>
    </div>
  );
}
