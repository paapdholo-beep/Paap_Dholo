// Torn-paper "scrap" effect — matches a wide hand-torn strip with one
// smooth curved edge (as if trimmed or the natural sheet edge) and
// rough, fibrous tears on the other three sides.
//
// Builds on the base generator in ./tornPaper.js instead of duplicating
// its PRNG/grain — import shared pieces from there.

import { mulberry32, PAPER_GRAIN_URI } from './TornPaper.js';

/**
 * Builds an SVG path (objectBoundingBox units, 0..1) with:
 *  - a smooth, gently wavy LEFT edge (low-frequency curve, no jitter)
 *  - rough, fibrous TOP / RIGHT / BOTTOM edges (higher-amplitude jitter
 *    plus occasional deep tears, mimicking frayed paper fiber)
 */
export function buildScrapEdgePath(
  seed = 5,
  { top = 40, right = 50, bottom = 40, left = 50 } = {}
) {
  const rand = mulberry32(seed);
  const pts = [];

  // Smooth edge: a subtle seeded low-frequency curve — gentle natural
  // waver without cutting deep into the content area.
  const leftHarmonics = [
    { freq: 0.9 + rand() * 0.4, amp: 0.006 + rand() * 0.004, phase: rand() * Math.PI * 2 },
    { freq: 2.2 + rand() * 0.8, amp: 0.002 + rand() * 0.002, phase: rand() * Math.PI * 2 },
  ];

  const smoothEdge = (steps, from, to) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = from + (to - from) * t;
      let bulge = 0;
      leftHarmonics.forEach(({ freq, amp, phase }) => {
        bulge += Math.sin(2 * Math.PI * freq * t + phase) * amp;
      });
      const x = Math.max(0.003, Math.min(0.022, 0.009 + bulge));
      pts.push({ x, y });
    }
  };

  // Rough edge: uneven spacing + mostly small jitter + occasional deep
  // fibrous tears (bigger and more frequent than the base torn-paper
  // effect, since this reference has visibly heavier fraying).
  const roughEdge = (steps, axis, base, inward, from, to) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps + (rand() - 0.5) * (0.4 / steps);
      const pos = from + (to - from) * Math.min(1, Math.max(0, t));
      const isDeepTear = rand() < 0.08;
      const depth = isDeepTear ? 0.022 + rand() * 0.02 : rand() * 0.012;
      const val = base + depth * inward;
      if (axis === 'x') pts.push({ x: pos, y: Math.min(1, Math.max(0, val)) });
      else pts.push({ x: Math.min(1, Math.max(0, val)), y: pos });
    }
  };

  roughEdge(top, 'x', 0.006, 1, 0.02, 0.99);     // top: left → right, torn
  roughEdge(right, 'y', 0.99, -1, 0.01, 0.99);   // right: top → bottom, torn
  roughEdge(bottom, 'x', 0.99, -1, 0.99, 0.02);  // bottom: right → left, torn
  smoothEdge(left, 0.99, 0.01);                   // left: bottom → top, smooth curve

  const [first, ...rest] = pts;
  return (
    `M ${first.x.toFixed(4)},${first.y.toFixed(4)} ` +
    rest.map((p) => `L ${p.x.toFixed(4)},${p.y.toFixed(4)}`).join(' ') +
    ' Z'
  );
}

// Warm brown fiber tint that hugs the torn (top/right/bottom) edges —
// the reference photo shows visible darker, dirtier fiber right at the
// tear line rather than a clean cut. Layer this *under* PAPER_GRAIN_URI.
export const SCRAP_EDGE_TINT = `
  linear-gradient(180deg, rgba(140,105,55,0.22) 0%, transparent 10%),
  linear-gradient(270deg, rgba(140,105,55,0.14) 0%, transparent 9%),
  linear-gradient(0deg, rgba(140,105,55,0.18) 0%, transparent 9%)
`;

// Slightly heavier than the base PAPER_SHADOW — this is a thicker,
// more physical-looking scrap of paper.
export const SCRAP_SHADOW =
  'drop-shadow(0 3px 4px rgba(17,17,17,0.16)) drop-shadow(0 14px 26px rgba(17,17,17,0.22))';

export { PAPER_GRAIN_URI };