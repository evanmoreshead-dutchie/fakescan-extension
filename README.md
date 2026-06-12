# FakeScan

A Chrome extension that simulates a physical barcode scanner. Opens a side panel where you can enter barcode strings and fire them as rapid keypress events on the page — exactly like a real scanner would.

## Installation

1. Download or clone this repository to your machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `fakescan-extension` folder.

The FakeScan icon will appear in your Chrome toolbar. Pin it for easy access.

## Usage

1. Navigate to the tab you want to scan on.
2. Click the FakeScan toolbar icon — a side panel opens on that tab.
3. Type a barcode into the input field and press **Enter** or click **Scan**.
4. Previously scanned barcodes appear as buttons in the history list — click any to re-fire that scan.
5. Remove individual entries with the **×** button, or wipe the list with **Clear all**.

## Notes

- The panel is tied to the tab it was opened on — switching tabs won't carry it over.
- History is saved to `localStorage` and persists across browser sessions (up to 25 entries).
- Scan events are dispatched on `document.body` to mimic a physical scanner rather than direct input field focus.
