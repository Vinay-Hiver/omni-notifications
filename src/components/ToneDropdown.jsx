import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { PlayCircle } from '@untitledui/icons';
import { TONES, TONE_MAP } from '../data/tones';
import './ToneDropdown.css';

export default function ToneDropdown({ value, onChange, disabled, playingToneId, onPreview }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);
  const selected = TONE_MAP[value];

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
    const openUpward = spaceBelow < 320 && rect.top > spaceBelow;
    setMenuStyle({
      position: 'fixed',
      left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
      top: openUpward ? undefined : rect.bottom + 6,
      bottom: openUpward ? window.innerHeight - rect.top + 6 : undefined,
      width: menuWidth,
    });
  }, [open]);

  const displayName = value === 'none' ? 'No sound' : selected ? selected.name : 'Select tone';

  return (
    <div className="tone-dropdown" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        className="tone-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {displayName}
        <ChevronDown size={14} />
      </button>

      {open && menuStyle && createPortal(
        <div className="tone-dropdown-menu" role="listbox" ref={menuRef} style={menuStyle}>
          <div className="tone-dropdown-list">
            {TONES.map((tone) => (
              <div
                className={`tone-option ${value === tone.id ? 'selected' : ''}`}
                role="option"
                aria-selected={value === tone.id}
                key={tone.id}
              >
                <button
                  type="button"
                  className={`tone-option-play ${playingToneId === tone.id ? 'playing' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(tone.id);
                  }}
                  aria-label={`Preview ${tone.name}`}
                >
                  <PlayCircle width={14} height={14} />
                </button>
                <button
                  type="button"
                  className="tone-option-label"
                  onClick={() => {
                    onChange(tone.id);
                    setOpen(false);
                  }}
                >
                  {tone.name}
                </button>
                {value === tone.id && <Check size={14} className="tone-option-check" />}
              </div>
            ))}

            <div className="tone-dropdown-divider" />

            <div
              className={`tone-option ${value === 'none' ? 'selected' : ''}`}
              role="option"
              aria-selected={value === 'none'}
            >
              <button
                type="button"
                className="tone-option-label"
                onClick={() => {
                  onChange('none');
                  setOpen(false);
                }}
              >
                No sound
              </button>
              {value === 'none' && <Check size={14} className="tone-option-check" />}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export function usePreviewTone() {
  const [playingToneId, setPlayingToneId] = useState(null);
  const audioRef = useRef(null);

  const previewTone = (toneId) => {
    const tone = TONE_MAP[toneId];
    if (!tone) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(tone.file);
    audioRef.current = audio;
    setPlayingToneId(toneId);
    audio.addEventListener('ended', () => setPlayingToneId((cur) => (cur === toneId ? null : cur)));
    audio.play().catch(() => setPlayingToneId((cur) => (cur === toneId ? null : cur)));
  };

  return { playingToneId, previewTone };
}
