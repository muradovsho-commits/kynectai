// OfferBell Background Service Worker
// Handles API calls and usage sync

const API_BASE = 'https://www.offerbell.org';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  // Generate outreach message
  if (request.action === 'generateOutreach') {
    fetch(API_BASE + '/api/generate-outreach', {
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
          // After successful generation, also notify the web app by storing count
          const newCount = data.newCount || (request.messagesSent || 0) + 1;
          chrome.storage.local.set({ offerbell_messages_sent: newCount });
          sendResponse({ success: true, data: { ...data, newCount } });
        } else {
          sendResponse({ success: false, error: data.error || 'Unknown error' });
        }
      })
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }

  // Sync usage count from web app
  if (request.action === 'syncUsage') {
    // Fetch current count from the web app cookie/page
    fetch(API_BASE + '/api/outreach-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get',
        messagesSent: request.messagesSent || 0,
        plan: request.plan || 'free'
      })
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

// Listen for messages from the OfferBell web app to sync counts
chrome.runtime.onMessageExternal && chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.action === 'updateCount') {
      chrome.storage.local.set({
        offerbell_messages_sent: request.messagesSent || 0,
        offerbell_plan: request.plan || 'free'
      });
      sendResponse({ success: true });
    }
    if (request.action === 'getCount') {
      chrome.storage.local.get(['offerbell_messages_sent', 'offerbell_plan'], (data) => {
        sendResponse({
          success: true,
          messagesSent: data.offerbell_messages_sent || 0,
          plan: data.offerbell_plan || 'free'
        });
      });
      return true;
    }
  }
);
