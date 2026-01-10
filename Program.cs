using ItoMcovertor.Converters;

Console.Title = "Unit Converter";

UnitConverter.PrintHeader("UNIT CONVERTER");
Console.WriteLine("  Convert between Imperial and Metric units\n");

while (true)
{
    Console.WriteLine("\n┌─────────────────────────────────────┐");
    Console.WriteLine("│           MAIN MENU                 │");
    Console.WriteLine("├─────────────────────────────────────┤");
    Console.WriteLine("│  1. Imperial → Metric               │");
    Console.WriteLine("│  2. Metric → Imperial               │");
    Console.WriteLine("│  3. Batch Conversion                │");
    Console.WriteLine("│  4. View History                    │");
    Console.WriteLine("│  5. Quit                            │");
    Console.WriteLine("└─────────────────────────────────────┘");
    Console.Write("\nSelect option: ");

    string? input = Console.ReadLine();

    switch (input?.Trim())
    {
        case "1":
            ImperialToMetricMenu();
            break;
        case "2":
            MetricToImperialMenu();
            break;
        case "3":
            BatchConversionMenu();
            break;
        case "4":
            UnitConverter.ShowHistory();
            break;
        case "5":
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("\nGoodbye! 👋");
            Console.ResetColor();
            return;
        default:
            UnitConverter.PrintError("Invalid option. Please enter 1-5.");
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// IMPERIAL TO METRIC MENU
// ═══════════════════════════════════════════════════════════════════════════
void ImperialToMetricMenu()
{
    while (true)
    {
        UnitConverter.PrintHeader("IMPERIAL → METRIC");
        Console.WriteLine("  1. Inches → Centimeters");
        Console.WriteLine("  2. Feet → Meters");
        Console.WriteLine("  3. Miles → Kilometers");
        Console.WriteLine("  4. Pounds → Kilograms");
        Console.WriteLine("  5. Gallons → Liters");
        Console.WriteLine("  6. Fahrenheit → Celsius");
        Console.WriteLine("  7. ← Back");
        Console.Write("\nSelect option: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1":
                UnitConverter.PerformConversion("Inches", "Centimeters", "\"", " cm",
                    UnitConverter.InchesToCentimeters, UnitConverter.ValidatePositive, "0.00");
                break;
            case "2":
                UnitConverter.PerformConversion("Feet", "Meters", " ft", " m",
                    UnitConverter.FeetToMeter, UnitConverter.ValidatePositive, "0.00");
                break;
            case "3":
                UnitConverter.PerformConversion("Miles", "Kilometers", " mi", " km",
                    UnitConverter.MilesToKilometers, UnitConverter.ValidatePositive, "0.00");
                break;
            case "4":
                UnitConverter.PerformConversion("Pounds", "Kilograms", " lbs", " kg",
                    UnitConverter.PoundsToKilograms, UnitConverter.ValidatePositive, "0.00");
                break;
            case "5":
                UnitConverter.PerformConversion("Gallons", "Liters", " gal", " L",
                    UnitConverter.GallonsToLiter, UnitConverter.ValidatePositive, "0.00");
                break;
            case "6":
                UnitConverter.PerformConversion("Fahrenheit", "Celsius", "°F", "°C",
                    UnitConverter.FahrenheitToCelsius, UnitConverter.ValidateFahrenheit, "0.0");
                break;
            case "7":
                return;
            default:
                UnitConverter.PrintError("Invalid option. Please enter 1-7.");
                break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// METRIC TO IMPERIAL MENU
// ═══════════════════════════════════════════════════════════════════════════
void MetricToImperialMenu()
{
    while (true)
    {
        UnitConverter.PrintHeader("METRIC → IMPERIAL");
        Console.WriteLine("  1. Centimeters → Inches");
        Console.WriteLine("  2. Meters → Feet");
        Console.WriteLine("  3. Kilometers → Miles");
        Console.WriteLine("  4. Kilograms → Pounds");
        Console.WriteLine("  5. Liters → Gallons");
        Console.WriteLine("  6. Celsius → Fahrenheit");
        Console.WriteLine("  7. ← Back");
        Console.Write("\nSelect option: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1":
                UnitConverter.PerformConversion("Centimeters", "Inches", " cm", "\"",
                    UnitConverter.CentimetersToInches, UnitConverter.ValidatePositive, "0.00");
                break;
            case "2":
                UnitConverter.PerformConversion("Meters", "Feet", " m", " ft",
                    UnitConverter.MetersToFeet, UnitConverter.ValidatePositive, "0.00");
                break;
            case "3":
                UnitConverter.PerformConversion("Kilometers", "Miles", " km", " mi",
                    UnitConverter.KilometersToMiles, UnitConverter.ValidatePositive, "0.00");
                break;
            case "4":
                UnitConverter.PerformConversion("Kilograms", "Pounds", " kg", " lbs",
                    UnitConverter.KilogramsToPounds, UnitConverter.ValidatePositive, "0.00");
                break;
            case "5":
                UnitConverter.PerformConversion("Liters", "Gallons", " L", " gal",
                    UnitConverter.LitersToGallons, UnitConverter.ValidatePositive, "0.00");
                break;
            case "6":
                UnitConverter.PerformConversion("Celsius", "Fahrenheit", "°C", "°F",
                    UnitConverter.CelsiusToFahrenheit, UnitConverter.ValidateCelsius, "0.0");
                break;
            case "7":
                return;
            default:
                UnitConverter.PrintError("Invalid option. Please enter 1-7.");
                break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BATCH CONVERSION MENU
// ═══════════════════════════════════════════════════════════════════════════
void BatchConversionMenu()
{
    while (true)
    {
        UnitConverter.PrintHeader("BATCH CONVERSION");
        Console.WriteLine("  Convert multiple values at once!\n");
        Console.WriteLine("  1. Inches → Centimeters");
        Console.WriteLine("  2. Feet → Meters");
        Console.WriteLine("  3. Miles → Kilometers");
        Console.WriteLine("  4. Pounds → Kilograms");
        Console.WriteLine("  5. Fahrenheit → Celsius");
        Console.WriteLine("  6. ← Back");
        Console.Write("\nSelect option: ");

        switch (Console.ReadLine()?.Trim())
        {
            case "1":
                UnitConverter.PerformBatchConversion("Inches", "Centimeters", "\"", " cm",
                    UnitConverter.InchesToCentimeters, "0.00");
                break;
            case "2":
                UnitConverter.PerformBatchConversion("Feet", "Meters", " ft", " m",
                    UnitConverter.FeetToMeter, "0.00");
                break;
            case "3":
                UnitConverter.PerformBatchConversion("Miles", "Kilometers", " mi", " km",
                    UnitConverter.MilesToKilometers, "0.00");
                break;
            case "4":
                UnitConverter.PerformBatchConversion("Pounds", "Kilograms", " lbs", " kg",
                    UnitConverter.PoundsToKilograms, "0.00");
                break;
            case "5":
                UnitConverter.PerformBatchConversion("Fahrenheit", "Celsius", "°F", "°C",
                    UnitConverter.FahrenheitToCelsius, "0.0");
                break;
            case "6":
                return;
            default:
                UnitConverter.PrintError("Invalid option. Please enter 1-6.");
                break;
        }
    }
}
