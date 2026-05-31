import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Refund Policy — OfferBell",
  description: "OfferBell's policy on refunds and subscription cancellation.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="May 31, 2026">

      <p>
        This policy explains how refunds and cancellations work for OfferBell subscriptions. Together with our <a href="/terms">Terms of Service</a>, it forms part of the agreement between you and OfferBell.
      </p>

      <h2>1. Subscriptions are non-refundable</h2>

      <p>
        OfferBell&rsquo;s paid plans (Pro and Elite) are billed in advance for monthly, six-month, or annual periods. <strong>We do not provide refunds for partial billing periods or unused subscription time.</strong> This includes cases where:
      </p>

      <ul>
        <li>You change your mind after subscribing</li>
        <li>You no longer need the service</li>
        <li>You stop using the platform but forget to cancel</li>
        <li>You signed up by mistake or for the wrong tier</li>
        <li>You receive a job offer or internship and don&rsquo;t need OfferBell anymore</li>
      </ul>

      <p>
        Before subscribing, you can use the Free tier to evaluate whether OfferBell is right for you. Most paid features have a small free allowance so you can try them before committing.
      </p>

      <h2>2. Cancelling Your Subscription</h2>

      <p>
        You can cancel a paid subscription at any time from the <strong>My Account</strong> page. When you cancel:
      </p>

      <ul>
        <li>Your subscription stops auto-renewing</li>
        <li>You keep full access to all paid features until the end of your current billing period</li>
        <li>At the end of that period, your account downgrades to the Free tier — you don&rsquo;t lose your data, just access to paid features</li>
      </ul>

      <p>
        Cancelling does <strong>not</strong> trigger a refund of the period you already paid for. If you cancel mid-month on a monthly plan, you still have access for the rest of that month.
      </p>

      <h2>3. Failed Payments</h2>

      <p>
        If a renewal charge fails (declined card, expired card, insufficient funds), Stripe automatically retries the charge per its default schedule (typically ~4 retries over ~3 weeks). During the retry window, your account stays active and you keep paid access. If all retries fail, the subscription is cancelled and your account downgrades to Free.
      </p>

      <p>
        If you want to keep your subscription, update your payment method from the My Account page before the retry window ends. We&rsquo;ll show a banner on your account page when your payment is past due.
      </p>

      <h2>4. Exceptions</h2>

      <p>
        We may grant refunds at our discretion in limited circumstances:
      </p>

      <ul>
        <li><strong>Duplicate charges:</strong> if you were billed twice for the same period due to a technical error, we&rsquo;ll refund the duplicate</li>
        <li><strong>Unauthorized charges:</strong> if your account was charged without authorization (e.g., a family member used your card without permission), contact us immediately and we&rsquo;ll work with you to resolve it</li>
        <li><strong>Service outage:</strong> if OfferBell experiences an extended outage (more than 7 consecutive days) preventing you from using the service, we&rsquo;ll credit your account or issue a partial refund proportional to the lost time</li>
        <li><strong>Legal requirements:</strong> if applicable consumer protection law in your jurisdiction requires a refund, we comply</li>
      </ul>

      <p>
        To request a refund under any of the above, email <a href="mailto:support@offerbell.org">support@offerbell.org</a> from the address on your account within 30 days of the charge. Include your account email, the date and amount of the charge, and the reason for the refund request. We respond within 5 business days.
      </p>

      <h2>5. Chargebacks</h2>

      <p>
        Disputing a charge with your bank or credit card company without first contacting us is considered a chargeback. Initiating a chargeback for a charge that&rsquo;s valid under this Policy may result in:
      </p>

      <ul>
        <li>Immediate suspension of your OfferBell account</li>
        <li>Loss of access to your saved content (outreach drafts, mock interview recordings, notes, etc.)</li>
        <li>Banning of your email address from future OfferBell signups</li>
      </ul>

      <p>
        Please contact us at <a href="mailto:support@offerbell.org">support@offerbell.org</a> before disputing a charge. Most issues can be resolved directly and quickly. We genuinely want to help.
      </p>

      <h2>6. Plan Changes and Prorations</h2>

      <p>
        <strong>Upgrading</strong> (e.g., Pro to Elite, or monthly to annual): takes effect immediately. Stripe automatically prorates the change — you&rsquo;re charged the difference for the remaining time in your current billing period.
      </p>

      <p>
        <strong>Downgrading</strong> (e.g., Elite to Pro, or annual to monthly): takes effect at the end of your current billing period. You keep your higher tier and original pricing until then. No proration credit is issued for the time you keep the higher tier.
      </p>

      <p>
        Downgrades to Free behave the same as cancellation — covered above.
      </p>

      <h2>7. Promotional Pricing and Discounts</h2>

      <p>
        If you subscribed using a promo code or discount, the same refund policy applies based on what you actually paid. Promo codes are typically single-use and have their own expiration terms — see the specific promo offer for details. Promotional pricing for the first billing period does not extend to subsequent periods unless explicitly stated.
      </p>

      <h2>8. Changes to This Policy</h2>

      <p>
        We may update this Refund Policy from time to time. Material changes will be communicated by email or by notice in the app. The version that applies to your transaction is the version in effect at the time of the charge.
      </p>

      <h2>9. Contact Us</h2>

      <p>For refund requests, billing questions, or anything related to your subscription:</p>

      <p>
        Email: <a href="mailto:support@offerbell.org">support@offerbell.org</a><br/>
        Web: <a href="https://offerbell.org">offerbell.org</a>
      </p>

    </LegalLayout>
  );
}
