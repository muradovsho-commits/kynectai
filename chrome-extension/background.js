// OfferBell Background Service Worker
// Handles API calls to avoid CORS issues from content scripts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOutreach') {
    fetch('https://www.offerbell.org/api/generate-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: request.prompt,
        messagesSent: request.messagesSent || 0,
        plan: request.plan || 'free'
      })
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 403 && data.error === 'limit_reached') {
          sendResponse({ success: false, limitReached: true, message: data.message });
        } else if (data.text) {
          sendResponse({ success: true, data });
        } else {
          sendResponse({ success: false, error: data.error || 'Unknown error' });
        }
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
