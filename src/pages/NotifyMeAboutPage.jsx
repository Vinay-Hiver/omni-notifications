import React, { useState } from 'react';
import MiniSidebar from '../components/MiniSidebar';
import ToneDropdown, { usePreviewTone } from '../components/ToneDropdown';
import SimpleDropdown from '../components/SimpleDropdown';
import { CHANNELS, BUCKETS, CHANNEL_SPECIFIC_ACTIVITIES } from '../data/notificationEvents';
import { DEFAULT_TONE } from '../data/tones';
import './NotifyMeAboutPage.css';

import profileIcon from '../assets/icons/inbox-icon.svg';
import basicSettingsIcon from '../assets/icons/settings.svg';
import senderSettingsIcon from '../assets/icons/new-conversation.svg';
import bellIcon from '../assets/icons/notification.svg';

const CHANNEL_NAME = Object.fromEntries(CHANNELS.map((c) => [c.id, c.name]));

function onlyForLabel(channelIds) {
  const names = channelIds.map((id) => CHANNEL_NAME[id]);
  if (names.length === 1) return `Only for ${names[0]}`;
  return `Only for ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

// Smart defaults: covers the ~90% case out of the box.
// On by default: only what needs the agent's action, or what they explicitly opted into (followed),
// plus "a new conversation comes in" so agents in an unclaimed queue can see and grab new work.
// Off by default: FYI-only events and anything high-volume that would flood a new user
// (plain customer replies already covered by "assigned" activity, reassignment/resolution/CSAT
// that require no follow-up, and low-signal reactions).
const DEFAULT_OFF = new Set(['reassigned', 'cust_reply', 'csat', 'resolved', 'reaction_added']);

function buildDefaultEnabled() {
  const state = {};
  BUCKETS.forEach((b) => b.items.forEach((item) => { state[item.id] = !DEFAULT_OFF.has(item.id); }));
  CHANNEL_SPECIFIC_ACTIVITIES.forEach((a) => { state[a.id] = !DEFAULT_OFF.has(a.id); });
  return state;
}

const DEFAULT_ENABLED = buildDefaultEnabled();
const DEFAULT_SOUND_ON = true;
const DEFAULT_SOUND_MODE = 'single';
const DEFAULT_BULK_TONE = DEFAULT_TONE.email;
const DEFAULT_CHANNEL_TONES = { ...DEFAULT_TONE };

const SNOOZE_OPTIONS = [
  { id: '30m', label: 'For 30 minutes', ms: 30 * 60 * 1000 },
  { id: '1h', label: 'For 1 hour', ms: 60 * 60 * 1000 },
  { id: '2h', label: 'For 2 hours', ms: 120 * 60 * 1000 },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
}

const NotifyMeAboutPage = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [enabled, setEnabled] = useState(() => ({ ...DEFAULT_ENABLED }));
  const [isDirty, setIsDirty] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const [snoozeUntil, setSnoozeUntil] = useState(null);

  const startSnooze = (optionId) => {
    const option = SNOOZE_OPTIONS.find((o) => o.id === optionId);
    if (!option) return;
    setSnoozeUntil(new Date(Date.now() + option.ms));
  };

  const resumeNow = () => setSnoozeUntil(null);

  const [soundOn, setSoundOn] = useState(DEFAULT_SOUND_ON);
  const [soundMode, setSoundMode] = useState(DEFAULT_SOUND_MODE); // 'single' | 'perChannel'
  const [bulkTone, setBulkTone] = useState(DEFAULT_BULK_TONE);
  const [channelTones, setChannelTones] = useState(() => ({ ...DEFAULT_CHANNEL_TONES }));
  const { playingToneId, previewTone } = usePreviewTone();

  const toggle = (id) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    setIsDirty(true);
  };

  const setChannelTone = (channelId, toneId) => {
    setChannelTones((prev) => ({ ...prev, [channelId]: toneId }));
    setIsDirty(true);
  };

  const restoreDefaults = () => {
    setEnabled({ ...DEFAULT_ENABLED });
    setSoundOn(DEFAULT_SOUND_ON);
    setSoundMode(DEFAULT_SOUND_MODE);
    setBulkTone(DEFAULT_BULK_TONE);
    setChannelTones({ ...DEFAULT_CHANNEL_TONES });
    setIsDirty(false);
    setShowRestoreModal(false);
  };

  return (
    <div className="notify-page-root">
      <MiniSidebar showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal} />

      <div className="notify-layout">
        <aside className="notify-subnav">
          <div className="notify-subnav-header">
            <h2>My Settings</h2>
          </div>
          <div className="notify-subnav-items">
            <div className="notify-subnav-item">
              <img src={profileIcon} alt="" width="14" height="14" />
              <span>Profile</span>
            </div>
            <div className="notify-subnav-item">
              <img src={basicSettingsIcon} alt="" width="14" height="14" />
              <span>Basic Settings</span>
            </div>
            <div className="notify-subnav-item">
              <img src={senderSettingsIcon} alt="" width="14" height="14" />
              <span>Sender Settings</span>
            </div>
            <div className="notify-subnav-item active">
              <img src={bellIcon} alt="" width="14" height="14" />
              <span>Notifications Settings</span>
            </div>
          </div>
        </aside>

        <div className="notify-content-wrapper">
          <header className="notify-topbar">
            <h1>Notification settings</h1>
          </header>

          <main className="notify-main-content">
            <div className="notify-block">
              <div className="notify-block-title-row">
                <div>
                  <h2>Customize notifications</h2>
                  <p className="notify-block-subtext">These settings are applicable across all channels</p>
                </div>
                {!snoozeUntil && (
                  <div className="notify-snooze">
                    <SimpleDropdown
                      placeholder="Pause notifications"
                      value={null}
                      options={SNOOZE_OPTIONS}
                      onChange={startSnooze}
                    />
                  </div>
                )}
              </div>

              {snoozeUntil && (
                <div className="notify-snooze-banner">
                  <p>
                    Notifications paused until <strong>{formatTime(snoozeUntil)}</strong>
                  </p>
                  <button className="notify-snooze-resume" onClick={resumeNow}>Resume now</button>
                </div>
              )}

              <div className="notify-card">
                {BUCKETS.map((bucket, i) => (
                  <React.Fragment key={bucket.id}>
                    {i > 0 && <div className="notify-divider" />}
                    <div className="notify-bucket">
                      <p className="notify-bucket-title">{bucket.name}</p>
                      {bucket.items.map((item) => (
                        <div className="notify-row" key={item.id}>
                          {item.caption ? (
                            <span className="notify-row-label-group">
                              <span className="notify-row-label">{item.label}</span>
                              <span className="notify-row-caption">{item.caption}</span>
                            </span>
                          ) : (
                            <span className="notify-row-label">{item.label}</span>
                          )}
                          <button
                            className={`notify-switch ${enabled[item.id] ? 'on' : ''}`}
                            role="switch"
                            aria-checked={enabled[item.id]}
                            onClick={() => toggle(item.id)}
                          >
                            <span className="notify-switch-handle" />
                          </button>
                        </div>
                      ))}
                      {bucket.id === 'deadlines_feedback' &&
                        CHANNEL_SPECIFIC_ACTIVITIES.map((activity) => (
                          <div className="notify-row" key={activity.id}>
                            <span className="notify-row-label-group">
                              <span className="notify-row-label">{activity.label}</span>
                              <span className="notify-row-caption">{onlyForLabel(activity.channels)}</span>
                            </span>
                            <button
                              className={`notify-switch ${enabled[activity.id] ? 'on' : ''}`}
                              role="switch"
                              aria-checked={enabled[activity.id]}
                              onClick={() => toggle(activity.id)}
                            >
                              <span className="notify-switch-handle" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="notify-block">
              <header className="notify-sound-header">
                <p className="notify-sound-title">Notification sound</p>
                <p className="notify-sound-desc">
                  {soundMode === 'perChannel'
                    ? 'Assign a different sound to each channel'
                    : 'Use a single sound for all notifications'}
                </p>
              </header>

              <div className="notify-sound-card">
                <div className="notify-sound-row">
                  <span className="notify-sound-row-label">Play sound for notifications</span>
                  <button
                    className={`notify-switch ${soundOn ? 'on' : ''}`}
                    role="switch"
                    aria-checked={soundOn}
                    onClick={() => { setSoundOn((v) => !v); setIsDirty(true); }}
                  >
                    <span className="notify-switch-handle" />
                  </button>
                </div>

                {soundOn && (
                  <>
                    <div className="notify-sound-divider" />
                    <div className="notify-sound-options-group">
                    <label className="notify-sound-option">
                      <input
                        type="radio"
                        name="sound-mode"
                        checked={soundMode === 'single'}
                        onChange={() => { setSoundMode('single'); setIsDirty(true); }}
                      />
                      <span className="notify-sound-option-label">Apply a single sound to all notifications</span>
                      <ToneDropdown
                        value={bulkTone}
                        onChange={(id) => { setBulkTone(id); setIsDirty(true); }}
                        disabled={soundMode !== 'single'}
                        playingToneId={playingToneId}
                        onPreview={previewTone}
                      />
                    </label>

                    <label className="notify-sound-option">
                      <input
                        type="radio"
                        name="sound-mode"
                        checked={soundMode === 'perChannel'}
                        onChange={() => { setSoundMode('perChannel'); setIsDirty(true); }}
                      />
                      <span className="notify-sound-option-label">Configure notification sounds by channel</span>
                    </label>

                    {soundMode === 'perChannel' && (
                      <div className="notify-sound-channel-list">
                        {CHANNELS.map((c) => (
                          <div className="notify-sound-channel-row" key={c.id}>
                            <span className="notify-sound-row-label">{c.name}</span>
                            <ToneDropdown
                              value={channelTones[c.id]}
                              onChange={(id) => setChannelTone(c.id, id)}
                              playingToneId={playingToneId}
                              onPreview={previewTone}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>

          <footer className="notify-footer">
            <button className="notify-btn-secondary" disabled={!isDirty} onClick={() => setShowRestoreModal(true)}>
              Restore defaults
            </button>
            <button className="notify-btn-save" disabled={!isDirty}>Save</button>
          </footer>
        </div>
      </div>

      {showRestoreModal && (
        <div className="notify-modal-overlay" onClick={() => setShowRestoreModal(false)}>
          <div className="notify-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notify-modal-header">
              <p className="notify-modal-title">Restore default settings?</p>
              <button className="notify-modal-close" onClick={() => setShowRestoreModal(false)} aria-label="Close">
                &times;
              </button>
            </div>
            <div className="notify-modal-body">
              <p className="notify-modal-text">Your current notification and sound choices will be discarded and reset to the recommended defaults.</p>
              <div className="notify-modal-actions">
                <button className="notify-modal-cancel" onClick={() => setShowRestoreModal(false)}>Cancel</button>
                <button className="notify-modal-confirm" onClick={restoreDefaults}>Restore defaults</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifyMeAboutPage;
