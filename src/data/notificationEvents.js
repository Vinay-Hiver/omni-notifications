// Notification events database (prototype seed data)
// Duplicated from the existing Priority notification settings screen, extended
// with cross-channel combo events for the new per-channel notification settings work.

export const CHANNELS = [
  { id: 'email', name: 'Email' },
  { id: 'chat', name: 'Chat' },
  { id: 'slack', name: 'Slack' },
  { id: 'sms', name: 'SMS' },
  { id: 'voice', name: 'Voice' },
  { id: 'whatsapp', name: 'WhatsApp' },
];

export const ALL_CHANNEL_IDS = CHANNELS.map((c) => c.id);

// Shared buckets, duplicated directly from the existing Priority notifications screen.
// Each event applies to every channel unless overridden below.
export const BUCKETS = [
  {
    id: 'assigned_to_me',
    name: 'Assigned to me',
    items: [
      { id: 'assigned', label: 'A conversation is assigned to me' },
      { id: 'reply_mine', label: 'A new reply on a conversation assigned to me' },
      { id: 'mention', label: 'Someone @mentions me in a note' },
      { id: 'reassigned', label: 'A conversation is reassigned away from me' },
    ],
  },
  {
    id: 'new_activity',
    name: 'New activity',
    items: [
      { id: 'new_convo', label: 'A new conversation comes in', caption: "Real-time Chat, Slack, SMS or WhatsApp notifications won't show in the notification panel" },
      { id: 'reopened', label: 'A conversation is reopened' },
      { id: 'followed', label: 'A conversation I follow is updated' },
      { id: 'cust_reply', label: 'A customer replies' },
    ],
  },
  {
    id: 'deadlines_feedback',
    name: 'Deadlines & feedback',
    items: [
      { id: 'sla_first', label: 'First-response SLA is about to breach' },
      { id: 'sla_res', label: 'Resolution SLA is breached' },
      { id: 'csat', label: 'CSAT feedback is received' },
      { id: 'resolved', label: 'A conversation is marked resolved' },
    ],
  },
];

// Combo events: apply to more than one channel but not all of them.
// Kept separate from BUCKETS since they need an explicit channel allow-list.
export const CHANNEL_SPECIFIC_ACTIVITIES = [
  {
    id: 'reaction_added',
    label: 'Someone reacts to your message',
    channels: ['slack', 'chat', 'whatsapp'],
  },
  {
    id: 'delivery_failed',
    label: 'Message delivery fails',
    channels: ['sms', 'whatsapp', 'voice'],
  },
  {
    id: 'window_closing',
    label: 'Reply window is about to close',
    channels: ['whatsapp', 'sms'],
  },
];

// Helper: does this activity apply to this channel?
// Bucket items apply to all channels; combo activities only apply to their listed channels.
export function appliesTo(activityId, channelId) {
  const combo = CHANNEL_SPECIFIC_ACTIVITIES.find((a) => a.id === activityId);
  if (combo) return combo.channels.includes(channelId);
  return true;
}
