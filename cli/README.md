# ItoMcovertor CLI

A modern, color-coded console application for converting between Imperial and Metric units with 120+ conversion types.

## Features

- **120+ Conversion Types** across 12 categories
- **Full SI Scale Support** - From yocto (10^-24) to Yotta (10^24) prefixes
- **Direct Input** - Type `5.5 ft to m` directly
- **Conversion History** - Persists across sessions
- **Configurable Settings** - Decimal places, rounding mode
- **Input Validation** - Temperature limits and positive values
- **Color-Coded UI** - Easy-to-read output

## Categories

| Category | Conversions |
|----------|-------------|
| Length | in, ft, yd, mi to/from mm, cm, m, km + SI scale (ym to Ym) |
| Area | sq in, sq ft, acre, sq mi to/from cm2, m2, ha, km2 |
| Volume (Liquid) | tsp, tbsp, cup, pint, quart, gallon to/from ml, L + SI scale |
| Volume (Solid) | cu in, cu ft, cu yd to/from cm3, m3 |
| Mass | oz, lb, stone, ton to/from g, kg, tonne + SI scale (ug to Yg) |
| Temperature | F to/from C to/from K |
| Speed | mph, ft/s to/from km/h, m/s + SI scale (mm/s to km/s) |
| Pressure | psi, inHg to/from Pa, kPa, bar + SI scale (Pa to YPa) |
| Energy | BTU, ft-lb to/from J, kJ + SI scale (J to QJ) |
| Power | hp to/from W, kW + SI scale (W to YW) |
| Force | lbf to/from N |
| Nautical | nm to/from km |

## Requirements

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

## Build and Run

```bash
# Build
dotnet build

# Run
dotnet run

# Run tests
dotnet test
```

## Direct Input Mode

```
> 5.5 ft to m
5.5 ft = 1.68 m

> 100 mph
100 mph = 160.93 km/h

> 32 f
32 F = 0.0 C
```

## Settings

Access the settings menu to configure:
- **Decimal Places** - 0 to 10 decimal places
- **Rounding Mode** - Round, Floor, or Ceiling

## Project Structure

```
cli/
├── Converters/
│   └── UnitConverter.cs    # Core conversion engine (1100+ lines)
├── ItoMcovertor.Tests/     # Unit tests
├── ItoMcovertor.csproj     # Project file
└── Program.cs              # Main entry point
```
