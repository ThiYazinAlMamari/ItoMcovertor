using System.Text.Json;
using System.Text.RegularExpressions;

namespace ItoMcovertor.Converters;

/// <summary>
/// Centralized unit conversion logic with constants, validation, and history tracking.
/// </summary>
public static class UnitConverter
{
    #region Conversion Constants

    // ═══════════════════════════════════════════════════════════════════════════
    // 📏 LENGTH / DISTANCE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double InchToCm = 2.54;
    public const double InchToMm = 25.4;
    public const double FootToMeter = 0.3048;
    public const double FootToCm = 30.48;
    public const double YardToMeter = 0.9144;
    public const double MileToKm = 1.60934;
    public const double NauticalMileToKm = 1.852;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📐 AREA
    // ═══════════════════════════════════════════════════════════════════════════
    public const double SqInchToSqCm = 6.4516;
    public const double SqInchToSqMm = 645.16;
    public const double SqFootToSqMeter = 0.092903;
    public const double SqYardToSqMeter = 0.836127;
    public const double AcreToSqMeter = 4046.86;
    public const double AcreToHectare = 0.404686;
    public const double SqMileToSqKm = 2.58999;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 VOLUME (LIQUID)
    // ═══════════════════════════════════════════════════════════════════════════
    public const double TeaspoonToMl = 4.92892;
    public const double TablespoonToMl = 14.7868;
    public const double FluidOunceToMl = 29.5735;
    public const double CupToMl = 236.588;
    public const double CupToLiter = 0.236588;
    public const double PintToMl = 473.176;
    public const double PintToLiter = 0.473176;
    public const double QuartToLiter = 0.946353;
    public const double GallonToLiter = 3.78541;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 VOLUME (SOLID / GEOMETRIC)
    // ═══════════════════════════════════════════════════════════════════════════
    public const double CubicInchToCubicCm = 16.3871;
    public const double CubicFootToCubicMeter = 0.0283168;
    public const double CubicYardToCubicMeter = 0.764555;

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚖️ MASS / WEIGHT
    // ═══════════════════════════════════════════════════════════════════════════
    public const double OunceToGram = 28.3495;
    public const double PoundToKg = 0.453592;
    public const double PoundToGram = 453.592;
    public const double StoneToKg = 6.35029;
    public const double ShortTonToKg = 907.185;
    public const double ShortTonToTonne = 0.907185;
    public const double LongTonToKg = 1016.05;
    public const double LongTonToTonne = 1.01605;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌡️ TEMPERATURE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double AbsoluteZeroFahrenheit = -459.67;
    public const double AbsoluteZeroCelsius = -273.15;
    public const double AbsoluteZeroKelvin = 0;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚗 SPEED
    // ═══════════════════════════════════════════════════════════════════════════
    public const double MphToKmh = 1.60934;
    public const double MphToMps = 0.44704;
    public const double FpsToMps = 0.3048;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧭 PRESSURE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double PsiToPascal = 6894.76;
    public const double PsiToKpa = 6.89476;
    public const double PsiToBar = 0.0689476;
    public const double InHgToPascal = 3386.39;
    public const double InHgToKpa = 3.38639;

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ ENERGY
    // ═══════════════════════════════════════════════════════════════════════════
    public const double BtuToJoule = 1055.06;
    public const double BtuToKj = 1.05506;
    public const double FootPoundToJoule = 1.35582;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 POWER
    // ═══════════════════════════════════════════════════════════════════════════
    public const double HorsepowerToWatt = 745.7;
    public const double HorsepowerToKw = 0.7457;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 FORCE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double PoundForceToNewton = 4.44822;

    #endregion

    #region Conversion History

