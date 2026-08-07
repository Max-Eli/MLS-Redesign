'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, AlertTriangle, Loader2, CheckCircle2, Eye } from 'lucide-react'

const DEFAULT_MESSAGE =
  `Hi {name}! Reminder from Manhattan Laser Spa: our 4 Year Anniversary is TOMORROW, ` +
  `Fri Aug 7, 6–10 PM at 16850 Collins Ave Ste 105, Sunny Isles Beach. ` +
  `Champagne, live music, raffles & 30% off the entire menu — one night only. ` +
  `Can't wait to see you! Reply STOP to opt out, HELP for help.`

type Summary = { pending: number; sent: number; skippedInvalid: number; failed: number }
type ApiResult = {
  ok: boolean
  mode: 'dryRun' | 'test' | 'live'
  summary?: Summary
  remaining?: number
  wouldSendTo?: string[]
  sid?: string
  to?: string
  error?: string
}

const BATCH_SIZE = 10

export default function AdminRemindersPage() {
  const [accountSid, setAccountSid] = useState('')
  const [authToken,  setAuthToken]  = useState('')
  const [fromNumber, setFromNumber] = useState('')
  const [message,    setMessage]    = useState(DEFAULT_MESSAGE)
  const [campaign,   setCampaign]   = useState('')
  const [testNumber, setTestNumber] = useState('')

  const [busy,     setBusy]     = useState<null | 'dry' | 'test' | 'live'>(null)
  const [result,   setResult]   = useState<ApiResult | null>(null)
  const [error,    setError]    = useState('')
  const [progress, setProgress] = useState<{ sent: number; failed: number } | null>(null)

  // Suggest a date-based campaign name so consecutive-day sends differ by
  // default (set after mount to avoid an SSR/hydration mismatch).
  useEffect(() => {
    setCampaign(`reminder-${new Date().toISOString().slice(0, 10)}`)
  }, [])

  const canSend = campaign.trim().length > 0

  async function call(payload: Record<string, unknown>, kind: 'dry' | 'test' | 'live') {
    setBusy(kind)
    setError('')
    setResult(null)
    try {
      const res  = await fetch('/api/admin/send-reminders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ accountSid, authToken, fromNumber, message, campaign, ...payload }),
      })
      const data = await res.json() as ApiResult
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setBusy(null)
    }
  }

  // Send to everyone in batches of BATCH_SIZE: call the endpoint repeatedly,
  // each call sends the next batch and reports how many remain, until 0.
  async function sendAllBatched() {
    setBusy('live')
    setError('')
    setResult(null)
    setProgress({ sent: 0, failed: 0 })

    let sent = 0, failed = 0, invalid = 0
    // Safety cap so a persistent backend issue can't loop forever.
    for (let i = 0; i < 200; i++) {
      let data: ApiResult
      try {
        const res = await fetch('/api/admin/send-reminders', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ accountSid, authToken, fromNumber, message, campaign, batchSize: BATCH_SIZE }),
        })
        data = await res.json() as ApiResult
        if (!res.ok || !data.ok) { setError(data.error || 'Something went wrong.'); break }
      } catch {
        setError('Network error partway through — some texts may have sent. Re-run the same campaign to finish (already-sent guests are skipped).')
        break
      }

      sent    += data.summary?.sent ?? 0
      failed  += data.summary?.failed ?? 0
      invalid += data.summary?.skippedInvalid ?? 0
      setProgress({ sent, failed })

      if ((data.remaining ?? 0) <= 0) {
        setResult({ ok: true, mode: 'live', summary: { pending: 0, sent, skippedInvalid: invalid, failed } })
        break
      }
      // brief pause between batches to pace Twilio
      await new Promise(r => setTimeout(r, 700))
    }
    setProgress(null)
    setBusy(null)
  }

  const chars    = message.replace('{name}', 'Sarah').length
  const segments = Math.max(1, Math.ceil(chars / 153))

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Event Communications</p>
        <h1 className="font-display text-4xl font-light text-dark-50 mb-1">Send SMS Reminders</h1>
        <p className="text-sm text-dark-50/50">
          Text every attending RSVP for the 4 Year Anniversary. Enter your Twilio details, preview, then send.
        </p>
      </div>

      {/* Consent notice */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          These numbers were collected at RSVP without a separate SMS opt-in. Sending is your decision as the
          business owner. The STOP/HELP opt-out line is added automatically for A2P&nbsp;10DLC compliance, and
          no guest is ever texted twice.
        </p>
      </div>

      {/* Twilio credentials */}
      <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-6 mb-5 space-y-4">
        <h2 className="text-2xs font-medium tracking-widest uppercase text-dark-50/50">Twilio Credentials</h2>

        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">Account SID</label>
          <input
            type="text" value={accountSid} onChange={e => setAccountSid(e.target.value)}
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" autoComplete="off"
            className="w-full h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 font-mono placeholder:text-dark-50/25 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">Auth Token</label>
          <input
            type="password" value={authToken} onChange={e => setAuthToken(e.target.value)}
            placeholder="Your Twilio Auth Token" autoComplete="off"
            className="w-full h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 font-mono placeholder:text-dark-50/25 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
          <p className="mt-1.5 text-2xs text-dark-50/40">Used only for this send — never stored.</p>
        </div>

        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">From Number</label>
          <input
            type="tel" value={fromNumber} onChange={e => setFromNumber(e.target.value)}
            placeholder="+13055551234"
            className="w-full h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 font-mono placeholder:text-dark-50/25 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
          <p className="mt-1.5 text-2xs text-dark-50/40">Your SMS-enabled Twilio number, in E.164 format.</p>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xs font-medium tracking-widest uppercase text-dark-50/50 flex items-center gap-2">
            <MessageSquare size={13} /> Message
          </h2>
          <span className="text-2xs text-dark-50/40 tabular-nums">
            ~{chars} chars · {segments} segment{segments === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">Campaign name</label>
          <input
            type="text" value={campaign} onChange={e => setCampaign(e.target.value)}
            placeholder="e.g. day-before-reminder"
            className="w-full h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
          <p className="mt-1.5 text-2xs text-dark-50/40">
            Give each separate send a new name. Everyone attending gets a fresh send under a new name;
            reusing a name only reaches people that name hasn&apos;t reached yet (safe to re-run).
          </p>
        </div>

        <textarea
          value={message} onChange={e => setMessage(e.target.value)} rows={6}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 leading-relaxed placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all resize-none"
        />
        <p className="mt-2 text-2xs text-dark-50/40">
          Use <code className="px-1 py-0.5 bg-cream-100 rounded text-dark-50/60">{'{name}'}</code> to insert each
          guest&apos;s first name. A STOP/HELP line is appended automatically if you remove it.
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-6 space-y-4">
        {/* Preview + test row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => call({ dryRun: true }, 'dry')}
            disabled={busy !== null || !canSend}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-cream-300 bg-white text-dark-50 text-xs font-semibold tracking-widest uppercase hover:bg-cream-50 transition-colors disabled:opacity-40"
          >
            {busy === 'dry' ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Preview count
          </button>

          <div className="flex-1 flex gap-2">
            <input
              type="tel" value={testNumber} onChange={e => setTestNumber(e.target.value)}
              placeholder="+1… test to your phone"
              className="flex-1 h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 font-mono placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
            />
            <button
              onClick={() => call({ test: testNumber }, 'test')}
              disabled={busy !== null || !testNumber.trim() || !canSend}
              className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-cream-300 bg-white text-dark-50 text-xs font-semibold tracking-widest uppercase hover:bg-cream-50 transition-colors disabled:opacity-40"
            >
              {busy === 'test' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Test
            </button>
          </div>
        </div>

        {/* Send to all */}
        <button
          onClick={() => {
            if (confirm(`Send this SMS to every attending RSVP not yet reached in campaign "${campaign}", in batches of ${BATCH_SIZE}? This cannot be undone.`)) {
              sendAllBatched()
            }
          }}
          disabled={busy !== null || !canSend}
          className="w-full flex items-center justify-center gap-2 h-13 py-3.5 rounded-xl bg-mauve text-white text-sm font-semibold tracking-widest uppercase hover:bg-mauve-600 transition-colors disabled:opacity-50"
        >
          {busy === 'live' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {busy === 'live'
            ? `Sending… ${progress?.sent ?? 0} sent`
            : `Send to all attending RSVPs (batches of ${BATCH_SIZE})`}
        </button>

        {busy === 'live' && progress && (
          <p className="text-center text-2xs text-dark-50/50 tabular-nums">
            {progress.sent} sent{progress.failed ? ` · ${progress.failed} failed` : ''} — keep this tab open until it finishes.
          </p>
        )}
      </div>

      {/* Result / error */}
      {error && (
        <div className="mt-5 flex gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-5 flex gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800 leading-relaxed">
            {result.mode === 'dryRun' && (
              <>
                <p className="font-medium">Preview — nothing sent.</p>
                <p className="mt-1 text-green-700">
                  {result.summary?.pending ?? 0} attending RSVP(s) pending
                  {result.summary?.skippedInvalid ? `, ${result.summary.skippedInvalid} with an unusable phone number` : ''}.
                </p>
              </>
            )}
            {result.mode === 'test' && (
              <p className="font-medium">Test message sent to {result.to}. Check your phone.</p>
            )}
            {result.mode === 'live' && (
              <>
                <p className="font-medium">Reminders sent.</p>
                <p className="mt-1 text-green-700">
                  {result.summary?.sent ?? 0} sent
                  {result.summary?.skippedInvalid ? `, ${result.summary.skippedInvalid} skipped (bad number)` : ''}
                  {result.summary?.failed ? `, ${result.summary.failed} failed` : ''}.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
