# OfferBell Gmail Extension

Add contacts from Gmail directly to your OfferBell Outreach Tracker with one click.

## How to Install (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder from this project
5. The extension is now active - go to Gmail!

## How It Works

1. Open any email in Gmail
2. You'll see an **"Add to OfferBell"** button (purple) in the email toolbar area
3. Click it - a popup appears pre-filled with the sender's name, email, and inferred company
4. Edit any fields, set the contact status, add notes
5. Click **Add Contact** - it opens a small OfferBell page that saves the contact to your tracker
6. Go to your Outreach Tracker to see the new contact

## What Gets Extracted

- **Name**: Parsed from the sender's display name
- **Email**: From the sender's email address
- **Firm**: Inferred from the email domain (e.g. `john@goldmansachs.com` → "Goldmansachs"). Free providers like Gmail/Yahoo are skipped.
- **Role**: You fill this in manually
- **Status**: Defaults to "Sent" but you can change it

## Configuration

The extension points to `https://offerbell.org` by default. To change this (e.g., for local development), edit the `OFFERBELL_URL` constant at the top of `content.js`:

```js
const OFFERBELL_URL = 'http://localhost:3000';  // for local dev
```

## For Production

When you're ready to publish to the Chrome Web Store:
1. Replace the placeholder icons in `icons/` with your actual OfferBell logo
2. Update the description in `manifest.json`
3. Zip the `chrome-extension` folder and upload to the Chrome Developer Dashboard
