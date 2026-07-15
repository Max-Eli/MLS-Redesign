// Generates the RFC-5545 iCalendar (.ics) content for the 4 Year Anniversary
// event. Used by /api/calendar/anniversary.ics (served as a downloadable .ics
// file) and attached to the RSVP confirmation email. Opens natively in iOS
// Calendar, Google Calendar, and Outlook — no provider-picker needed.

const EVENT_UID    = 'anniversary-4-year-2026@manhattanlaserspa.com'
const EVENT_TITLE  = 'Manhattan Laser Spa · 4 Year Anniversary'
const EVENT_DESC   = 'Live music, champagne, raffles, goodie bags — and 30% off the entire menu, one night only. Bookable at the event. Questions: 305-705-3997'
const EVENT_LOC    = '16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160'
const EVENT_URL    = 'https://manhattanlaserspa.com/anniversary'

// Friday, August 7 2026 6:00 PM EDT (UTC-4) → 22:00 UTC
const DTSTART_UTC  = '20260807T220000Z'
// Friday 10:00 PM EDT → Sat 02:00 UTC
const DTEND_UTC    = '20260808T020000Z'

export function buildAnniversaryIcs(): string {
  // Stamped at build time — but the UID stays constant so calendars
  // recognize re-downloads as the same event, not a duplicate.
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').slice(0, 15) + 'Z'

  // Escape per RFC 5545: backslash, comma, semicolon, newline.
  const esc = (s: string) => s
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')

  // Lines must end with CRLF, and long lines should ideally be folded at 75
  // chars — but every modern calendar client tolerates un-folded lines, and
  // our description is short enough that folding adds complexity without
  // benefit. Keep it simple.
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Manhattan Laser Spa//Anniversary 2026//EN',
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
    `URL:${EVENT_URL}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Manhattan Laser Spa Anniversary tonight at 6 PM',
    'TRIGGER:-PT4H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n'
}
