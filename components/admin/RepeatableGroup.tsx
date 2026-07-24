"use client";

// components/admin/RepeatableGroup.tsx
// Wrapper generic pentru liste editabile: experienta, educatie, limbi, portofoliu.

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RepeatableGroupProps<T> {
  titlu: string;
  elemente: T[];
  onAdauga: () => void;
  onSterge: (id: string) => void;
  getId: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  textButonAdauga?: string;
  gol?: string;
}

export default function RepeatableGroup<T>({
  titlu,
  elemente,
  onAdauga,
  onSterge,
  getId,
  renderItem,
  textButonAdauga = "+ Adaugă",
  gol = "Nimic adăugat încă.",
}: RepeatableGroupProps<T>) {
  return (
    <div className="ogw-repeatable">
      <div className="ogw-repeatable__header">
        <h3>{titlu}</h3>
        <button 
          type="button" 
          className="ogw-btn ogw-btn--ghost" 
          onClick={onAdauga}
        >
          {textButonAdauga}
        </button>
      </div>

      {elemente.length === 0 && (
        <p className="ogw-repeatable__gol" role="status">
          {gol}
        </p>
      )}

      <div className="ogw-repeatable__list">
        <AnimatePresence initial={false}>
          {elemente.map((item, index) => {
            const itemId = getId(item);
            return (
              <motion.div
                key={itemId}
                className="ogw-repeatable__item"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: "1rem" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <div className="ogw-repeatable__content">
                  {renderItem(item, index)}
                </div>
                <button
                  type="button"
                  className="ogw-repeatable__sterge"
                  onClick={() => onSterge(itemId)}
                  aria-label={`Șterge elementul ${index + 1}`}
                >
                  ✕
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}