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

## Project Structure

```
ItoMcovertor/
├── ItoMcovertor.csproj    # Project file
├── Program.cs             # Main entry point & menus
├── Converters/
│   └── UnitConverter.cs   # Conversion logic & utilities
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
