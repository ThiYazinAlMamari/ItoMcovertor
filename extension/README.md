# ItoMcovertor Browser Extension

A powerful browser extension that automatically detects and converts Imperial/Metric units on any webpage with 120+ conversion types.

## Features

- **Auto-Detection**: Automatically scans webpages for unit measurements and displays conversions inline
- **Interactive Badges**: Click conversion badges to cycle through alternative units
- **Selection Popup**: Select any text containing units to see instant conversions
- **Quick Converter**: Use the popup for manual conversions anytime
- **Context Menu**: Right-click selected text to convert units
- **Customizable Settings**: Configure decimal places, badge styles, rounding methods, and more
- **Site Rules**: Create allowlist/denylist rules for specific websites

## Supported Unit Categories

| Category | Units |
|----------|-------|
| Length | in, ft, yd, mi, mm, cm, m, km + full SI scale (ym to Ym) |
| Area | sq in, sq ft, acre, sq mi, cm2, m2, ha, km2 |
| Volume (Liquid) | tsp, tbsp, cup, pint, quart, gallon, ml, L + full SI scale |
| Volume (Solid) | cu in, cu ft, cu yd, cm3, m3 |
| Mass | oz, lb, stone, ton, g, kg, tonne + full SI scale (ug to Yg) |
| Temperature | F, C, K |
| Speed | mph, ft/s, km/h, m/s + full SI scale (mm/s to km/s) |
| Pressure | psi, inHg, Pa, kPa, bar + full SI scale (Pa to YPa) |
| Energy | BTU, ft-lb, J, kJ + full SI scale (J to QJ) |
| Power | hp, W, kW + full SI scale (W to YW) |
| Force | lbf, N |
| Nautical | nm, km |

## Installation

### Chrome / Edge / Brave (Chromium-based)

1. Download or clone this repository
2. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `extension/` folder
6. The extension icon will appear in your toolbar

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select any file in the `extension/` folder (e.g., `manifest.json`)

> Note: Firefox requires Manifest V2 for permanent installation. This extension uses Manifest V3.

## Usage

### Automatic Conversion
Once installed, the extension automatically scans webpages for unit measurements. Hover over highlighted values to see conversions in tooltips, or click badges to cycle through alternatives.

### Popup Converter
Click the extension icon to open the quick converter popup:
- Select a conversion type from the dropdown
- Enter a value to see instant results
- Switch conversion direction with the toggle

### Options
Right-click the extension icon and select **Options** to configure:
- **General**: Auto-convert toggle, direction, decimal places
- **Display**: Badge style, tooltips, selection popup, number grouping
- **Advanced**: Scan mode, max conversions, scientific notation, rounding
- **Site Rules**: Allowlist/denylist specific websites
- **Privacy**: Sync settings, clear history

## Folder Structure

```
extension/
├── manifest.json       # Extension configuration (Manifest V3)
├── background.js       # Service worker for context menus
├── content.js          # Page scanning and conversion logic
├── content.css         # Badge and tooltip styles
├── popup.html          # Quick converter popup
├── popup.js            # Popup logic
├── popup.css           # Popup styles
├── options.html        # Settings page
├── options.js          # Settings logic
├── options.css         # Settings styles
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Development

### Modifying the Extension
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload any open tabs to see changes

### Key Files
- **content.js**: Core conversion engine with regex patterns for unit detection
- **background.js**: Handles context menu creation and messaging
- **popup.js**: Quick converter functionality and settings sync
- **options.js**: Full settings management

## Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save user preferences and settings |
| `activeTab` | Access current tab for manual conversions |
| `contextMenus` | Add "Convert Units" to right-click menu |
| `<all_urls>` | Scan any webpage for units |

## Version

**1.0.0** - Full-featured release with auto-detection, interactive badges, 120+ conversions, and comprehensive settings.
