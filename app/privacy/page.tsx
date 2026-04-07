import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/ui/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy | Manhattan Laser Spa',
  description: 'Privacy Policy for Manhattan Laser Spa in Sunny Isles Beach, Florida.',
  alternates: { canonical: 'https://manhattanlaserspa.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" lastUpdated="April 7, 2026">
      <p>
        Manhattan Laser Spa ("we," "our," or "us"), located at 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at <strong>manhattanlaserspa.com</strong> or interact with us in connection with our services.
      </p>
      <p>
        Please read this policy carefully. By using our website or services, you agree to the practices described below. If you do not agree, please discontinue use of our website.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information You Provide Directly</h3>
      <ul>
        <li><strong>Contact information:</strong> name, email address, phone number</li>
        <li><strong>Appointment and intake information:</strong> treatment preferences, health history relevant to services</li>
        <li><strong>Payment information:</strong> credit/debit card details processed securely through Stripe (we do not store full card numbers)</li>
        <li><strong>Communications:</strong> messages, inquiries, and feedback you send us</li>
        <li><strong>Marketing opt-in:</strong> consent to receive SMS or email marketing messages</li>
      </ul>
      <h3>Information Collected Automatically</h3>
      <ul>
        <li>IP address, browser type, device type, and operating system</li>
        <li>Pages visited, time spent on site, and referring URLs</li>
        <li>Cookies and similar tracking technologies (see Section 6)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Schedule, confirm, and manage appointments</li>
        <li>Process payments and send receipts</li>
        <li>Respond to inquiries and provide customer support</li>
        <li>Send appointment reminders and follow-up communications</li>
        <li>Send promotional messages, special offers, and spa updates — only where you have provided consent</li>
        <li>Comply with legal obligations, including HIPAA where applicable</li>
        <li>Improve our website, services, and marketing</li>
      </ul>

      <h2>3. SMS and Text Message Communications</h2>
      <p>
        If you opt in to receive SMS messages from Manhattan Laser Spa, you agree to receive recurring automated marketing and transactional text messages (such as appointment reminders and promotional offers) at the mobile number you provide.
      </p>
      <ul>
        <li>Consent is not a condition of purchase</li>
        <li>Message and data rates may apply</li>
        <li>Message frequency varies</li>
        <li>Reply <strong>STOP</strong> at any time to unsubscribe; reply <strong>HELP</strong> for assistance</li>
        <li>Carrier is not liable for delayed or undelivered messages</li>
      </ul>
      <p>
        We do not sell, share, or rent your phone number or SMS opt-in data to third parties for their own marketing purposes.
      </p>

      <h2>4. How We Share Your Information</h2>
      <p>We do not sell your personal information. We may share it with:</p>
      <ul>
        <li><strong>Service providers:</strong> third parties that help us operate our business (payment processors like Stripe, database hosting, email/SMS platforms) under confidentiality agreements</li>
        <li><strong>Healthcare partners:</strong> licensed medical professionals involved in your treatment, as permitted under HIPAA</li>
        <li><strong>Legal authorities:</strong> when required by law, court order, or governmental authority</li>
        <li><strong>Business transfers:</strong> in the event of a merger, acquisition, or sale of all or a portion of our assets</li>
      </ul>

      <h2>5. Protected Health Information (HIPAA)</h2>
      <p>
        To the extent that Manhattan Laser Spa collects and uses protected health information (PHI) in connection with medical or clinical services, we comply with the Health Insurance Portability and Accountability Act (HIPAA). Our separate <Link href="/hipaa">HIPAA Notice of Privacy Practices</Link> governs the use and disclosure of such information.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies and similar technologies to enhance your experience, analyze traffic, and support our marketing. You may disable cookies in your browser settings; however, some features of the website may not function properly as a result.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain personal information for as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Health-related records are retained in accordance with Florida law and HIPAA requirements.
      </p>

      <h2>8. Your Rights and Choices</h2>
      <p>Depending on applicable law, you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal information</li>
        <li>Opt out of marketing communications at any time</li>
        <li>Request a copy of data we hold about you</li>
        <li>Lodge a complaint with a supervisory authority</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{' '}
        <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a>.
      </p>

      <h2>9. Children's Privacy</h2>
      <p>
        Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately.
      </p>

      <h2>10. Security</h2>
      <p>
        We implement industry-standard technical and organizational measures to protect your information against unauthorized access, loss, or misuse. Payment processing is handled exclusively through Stripe's PCI-DSS-compliant infrastructure.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. When we do, we will revise the "Last updated" date at the top of this page. Your continued use of our website after any changes constitutes acceptance of the updated policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+13057053997">305-705-3997</a></li>
        <li><strong>Address:</strong> 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160</li>
      </ul>
    </LegalPage>
  )
}
