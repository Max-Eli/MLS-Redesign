import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/ui/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service | Manhattan Laser Spa',
  description: 'Terms of Service for Manhattan Laser Spa in Sunny Isles Beach, Florida.',
  alternates: { canonical: 'https://manhattanlaserspa.com/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" lastUpdated="April 7, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of the Manhattan Laser Spa website at <strong>manhattanlaserspa.com</strong> and any services provided by Manhattan Laser Spa ("we," "our," or "us"), located at 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160. By accessing our website or booking our services, you agree to be bound by these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years of age to use our website or purchase our services. Clients between the ages of 16 and 18 may receive certain treatments with written parental or guardian consent and the guardian's presence at the time of treatment. By using our services, you represent and warrant that you meet these requirements.
      </p>

      <h2>2. Services and Medical Disclaimer</h2>
      <p>
        Manhattan Laser Spa provides aesthetic and wellness treatments performed by trained professionals. Our services are not a substitute for professional medical advice, diagnosis, or treatment. Nothing on this website constitutes medical advice.
      </p>
      <p>
        Individual results vary. We make no guarantees regarding specific outcomes of any treatment. During your consultation, our team will assess your suitability for specific services and discuss realistic expectations.
      </p>
      <p>
        It is your responsibility to disclose accurate and complete health history, medications, allergies, and any conditions that may affect your treatment. Providing false or incomplete information may result in injury for which Manhattan Laser Spa bears no liability.
      </p>

      <h2>3. Appointments and Cancellations</h2>
      <h3>Booking</h3>
      <p>
        Appointments may be booked online, by phone, or in person. A valid credit card may be required to hold an appointment.
      </p>
      <h3>Cancellation and No-Show Policy</h3>
      <p>
        We ask for at least <strong>24 hours' notice</strong> for cancellations or rescheduling. Late cancellations or no-shows may result in a cancellation fee. Repeated no-shows may result in a requirement to prepay for future appointments.
      </p>
      <h3>Late Arrivals</h3>
      <p>
        Arriving more than 15 minutes late may result in a shortened treatment or rescheduling at our discretion, and the full service fee may still apply.
      </p>

      <h2>4. Payment</h2>
      <p>
        All prices are listed in U.S. dollars. Payment is due at the time of service unless otherwise arranged. We accept major credit cards, debit cards, and buy-now-pay-later options including Affirm and Klarna, subject to their respective terms. Prepaid packages and gift cards are non-refundable except as outlined in our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>5. Refunds</h2>
      <p>
        Please review our <Link href="/refund-policy">Refund Policy</Link> for complete information regarding refunds, which are generally not provided except under specific qualifying circumstances.
      </p>

      <h2>6. Health and Safety</h2>
      <p>
        You acknowledge that aesthetic treatments carry inherent risks and agree to follow all pre- and post-treatment instructions provided by our staff. Manhattan Laser Spa reserves the right to decline or discontinue service to any client at any time if we determine that treatment is not in the client's best interest or presents a safety concern.
      </p>

      <h2>7. Consent</h2>
      <p>
        Prior to receiving treatment, you will be required to sign a written informed consent form acknowledging the nature of the treatment, associated risks, and your agreement to proceed. Electronic consent collected through our website has the same legal effect as a handwritten signature.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        All content on this website — including text, images, logos, graphics, and videos — is the property of Manhattan Laser Spa or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
      </p>

      <h2>9. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the website for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Submit false, misleading, or fraudulent information</li>
        <li>Interfere with the operation of the website</li>
        <li>Engage in any conduct that could damage our reputation or the experience of other clients</li>
      </ul>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by Florida law, Manhattan Laser Spa and its owners, employees, and agents shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your use of our website or services, even if we have been advised of the possibility of such damages. Our total liability to you for any claim shall not exceed the amount you paid for the specific service giving rise to the claim.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Manhattan Laser Spa, its owners, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of our services, your violation of these Terms, or your provision of inaccurate health information.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Your use of our website and services is also governed by our <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference.
      </p>

      <h2>13. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services shall be resolved exclusively in the state or federal courts located in Miami-Dade County, Florida, and you consent to the personal jurisdiction of such courts.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be effective upon posting to this page with an updated "Last updated" date. Your continued use of our website or services after any changes constitutes your acceptance of the revised Terms.
      </p>

      <h2>15. Contact Us</h2>
      <p>For questions about these Terms, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+13057053997">305-705-3997</a></li>
        <li><strong>Address:</strong> 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160</li>
      </ul>
    </LegalPage>
  )
}
