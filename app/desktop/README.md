# ItoMcovertor - Desktop App

Cross-platform desktop application built with [Tauri](https://tauri.app/).

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Platform-specific dependencies:
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`

## Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Project Structure

```
desktop/
├── package.json          # Node.js config
├── src-tauri/            # Rust/Tauri backend
│   ├── Cargo.toml        # Rust dependencies
│   ├── tauri.conf.json   # Tauri configuration
│   ├── build.rs          # Build script
│   └── src/
│       └── main.rs       # Rust entry point
└── src/                  # Web frontend
    ├── index.html        # Main HTML
    ├── css/
    │   └── styles.css    # Styles
    └── js/
        ├── app.js        # App logic
        └── converter.js  # Conversion engine
```

## Features

- 120+ unit conversions across 12 categories
- Light/Dark theme with system preference detection
- Conversion history (persisted locally)
- Keyboard shortcuts:
  - `Ctrl/Cmd + Enter`: Swap units
  - `Ctrl/Cmd + C`: Copy result

## Building

### Windows

```bash
npm run build
# Output: src-tauri/target/release/bundle/msi/
```

### macOS

```bash
npm run build
# Output: src-tauri/target/release/bundle/dmg/
```

### Linux

```bash
npm run build
# Output: src-tauri/target/release/bundle/deb/ or /appimage/
```
