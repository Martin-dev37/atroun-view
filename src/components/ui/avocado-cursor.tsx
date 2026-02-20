import { useEffect, useRef } from 'react';

export const AvocadoCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ hovering: false, textInput: false, visible: false });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;

      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;

      if (!stateRef.current.visible) {
        stateRef.current.visible = true;
        el.style.display = '';
      }

      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isText = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'P' || tag === 'SPAN' ||
        tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5' || tag === 'H6' ||
        tag === 'LI' || tag === 'TD' || tag === 'TH' || tag === 'LABEL' ||
        target.isContentEditable || !!target.closest('[contenteditable="true"]');

      const isInteractive = tag === 'BUTTON' || tag === 'A' ||
        !!target.closest('button') || !!target.closest('a') ||
        target.classList.contains('cursor-pointer') || !!target.closest('[role="button"]');
      const hovering = isInteractive && !isText;

      if (isText !== stateRef.current.textInput) {
        stateRef.current.textInput = isText;
        el.style.display = isText ? 'none' : '';
      }
      if (hovering !== stateRef.current.hovering) {
        stateRef.current.hovering = hovering;
        el.style.transform = `translate(-20%, -10%) rotate(-35deg) scale(${hovering ? 1.2 : 1})`;
      }
    };

    const onEnter = () => {
      stateRef.current.visible = true;
      if (cursorRef.current && !stateRef.current.textInput) cursorRef.current.style.display = '';
    };
    const onLeave = () => {
      stateRef.current.visible = false;
      if (cursorRef.current) cursorRef.current.style.display = 'none';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999]"
      style={{ display: 'none', transform: 'translate(-20%, -10%) rotate(-35deg) scale(1)', willChange: 'left, top, transform' }}
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
