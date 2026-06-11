chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true,
  });
  chrome.sidePanel.open({ tabId: tab.id });
});
