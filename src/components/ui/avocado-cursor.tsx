import { useEffect, useRef, useCallback } from 'react';

export const AvocadoCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({ hovering: false, textInput: false, visible: false });

  const applyStyle = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;
    const { x, y } = posRef.current;
    const { hovering, textInput, visible } = stateRef.current;
    el.style.display = visible && !textInput ? '' : 'none';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const scale = hovering ? 1.2 : 1;
    el.style.transform = `translate(-20%, -10%) rotate(-35deg) scale(${scale})`;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      if (!stateRef.current.visible) stateRef.current.visible = true;

      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isText = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'P' || tag === 'SPAN' ||
        tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5' || tag === 'H6' ||
        tag === 'LI' || tag === 'TD' || tag === 'TH' || tag === 'LABEL' ||
        target.isContentEditable || !!target.closest('[contenteditable="true"]');
      stateRef.current.textInput = isText;

      const isInteractive = tag === 'BUTTON' || tag === 'A' ||
        !!target.closest('button') || !!target.closest('a') ||
        target.classList.contains('cursor-pointer') || !!target.closest('[role="button"]');
      stateRef.current.hovering = isInteractive && !isText;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(applyStyle);
    };

    const onEnter = () => { stateRef.current.visible = true; requestAnimationFrame(applyStyle); };
    const onLeave = () => { stateRef.current.visible = false; requestAnimationFrame(applyStyle); };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyStyle]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999]"
      style={{ display: 'none', willChange: 'left, top, transform' }}
    >
      <svg
        width="18"
        height="22"
        viewBox="0 0 28 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
      >
        <ellipse cx="14" cy="17" rx="13" ry="16" fill="url(#avocadoSkinSmall)" stroke="#2d5a27" strokeWidth="1" />
        <ellipse cx="14" cy="17" rx="10" ry="12.5" fill="url(#avocadoFleshSmall)" />
        <ellipse cx="14" cy="18" rx="5" ry="6" fill="url(#avocadoPitSmall)" />
        <ellipse cx="12.5" cy="16" rx="1.5" ry="2" fill="rgba(255,255,255,0.3)" />
        <ellipse cx="8" cy="12" rx="3" ry="4" fill="rgba(255,255,255,0.15)" />
        <defs>
          <linearGradient id="avocadoSkinSmall" x1="14" y1="1" x2="14" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4a7c42" />
            <stop offset="50%" stopColor="#3d6935" />
            <stop offset="100%" stopColor="#2d5a27" />
          </linearGradient>
          <radialGradient id="avocadoFleshSmall" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#e8f5a3" />
            <stop offset="40%" stopColor="#c5e878" />
            <stop offset="100%" stopColor="#8cb644" />
          </radialGradient>
          <radialGradient id="avocadoPitSmall" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="50%" stopColor="#6B4E11" />
            <stop offset="100%" stopColor="#4a3810" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
