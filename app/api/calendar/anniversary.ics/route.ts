import { buildAnniversaryIcs } from '@/lib/anniversary-ics'

// Downloadable .ics file for the 4 Year Anniversary. Linking to this URL
// with an <a download> anchor triggers the native calendar app on iOS,
// Android, and desktop — one tap and the event is saved.
export function GET() {
  return new Response(buildAnniversaryIcs(), {
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="manhattan-laser-spa-anniversary.ics"',
      'Cache-Control':       'public, max-age=3600',
    },
  })
}
