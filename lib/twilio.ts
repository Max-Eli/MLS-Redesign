import twilio from 'twilio'

export type TwilioClient = ReturnType<typeof twilio>

// Build a Twilio client from explicit credentials (e.g. entered in the admin
// panel). Returns null if either credential is missing or the SDK rejects them.
export function makeTwilioClient(accountSid: string, authToken: string): TwilioClient | null {
  if (!accountSid || !authToken) return null
  try {
    return twilio(accountSid, authToken)
  } catch {
    return null
  }
}

// Lazy singleton so a missing TWILIO_* env (e.g. local dev) doesn't crash the
// module at import time — mirrors the getResend() pattern used elsewhere.
let _client: TwilioClient | null = null

export function getTwilio(): TwilioClient | null {
  if (_client) return _client
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) return null
  _client = twilio(sid, token)
  return _client
}

export function getTwilioFrom(): string | null {
  return process.env.TWILIO_FROM_NUMBER || null
}

// Normalize a user-entered phone string to E.164 (US default). RSVP phones are
// stored raw ("(305) 555-1234"), which Twilio rejects. Returns null when the
// input can't be confidently coerced — the caller should skip those rather than
// risk texting a wrong number.
export function toE164US(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  // Already E.164.
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed

  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}
