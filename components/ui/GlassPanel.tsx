"use client";

// components/ui/GlassPanel.tsx
// Panoul de sticlă reutilizat peste tot în dashboard: margini rotunjite, transparență, blur.

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type TagPermis = "div" | "section" | "article";

interface GlassPanelProps extends Omit<HTMLMotionProps<TagPermis>, "children" | "className"> {
  children: ReactNode;
  className?: string;
  intarziereReveal?: number; // secunde, pentru a eșalona cardurile
  ca?: TagPermis;
}

export default function GlassPanel({
  children,
  className = "",
  intarziereReveal = 0,
  ca = "div",
  ...props
}: GlassPanelProps) {
  // Mapare sigură pe componentele animate din framer-motion
  const Componenta = motion[ca] as React.ElementType;

  return (
    <Componenta
      className={`ogw-glass ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: 0.5, 
        delay: intarziereReveal, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      {...props}
    >
      {children}
    </Componenta>
  );
}