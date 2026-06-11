const STORAGE_KEY = 'fakescan_history';

const input = document.getElementById('barcode-input');
const scanBtn = document.getElementById('scan-btn');
const statusEl = document.getElementById('status');
const historyList = document.getElementById('history-list');
const clearBtn = document.getElementById('clear-btn');

let history = loadHistory();
renderHistory();

// ---- Scan ----------------------------------------------------------------

async function triggerScan(barcode) {
  if (!barcode) return;

  let tab;
  try {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = active;
  } catch {
    showStatus('Could not get active tab.', true);
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runFakeScan,
      args: [barcode],
    });
    showStatus(`Scanned: ${barcode}`);
    addToHistory(barcode);
  } catch (err) {
    showStatus(`Error: ${err.message}`, true);
  }
}

// Injected into the page — must be self-contained (no closure references)
function runFakeScan(barcodeString) {
  const delay = 10;

  [...barcodeString].forEach((char, index) => {
    setTimeout(() => {
      const event = new KeyboardEvent('keypress', {
        bubbles: true,
        cancelable: true,
        which: char.charCodeAt(0),
        charCode: char.charCodeAt(0),
        keyCode: char.charCodeAt(0),
        key: char,
      });
      document.body.dispatchEvent(event);
    }, index * delay);
  });

  console.log(`[fakeScan] Dispatched ${barcodeString.length} keypress events for: "${barcodeString}"`);
  console.log(`[fakeScan] onScan will fire in ~${barcodeString.length * delay + 250}ms`);
}

// ---- Status --------------------------------------------------------------

let statusTimeout;
function showStatus(msg, isError = false) {
  clearTimeout(statusTimeout);
  statusEl.textContent = msg;
  statusEl.className = 'status' + (isError ? ' error' : '');
  statusTimeout = setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status';
  }, 3000);
}

// ---- History -------------------------------------------------------------

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function addToHistory(barcode) {
  // Move to top if already exists, else prepend
  history = [barcode, ...history.filter((b) => b !== barcode)].slice(0, 25);
  saveHistory();
  renderHistory();
}

function removeFromHistory(barcode) {
  history = history.filter((b) => b !== barcode);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<span class="empty-state">No scans yet.</span>';
    return;
  }

  history.forEach((barcode) => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const rescanBtn = document.createElement('button');
    rescanBtn.className = 'rescan-btn';
    rescanBtn.textContent = barcode;
    rescanBtn.title = `Click to scan: ${barcode}`;
    rescanBtn.addEventListener('click', () => triggerScan(barcode));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove';
    removeBtn.addEventListener('click', () => removeFromHistory(barcode));

    item.appendChild(rescanBtn);
    item.appendChild(removeBtn);
    historyList.appendChild(item);
  });
}

// ---- Events --------------------------------------------------------------

scanBtn.addEventListener('click', () => {
  const barcode = input.value.trim();
  if (!barcode) return;
  triggerScan(barcode);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') scanBtn.click();
});

clearBtn.addEventListener('click', () => {
  history = [];
  saveHistory();
  renderHistory();
});
