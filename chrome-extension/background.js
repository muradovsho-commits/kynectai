// OfferBell Background Service Worker
// Handles API calls to avoid CORS issues from content scripts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOutreach') {
    chrome.storage.local.get(['offerbell_messages_sent', 'offerbell_plan'], (stored) => {
      const count = stored.offerbell_messages_sent || 0;
      const plan = stored.offerbell_plan || request.plan || 'free';

      // Check limit client-side
      if (plan !== 'pro' && count >= 3) {
        sendResponse({ success: false, limitReached: true });
        return;
      }

      fetch('https://www.offerbell.org/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.prompt,
          messagesSent: count,
          plan: plan
        })
      })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
          if (status === 403 && data.error === 'limit_reached') {
            sendResponse({ success: false, limitReached: true });
          } else if (data.text) {
            const newCount = data.newCount || count + 1;
            chrome.storage.local.set({ offerbell_messages_sent: newCount });
            sendResponse({ success: true, data: { ...data, newCount } });
          } else {
            sendResponse({ success: false, error: data.error || 'Unknown error' });
          }
        })
        .catch(err => sendResponse({ success: false, error: err.message }));
    });
    return true;
  }
});

// Listen for the web app to sync counts
chrome.runtime.onMessageExternal && chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.action === 'updateCount') {
      chrome.storage.local.set({
        offerbell_messages_sent: request.messagesSent || 0,
        offerbell_plan: request.plan || 'free'
      });
      sendResponse({ success: true });
    }
  }
);
