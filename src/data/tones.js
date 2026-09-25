import barkTone from '../tones/bark.mp3';
import blingTone from '../tones/bling.mp3';
import chimeTone from '../tones/chime.mp3';
import dropletTone from '../tones/droplet.mp3';
import hornTone from '../tones/horn.mp3';
import meowTone from '../tones/meow.mp3';
import notificationTone from '../tones/notification.mp3';
import ringTone from '../tones/ring.mp3';
import twinkleTone from '../tones/twinkle.mp3';

export const TONES = [
  { id: 'chime', name: 'Chime', file: chimeTone },
  { id: 'bling', name: 'Bling', file: blingTone },
  { id: 'ring', name: 'Ring', file: ringTone },
  { id: 'notification', name: 'Notification', file: notificationTone },
  { id: 'droplet', name: 'Droplet', file: dropletTone },
  { id: 'twinkle', name: 'Twinkle', file: twinkleTone },
  { id: 'horn', name: 'Horn', file: hornTone },
  { id: 'bark', name: 'Bark', file: barkTone },
  { id: 'meow', name: 'Meow', file: meowTone },
];

export const TONE_MAP = Object.fromEntries(TONES.map((t) => [t.id, t]));

// Default tone per channel, keyed by channel id (see src/data/notificationEvents.js).
export const DEFAULT_TONE = {
  email: 'chime',
  chat: 'notification',
  slack: 'bling',
  sms: 'twinkle',
  voice: 'ring',
  whatsapp: 'droplet',
};
