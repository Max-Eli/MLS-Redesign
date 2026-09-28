import { buildBotoxEventIcs } from '@/lib/botox-event'

// Downloadable .ics for The Botox Event — one tap saves it to the native
// calendar app on iOS, Android, and desktop.
export function GET() {
  return new Response(buildBotoxEventIcs(), {
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="manhattan-laser-spa-botox-event.ics"',
      'Cache-Control':       'public, max-age=3600',
    },
  })
}
