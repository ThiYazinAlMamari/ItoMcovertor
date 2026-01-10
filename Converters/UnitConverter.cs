namespace ItoMcovertor.Converters;

/// <summary>
/// Centralized unit conversion logic with constants, validation, and history tracking.
/// </summary>
public static class UnitConverter
{
    #region Conversion Constants

    // Length
    public const double InchesToCm = 2.54;
    public const double FeetToMeters = 0.3048;
    public const double MilesToKm = 1.60934;

    // Weight
    public const double PoundsToKg = 0.453592;

    // Volume
    public const double GallonsToLiters = 3.78541;

    // Temperature
    public const double AbsoluteZeroFahrenheit = -459.67;
    public const double AbsoluteZeroCelsius = -273.15;

    #endregion

    #region Conversion History

    private static readonly List<string> _history = new(10);

    public static IReadOnlyList<string> History => _history;

    private static void AddToHistory(string entry)
    {
        if (_history.Count >= 10)
            _history.RemoveAt(0);
        _history.Add($"[{DateTime.Now:HH:mm:ss}] {entry}");
    }

    public static void ShowHistory()
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("\n═══════════════════════════════════════");
        Console.WriteLine("        CONVERSION HISTORY (Last 10)");
        Console.WriteLine("═══════════════════════════════════════");
        Console.ResetColor();

        if (_history.Count == 0)
        {
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine("  No conversions yet.");
            Console.ResetColor();
            return;
        }

        for (int i = 0; i < _history.Count; i++)
        {
            Console.WriteLine($"  {i + 1}. {_history[i]}");
        }
    }

    #endregion

    #region Generic Conversion Engine

    public delegate double ConversionFunc(double value);
    public delegate bool ValidationFunc(double value, out string? error);

    /// <summary>
    /// Performs a conversion with input parsing, validation, color-coded output, and history tracking.
    /// </summary>
    public static void PerformConversion(
        string unitFrom,
        string unitTo,
        string symbolFrom,
        string symbolTo,
        ConversionFunc converter,
        ValidationFunc? validator = null,
        string format = "0.00")
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine($"\n══ {unitFrom} → {unitTo} ══");
        Console.ResetColor();

        while (true)
        {
            Console.Write($"\nEnter value in {unitFrom} (or 'q' to go back): ");
            string? input = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(input) || input.Trim().Equals("q", StringComparison.OrdinalIgnoreCase))
                break;

            if (!double.TryParse(input.Trim(), out double value))
            {
                PrintError("Invalid input. Please enter a numeric value.");
                continue;
            }

            // Run validation if provided
            if (validator != null && !validator(value, out string? error))
            {
                PrintError(error ?? "Invalid value.");
                continue;
            }

            double result = converter(value);
            string historyEntry = $"{value}{symbolFrom} = {result.ToString(format)}{symbolTo}";

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"  ✓ {historyEntry}");
            Console.ResetColor();

            AddToHistory(historyEntry);
        }
    }

    /// <summary>
    /// Batch conversion: convert multiple values at once (comma or space separated).
    /// </summary>
    public static void PerformBatchConversion(
        string unitFrom,
        string unitTo,
        string symbolFrom,
        string symbolTo,
        ConversionFunc converter,
        string format = "0.00")
    {
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine($"\n══ BATCH: {unitFrom} → {unitTo} ══");
        Console.ResetColor();
        Console.WriteLine("Enter multiple values separated by spaces or commas (or 'q' to go back):");

        while (true)
        {
            Console.Write("\n> ");
            string? input = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(input) || input.Trim().Equals("q", StringComparison.OrdinalIgnoreCase))
                break;

            var values = input.Split(new[] { ' ', ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            int successCount = 0;

            foreach (var val in values)
            {
                if (double.TryParse(val.Trim(), out double num))
                {
                    double result = converter(num);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine($"  ✓ {num}{symbolFrom} = {result.ToString(format)}{symbolTo}");
                    Console.ResetColor();
                    AddToHistory($"{num}{symbolFrom} = {result.ToString(format)}{symbolTo}");
                    successCount++;
                }
                else
                {
                    PrintError($"  ✗ Could not parse: '{val}'");
                }
            }

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"\n  Converted {successCount}/{values.Length} values.");
            Console.ResetColor();
        }
    }

    #endregion

    #region Validators

    public static bool ValidateFahrenheit(double value, out string? error)
    {
        if (value < AbsoluteZeroFahrenheit)
        {
            error = $"Temperature cannot be below absolute zero ({AbsoluteZeroFahrenheit}°F).";
            return false;
        }
        error = null;
        return true;
    }

    public static bool ValidateCelsius(double value, out string? error)
    {
        if (value < AbsoluteZeroCelsius)
        {
            error = $"Temperature cannot be below absolute zero ({AbsoluteZeroCelsius}°C).";
            return false;
        }
        error = null;
        return true;
    }

    public static bool ValidatePositive(double value, out string? error)
    {
        if (value < 0)
        {
            error = "Value must be positive (≥ 0).";
            return false;
        }
        error = null;
        return true;
    }

    #endregion

    #region Specific Conversions (For direct calls)

    // Length
    public static double InchesToCentimeters(double inches) => inches * InchesToCm;
    public static double CentimetersToInches(double cm) => cm / InchesToCm;
    public static double FeetToMeter(double feet) => feet * FeetToMeters;
    public static double MetersToFeet(double meters) => meters / FeetToMeters;
    public static double MilesToKilometers(double miles) => miles * MilesToKm;
    public static double KilometersToMiles(double km) => km / MilesToKm;

    // Weight
    public static double PoundsToKilograms(double lbs) => lbs * PoundsToKg;
    public static double KilogramsToPounds(double kg) => kg / PoundsToKg;

    // Volume
    public static double GallonsToLiter(double gallons) => gallons * GallonsToLiters;
    public static double LitersToGallons(double liters) => liters / GallonsToLiters;

    // Temperature
    public static double FahrenheitToCelsius(double f) => (f - 32) * 5 / 9;
    public static double CelsiusToFahrenheit(double c) => c * 9 / 5 + 32;

    #endregion

    #region Helpers

    public static void PrintError(string message)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"  ✗ {message}");
        Console.ResetColor();
    }

    public static void PrintHeader(string title)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"\n═══════════════════════════════════════");
        Console.WriteLine($"        {title}");
        Console.WriteLine($"═══════════════════════════════════════");
        Console.ResetColor();
    }

    public static void PrintMenu(string[] options)
    {
        for (int i = 0; i < options.Length; i++)
        {
            Console.WriteLine($"  {i + 1}. {options[i]}");
        }
    }

    #endregion
}
