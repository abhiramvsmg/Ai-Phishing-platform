/**
 * Two layers: a fixed twinkling starfield (the "galaxy" base) plus
 * slow-drifting dust particles on top (the original snow effect).
 * Kept the name BackgroundOrbs for import compatibility with
 * Shell.tsx / page.tsx.
 */
const STAR_COUNT = 65;
const DUST_COUNT = 16;

// Deterministic pseudo-random spread so output is stable across
// renders without needing client-side randomness (keeps this a
// server component, no "use client" needed).
function seededStar(i: number) {
  const left = (i * 53) % 100;
  const top = (i * 29) % 100;
  const size = 1 + (i % 4) * 0.5;
  const duration = 3 + (i % 5) * 0.7;
  const delay = (i * 0.37) % 6;
  const maxOpacity = 0.28 + ((i % 4) * 0.07);
  return { left, top, size, duration, delay, maxOpacity };
}

function seededDust(i: number) {
  const left = (i * 37) % 100;
  const delay = (i * 1.7) % 25;
  const duration = 20 + (i % 7) * 3;
  const size = 1 + (i % 2) * 0.5;
  const drift = (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 6);
  const opacity = 0.05 + ((i % 4) * 0.03);
  return { left, delay, duration, size, drift, opacity };
}

export const BackgroundOrbs = () => (
  <div className="cosmos-field" aria-hidden="true">
    {Array.from({ length: STAR_COUNT }).map((_, i) => {
      const s = seededStar(i);
      return (
        <span
          key={`star-${i}`}
          className="star-particle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            ["--max-opacity" as string]: s.maxOpacity,
          }}
        />
      );
    })}
    {Array.from({ length: DUST_COUNT }).map((_, i) => {
      const p = seededDust(i);
      return (
        <span
          key={`dust-${i}`}
          className="snow-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      );
    })}
  </div>
);