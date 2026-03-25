// OfferBell Background Service Worker
// Handles API calls to avoid CORS issues from content scripts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOutreach') {
    fetch('https://www.offerbell.org/api/generate-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: request.prompt })
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // keep channel open for async response
  }
});
