/**
 * BotanicalScene
 * Lightweight animation utilities for the auth experience.
 * Heavy SVG illustration components were removed — the visual depth now
 * comes from the photographic background in AuthLayout.
 */

import { motion } from 'framer-motion'

// ── Film-grain overlay (feTurbulence → overlay blend) ────────────────────────

export function GrainOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ mixBlendMode: 'overlay', opacity: 0.38 }}
    >
      <filter id="f-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.48  0 0 0 0 0.44  0 0 0 0 0.38  0 0 0 0.05 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#f-grain)" />
    </svg>
  )
}

// ── Falling petals ────────────────────────────────────────────────────────────

export interface PetalDef {
  x: number; sz: number; delay: number; dur: number; rot: number; color: string
}

// Ivory/cream petals — no pink, palette matches the botanical editorial background
export const LOGIN_PETALS: PetalDef[] = [
  { x:  7, sz:  9, delay: 0,   dur: 14, rot:  22, color: 'linear-gradient(140deg,rgba(255,253,248,0.90),rgba(230,240,228,0.70))' },
  { x: 23, sz:  7, delay: 4.5, dur: 11, rot:  58, color: 'linear-gradient(140deg,rgba(252,250,244,0.88),rgba(220,235,218,0.65))' },
  { x: 46, sz: 11, delay: 8,   dur: 17, rot: 128, color: 'linear-gradient(140deg,rgba(255,255,252,0.85),rgba(235,245,232,0.68))' },
  { x: 63, sz:  8, delay: 2,   dur: 13, rot: 205, color: 'linear-gradient(140deg,rgba(250,252,246,0.88),rgba(225,238,222,0.66))' },
  { x: 82, sz: 10, delay: 6,   dur: 16, rot: 312, color: 'linear-gradient(140deg,rgba(255,253,248,0.86),rgba(232,244,229,0.68))' },
  { x: 38, sz:  7, delay: 11,  dur: 12, rot:  82, color: 'linear-gradient(140deg,rgba(252,254,250,0.82),rgba(228,240,226,0.64))' },
  { x: 70, sz:  9, delay: 9,   dur: 18, rot: 160, color: 'linear-gradient(140deg,rgba(255,252,246,0.87),rgba(234,245,230,0.66))' },
]

export const REGISTER_PETALS: PetalDef[] = [
  { x: 12, sz:  8, delay: 2,   dur: 15, rot:  40, color: 'linear-gradient(140deg,rgba(255,253,248,0.88),rgba(228,240,224,0.68))' },
  { x: 30, sz: 10, delay: 7,   dur: 18, rot: 100, color: 'linear-gradient(140deg,rgba(252,254,248,0.86),rgba(230,242,226,0.66))' },
  { x: 55, sz:  7, delay: 0,   dur: 13, rot: 220, color: 'linear-gradient(140deg,rgba(255,255,252,0.84),rgba(225,238,220,0.64))' },
  { x: 74, sz:  9, delay: 5,   dur: 16, rot: 290, color: 'linear-gradient(140deg,rgba(250,252,246,0.87),rgba(232,244,228,0.66))' },
  { x: 48, sz: 11, delay: 11,  dur: 20, rot: 160, color: 'linear-gradient(140deg,rgba(254,253,248,0.85),rgba(226,240,222,0.65))' },
  { x: 88, sz:  7, delay: 9,   dur: 14, rot:  70, color: 'linear-gradient(140deg,rgba(252,254,250,0.82),rgba(230,242,225,0.63))' },
]

export function FallingPetal({ x, sz, delay, dur, rot, color }: PetalDef) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: 0,
        width: sz,
        height: sz * 1.72,
        borderRadius: '50% 6% 50% 6%',
        background: color,
        rotate: rot,
        pointerEvents: 'none',
        zIndex: 2,
        willChange: 'transform',
      }}
      initial={{ y: '-10vh', x: 0, opacity: 0 }}
      animate={{
        y: '110vh',
        x: [0, 22, -14, 18, -10, 0],
        opacity: [0, 0.55, 0.55, 0.50, 0.22, 0],
        rotate: [rot, rot + 295],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        ease: 'linear',
        x: {
          duration: dur,
          ease: 'easeInOut',
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
        opacity: { duration: dur, times: [0, 0.06, 0.40, 0.82, 0.96, 1] },
      }}
    />
  )
}
