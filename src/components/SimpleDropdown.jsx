import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import './ToneDropdown.css';

// A minimal options dropdown that shares ToneDropdown's visual language
// (trigger + portaled, position-aware menu) but without the audio-preview bits.
export default function SimpleDropdown({ value, placeholder = 'Select', options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (e) => {
      if (rootRef.current && rootRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < 200 && rect.top > spaceBelow;
    setMenuStyle({
      position: 'fixed',
      left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      top: openUpward ? undefined : rect.bottom + 6,
      bottom: openUpward ? window.innerHeight - rect.top + 6 : undefined,
      width: menuWidth,
    });
  }, [open]);

  const selected = options.find((o) => o.id === value);

  return (
    <div className="tone-dropdown" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className="tone-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? selected.label : placeholder}
        <ChevronDown size={14} />
      </button>

      {open && menuStyle && createPortal(
        <div className="tone-dropdown-menu" role="listbox" ref={menuRef} style={menuStyle}>
          <div className="tone-dropdown-list">
            {options.map((opt) => (
              <div
                className={`tone-option ${value === opt.id ? 'selected' : ''}`}
                role="option"
                aria-selected={value === opt.id}
                key={opt.id}
              >
                <button
                  type="button"
                  className="tone-option-label"
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
                {value === opt.id && <Check size={14} className="tone-option-check" />}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
