"use client";

// components/ui/GlassPanel.tsx
// Panoul de sticla reutilizat peste tot in dashboard: margini rotunjite,
// transparenta, blur. Optional apare cu o animatie de intrare la scroll.

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  intarziereReveal?: number; // secunde, pentru a esalona cardurile
  ca?: "div" | "section" | "article";
}

export default function GlassPanel({
  children,
  className = "",
  intarziereReveal = 0,
  ca = "div",
}: GlassPanelProps) {
  const Componenta = motion[ca] as typeof motion.div;

  return (
    <Componenta
      className={`ogw-glass ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: intarziereReveal, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Componenta>
  );
}