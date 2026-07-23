"use client";

// components/admin/RepeatableGroup.tsx
// Wrapper generic pentru liste editabile: experienta, educatie, limbi, portofoliu.
// Primeste elementele + un "renderItem" ca sa ramana refolosibil pentru orice tip de lista.

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
  textButonAdauga = "+ Adauga",
  gol = "Nimic adaugat inca.",
}: RepeatableGroupProps<T>) {
  return (
    <div className="ogw-repeatable">
      <div className="ogw-repeatable__header">
        <h3>{titlu}</h3>
        <button type="button" className="ogw-btn ogw-btn--ghost" onClick={onAdauga}>
          {textButonAdauga}
        </button>
      </div>

      {elemente.length === 0 && <p className="ogw-repeatable__gol">{gol}</p>}

      <AnimatePresence initial={false}>
        {elemente.map((item, index) => (
          <motion.div
            key={getId(item)}
            className="ogw-repeatable__item"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderItem(item, index)}
            <button
              type="button"
              className="ogw-repeatable__sterge"
              onClick={() => onSterge(getId(item))}
              aria-label="Sterge"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}