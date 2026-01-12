# ItoMcovertor - Unit Converter

A modern, color-coded console application for converting between Imperial and Metric units.

## Features

- **60+ Conversion Types** across 12 categories
- **Direct Input** - Type `5.5 ft to m` directly
- **Conversion History** - Persists across sessions
- **Input Validation** - Prevents invalid values
- **Color-Coded UI** - Easy-to-read output

## Categories

| Category | Conversions |
|----------|-------------|
| 📏 Length | inch, foot, yard, mile ↔ cm, mm, m, km |
| 📐 Area | sq in, sq ft, acre, sq mi ↔ cm², m², ha, km² |
| 📦 Volume (Liquid) | tsp, tbsp, cup, pint, quart, gallon ↔ ml, L |
| 📦 Volume (Solid) | cu in, cu ft, cu yd ↔ cm³, m³ |
| ⚖️ Mass | oz, lb, stone, ton ↔ g, kg, tonne |
| 🌡️ Temperature | °F ↔ °C ↔ K |
| 🚗 Speed | mph, ft/s ↔ km/h, m/s |
| 🧭 Pressure | psi, inHg ↔ Pa, kPa, bar |
| ⚡ Energy | BTU, ft·lb ↔ J, kJ |
| 🔌 Power | hp ↔ W, kW |
| 🧪 Force | lbf ↔ N |
| 🌊 Nautical | nm ↔ km |

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Usage

```bash
dotnet run
```

## Direct Input Mode

```
> 5.5 ft to m
✓ 5.5 ft = 1.68 m

> 100 mph
✓ 100 mph = 160.93 km/h

> 32 f
✓ 32 °F = 0.0 °C
```

## License

MIT
