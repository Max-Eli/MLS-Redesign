import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/ui/LegalPage'

export const metadata: Metadata = {
  title: 'Refund Policy | Manhattan Laser Spa',
  description: 'Refund and cancellation policy for Manhattan Laser Spa in Sunny Isles Beach, Florida.',
  alternates: { canonical: 'https://manhattanlaserspa.com/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Refund Policy" lastUpdated="April 7, 2026">
      <p>
        At Manhattan Laser Spa, we are committed to delivering exceptional results and service. Please read this Refund Policy carefully before purchasing any service or package. By completing a purchase, you acknowledge and agree to the terms below.
      </p>

      <h2>1. All Sales Are Final</h2>
      <p>
        <strong>Manhattan Laser Spa does not offer refunds on services rendered, prepaid treatment packages, or promotional purchases.</strong> All sales are considered final at the time of payment.
      </p>
      <p>
        We invest significant time, resources, and expertise in every treatment. Because aesthetic results vary by individual based on skin type, lifestyle, health factors, and adherence to aftercare instructions, dissatisfaction with outcomes alone does not constitute grounds for a refund.
      </p>

      <h2>2. Prepaid Packages and Series</h2>
      <p>
        Prepaid treatment packages and service bundles are non-refundable. Unused sessions within a package may be transferred to a different treatment of equal or lesser value, or applied as spa credit, at the sole discretion of management.
      </p>
      <p>
        Packages do not expire, however sessions must be used within <strong>24 months</strong> of the purchase date. Sessions unused after 24 months are forfeited without refund.
      </p>

      <h2>3. Gift Cards</h2>
      <p>
        Gift cards are non-refundable and non-redeemable for cash. Lost or stolen gift cards cannot be replaced. Gift cards are valid for 5 years from the date of purchase in accordance with Florida law.
      </p>

      <h2>4. Special Qualifying Circumstances</h2>
      <p>
        We understand that exceptional circumstances arise. Refund requests <strong>may</strong> be considered — at our sole discretion — under the following limited conditions:
      </p>
      <ul>
        <li>
          <strong>Medical contraindication:</strong> A licensed physician has determined in writing that you cannot receive the purchased treatment due to a newly diagnosed medical condition that was unknown at the time of purchase and could not have been disclosed during intake.
        </li>
        <li>
          <strong>Service not rendered:</strong> You were charged for a session that was never performed due to an error on our part.
        </li>
        <li>
          <strong>Duplicate charge:</strong> A billing error resulted in you being charged more than once for the same service.
        </li>
      </ul>
      <p>
        All qualifying requests require supporting documentation (e.g., a letter from your physician on official letterhead, or evidence of a billing error). Submitting a request does not guarantee approval.
      </p>

      <h2>5. How to Request a Review</h2>
      <p>
        Refund requests are accepted <strong>by email only</strong>. We do not accept refund requests by phone, in person, or through third-party chargeback processes before contacting us first.
      </p>
      <p>To submit a request:</p>
      <ul>
        <li>Email us at <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a></li>
        <li>Use the subject line: <strong>"Refund Request – [Your Full Name]"</strong></li>
        <li>Include your name, date of purchase, service purchased, and a detailed explanation of your circumstances</li>
        <li>Attach any supporting documentation</li>
      </ul>
      <p>
        We aim to respond to all refund inquiries within <strong>5 business days</strong>. If your request is approved, refunds are issued to the original payment method within 7–10 business days.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        If you initiate a chargeback with your bank or credit card issuer without first contacting us and allowing us the opportunity to resolve the matter, we reserve the right to dispute the chargeback and provide evidence of service delivery. Clients who initiate unjustified chargebacks may be suspended from booking future appointments.
      </p>

      <h2>7. Online Purchases</h2>
      <p>
        Services purchased through our website are subject to this same policy. Completing payment online constitutes your acceptance of these terms.
      </p>

      <h2>8. Questions</h2>
      <p>
        If you have questions about this policy before making a purchase, please contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+13057053997">305-705-3997</a></li>
        <li><strong>Address:</strong> 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160</li>
      </ul>
    </LegalPage>
  )
}
