import LegalLayout from "../components/LegalLayout";

export const metadata = {
  title: "Cookie Policy — OfferBell",
  description: "How OfferBell uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 31, 2026">

      <p>
        This Cookie Policy explains how OfferBell uses cookies and similar local storage technologies. It supplements our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What Are Cookies?</h2>

      <p>
        Cookies are small text files that websites place on your device to remember information between visits. &ldquo;Local storage&rdquo; is a related technology built into modern browsers that serves a similar purpose. OfferBell uses both.
      </p>

      <h2>2. Why We Use Them</h2>

      <p>
        OfferBell uses cookies and local storage for a small number of essential and functional purposes. We do <strong>not</strong> use cookies for cross-site advertising, profile-building, behavioral retargeting, or selling your data to third parties.
      </p>

      <h2>3. What We Use</h2>

      <h3>Essential (required for the service to work)</h3>

      <ul>
        <li><strong>Session cookie</strong> (<code>offerbell_session</code>): keeps you signed in across page loads. Without it, you&rsquo;d have to log in every time you click a link. Set when you sign in, cleared when you sign out, and expires after 30 days of inactivity.</li>
        <li><strong>Theme preference</strong> (<code>offerbell-theme</code>): remembers whether you chose light or dark mode.</li>
      </ul>

      <h3>Functional (used to save your progress and settings)</h3>

      <p>
        OfferBell stores a substantial amount of your in-app state in your browser&rsquo;s local storage so that the interface loads quickly and feels responsive. This includes things like which tutorial step you&rsquo;re on, your outreach tracker contacts, flashcard performance, drill history, and similar product data. This data is synced to our server in the background so you don&rsquo;t lose anything when switching devices.
      </p>

      <h3>Third-party cookies set by service providers</h3>

      <p>
        When you check out with Stripe, Stripe sets its own cookies on the checkout page (which is hosted on Stripe&rsquo;s domain, not ours) for fraud prevention and session security. See <a href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer">Stripe&rsquo;s cookie policy</a>.
      </p>

      <p>
        If you connect Gmail or Outlook, those services may set their own cookies on their OAuth consent pages. See their respective privacy and cookie policies.
      </p>

      <h2>4. Analytics</h2>

      <p>
        We currently do not use third-party analytics cookies (Google Analytics, Mixpanel, etc.) on OfferBell. If we add analytics in the future, we&rsquo;ll update this Policy and, if applicable, request consent before setting non-essential cookies for users in jurisdictions that require it.
      </p>

      <h2>5. Managing Cookies</h2>

      <p>
        You can clear cookies and local storage at any time through your browser&rsquo;s settings:
      </p>

      <ul>
        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data → See all cookies and site data</li>
        <li><strong>Safari:</strong> Settings → Privacy → Manage Website Data</li>
        <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
        <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies and site data</li>
      </ul>

      <p>
        Clearing OfferBell&rsquo;s cookies will sign you out and may temporarily clear in-progress unsaved work in your browser. Data already synced to your account on our server is not affected and will reload when you sign back in.
      </p>

      <p>
        You can also block cookies entirely in your browser, but OfferBell won&rsquo;t work properly without at least the essential session cookie — you wouldn&rsquo;t be able to stay signed in.
      </p>

      <h2>6. Do Not Track</h2>

      <p>
        OfferBell does not currently respond to Do Not Track browser signals because there is no clear industry standard for what compliance means. We rely on the cookie controls described above and the data rights in our <a href="/privacy">Privacy Policy</a> instead.
      </p>

      <h2>7. Changes to This Policy</h2>

      <p>
        We may update this Cookie Policy if we change the cookies we use. Material changes will be communicated by email or by notice in the app. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.
      </p>

      <h2>8. Contact Us</h2>

      <p>Questions about cookies or this Policy:</p>

      <p>
        Email: <a href="mailto:support@offerbell.org">support@offerbell.org</a><br/>
        Web: <a href="https://offerbell.org">offerbell.org</a>
      </p>

    </LegalLayout>
  );
}