    private static readonly List<string> _history = new(10);
    private static readonly string HistoryFile = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "ItoMcovertor", "history.json");

    public static IReadOnlyList<string> History => _history;

    static UnitConverter()
    {
        LoadHistory();
    }

    private static void AddToHistory(string entry)
    {
        if (_history.Count >= 10)
            _history.RemoveAt(0);
        _history.Add($"[{DateTime.Now:HH:mm:ss}] {entry}");
        SaveHistory();
    }

    public static void SaveHistory()
    {
        try
        {
            var dir = Path.GetDirectoryName(HistoryFile);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            File.WriteAllText(HistoryFile, JsonSerializer.Serialize(_history));
        }
        catch { /* Silently ignore save errors */ }
    }

    public static void LoadHistory()
    {
        try
        {
            if (File.Exists(HistoryFile))
            {
                var data = File.ReadAllText(HistoryFile);
                var loaded = JsonSerializer.Deserialize<List<string>>(data);
                if (loaded != null)
                {
                    _history.Clear();
                    _history.AddRange(loaded.TakeLast(10));
                }
            }
        }
        catch { /* Silently ignore load errors */ }
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

    #region Direct Input Parser

    private static readonly Dictionary<string, (string From, string To, ConversionFunc Converter, string Format)> UnitMappings = new(StringComparer.OrdinalIgnoreCase)
    {
        // Length
        ["in"] = ("in", "cm", InchToCentimeter, "0.00"),
        ["inch"] = ("in", "cm", InchToCentimeter, "0.00"),
        ["inches"] = ("in", "cm", InchToCentimeter, "0.00"),
        ["ft"] = ("ft", "m", FootToMeter_, "0.00"),
        ["feet"] = ("ft", "m", FootToMeter_, "0.00"),
        ["foot"] = ("ft", "m", FootToMeter_, "0.00"),
        ["yd"] = ("yd", "m", YardToMeter_, "0.00"),
        ["yard"] = ("yd", "m", YardToMeter_, "0.00"),
        ["yards"] = ("yd", "m", YardToMeter_, "0.00"),
        ["mi"] = ("mi", "km", MileToKilometer, "0.00"),
        ["mile"] = ("mi", "km", MileToKilometer, "0.00"),
        ["miles"] = ("mi", "km", MileToKilometer, "0.00"),
        ["nm"] = ("nm", "km", NauticalMileToKilometer, "0.00"),
        ["nmi"] = ("nm", "km", NauticalMileToKilometer, "0.00"),
        
        // Metric length (reverse)
        ["cm"] = ("cm", "in", CentimeterToInch, "0.00"),
        ["mm"] = ("mm", "in", MillimeterToInch, "0.00"),
        ["m"] = ("m", "ft", MeterToFoot, "0.00"),
        ["meter"] = ("m", "ft", MeterToFoot, "0.00"),
        ["meters"] = ("m", "ft", MeterToFoot, "0.00"),
        ["km"] = ("km", "mi", KilometerToMile, "0.00"),

        // Area
        ["sqin"] = ("sq in", "cm²", SqInchToSqCentimeter, "0.00"),
        ["sqft"] = ("sq ft", "m²", SqFootToSqMeter_, "0.00"),
        ["sqyd"] = ("sq yd", "m²", SqYardToSqMeter_, "0.00"),
        ["acre"] = ("acre", "ha", AcreToHectare_, "0.00"),
        ["acres"] = ("acre", "ha", AcreToHectare_, "0.00"),
        ["sqmi"] = ("sq mi", "km²", SqMileToSqKilometer, "0.00"),

        // Volume (liquid)
        ["tsp"] = ("tsp", "ml", TeaspoonToMilliliter, "0.00"),
        ["tbsp"] = ("tbsp", "ml", TablespoonToMilliliter, "0.00"),
        ["floz"] = ("fl oz", "ml", FluidOunceToMilliliter, "0.00"),
        ["cup"] = ("cup", "ml", CupToMilliliter, "0.00"),
        ["cups"] = ("cup", "ml", CupToMilliliter, "0.00"),
        ["pt"] = ("pt", "ml", PintToMilliliter, "0.00"),
        ["pint"] = ("pt", "ml", PintToMilliliter, "0.00"),
        ["qt"] = ("qt", "L", QuartToLiter_, "0.00"),
        ["quart"] = ("qt", "L", QuartToLiter_, "0.00"),
        ["gal"] = ("gal", "L", GallonToLiter_, "0.00"),
        ["gallon"] = ("gal", "L", GallonToLiter_, "0.00"),
        ["gallons"] = ("gal", "L", GallonToLiter_, "0.00"),

        // Volume (solid)
        ["cuin"] = ("cu in", "cm³", CubicInchToCubicCentimeter, "0.00"),
        ["cuft"] = ("cu ft", "m³", CubicFootToCubicMeter_, "0.00"),
        ["cuyd"] = ("cu yd", "m³", CubicYardToCubicMeter_, "0.00"),

        // Mass/Weight
        ["oz"] = ("oz", "g", OunceToGram_, "0.00"),
        ["ounce"] = ("oz", "g", OunceToGram_, "0.00"),
        ["ounces"] = ("oz", "g", OunceToGram_, "0.00"),
        ["lb"] = ("lb", "kg", PoundToKilogram, "0.00"),
        ["lbs"] = ("lb", "kg", PoundToKilogram, "0.00"),
        ["pound"] = ("lb", "kg", PoundToKilogram, "0.00"),
        ["pounds"] = ("lb", "kg", PoundToKilogram, "0.00"),
        ["st"] = ("st", "kg", StoneToKilogram, "0.00"),
        ["stone"] = ("st", "kg", StoneToKilogram, "0.00"),
        ["ton"] = ("short ton", "kg", ShortTonToKilogram, "0.00"),

        // Metric mass (reverse)
        ["g"] = ("g", "oz", GramToOunce, "0.00"),
        ["gram"] = ("g", "oz", GramToOunce, "0.00"),
        ["grams"] = ("g", "oz", GramToOunce, "0.00"),
        ["kg"] = ("kg", "lb", KilogramToPound, "0.00"),

        // Temperature
        ["f"] = ("°F", "°C", FahrenheitToCelsius, "0.0"),
        ["fahrenheit"] = ("°F", "°C", FahrenheitToCelsius, "0.0"),
        ["c"] = ("°C", "°F", CelsiusToFahrenheit, "0.0"),
        ["celsius"] = ("°C", "°F", CelsiusToFahrenheit, "0.0"),
        ["k"] = ("K", "°C", KelvinToCelsius, "0.0"),
        ["kelvin"] = ("K", "°C", KelvinToCelsius, "0.0"),

        // Speed
        ["mph"] = ("mph", "km/h", MphToKmh_, "0.00"),
        ["kmh"] = ("km/h", "mph", KmhToMph, "0.00"),
        ["km/h"] = ("km/h", "mph", KmhToMph, "0.00"),
        ["fps"] = ("ft/s", "m/s", FpsToMps_, "0.00"),

        // Pressure
        ["psi"] = ("psi", "kPa", PsiToKilopascal, "0.00"),
        ["inhg"] = ("inHg", "kPa", InHgToKilopascal, "0.00"),
        ["bar"] = ("bar", "psi", BarToPsi, "0.00"),

        // Energy
        ["btu"] = ("BTU", "kJ", BtuToKilojoule, "0.00"),
        ["ftlb"] = ("ft·lb", "J", FootPoundToJoule_, "0.00"),

        // Power
        ["hp"] = ("hp", "kW", HorsepowerToKilowatt, "0.00"),
        ["horsepower"] = ("hp", "kW", HorsepowerToKilowatt, "0.00"),

        // Force
        ["lbf"] = ("lbf", "N", PoundForceToNewton_, "0.00"),
    };

    public static bool TryDirectConvert(string input)
    {
        var match = Regex.Match(input.Trim(), @"^([\d.,]+)\s*(\w+(?:/\w+)?)\s*(?:to\s+(\w+(?:/\w+)?))?$", RegexOptions.IgnoreCase);

        if (!match.Success)
            return false;

        if (!double.TryParse(match.Groups[1].Value, out double value))
            return false;

        string fromUnit = match.Groups[2].Value;
        string? toUnit = match.Groups[3].Success ? match.Groups[3].Value : null;

        if (!UnitMappings.TryGetValue(fromUnit, out var mapping))
            return false;

        if (toUnit != null && !toUnit.Equals(mapping.To, StringComparison.OrdinalIgnoreCase) &&
            !UnitMappings.ContainsKey(toUnit))
            return false;

        double result = mapping.Converter(value);
        string historyEntry = $"{value} {mapping.From} = {result.ToString(mapping.Format)} {mapping.To}";

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"  ✓ {historyEntry}");
        Console.ResetColor();

        AddToHistory(historyEntry);
        return true;
    }

    #endregion

    #region Generic Conversion Engine

    public delegate double ConversionFunc(double value);
    public delegate bool ValidationFunc(double value, out string? error);

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

    public static bool ValidateKelvin(double value, out string? error)
    {
        if (value < AbsoluteZeroKelvin)
        {
            error = "Kelvin cannot be negative.";
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

    #region Conversion Functions

    // ═══════════════════════════════════════════════════════════════════════════
    // 📏 LENGTH / DISTANCE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double InchToCentimeter(double v) => v * InchToCm;
    public static double InchToMillimeter(double v) => v * InchToMm;
    public static double CentimeterToInch(double v) => v / InchToCm;
    public static double MillimeterToInch(double v) => v / InchToMm;

    public static double FootToMeter_(double v) => v * FootToMeter;
    public static double FootToCentimeter(double v) => v * FootToCm;
    public static double MeterToFoot(double v) => v / FootToMeter;
    public static double CentimeterToFoot(double v) => v / FootToCm;

    public static double YardToMeter_(double v) => v * YardToMeter;
    public static double MeterToYard(double v) => v / YardToMeter;

    public static double MileToKilometer(double v) => v * MileToKm;
    public static double KilometerToMile(double v) => v / MileToKm;

    public static double NauticalMileToKilometer(double v) => v * NauticalMileToKm;
    public static double KilometerToNauticalMile(double v) => v / NauticalMileToKm;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📐 AREA
    // ═══════════════════════════════════════════════════════════════════════════
    public static double SqInchToSqCentimeter(double v) => v * SqInchToSqCm;
    public static double SqInchToSqMillimeter(double v) => v * SqInchToSqMm;
    public static double SqCentimeterToSqInch(double v) => v / SqInchToSqCm;

    public static double SqFootToSqMeter_(double v) => v * SqFootToSqMeter;
    public static double SqMeterToSqFoot(double v) => v / SqFootToSqMeter;

    public static double SqYardToSqMeter_(double v) => v * SqYardToSqMeter;
    public static double SqMeterToSqYard(double v) => v / SqYardToSqMeter;

    public static double AcreToSqMeter_(double v) => v * AcreToSqMeter;
    public static double AcreToHectare_(double v) => v * AcreToHectare;
    public static double HectareToAcre(double v) => v / AcreToHectare;
    public static double SqMeterToAcre(double v) => v / AcreToSqMeter;

    public static double SqMileToSqKilometer(double v) => v * SqMileToSqKm;
    public static double SqKilometerToSqMile(double v) => v / SqMileToSqKm;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 VOLUME (LIQUID)
    // ═══════════════════════════════════════════════════════════════════════════
    public static double TeaspoonToMilliliter(double v) => v * TeaspoonToMl;
    public static double MilliliterToTeaspoon(double v) => v / TeaspoonToMl;

    public static double TablespoonToMilliliter(double v) => v * TablespoonToMl;
    public static double MilliliterToTablespoon(double v) => v / TablespoonToMl;

    public static double FluidOunceToMilliliter(double v) => v * FluidOunceToMl;
    public static double MilliliterToFluidOunce(double v) => v / FluidOunceToMl;

    public static double CupToMilliliter(double v) => v * CupToMl;
    public static double CupToLiter_(double v) => v * CupToLiter;
    public static double MilliliterToCup(double v) => v / CupToMl;
    public static double LiterToCup(double v) => v / CupToLiter;

    public static double PintToMilliliter(double v) => v * PintToMl;
    public static double PintToLiter_(double v) => v * PintToLiter;
    public static double MilliliterToPint(double v) => v / PintToMl;
    public static double LiterToPint(double v) => v / PintToLiter;

    public static double QuartToLiter_(double v) => v * QuartToLiter;
    public static double LiterToQuart(double v) => v / QuartToLiter;

    public static double GallonToLiter_(double v) => v * GallonToLiter;
    public static double LiterToGallon(double v) => v / GallonToLiter;

    // ═══════════════════════════════════════════════════════════════════════════
    // 📦 VOLUME (SOLID / GEOMETRIC)
    // ═══════════════════════════════════════════════════════════════════════════
    public static double CubicInchToCubicCentimeter(double v) => v * CubicInchToCubicCm;
    public static double CubicCentimeterToCubicInch(double v) => v / CubicInchToCubicCm;

    public static double CubicFootToCubicMeter_(double v) => v * CubicFootToCubicMeter;
    public static double CubicMeterToCubicFoot(double v) => v / CubicFootToCubicMeter;

    public static double CubicYardToCubicMeter_(double v) => v * CubicYardToCubicMeter;
    public static double CubicMeterToCubicYard(double v) => v / CubicYardToCubicMeter;

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚖️ MASS / WEIGHT
    // ═══════════════════════════════════════════════════════════════════════════
    public static double OunceToGram_(double v) => v * OunceToGram;
    public static double GramToOunce(double v) => v / OunceToGram;

    public static double PoundToKilogram(double v) => v * PoundToKg;
    public static double PoundToGram_(double v) => v * PoundToGram;
    public static double KilogramToPound(double v) => v / PoundToKg;
    public static double GramToPound(double v) => v / PoundToGram;

    public static double StoneToKilogram(double v) => v * StoneToKg;
    public static double KilogramToStone(double v) => v / StoneToKg;

    public static double ShortTonToKilogram(double v) => v * ShortTonToKg;
    public static double ShortTonToTonne_(double v) => v * ShortTonToTonne;
    public static double KilogramToShortTon(double v) => v / ShortTonToKg;
    public static double TonneToShortTon(double v) => v / ShortTonToTonne;

    public static double LongTonToKilogram(double v) => v * LongTonToKg;
    public static double LongTonToTonne_(double v) => v * LongTonToTonne;
    public static double KilogramToLongTon(double v) => v / LongTonToKg;
    public static double TonneToLongTon(double v) => v / LongTonToTonne;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌡️ TEMPERATURE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double FahrenheitToCelsius(double f) => (f - 32) * 5 / 9;
    public static double CelsiusToFahrenheit(double c) => c * 9 / 5 + 32;
    public static double FahrenheitToKelvin(double f) => (f - 32) * 5 / 9 + 273.15;
    public static double KelvinToFahrenheit(double k) => (k - 273.15) * 9 / 5 + 32;
    public static double CelsiusToKelvin(double c) => c + 273.15;
    public static double KelvinToCelsius(double k) => k - 273.15;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚗 SPEED
    // ═══════════════════════════════════════════════════════════════════════════
    public static double MphToKmh_(double v) => v * MphToKmh;
    public static double MphToMps_(double v) => v * MphToMps;
    public static double KmhToMph(double v) => v / MphToKmh;
    public static double MpsToMph(double v) => v / MphToMps;

    public static double FpsToMps_(double v) => v * FpsToMps;
    public static double MpsToFps(double v) => v / FpsToMps;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧭 PRESSURE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double PsiToPascal_(double v) => v * PsiToPascal;
    public static double PsiToKilopascal(double v) => v * PsiToKpa;
    public static double PsiToBar_(double v) => v * PsiToBar;
    public static double PascalToPsi(double v) => v / PsiToPascal;
    public static double KilopascalToPsi(double v) => v / PsiToKpa;
    public static double BarToPsi(double v) => v / PsiToBar;

    public static double InHgToPascal_(double v) => v * InHgToPascal;
    public static double InHgToKilopascal(double v) => v * InHgToKpa;
    public static double PascalToInHg(double v) => v / InHgToPascal;
    public static double KilopascalToInHg(double v) => v / InHgToKpa;

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ ENERGY
    // ═══════════════════════════════════════════════════════════════════════════
    public static double BtuToJoule_(double v) => v * BtuToJoule;
    public static double BtuToKilojoule(double v) => v * BtuToKj;
    public static double JouleToBtu(double v) => v / BtuToJoule;
    public static double KilojouleToBtu(double v) => v / BtuToKj;

    public static double FootPoundToJoule_(double v) => v * FootPoundToJoule;
    public static double JouleToFootPound(double v) => v / FootPoundToJoule;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔌 POWER
    // ═══════════════════════════════════════════════════════════════════════════
    public static double HorsepowerToWatt_(double v) => v * HorsepowerToWatt;
    public static double HorsepowerToKilowatt(double v) => v * HorsepowerToKw;
    public static double WattToHorsepower(double v) => v / HorsepowerToWatt;
    public static double KilowattToHorsepower(double v) => v / HorsepowerToKw;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧪 FORCE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double PoundForceToNewton_(double v) => v * PoundForceToNewton;
    public static double NewtonToPoundForce(double v) => v / PoundForceToNewton;

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
