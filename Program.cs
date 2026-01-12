using ItoMcovertor.Converters;
using static ItoMcovertor.Converters.UnitConverter;

Console.Title = "Unit Converter";

PrintHeader("UNIT CONVERTER");
Console.WriteLine("  Convert between Imperial and Metric units");
Console.WriteLine("  Type directly: 5.5 ft to m | 100 mph | 32 f\n");

while (true)
{
    Console.WriteLine("\n┌─────────────────────────────────────┐");
    Console.WriteLine("│           MAIN MENU                 │");
    Console.WriteLine("├─────────────────────────────────────┤");
    Console.WriteLine("│  1. 📏 Length / Distance            │");
    Console.WriteLine("│  2. 📐 Area                         │");
    Console.WriteLine("│  3. 📦 Volume (Liquid)              │");
    Console.WriteLine("│  4. 📦 Volume (Solid)               │");
    Console.WriteLine("│  5. ⚖️  Mass / Weight               │");
    Console.WriteLine("│  6. 🌡️ Temperature                  │");
    Console.WriteLine("│  7. 🚗 Speed                        │");
    Console.WriteLine("│  8. 🧭 Pressure                     │");
    Console.WriteLine("│  9. ⚡ Energy                       │");
    Console.WriteLine("│ 10. 🔌 Power                        │");
    Console.WriteLine("│ 11. 🧪 Force                        │");
    Console.WriteLine("│ 12. 🌊 Nautical                     │");
    Console.WriteLine("│ 13. View History                    │");
    Console.WriteLine("│ 14. Quit                            │");
    Console.WriteLine("└─────────────────────────────────────┘");
    Console.Write("\nSelect option (or enter a conversion): ");

    string? input = Console.ReadLine();

    if (string.IsNullOrWhiteSpace(input))
        continue;

    string trimmed = input.Trim();

    // Try direct conversion first
    if (char.IsDigit(trimmed[0]) || trimmed[0] == '.' || trimmed[0] == '-')
    {
        if (TryDirectConvert(trimmed))
            continue;
    }

    switch (trimmed)
    {
        case "1": LengthMenu(); break;
        case "2": AreaMenu(); break;
        case "3": VolumeLiquidMenu(); break;
        case "4": VolumeSolidMenu(); break;
        case "5": MassMenu(); break;
        case "6": TemperatureMenu(); break;
        case "7": SpeedMenu(); break;
        case "8": PressureMenu(); break;
        case "9": EnergyMenu(); break;
        case "10": PowerMenu(); break;
        case "11": ForceMenu(); break;
        case "12": NauticalMenu(); break;
        case "13": ShowHistory(); break;
        case "14":
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("\nGoodbye! 👋");
            Console.ResetColor();
            return;
        default:
            PrintError("Invalid option. Enter 1-14 or type a conversion like '5.5 ft to m'.");
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📏 LENGTH / DISTANCE
// ═══════════════════════════════════════════════════════════════════════════
void LengthMenu()
{
    while (true)
    {
        PrintHeader("📏 LENGTH / DISTANCE");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Inch → Centimeter");
        Console.WriteLine("   2. Inch → Millimeter");
        Console.WriteLine("   3. Foot → Meter");
        Console.WriteLine("   4. Foot → Centimeter");
        Console.WriteLine("   5. Yard → Meter");
        Console.WriteLine("   6. Mile → Kilometer");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   7. Centimeter → Inch");
        Console.WriteLine("   8. Millimeter → Inch");
        Console.WriteLine("   9. Meter → Foot");
        Console.WriteLine("  10. Meter → Yard");
        Console.WriteLine("  11. Kilometer → Mile");
        Console.WriteLine("  12. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Inches", "Centimeters", "\"", " cm", InchToCentimeter, ValidatePositive); break;
            case "2": PerformConversion("Inches", "Millimeters", "\"", " mm", InchToMillimeter, ValidatePositive); break;
            case "3": PerformConversion("Feet", "Meters", " ft", " m", FootToMeter_, ValidatePositive); break;
            case "4": PerformConversion("Feet", "Centimeters", " ft", " cm", FootToCentimeter, ValidatePositive); break;
            case "5": PerformConversion("Yards", "Meters", " yd", " m", YardToMeter_, ValidatePositive); break;
            case "6": PerformConversion("Miles", "Kilometers", " mi", " km", MileToKilometer, ValidatePositive); break;
            case "7": PerformConversion("Centimeters", "Inches", " cm", "\"", CentimeterToInch, ValidatePositive); break;
            case "8": PerformConversion("Millimeters", "Inches", " mm", "\"", MillimeterToInch, ValidatePositive); break;
            case "9": PerformConversion("Meters", "Feet", " m", " ft", MeterToFoot, ValidatePositive); break;
            case "10": PerformConversion("Meters", "Yards", " m", " yd", MeterToYard, ValidatePositive); break;
            case "11": PerformConversion("Kilometers", "Miles", " km", " mi", KilometerToMile, ValidatePositive); break;
            case "12": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📐 AREA
// ═══════════════════════════════════════════════════════════════════════════
void AreaMenu()
{
    while (true)
    {
        PrintHeader("📐 AREA");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Sq Inch → Sq Centimeter");
        Console.WriteLine("   2. Sq Inch → Sq Millimeter");
        Console.WriteLine("   3. Sq Foot → Sq Meter");
        Console.WriteLine("   4. Sq Yard → Sq Meter");
        Console.WriteLine("   5. Acre → Sq Meter");
        Console.WriteLine("   6. Acre → Hectare");
        Console.WriteLine("   7. Sq Mile → Sq Kilometer");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   8. Sq Centimeter → Sq Inch");
        Console.WriteLine("   9. Sq Meter → Sq Foot");
        Console.WriteLine("  10. Sq Meter → Sq Yard");
        Console.WriteLine("  11. Hectare → Acre");
        Console.WriteLine("  12. Sq Kilometer → Sq Mile");
        Console.WriteLine("  13. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Sq Inches", "Sq Centimeters", " sq in", " cm²", SqInchToSqCentimeter, ValidatePositive); break;
            case "2": PerformConversion("Sq Inches", "Sq Millimeters", " sq in", " mm²", SqInchToSqMillimeter, ValidatePositive); break;
            case "3": PerformConversion("Sq Feet", "Sq Meters", " sq ft", " m²", SqFootToSqMeter_, ValidatePositive); break;
            case "4": PerformConversion("Sq Yards", "Sq Meters", " sq yd", " m²", SqYardToSqMeter_, ValidatePositive); break;
            case "5": PerformConversion("Acres", "Sq Meters", " acre", " m²", AcreToSqMeter_, ValidatePositive); break;
            case "6": PerformConversion("Acres", "Hectares", " acre", " ha", AcreToHectare_, ValidatePositive); break;
            case "7": PerformConversion("Sq Miles", "Sq Kilometers", " sq mi", " km²", SqMileToSqKilometer, ValidatePositive); break;
            case "8": PerformConversion("Sq Centimeters", "Sq Inches", " cm²", " sq in", SqCentimeterToSqInch, ValidatePositive); break;
            case "9": PerformConversion("Sq Meters", "Sq Feet", " m²", " sq ft", SqMeterToSqFoot, ValidatePositive); break;
            case "10": PerformConversion("Sq Meters", "Sq Yards", " m²", " sq yd", SqMeterToSqYard, ValidatePositive); break;
            case "11": PerformConversion("Hectares", "Acres", " ha", " acre", HectareToAcre, ValidatePositive); break;
            case "12": PerformConversion("Sq Kilometers", "Sq Miles", " km²", " sq mi", SqKilometerToSqMile, ValidatePositive); break;
            case "13": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 VOLUME (LIQUID)
// ═══════════════════════════════════════════════════════════════════════════
void VolumeLiquidMenu()
{
    while (true)
    {
        PrintHeader("📦 VOLUME (LIQUID)");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Teaspoon → Milliliter");
        Console.WriteLine("   2. Tablespoon → Milliliter");
        Console.WriteLine("   3. Fluid Ounce → Milliliter");
        Console.WriteLine("   4. Cup → Milliliter");
        Console.WriteLine("   5. Cup → Liter");
        Console.WriteLine("   6. Pint → Milliliter");
        Console.WriteLine("   7. Pint → Liter");
        Console.WriteLine("   8. Quart → Liter");
        Console.WriteLine("   9. Gallon → Liter");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("  10. Milliliter → Fluid Ounce");
        Console.WriteLine("  11. Liter → Gallon");
        Console.WriteLine("  12. Liter → Quart");
        Console.WriteLine("  13. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Teaspoons", "Milliliters", " tsp", " ml", TeaspoonToMilliliter, ValidatePositive); break;
            case "2": PerformConversion("Tablespoons", "Milliliters", " tbsp", " ml", TablespoonToMilliliter, ValidatePositive); break;
            case "3": PerformConversion("Fluid Ounces", "Milliliters", " fl oz", " ml", FluidOunceToMilliliter, ValidatePositive); break;
            case "4": PerformConversion("Cups", "Milliliters", " cup", " ml", CupToMilliliter, ValidatePositive); break;
            case "5": PerformConversion("Cups", "Liters", " cup", " L", CupToLiter_, ValidatePositive); break;
            case "6": PerformConversion("Pints", "Milliliters", " pt", " ml", PintToMilliliter, ValidatePositive); break;
            case "7": PerformConversion("Pints", "Liters", " pt", " L", PintToLiter_, ValidatePositive); break;
            case "8": PerformConversion("Quarts", "Liters", " qt", " L", QuartToLiter_, ValidatePositive); break;
            case "9": PerformConversion("Gallons", "Liters", " gal", " L", GallonToLiter_, ValidatePositive); break;
            case "10": PerformConversion("Milliliters", "Fluid Ounces", " ml", " fl oz", MilliliterToFluidOunce, ValidatePositive); break;
            case "11": PerformConversion("Liters", "Gallons", " L", " gal", LiterToGallon, ValidatePositive); break;
            case "12": PerformConversion("Liters", "Quarts", " L", " qt", LiterToQuart, ValidatePositive); break;
            case "13": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 VOLUME (SOLID / GEOMETRIC)
// ═══════════════════════════════════════════════════════════════════════════
void VolumeSolidMenu()
{
    while (true)
    {
        PrintHeader("📦 VOLUME (SOLID / GEOMETRIC)");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Cubic Inch → Cubic Centimeter");
        Console.WriteLine("   2. Cubic Foot → Cubic Meter");
        Console.WriteLine("   3. Cubic Yard → Cubic Meter");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   4. Cubic Centimeter → Cubic Inch");
        Console.WriteLine("   5. Cubic Meter → Cubic Foot");
        Console.WriteLine("   6. Cubic Meter → Cubic Yard");
        Console.WriteLine("   7. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Cubic Inches", "Cubic Centimeters", " cu in", " cm³", CubicInchToCubicCentimeter, ValidatePositive); break;
            case "2": PerformConversion("Cubic Feet", "Cubic Meters", " cu ft", " m³", CubicFootToCubicMeter_, ValidatePositive); break;
            case "3": PerformConversion("Cubic Yards", "Cubic Meters", " cu yd", " m³", CubicYardToCubicMeter_, ValidatePositive); break;
            case "4": PerformConversion("Cubic Centimeters", "Cubic Inches", " cm³", " cu in", CubicCentimeterToCubicInch, ValidatePositive); break;
            case "5": PerformConversion("Cubic Meters", "Cubic Feet", " m³", " cu ft", CubicMeterToCubicFoot, ValidatePositive); break;
            case "6": PerformConversion("Cubic Meters", "Cubic Yards", " m³", " cu yd", CubicMeterToCubicYard, ValidatePositive); break;
            case "7": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚖️ MASS / WEIGHT
// ═══════════════════════════════════════════════════════════════════════════
void MassMenu()
{
    while (true)
    {
        PrintHeader("⚖️ MASS / WEIGHT");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Ounce → Gram");
        Console.WriteLine("   2. Pound → Kilogram");
        Console.WriteLine("   3. Pound → Gram");
        Console.WriteLine("   4. Stone → Kilogram");
        Console.WriteLine("   5. Short Ton → Kilogram");
        Console.WriteLine("   6. Short Ton → Tonne");
        Console.WriteLine("   7. Long Ton → Kilogram");
        Console.WriteLine("   8. Long Ton → Tonne");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   9. Gram → Ounce");
        Console.WriteLine("  10. Kilogram → Pound");
        Console.WriteLine("  11. Kilogram → Stone");
        Console.WriteLine("  12. Tonne → Short Ton");
        Console.WriteLine("  13. Tonne → Long Ton");
        Console.WriteLine("  14. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Ounces", "Grams", " oz", " g", OunceToGram_, ValidatePositive); break;
            case "2": PerformConversion("Pounds", "Kilograms", " lb", " kg", PoundToKilogram, ValidatePositive); break;
            case "3": PerformConversion("Pounds", "Grams", " lb", " g", PoundToGram_, ValidatePositive); break;
            case "4": PerformConversion("Stones", "Kilograms", " st", " kg", StoneToKilogram, ValidatePositive); break;
            case "5": PerformConversion("Short Tons", "Kilograms", " short ton", " kg", ShortTonToKilogram, ValidatePositive); break;
            case "6": PerformConversion("Short Tons", "Tonnes", " short ton", " t", ShortTonToTonne_, ValidatePositive); break;
            case "7": PerformConversion("Long Tons", "Kilograms", " long ton", " kg", LongTonToKilogram, ValidatePositive); break;
            case "8": PerformConversion("Long Tons", "Tonnes", " long ton", " t", LongTonToTonne_, ValidatePositive); break;
            case "9": PerformConversion("Grams", "Ounces", " g", " oz", GramToOunce, ValidatePositive); break;
            case "10": PerformConversion("Kilograms", "Pounds", " kg", " lb", KilogramToPound, ValidatePositive); break;
            case "11": PerformConversion("Kilograms", "Stones", " kg", " st", KilogramToStone, ValidatePositive); break;
            case "12": PerformConversion("Tonnes", "Short Tons", " t", " short ton", TonneToShortTon, ValidatePositive); break;
            case "13": PerformConversion("Tonnes", "Long Tons", " t", " long ton", TonneToLongTon, ValidatePositive); break;
            case "14": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌡️ TEMPERATURE
// ═══════════════════════════════════════════════════════════════════════════
void TemperatureMenu()
{
    while (true)
    {
        PrintHeader("🌡️ TEMPERATURE");
        Console.WriteLine("   1. Fahrenheit → Celsius");
        Console.WriteLine("   2. Fahrenheit → Kelvin");
        Console.WriteLine("   3. Celsius → Fahrenheit");
        Console.WriteLine("   4. Celsius → Kelvin");
        Console.WriteLine("   5. Kelvin → Celsius");
        Console.WriteLine("   6. Kelvin → Fahrenheit");
        Console.WriteLine("   7. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Fahrenheit", "Celsius", "°F", "°C", FahrenheitToCelsius, ValidateFahrenheit, "0.1"); break;
            case "2": PerformConversion("Fahrenheit", "Kelvin", "°F", " K", FahrenheitToKelvin, ValidateFahrenheit, "0.1"); break;
            case "3": PerformConversion("Celsius", "Fahrenheit", "°C", "°F", CelsiusToFahrenheit, ValidateCelsius, "0.1"); break;
            case "4": PerformConversion("Celsius", "Kelvin", "°C", " K", CelsiusToKelvin, ValidateCelsius, "0.1"); break;
            case "5": PerformConversion("Kelvin", "Celsius", " K", "°C", KelvinToCelsius, ValidateKelvin, "0.1"); break;
            case "6": PerformConversion("Kelvin", "Fahrenheit", " K", "°F", KelvinToFahrenheit, ValidateKelvin, "0.1"); break;
            case "7": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚗 SPEED
// ═══════════════════════════════════════════════════════════════════════════
void SpeedMenu()
{
    while (true)
    {
        PrintHeader("🚗 SPEED");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Miles/Hour → Kilometers/Hour");
        Console.WriteLine("   2. Miles/Hour → Meters/Second");
        Console.WriteLine("   3. Feet/Second → Meters/Second");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   4. Kilometers/Hour → Miles/Hour");
        Console.WriteLine("   5. Meters/Second → Miles/Hour");
        Console.WriteLine("   6. Meters/Second → Feet/Second");
        Console.WriteLine("   7. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Miles/Hour", "Kilometers/Hour", " mph", " km/h", MphToKmh_, ValidatePositive); break;
            case "2": PerformConversion("Miles/Hour", "Meters/Second", " mph", " m/s", MphToMps_, ValidatePositive); break;
            case "3": PerformConversion("Feet/Second", "Meters/Second", " ft/s", " m/s", FpsToMps_, ValidatePositive); break;
            case "4": PerformConversion("Kilometers/Hour", "Miles/Hour", " km/h", " mph", KmhToMph, ValidatePositive); break;
            case "5": PerformConversion("Meters/Second", "Miles/Hour", " m/s", " mph", MpsToMph, ValidatePositive); break;
            case "6": PerformConversion("Meters/Second", "Feet/Second", " m/s", " ft/s", MpsToFps, ValidatePositive); break;
            case "7": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧭 PRESSURE
// ═══════════════════════════════════════════════════════════════════════════
void PressureMenu()
{
    while (true)
    {
        PrintHeader("🧭 PRESSURE");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. PSI → Pascal");
        Console.WriteLine("   2. PSI → Kilopascal");
        Console.WriteLine("   3. PSI → Bar");
        Console.WriteLine("   4. Inches of Mercury → Pascal");
        Console.WriteLine("   5. Inches of Mercury → Kilopascal");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   6. Pascal → PSI");
        Console.WriteLine("   7. Kilopascal → PSI");
        Console.WriteLine("   8. Bar → PSI");
        Console.WriteLine("   9. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("PSI", "Pascal", " psi", " Pa", PsiToPascal_, ValidatePositive); break;
            case "2": PerformConversion("PSI", "Kilopascal", " psi", " kPa", PsiToKilopascal, ValidatePositive); break;
            case "3": PerformConversion("PSI", "Bar", " psi", " bar", PsiToBar_, ValidatePositive); break;
            case "4": PerformConversion("Inches Hg", "Pascal", " inHg", " Pa", InHgToPascal_, ValidatePositive); break;
            case "5": PerformConversion("Inches Hg", "Kilopascal", " inHg", " kPa", InHgToKilopascal, ValidatePositive); break;
            case "6": PerformConversion("Pascal", "PSI", " Pa", " psi", PascalToPsi, ValidatePositive); break;
            case "7": PerformConversion("Kilopascal", "PSI", " kPa", " psi", KilopascalToPsi, ValidatePositive); break;
            case "8": PerformConversion("Bar", "PSI", " bar", " psi", BarToPsi, ValidatePositive); break;
            case "9": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ ENERGY
// ═══════════════════════════════════════════════════════════════════════════
void EnergyMenu()
{
    while (true)
    {
        PrintHeader("⚡ ENERGY");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. BTU → Joule");
        Console.WriteLine("   2. BTU → Kilojoule");
        Console.WriteLine("   3. Foot-Pound → Joule");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   4. Joule → BTU");
        Console.WriteLine("   5. Kilojoule → BTU");
        Console.WriteLine("   6. Joule → Foot-Pound");
        Console.WriteLine("   7. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("BTU", "Joules", " BTU", " J", BtuToJoule_, ValidatePositive); break;
            case "2": PerformConversion("BTU", "Kilojoules", " BTU", " kJ", BtuToKilojoule, ValidatePositive); break;
            case "3": PerformConversion("Foot-Pounds", "Joules", " ft·lb", " J", FootPoundToJoule_, ValidatePositive); break;
            case "4": PerformConversion("Joules", "BTU", " J", " BTU", JouleToBtu, ValidatePositive); break;
            case "5": PerformConversion("Kilojoules", "BTU", " kJ", " BTU", KilojouleToBtu, ValidatePositive); break;
            case "6": PerformConversion("Joules", "Foot-Pounds", " J", " ft·lb", JouleToFootPound, ValidatePositive); break;
            case "7": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔌 POWER
// ═══════════════════════════════════════════════════════════════════════════
void PowerMenu()
{
    while (true)
    {
        PrintHeader("🔌 POWER");
        Console.WriteLine("  Imperial → Metric:");
        Console.WriteLine("   1. Horsepower → Watt");
        Console.WriteLine("   2. Horsepower → Kilowatt");
        Console.WriteLine("  Metric → Imperial:");
        Console.WriteLine("   3. Watt → Horsepower");
        Console.WriteLine("   4. Kilowatt → Horsepower");
        Console.WriteLine("   5. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Horsepower", "Watts", " hp", " W", HorsepowerToWatt_, ValidatePositive); break;
            case "2": PerformConversion("Horsepower", "Kilowatts", " hp", " kW", HorsepowerToKilowatt, ValidatePositive); break;
            case "3": PerformConversion("Watts", "Horsepower", " W", " hp", WattToHorsepower, ValidatePositive); break;
            case "4": PerformConversion("Kilowatts", "Horsepower", " kW", " hp", KilowattToHorsepower, ValidatePositive); break;
            case "5": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧪 FORCE
// ═══════════════════════════════════════════════════════════════════════════
void ForceMenu()
{
    while (true)
    {
        PrintHeader("🧪 FORCE");
        Console.WriteLine("   1. Pound-Force → Newton");
        Console.WriteLine("   2. Newton → Pound-Force");
        Console.WriteLine("   3. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Pound-Force", "Newtons", " lbf", " N", PoundForceToNewton_, ValidatePositive); break;
            case "2": PerformConversion("Newtons", "Pound-Force", " N", " lbf", NewtonToPoundForce, ValidatePositive); break;
            case "3": return;
            default: PrintError("Invalid option."); break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌊 NAUTICAL
// ═══════════════════════════════════════════════════════════════════════════
void NauticalMenu()
{
    while (true)
    {
        PrintHeader("🌊 NAUTICAL");
        Console.WriteLine("   1. Nautical Mile → Kilometer");
        Console.WriteLine("   2. Kilometer → Nautical Mile");
        Console.WriteLine("   3. ← Back");
        Console.Write("\nSelect: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1": PerformConversion("Nautical Miles", "Kilometers", " nm", " km", NauticalMileToKilometer, ValidatePositive); break;
            case "2": PerformConversion("Kilometers", "Nautical Miles", " km", " nm", KilometerToNauticalMile, ValidatePositive); break;
            case "3": return;
            default: PrintError("Invalid option."); break;
        }
    }
}
