// utils/TornPaperStrip.js
//
// A torn-paper geometry torn ONLY along the top edge. The left, right,
// and bottom edges are clean cuts — matching a strip torn off a larger sheet.
//
// Provides both:
// 1. buildNormalizedStripPath() for scalable objectBoundingBox clip paths.
// 2. buildStripTornPath() for pixel-based SVG viewBoxes.

import { mulberry32, PAPER_GRAIN_URI } from './TornPaper.js';

/**
 * Builds a normalized (0..1) SVG path for use in:
 * <clipPath clipPathUnits="objectBoundingBox">
 *
 * @param {number} seed - numeric seed
 * @param {object} [opts]
 * @param {number} [opts.toothCount=45] - number of uneven teeth across top
 * @param {number} [opts.maxDepth=0.06] - maximum tear depth fraction
 * @param {number} [opts.minDepth=0.005] - minimum tear depth fraction
 * @param {number} [opts.deepTearChance=0.10] - chance of a deeper nick
 * @returns {string} SVG path `d` attribute
 */
export function buildNormalizedStripPath(seed = 1, opts = {}) {
    const {
        toothCount = 52,
        maxDepth = 0.15,
        minDepth = 0.015,
        deepTearChance = 0.24,
    } = opts;

    const rand = mulberry32(seed);
    const baseStep = 1 / toothCount;

    const pts = [];
    let x = 0;

    while (x < 1) {
        const isDeepTear = rand() < deepTearChance;
        const isMediumTear = rand() < 0.35;

        let depthFrac;
        if (isDeepTear) {
            depthFrac = maxDepth * (0.75 + rand() * 0.25);
        } else if (isMediumTear) {
            depthFrac = minDepth + (maxDepth - minDepth) * (0.45 + rand() * 0.35);
        } else {
            depthFrac = minDepth + rand() * (maxDepth * 0.35);
        }

        pts.push([Math.min(1, x), depthFrac]);
        x += baseStep * (0.45 + rand() * 0.95);
    }

    // Pin exact left (0) and right (1) corners
    pts[0][0] = 0;
    pts.push([1, pts[pts.length - 1][1]]);

    const d = [
        'M 0 1',
        `L 0 ${pts[0][1].toFixed(4)}`,
        ...pts.slice(1).map(([px, py]) => `L ${px.toFixed(4)} ${py.toFixed(4)}`),
        'L 1 1',
        'Z',
    ].join(' ');

    return d;
}

/**
 * Builds a pixel-based SVG path (width x height)
 */
export function buildStripTornPath(width, height, seed = 1, opts = {}) {
    const {
        toothCount = Math.max(12, Math.round(width / 20)),
        minDepth = 0.03,
        maxDepth = 0.24,
        deepTearChance = 0.12,
    } = opts;

    const rand = mulberry32(seed);
    const baseStep = width / toothCount;

    const pts = [];
    let x = 0;

    while (x < width) {
        const isDeepTear = rand() < deepTearChance;
        const depthFrac = isDeepTear
            ? maxDepth * (0.7 + rand() * 0.3)
            : minDepth + rand() * (maxDepth - minDepth) * 0.5;

        const y = depthFrac * height;
        pts.push([x, y]);

        x += baseStep * (0.55 + rand() * 0.9);
    }

    pts[0][0] = 0;
    pts.push([width, pts[pts.length - 1][1]]);

    const d = [
        `M 0 ${height}`,
        `L 0 ${pts[0][1].toFixed(2)}`,
        ...pts.slice(1).map(([px, py]) => `L ${px.toFixed(2)} ${py.toFixed(2)}`),
        `L ${width} ${height}`,
        'Z',
    ].join(' ');

    return d;
}

/**
 * Soft downward-weighted shadow for torn top strip
 */
export const STRIP_TORN_SHADOW =
    'drop-shadow(0 4px 6px rgba(0,0,0,0.22)) drop-shadow(0 1px 3px rgba(0,0,0,0.12))';

export { PAPER_GRAIN_URI };