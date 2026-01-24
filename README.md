# ItoMcovertor - Unit Converter

A comprehensive multi-platform unit converter with 120+ conversion types supporting CLI, web, and browser extension versions.

## Project Structure

```
ItoMcovertor/
├── cli/          # Command-line application (.NET 9)
├── web/          # Static website for Hostinger deployment
└── extension/    # Browser extension (Chrome/Edge/Firefox)
```

## Platforms

### CLI Version

A modern, color-coded console application for converting between Imperial and Metric units.

**Features:**
- 120+ conversion types across 12 categories
- Full SI scale support (yocto to Yotta prefixes)
- Direct input mode (`5.5 ft to m`)
- Conversion history with persistence
- Configurable decimal places and rounding
- Input validation

**Requirements:** [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

```bash
cd cli
dotnet run
```

See [cli/README.md](cli/README.md) for full documentation.

---

### Web Version

A static HTML/CSS/JS website ready for Hostinger deployment.

**Features:**
- Real-time conversion as you type
- Swap units button
- Conversion history (localStorage)
- Mobile-responsive dark theme
- SEO optimized
- No server-side code required

Open `web/index.html` in a browser, or deploy to Hostinger.

See [web/README.md](web/README.md) for deployment instructions.

---

### Browser Extension

A powerful browser extension that automatically detects and converts units on any webpage.

**Features:**
- Auto-detection with inline badges
- Interactive badges (click to cycle alternatives)
- Selection popup for instant conversions
- Quick converter popup
- Context menu integration
- Customizable settings and site rules

See [extension/README.md](extension/README.md) for installation and usage.

## Supported Categories

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

## License

MIT
