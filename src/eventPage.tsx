chrome.tabs.onCreated.addListener((tab) => {
  console.log('opened tab:', tab);
})

chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  let url = tab.url;
  let title = tab.title;

  console.log('url', url, 'title', title);
})