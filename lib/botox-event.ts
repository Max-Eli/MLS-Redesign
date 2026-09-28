// The Botox Event — Thursday, October 15, 2026, 4–8 PM.
// Event constants + RFC-5545 .ics builder, mirroring lib/anniversary-ics.ts.

export const BOTOX_EVENT = {
  slug:     'botox-event-oct-2026',
  label:    'The Botox Event',
  date:     'Thursday, October 15, 2026',
  dateShort:'Thursday, October 15',
  time:     '4:00 PM – 8:00 PM',
  address1: '16850 Collins Ave, Suite 105',
  address2: 'Sunny Isles Beach, FL',
  phone:    '305-705-3997',
  phoneRaw: '+13057053997',
  instagram:'manhattanlaserspa_sunnyisles',
  page:     'https://manhattanlaserspa.com/botox-event',
}

const EVENT_UID   = 'botox-event-oct-2026@manhattanlaserspa.com'
const EVENT_TITLE = 'Manhattan Laser Spa · The Botox Event'
const EVENT_DESC  = 'Botox at $6.99 per unit — during the event only. Complimentary consultations, champagne, raffles & goodie bags. Questions: 305-705-3997'
const EVENT_LOC   = '16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160'

// Thursday, October 15 2026 4:00 PM EDT (UTC-4) → 20:00 UTC
const DTSTART_UTC = '20261015T200000Z'
// 8:00 PM EDT → Fri 00:00 UTC
const DTEND_UTC   = '20261016T000000Z'

export function buildBotoxEventIcs(): string {
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, 15) + 'Z'

  const esc = (s: string) => s
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Manhattan Laser Spa//Botox Event 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${EVENT_UID}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${DTSTART_UTC}`,
    `DTEND:${DTEND_UTC}`,
    `SUMMARY:${esc(EVENT_TITLE)}`,
    `DESCRIPTION:${esc(EVENT_DESC)}`,
    `LOCATION:${esc(EVENT_LOC)}`,
    `URL:${BOTOX_EVENT.page}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:The Botox Event at Manhattan Laser Spa today at 4 PM',
    'TRIGGER:-PT4H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n'
}
