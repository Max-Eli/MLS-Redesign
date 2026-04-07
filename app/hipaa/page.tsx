import type { Metadata } from 'next'
import { LegalPage } from '@/components/ui/LegalPage'

export const metadata: Metadata = {
  title: 'HIPAA Notice of Privacy Practices | Manhattan Laser Spa',
  description: 'HIPAA Notice of Privacy Practices for Manhattan Laser Spa in Sunny Isles Beach, Florida.',
  alternates: { canonical: 'https://manhattanlaserspa.com/hipaa' },
}

export default function HipaaPage() {
  return (
    <LegalPage eyebrow="Legal" title="HIPAA Notice of Privacy Practices" lastUpdated="April 7, 2026">
      <p>
        <strong>THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</strong>
      </p>
      <p>
        Manhattan Laser Spa ("we," "our," or "us") is required by law to maintain the privacy of your protected health information (PHI), to provide you with this Notice of Privacy Practices, and to abide by the terms of the Notice currently in effect.
      </p>

      <h2>1. How We May Use and Disclose Your Health Information</h2>
      <h3>Treatment</h3>
      <p>
        We may use and disclose your PHI to provide, coordinate, or manage your treatment and related services. For example, we may share information with licensed medical professionals involved in your care, or contact your primary care physician if a medical concern arises during treatment.
      </p>
      <h3>Payment</h3>
      <p>
        We may use and disclose your PHI to obtain payment for services we provide. For example, we may submit billing information to your insurance carrier or a financing provider.
      </p>
      <h3>Health Care Operations</h3>
      <p>
        We may use and disclose your PHI for our internal business operations, including quality assurance, staff training, compliance reviews, and business management activities.
      </p>
      <h3>Appointment Reminders</h3>
      <p>
        We may contact you to remind you of scheduled appointments via phone, text, or email using the contact information you have provided.
      </p>

      <h2>2. Other Permitted Uses and Disclosures</h2>
      <p>We may also use or disclose your PHI without your written authorization in the following circumstances:</p>
      <ul>
        <li><strong>As required by law:</strong> including public health reporting, law enforcement, judicial proceedings, or government oversight</li>
        <li><strong>Health oversight activities:</strong> audits, inspections, or investigations by authorized agencies</li>
        <li><strong>To avert serious threats:</strong> when necessary to prevent serious and imminent threats to your health or safety or the health or safety of others</li>
        <li><strong>Business associates:</strong> third-party vendors who perform services on our behalf (such as billing or IT support) under written confidentiality agreements</li>
      </ul>

      <h2>3. Uses and Disclosures Requiring Your Authorization</h2>
      <p>
        Other uses and disclosures of your PHI — including most marketing communications and sale of PHI — will be made only with your written authorization. You may revoke any authorization you provide at any time by notifying us in writing, except where we have already acted in reliance on the authorization.
      </p>

      <h2>4. Your Rights Regarding Your Health Information</h2>
      <h3>Right to Access</h3>
      <p>
        You have the right to inspect and obtain a copy of your PHI that is maintained in our records. We may charge a reasonable, cost-based fee. Requests may be submitted in writing to the address below.
      </p>
      <h3>Right to Amend</h3>
      <p>
        You have the right to request that we amend PHI that you believe is inaccurate or incomplete. We may deny your request under certain circumstances and will provide a written explanation if we do so.
      </p>
      <h3>Right to an Accounting of Disclosures</h3>
      <p>
        You have the right to request a list of disclosures of your PHI we have made in the past six years, other than disclosures made for treatment, payment, or healthcare operations.
      </p>
      <h3>Right to Request Restrictions</h3>
      <p>
        You may request that we restrict how we use or disclose your PHI. We are not required to agree to all restrictions, but we will comply with any restriction to which we do agree.
      </p>
      <h3>Right to Confidential Communications</h3>
      <p>
        You may request that we communicate with you about your health information by alternative means or at alternative locations (e.g., a different phone number or mailing address).
      </p>
      <h3>Right to a Paper Copy of This Notice</h3>
      <p>
        You have the right to receive a paper copy of this Notice upon request, even if you have agreed to receive it electronically.
      </p>

      <h2>5. Our Duties</h2>
      <p>We are required by law to:</p>
      <ul>
        <li>Maintain the privacy of your PHI</li>
        <li>Provide you with this Notice of our legal duties and privacy practices</li>
        <li>Notify you if we become aware of a breach that unsecures your PHI</li>
        <li>Abide by the terms of the Notice currently in effect</li>
      </ul>
      <p>
        We reserve the right to change this Notice at any time. Changes will apply to PHI we already hold as well as PHI we receive in the future. We will post the updated Notice in our office and on our website.
      </p>

      <h2>6. Complaints</h2>
      <p>
        If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services Office for Civil Rights. We will not retaliate against you for filing a complaint.
      </p>
      <p>
        <strong>HHS Office for Civil Rights:</strong><br />
        200 Independence Ave SW, Washington, DC 20201<br />
        <a href="https://www.hhs.gov/hipaa" target="_blank" rel="noopener noreferrer">hhs.gov/hipaa</a> · 1-800-368-1019
      </p>

      <h2>7. Contact Our Privacy Officer</h2>
      <p>
        For questions about this Notice or to exercise your rights, contact us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:florida@manhattanlaserspa.com">florida@manhattanlaserspa.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+13057053997">305-705-3997</a></li>
        <li><strong>Address:</strong> 16850 Collins Ave, Suite 105, Sunny Isles Beach, FL 33160</li>
      </ul>
    </LegalPage>
  )
}
