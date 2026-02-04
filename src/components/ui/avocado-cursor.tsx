import { useEffect, useState } from 'react';

export const AvocadoCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hovering over interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[role="button"]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousemove', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-transform duration-100 ease-out"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.3 : 1})`,
      }}
    >
      {/* Cut avocado SVG cursor */}
      <svg
        width={isHovering ? "36" : "28"}
        height={isHovering ? "44" : "34"}
        viewBox="0 0 28 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-200 drop-shadow-lg"
        style={{
          filter: isHovering
            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(140, 182, 68, 0.5))'
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
        }}
      >
        {/* Outer skin - dark green */}
        <ellipse
          cx="14"
          cy="17"
          rx="13"
          ry="16"
          fill="url(#avocadoSkin)"
          stroke="#2d5a27"
          strokeWidth="1"
        />

        {/* Inner flesh - light green/yellow */}
        <ellipse
          cx="14"
          cy="17"
          rx="10"
          ry="12.5"
          fill="url(#avocadoFlesh)"
        />

        {/* Pit - brown circle */}
        <ellipse
          cx="14"
          cy="18"
          rx="5"
          ry="6"
          fill="url(#avocadoPit)"
        />

        {/* Pit highlight */}
        <ellipse
          cx="12.5"
          cy="16"
          rx="1.5"
          ry="2"
          fill="rgba(255,255,255,0.3)"
        />

        {/* Flesh highlight */}
        <ellipse
          cx="8"
          cy="12"
          rx="3"
          ry="4"
          fill="rgba(255,255,255,0.15)"
        />

        <defs>
          <linearGradient id="avocadoSkin" x1="14" y1="1" x2="14" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4a7c42" />
            <stop offset="50%" stopColor="#3d6935" />
            <stop offset="100%" stopColor="#2d5a27" />
          </linearGradient>

          <radialGradient id="avocadoFlesh" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#e8f5a3" />
            <stop offset="40%" stopColor="#c5e878" />
            <stop offset="100%" stopColor="#8cb644" />
          </radialGradient>

          <radialGradient id="avocadoPit" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="50%" stopColor="#6B4E11" />
            <stop offset="100%" stopColor="#4a3810" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
