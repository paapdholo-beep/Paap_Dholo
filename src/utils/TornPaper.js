// Shared torn-paper effect used by ConfessionForm, BabaQuoteBanner, and
// ConfessionCard. Keeps one copy of the edge generator + grain texture
// instead of duplicating it per component.

/**
 * Deterministic seeded PRNG (mulberry32). Same seed → same output,
 * every render, every environment — no per-render reshuffle.
 */
export function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds an SVG path (objectBoundingBox units, 0..1) that traces an
 * irregular, hand-torn-looking edge around a rectangle: uneven step
 * spacing, mostly small nicks, and occasional deeper tears.
 */
export function buildTornEdgePath(seed, { topSteps = 40, sideSteps = 40 } = {}) {
  const rand = mulberry32(seed);
  const pts = [];

  const walk = (steps, axis, base, inward, from, to) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps + (rand() - 0.5) * (0.35 / steps);
      const pos = from + (to - from) * Math.min(1, Math.max(0, t));
      const isDeepTear = rand() < 0.05;
      const depth = isDeepTear ? 0.016 + rand() * 0.014 : rand() * 0.008;
      const val = base + depth * inward;
      if (axis === 'x') pts.push({ x: pos, y: Math.min(1, Math.max(0, val)) });
      else pts.push({ x: Math.min(1, Math.max(0, val)), y: pos });
    }
  };

  walk(topSteps, 'x', 0.004, 1, 0.003, 0.997);    // top: left → right
  walk(sideSteps, 'y', 0.996, -1, 0.003, 0.997);  // right: top → bottom
  walk(topSteps, 'x', 0.996, -1, 0.997, 0.003);   // bottom: right → left
  walk(sideSteps, 'y', 0.004, 1, 0.997, 0.003);   // left: bottom → top

  const [first, ...rest] = pts;
  return (
    `M ${first.x.toFixed(4)},${first.y.toFixed(4)} ` +
    rest.map((p) => `L ${p.x.toFixed(4)},${p.y.toFixed(4)}`).join(' ') +
    ' Z'
  );
}

// Fine fibrous grain via SVG feTurbulence — tiles cheaply, no image asset.
export const PAPER_GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

// Soft two-layer shadow shared by every torn-paper element — reads as
// paper resting/lifted rather than the old hard [Npx_Npx_0_#111] sticker shadow.
export const PAPER_SHADOW =
  'drop-shadow(0 2px 3px rgba(17,17,17,0.14)) drop-shadow(0 10px 20px rgba(17,17,17,0.18))';

/** Turns any string (e.g. a confession id) into a stable numeric seed,
 *  so each card gets its own tear shape instead of an identical one. */
export function hashSeed(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}