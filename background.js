// Disable the panel globally so it only appears on tabs where it's explicitly opened
chrome.sidePanel.setOptions({ enabled: false });

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true,
  });
  chrome.sidePanel.open({ tabId: tab.id });
});
