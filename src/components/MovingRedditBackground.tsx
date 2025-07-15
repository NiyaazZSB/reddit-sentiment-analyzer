// This component renders a CSS-animated, seamless Reddit logo background
import React from 'react';

// Reddit logo asset
const LOGO_SRC = '/free-reddit-logo-icon-2436-thumb.png';
const BG_COLOR = '#f6f7f8'; // Reddit light background
const TILE_SIZE = 120; // px
const LOGO_SIZE = 64; // px

// Helper: create a data URL for a single tile with a Reddit logo centered
function createPatternDataUrl() {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  // Fill background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  // Draw Reddit logo in the center
  const img = new window.Image();
  img.src = LOGO_SRC;
  // Draw after image loads
  // We'll return a placeholder, and update the background after mount
  return canvas.toDataURL();
}

const MovingRedditBackground: React.FC = () => {
  const bgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Dynamically create a pattern tile with the Reddit logo
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    const img = new window.Image();
    img.src = LOGO_SRC;
    img.onload = () => {
      ctx.globalAlpha = 0.18;
      ctx.drawImage(
        img,
        (TILE_SIZE - LOGO_SIZE) / 2,
        (TILE_SIZE - LOGO_SIZE) / 2,
        LOGO_SIZE,
        LOGO_SIZE
      );
      if (bgRef.current) {
        bgRef.current.style.backgroundImage = `url('${canvas.toDataURL()}')`;
      }
    };
  }, []);

  return (
    <div
      ref={bgRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: BG_COLOR,
        backgroundRepeat: 'repeat',
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        animation: 'reddit-diagonal-move 18s linear infinite',
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes reddit-diagonal-move {
          0% { background-position: 0 0; }
          100% { background-position: ${TILE_SIZE}px ${TILE_SIZE}px; }
        }
      `}</style>
    </div>
  );
};

export default MovingRedditBackground;
