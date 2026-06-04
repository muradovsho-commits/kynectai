import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Privacy Policy — OfferBell",
  description: "How OfferBell collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 4, 2026">

      <p>
        OfferBell (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;OfferBell&rdquo;) provides a recruiting training platform for college students pursuing finance and consulting careers. This Privacy Policy explains what information we collect when you use OfferBell, how we use it, who we share it with, and the rights you have over it.
      </p>

      <p>
        By using OfferBell, you agree to this Privacy Policy. If you don&rsquo;t agree, please don&rsquo;t use the service.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>Account information you give us</h3>
      <p>When you sign up, we collect your name, email address, and a password (stored hashed, never in plaintext). If you complete onboarding, we collect your school, graduation year, career track interests, and similar profile details you choose to share.</p>

      <h3>Payment information</h3>
      <p>If you purchase a Pro or Elite plan, payment is processed by <strong>Stripe</strong>. We never see or store your full credit card number — only the last four digits, expiration month/year, and card brand for display purposes. Your full card data lives only in Stripe&rsquo;s vault. Stripe&rsquo;s privacy practices apply to the payment data they handle: see <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.</p>

      <h3>Content you create on the platform</h3>
      <p>This includes outreach messages you generate, mock interview transcripts, resume documents you upload, coach conversations, flashcard performance, diagnostic results, contacts you add to your outreach tracker, and notes you write. We store this data so the product can function — e.g., so your dashboard shows your progress across sessions.</p>

      <h3>Usage information we collect automatically</h3>
      <p>We collect information about how you use OfferBell: which features you access, when you sign in, your approximate location derived from your IP address (city/region level), the device and browser you use, and timestamps of your actions. This is used to operate the service, enforce plan limits, and improve the product.</p>

      <h3>Optional integrations</h3>
      <p>If you connect your Gmail or Outlook account, we receive an OAuth access token from Google or Microsoft that lets OfferBell read recent emails for outreach sync. You can revoke this access anytime from your account settings or directly in Google/Microsoft account permissions.</p>

      <h2>2. How We Use Your Information</h2>

      <ul>
        <li><strong>To run the service:</strong> save your progress, render your dashboard, enforce plan limits, send AI-generated outputs back to you</li>
        <li><strong>To process payments:</strong> forward billing details to Stripe, receive subscription status webhooks, manage your plan</li>
        <li><strong>To communicate with you:</strong> send transactional emails (account confirmation, payment receipts, password resets, plan change confirmations) and occasional product updates</li>
        <li><strong>To improve OfferBell:</strong> aggregated usage analytics, A/B testing of new features, debugging</li>
        <li><strong>To enforce our Terms:</strong> investigate suspected abuse, fraud, or violations</li>
        <li><strong>To comply with legal obligations:</strong> respond to lawful requests, tax records, accounting requirements</li>
      </ul>

      <p>We do <strong>not</strong> sell your personal information. We do <strong>not</strong> use your content (resumes, outreach drafts, etc.) to train AI models. The AI features in OfferBell use third-party model providers (see below); your inputs are sent to those providers only to generate the response you requested, not for their training data, per their commercial API terms.</p>

      <h2>3. AI Features and Third-Party Model Providers</h2>

      <p>OfferBell uses third-party AI providers to power features like outreach generation, resume review, coach chat, and mock interview grading. The current providers are Google (Gemini), Anthropic (Claude), and may change over time. When you use these features, the text you input is sent to the provider&rsquo;s API to generate a response.</p>

      <p>Both providers&rsquo; commercial API agreements state that customer API data is not used to train their models and is retained only for short periods (typically 30 days or less) for abuse monitoring. We don&rsquo;t use any free or consumer-facing AI tier that would have different data terms.</p>

      <p>AI outputs are generated content, not professional advice. We make no guarantees about their accuracy or suitability for a particular career outcome. You are responsible for reviewing anything OfferBell suggests before using it.</p>

      <h2>4. Who We Share Information With (Subprocessors)</h2>

      <p>We share information only with the third-party service providers we rely on to operate OfferBell. Each processes data only as needed to provide its service to us, under its own terms and privacy commitments:</p>

      <ul>
        <li><strong>Stripe</strong> — payment processing and subscription billing</li>
        <li><strong>Convex</strong> — database and backend hosting (stores your account and content data)</li>
        <li><strong>Vercel</strong> — application hosting and content delivery</li>
        <li><strong>Google (Gemini)</strong> and <strong>Anthropic (Claude)</strong> — AI model inference for the outreach, resume review, coach, and mock interview features</li>
        <li><strong>Resend</strong> — delivery of transactional emails (verification, password reset, receipts, plan changes)</li>
        <li><strong>Apollo</strong> — contact search and enrichment used by the outreach and contact finder feature</li>
        <li><strong>Sentry</strong> — error monitoring and diagnostics. When an error occurs, Sentry may receive technical data including your IP address, browser and device details, the page and action involved, and your account identifier, so we can diagnose and fix the problem</li>
        <li><strong>Google / Microsoft</strong> — only if you connect Gmail or Outlook (OAuth scope is limited to what&rsquo;s needed for outreach sync)</li>
      </ul>

      <p>This list may change as our infrastructure evolves; we will keep this section current. We may also disclose information when required by law (subpoena, court order, valid government request), to enforce our Terms, to prevent fraud or abuse, or in connection with a business transfer (e.g., acquisition). We will notify users if we&rsquo;re part of a business transfer, unless legally prohibited.</p>

      <h2>5. Data Retention</h2>

      <p>We keep your account data while your account is active. If you delete your account, we delete or anonymize your personal information within 30 days, except where we have a legal obligation to retain it (e.g., payment records for tax purposes — typically up to 7 years).</p>

      <p>Backups may retain deleted data for up to an additional 30 days before being cycled out. Anonymized aggregate analytics may be retained indefinitely.</p>

      <h2>6. Your Rights</h2>

      <p>You have the following rights regarding your data:</p>

      <ul>
        <li><strong>Access:</strong> request a copy of the personal information we hold about you</li>
        <li><strong>Correction:</strong> ask us to fix inaccurate or incomplete information</li>
        <li><strong>Deletion:</strong> ask us to delete your account and associated data</li>
        <li><strong>Portability:</strong> request your data in a portable format</li>
        <li><strong>Objection:</strong> object to specific uses of your data (e.g., product analytics)</li>
      </ul>

      <p>To exercise any of these rights, email <a href="mailto:officialofferbell@gmail.com">officialofferbell@gmail.com</a> from the address on your account. We respond within 30 days.</p>

      <p>If you&rsquo;re a California resident, you have additional rights under the CCPA, including the right to know what categories of personal information we collect and the right to opt out of any &ldquo;sale&rdquo; of personal information. We do not sell personal information.</p>

      <p>If you&rsquo;re in the EU/UK, you have rights under GDPR/UK-GDPR including those listed above plus the right to lodge a complaint with your local data protection authority. Our legal basis for processing your data is the contract you enter when you sign up (Article 6(1)(b)) and our legitimate interest in operating and improving the service (Article 6(1)(f)).</p>

      <h2>7. Security</h2>

      <p>We use industry-standard measures to protect your information: encryption in transit (HTTPS), encryption at rest by our database provider, hashed passwords, and access controls limiting who on the OfferBell team can view production data.</p>

      <p>No system is perfectly secure. If we discover a breach affecting your personal information, we will notify affected users in line with applicable law.</p>

      <h2>8. Children</h2>

      <p>OfferBell is intended for users 13 and older. We do not knowingly collect information from children under 13. If you believe a child under 13 has provided information to us, contact us at <a href="mailto:officialofferbell@gmail.com">officialofferbell@gmail.com</a> and we will delete it.</p>

      <h2>9. International Users</h2>

      <p>OfferBell is operated from the United States. If you access OfferBell from outside the US, your information will be transferred to and processed in the US. By using OfferBell, you consent to this transfer.</p>

      <h2>10. Changes to This Policy</h2>

      <p>We may update this Privacy Policy from time to time. Material changes will be communicated by email to your account address or by a notice in the app. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision. Continued use of OfferBell after changes take effect constitutes acceptance.</p>

      <h2>11. Contact Us</h2>

      <p>Questions about this Privacy Policy or your data:</p>

      <p>
        Email: <a href="mailto:officialofferbell@gmail.com">officialofferbell@gmail.com</a><br/>
        Web: <a href="https://offerbell.org">offerbell.org</a>
      </p>

    </LegalLayout>
  );
}
