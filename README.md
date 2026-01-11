# ItoMcovertor - Unit Converter

A modern, color-coded console application for converting between Imperial and Metric units.

## Features

- **12 Conversion Types**
  - Length: Inches↔Cm, Feet↔Meters, Miles↔Km
  - Weight: Pounds↔Kilograms
  - Volume: Gallons↔Liters
  - Temperature: Fahrenheit↔Celsius

- **Batch Conversion** - Convert multiple values at once

- **Conversion History** - Track your last 10 conversions

- **Input Validation** - Prevents invalid values (e.g., below absolute zero)

- **Color-Coded UI** - Easy-to-read console output

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Usage

```bash
# Build the project
dotnet build

# Run the converter
dotnet run
```

## Chrome Extension

A browser extension that automatically converts units on any webpage.

### Extension Features

- **Auto-Convert** - Automatically detects and converts units on pages
- **Manual Converter** - Quick popup converter for manual conversions
- **Bidirectional** - Switch between Imperial→Metric or Metric→Imperial
- **Display Modes** - Replace text or show as badge tooltip
- **Customizable** - Enable/disable specific unit types in settings

### Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `extension` folder

### Supported Units

| Type | Imperial → Metric | Metric → Imperial |
|------|-------------------|-------------------|
| Length | in → cm, ft → m, mi → km | cm → in, m → ft, km → mi |
| Area | sq in → cm², sq ft → m², acres → ha | cm² → sq in, m² → sq ft, ha → acres |
| Weight | lbs → kg | kg → lbs |
| Volume | gal → L | L → gal |
| Temperature | °F → °C | °C → °F |

---

## Project Structure

```
ItoMcovertor/
├── ItoMcovertor.csproj    # Project file
├── Program.cs             # Main entry point & menus
├── Converters/
│   └── UnitConverter.cs   # Conversion logic & utilities
├── extension/             # Chrome Extension
│   ├── manifest.json      # Extension config
│   ├── background.js      # Service worker
│   ├── content.js         # Page conversion logic
│   ├── popup.html/js/css  # Popup UI
│   ├── settings.html/js   # Settings page
│   └── icons/             # Extension icons
└── README.md
```

## Example

```
═══════════════════════════════════════
        UNIT CONVERTER
═══════════════════════════════════════
  Convert between Imperial and Metric units

┌─────────────────────────────────────┐
│           MAIN MENU                 │
├─────────────────────────────────────┤
│  1. Imperial → Metric               │
│  2. Metric → Imperial               │
│  3. Batch Conversion                │
│  4. View History                    │
│  5. Quit                            │
└─────────────────────────────────────┘
```

## License

MIT
