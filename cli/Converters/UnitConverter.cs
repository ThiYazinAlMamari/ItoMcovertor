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
    // LENGTH / DISTANCE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double InchToCm = 2.54;
    public const double InchToMm = 25.4;
    public const double FootToMeter = 0.3048;
    public const double FootToCm = 30.48;
    public const double YardToMeter = 0.9144;
    public const double MileToKm = 1.60934;
    public const double NauticalMileToKm = 1.852;
    // Small SI Length
    public const double MicrometerToIn = 3.93701e-5;
    public const double NanometerToIn = 3.93701e-8;
    public const double PicometerToIn = 3.93701e-11;
    public const double FemtometerToIn = 3.93701e-14;
    public const double AttometerToIn = 3.93701e-17;
    public const double ZeptometerToIn = 3.93701e-20;
    public const double YoctometerToIn = 3.93701e-23;
    // Large SI Length (to miles)
    public const double MegameterToMi = 621.371;
    public const double GigameterToMi = 621371;
    public const double TerameterToMi = 6.21371e8;
    public const double PetameterToMi = 6.21371e11;
    public const double ExameterToMi = 6.21371e14;
    public const double ZettameterToMi = 6.21371e17;
    public const double YottameterToMi = 6.21371e20;

    // ═══════════════════════════════════════════════════════════════════════════
    // AREA
    // ═══════════════════════════════════════════════════════════════════════════
    public const double SqInchToSqCm = 6.4516;
    public const double SqInchToSqMm = 645.16;
    public const double SqFootToSqMeter = 0.092903;
    public const double SqYardToSqMeter = 0.836127;
    public const double AcreToSqMeter = 4046.86;
    public const double AcreToHectare = 0.404686;
    public const double SqMileToSqKm = 2.58999;

    // ═══════════════════════════════════════════════════════════════════════════
    // VOLUME (LIQUID)
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
    // Small SI Volume
    public const double MicroliterToFlOz = 3.3814e-5;
    public const double NanoliterToFlOz = 3.3814e-8;
    public const double PicoliterToFlOz = 3.3814e-11;
    public const double FemtoliterToFlOz = 3.3814e-14;
    public const double AttoliterToFlOz = 3.3814e-17;
    public const double ZeptoliterToFlOz = 3.3814e-20;
    public const double YoctoliterToFlOz = 3.3814e-23;
    // Large SI Volume (to gallons)
    public const double KiloliterToGal = 264.172;
    public const double MegaliterToGal = 264172;
    public const double GigaliterToGal = 2.64172e8;
    public const double TeraliterToGal = 2.64172e11;
    public const double PetaliterToGal = 2.64172e14;
    public const double ExaliterToGal = 2.64172e17;
    public const double ZettaliterToGal = 2.64172e20;
    public const double YottaliterToGal = 2.64172e23;

    // ═══════════════════════════════════════════════════════════════════════════
    // VOLUME (SOLID / GEOMETRIC)
    // ═══════════════════════════════════════════════════════════════════════════
    public const double CubicInchToCubicCm = 16.3871;
    public const double CubicFootToCubicMeter = 0.0283168;
    public const double CubicYardToCubicMeter = 0.764555;

    // ═══════════════════════════════════════════════════════════════════════════
    // MASS / WEIGHT
    // ═══════════════════════════════════════════════════════════════════════════
    public const double OunceToGram = 28.3495;
    public const double PoundToKg = 0.453592;
    public const double PoundToGram = 453.592;
    public const double StoneToKg = 6.35029;
    public const double ShortTonToKg = 907.185;
    public const double ShortTonToTonne = 0.907185;
    public const double LongTonToKg = 1016.05;
    public const double LongTonToTonne = 1.01605;
    // Large SI Mass (to short tons)
    public const double GigagramToShortTon = 1102.31;
    public const double TeragramToShortTon = 1.10231e6;
    public const double PetagramToShortTon = 1.10231e9;
    public const double ExagramToShortTon = 1.10231e12;
    public const double ZettagramToShortTon = 1.10231e15;
    public const double YottagramToShortTon = 1.10231e18;

    // ═══════════════════════════════════════════════════════════════════════════
    // TEMPERATURE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double AbsoluteZeroFahrenheit = -459.67;
    public const double AbsoluteZeroCelsius = -273.15;
    public const double AbsoluteZeroKelvin = 0;

    // ═══════════════════════════════════════════════════════════════════════════
    // SPEED
    // ═══════════════════════════════════════════════════════════════════════════
    public const double MphToKmh = 1.60934;
    public const double MphToMps = 0.44704;
    public const double FpsToMps = 0.3048;
    // Metric to imperial speed
    public const double MmpsToMph = 0.00223694;    // mm/s → mph
    public const double CmpsToMph = 0.0223694;     // cm/s → mph
    public const double MpsToMphFactor = 2.23694;        // m/s → mph
    public const double KmhToMphFactor = 0.621371;       // km/h → mph
    public const double KmpsToMph = 2236.94;       // km/s → mph

    // ═══════════════════════════════════════════════════════════════════════════
    // PRESSURE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double PsiToPascal = 6894.76;
    public const double PsiToKpa = 6.89476;
    public const double PsiToMpa = 0.00689476;
    public const double PsiToBar = 0.0689476;
    public const double InHgToPascal = 3386.39;
    public const double InHgToKpa = 3.38639;
    
    // SI Pressure scale factors (to Pa base)
    public const double HpaToPa = 100;
    public const double KpaToPa = 1000;
    public const double MpaToPa = 1000000;
    public const double GpaToPa = 1000000000;
    public const double TpaToPa = 1000000000000;
    public const double PpaToPa = 1000000000000000;
    public const double EpaToPa = 1000000000000000000;
    public const double ZpaToPa = 1e21;
    public const double YpaToPa = 1e24;
    public const double BarToPa = 100000;

    // ═══════════════════════════════════════════════════════════════════════════
    // ENERGY
    // ═══════════════════════════════════════════════════════════════════════════
    public const double BtuToJoule = 1055.06;
    public const double BtuToKj = 1.05506;
    public const double FootPoundToJoule = 1.35582;
    
    // SI Energy scale factors (to Joule base) and BTU conversions
    public const double KjToJ = 1000;
    public const double MjToJ = 1e6;
    public const double GjToJ = 1e9;
    public const double TjToJ = 1e12;
    public const double PjToJ = 1e15;
    public const double EjToJ = 1e18;
    public const double ZjToJ = 1e21;
    public const double YjToJ = 1e24;
    public const double RjToJ = 1e27;  // Ronna (2022 SI prefix)
    public const double QjToJ = 1e30;  // Quetta (2022 SI prefix)
    public const double JouleToBtuFactor = 0.000947817;

    // ═══════════════════════════════════════════════════════════════════════════
    // POWER
    // ═══════════════════════════════════════════════════════════════════════════
    public const double HorsepowerToWatt = 745.7;
    public const double HorsepowerToKw = 0.7457;
    public const double MegawattToHorsepower = 1341.02;
    public const double GigawattToHorsepower = 1341020;
    public const double TerawattToHorsepower = 1341020000;
    public const double PetawattToHorsepower = 1341020000000;
    public const double ExawattToHorsepower = 1341020000000000;
    public const double ZettawattToHorsepower = 1.34102e18;
    public const double YottawattToHorsepower = 1.34102e21;

    // ═══════════════════════════════════════════════════════════════════════════
    // FORCE
    // ═══════════════════════════════════════════════════════════════════════════
    public const double PoundForceToNewton = 4.44822;

    #endregion

    #region Settings

    private static readonly string SettingsFile = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "ItoMcovertor", "settings.json");

    public static int Precision { get; set; } = 4;
    public static bool UseNumberGrouping { get; set; } = true;
    public static bool UseScientificNotation { get; set; } = true;
    public static string RoundingMode { get; set; } = "round"; // round, floor, ceiling
    public static int HistorySize { get; set; } = 10; // CLI-specific: 5-50
    public static bool UseColorOutput { get; set; } = true; // CLI-specific

    public static string GetFormatString() => $"0.{new string('0', Precision)}";

    public static string FormatNumber(double value)
    {
        // Apply rounding mode
        double multiplier = Math.Pow(10, Precision);
        double rounded = RoundingMode switch
        {
            "floor" => Math.Floor(value * multiplier) / multiplier,
            "ceiling" => Math.Ceiling(value * multiplier) / multiplier,
            _ => Math.Round(value, Precision)
        };

        // Scientific notation for very small/large numbers
        if (UseScientificNotation && rounded != 0 && (Math.Abs(rounded) < 0.0001 || Math.Abs(rounded) > 999999999))
        {
            return rounded.ToString($"0.{new string('0', Precision)}E+0");
        }

        string formatted = rounded.ToString(GetFormatString());
        
        if (UseNumberGrouping && Math.Abs(rounded) >= 1000)
        {
            return rounded.ToString($"N{Precision}");
        }

        return formatted;
    }

    public static void SaveSettings()
    {
        try
        {
            var dir = Path.GetDirectoryName(SettingsFile);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            var settings = new { Precision, UseNumberGrouping, UseScientificNotation, RoundingMode, HistorySize, UseColorOutput };
            File.WriteAllText(SettingsFile, System.Text.Json.JsonSerializer.Serialize(settings));
        }
        catch { }
    }

    public static void LoadSettings()
    {
        try
        {
            if (File.Exists(SettingsFile))
            {
                var json = File.ReadAllText(SettingsFile);
                using var doc = System.Text.Json.JsonDocument.Parse(json);
                var root = doc.RootElement;
                if (root.TryGetProperty("Precision", out var p)) Precision = p.GetInt32();
                if (root.TryGetProperty("UseNumberGrouping", out var g)) UseNumberGrouping = g.GetBoolean();
                if (root.TryGetProperty("UseScientificNotation", out var s)) UseScientificNotation = s.GetBoolean();
                if (root.TryGetProperty("RoundingMode", out var r)) RoundingMode = r.GetString() ?? "round";
                if (root.TryGetProperty("HistorySize", out var h)) HistorySize = Math.Clamp(h.GetInt32(), 5, 50);
                if (root.TryGetProperty("UseColorOutput", out var c)) UseColorOutput = c.GetBoolean();
            }
        }
        catch { }
    }

    public static void SettingsMenu()
    {
        while (true)
        {
            PrintHeader("SETTINGS");
            Console.WriteLine($"   1. Precision: {Precision} decimals");
            Console.WriteLine($"   2. Number Grouping: {(UseNumberGrouping ? "On" : "Off")}");
            Console.WriteLine($"   3. Scientific Notation: {(UseScientificNotation ? "On" : "Off")}");
            Console.WriteLine($"   4. Rounding: {RoundingMode}");
            Console.WriteLine($"   5. History Size: {HistorySize} entries");
            Console.WriteLine($"   6. Color Output: {(UseColorOutput ? "On" : "Off")}");
            Console.WriteLine("   7. <- Back");
            Console.Write("\nSelect: ");

            switch (Console.ReadLine()?.Trim())
            {
                case "1":
                    Console.Write("Enter precision (1-4): ");
                    if (int.TryParse(Console.ReadLine()?.Trim(), out int prec) && prec >= 1 && prec <= 4)
                    {
                        Precision = prec;
                        SaveSettings();
                        PrintSuccess($"Precision set to {prec}");
                    }
                    else PrintError("Invalid. Enter 1-4.");
                    break;
                case "2":
                    UseNumberGrouping = !UseNumberGrouping;
                    SaveSettings();
                    PrintSuccess($"Number Grouping: {(UseNumberGrouping ? "On" : "Off")}");
                    break;
                case "3":
                    UseScientificNotation = !UseScientificNotation;
                    SaveSettings();
                    PrintSuccess($"Scientific Notation: {(UseScientificNotation ? "On" : "Off")}");
                    break;
                case "4":
                    Console.WriteLine("  1) round  2) floor  3) ceiling");
                    Console.Write("  Select: ");
                    var choice = Console.ReadLine()?.Trim();
                    RoundingMode = choice switch { "2" => "floor", "3" => "ceiling", _ => "round" };
                    SaveSettings();
                    PrintSuccess($"Rounding: {RoundingMode}");
                    break;
                case "5":
                    Console.Write("Enter history size (5-50): ");
                    if (int.TryParse(Console.ReadLine()?.Trim(), out int size) && size >= 5 && size <= 50)
                    {
                        HistorySize = size;
                        SaveSettings();
                        PrintSuccess($"History Size set to {size}");
                    }
                    else PrintError("Invalid. Enter 5-50.");
                    break;
                case "6":
                    UseColorOutput = !UseColorOutput;
                    SaveSettings();
                    PrintSuccess($"Color Output: {(UseColorOutput ? "On" : "Off")}");
                    break;
                case "7": return;
                default: PrintError("Invalid option."); break;
            }
        }
    }

    private static void PrintSuccess(string message)
    {
        if (UseColorOutput) Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"  {message}");
        if (UseColorOutput) Console.ResetColor();
    }

    #endregion

    #region Conversion History

    private static readonly List<string> _history = new(10);
    private static readonly string HistoryFile = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "ItoMcovertor", "history.json");

    public static IReadOnlyList<string> History => _history;

    static UnitConverter()
    {
        LoadSettings();
        LoadHistory();
    }

    private static void AddToHistory(string entry)
    {
        while (_history.Count >= HistorySize)
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
        ["in"] = ("in", "cm", InchToCentimeter, "0.0000"),
        ["inch"] = ("in", "cm", InchToCentimeter, "0.0000"),
        ["inches"] = ("in", "cm", InchToCentimeter, "0.0000"),
        ["ft"] = ("ft", "m", FootToMeter_, "0.0000"),
        ["feet"] = ("ft", "m", FootToMeter_, "0.0000"),
        ["foot"] = ("ft", "m", FootToMeter_, "0.0000"),
        ["yd"] = ("yd", "m", YardToMeter_, "0.0000"),
        ["yard"] = ("yd", "m", YardToMeter_, "0.0000"),
        ["yards"] = ("yd", "m", YardToMeter_, "0.0000"),
        ["mi"] = ("mi", "km", MileToKilometer, "0.0000"),
        ["mile"] = ("mi", "km", MileToKilometer, "0.0000"),
        ["miles"] = ("mi", "km", MileToKilometer, "0.0000"),
        ["nm"] = ("nm", "km", NauticalMileToKilometer, "0.0000"),
        ["nmi"] = ("nm", "km", NauticalMileToKilometer, "0.0000"),
        
        // Metric length (reverse)
        ["cm"] = ("cm", "in", CentimeterToInch, "0.0000"),
        ["mm"] = ("mm", "in", MillimeterToInch, "0.0000"),
        ["m"] = ("m", "ft", MeterToFoot, "0.0000"),
        ["meter"] = ("m", "ft", MeterToFoot, "0.0000"),
        ["meters"] = ("m", "ft", MeterToFoot, "0.0000"),
        ["km"] = ("km", "mi", KilometerToMile, "0.0000"),
        // Small SI Length
        ["um"] = ("µm", "in", MicrometerToInch, "0.00000000"),
        ["µm"] = ("µm", "in", MicrometerToInch, "0.00000000"),
        ["micrometer"] = ("µm", "in", MicrometerToInch, "0.00000000"),
        ["micrometers"] = ("µm", "in", MicrometerToInch, "0.00000000"),
        ["nanometer"] = ("nm", "in", NanometerToInch, "0.00000000"),
        ["nanometers"] = ("nm", "in", NanometerToInch, "0.00000000"),
        ["pm"] = ("pm", "in", PicometerToInch, "0.00000000"),
        ["picometer"] = ("pm", "in", PicometerToInch, "0.00000000"),
        ["picometers"] = ("pm", "in", PicometerToInch, "0.00000000"),
        ["fm"] = ("fm", "in", FemtometerToInch, "0.00000000"),
        ["femtometer"] = ("fm", "in", FemtometerToInch, "0.00000000"),
        ["femtometers"] = ("fm", "in", FemtometerToInch, "0.00000000"),
        ["am"] = ("am", "in", AttometerToInch, "0.00000000"),
        ["attometer"] = ("am", "in", AttometerToInch, "0.00000000"),
        ["attometers"] = ("am", "in", AttometerToInch, "0.00000000"),
        ["zm"] = ("zm", "in", ZeptometerToInch, "0.00000000"),
        ["zeptometer"] = ("zm", "in", ZeptometerToInch, "0.00000000"),
        ["zeptometers"] = ("zm", "in", ZeptometerToInch, "0.00000000"),
        ["ym"] = ("ym", "in", YoctometerToInch, "0.00000000"),
        ["yoctometer"] = ("ym", "in", YoctometerToInch, "0.00000000"),
        ["yoctometers"] = ("ym", "in", YoctometerToInch, "0.00000000"),
        // Large SI Length (to miles)
        ["mm"] = ("Mm", "mi", MegameterToMile, "0.00"),
        ["megameter"] = ("Mm", "mi", MegameterToMile, "0.00"),
        ["megameters"] = ("Mm", "mi", MegameterToMile, "0.00"),
        ["gm"] = ("Gm", "mi", GigameterToMile, "0.00"),
        ["gigameter"] = ("Gm", "mi", GigameterToMile, "0.00"),
        ["gigameters"] = ("Gm", "mi", GigameterToMile, "0.00"),
        ["tm"] = ("Tm", "mi", TerameterToMile, "0.00"),
        ["terameter"] = ("Tm", "mi", TerameterToMile, "0.00"),
        ["terameters"] = ("Tm", "mi", TerameterToMile, "0.00"),
        ["pm2"] = ("Pm", "mi", PetameterToMile, "0.00"),
        ["petameter"] = ("Pm", "mi", PetameterToMile, "0.00"),
        ["petameters"] = ("Pm", "mi", PetameterToMile, "0.00"),
        ["em"] = ("Em", "mi", ExameterToMile, "0.00"),
        ["exameter"] = ("Em", "mi", ExameterToMile, "0.00"),
        ["exameters"] = ("Em", "mi", ExameterToMile, "0.00"),
        ["zettam"] = ("Zm", "mi", ZettameterToMile, "0.00"),
        ["zettameter"] = ("Zm", "mi", ZettameterToMile, "0.00"),
        ["zettameters"] = ("Zm", "mi", ZettameterToMile, "0.00"),
        ["yottam"] = ("Ym", "mi", YottameterToMile, "0.00"),
        ["yottameter"] = ("Ym", "mi", YottameterToMile, "0.00"),
        ["yottameters"] = ("Ym", "mi", YottameterToMile, "0.00"),

        // Area
        ["sqin"] = ("sq in", "cm²", SqInchToSqCentimeter, "0.0000"),
        ["sqft"] = ("sq ft", "m²", SqFootToSqMeter_, "0.0000"),
        ["sqyd"] = ("sq yd", "m²", SqYardToSqMeter_, "0.0000"),
        ["acre"] = ("acre", "ha", AcreToHectare_, "0.0000"),
        ["acres"] = ("acre", "ha", AcreToHectare_, "0.0000"),
        ["sqmi"] = ("sq mi", "km²", SqMileToSqKilometer, "0.0000"),

        // Volume (liquid)
        ["tsp"] = ("tsp", "ml", TeaspoonToMilliliter, "0.0000"),
        ["tbsp"] = ("tbsp", "ml", TablespoonToMilliliter, "0.0000"),
        ["floz"] = ("fl oz", "ml", FluidOunceToMilliliter, "0.0000"),
        ["cup"] = ("cup", "ml", CupToMilliliter, "0.0000"),
        ["cups"] = ("cup", "ml", CupToMilliliter, "0.0000"),
        ["pt"] = ("pt", "ml", PintToMilliliter, "0.0000"),
        ["pint"] = ("pt", "ml", PintToMilliliter, "0.0000"),
        ["qt"] = ("qt", "L", QuartToLiter_, "0.0000"),
        ["quart"] = ("qt", "L", QuartToLiter_, "0.0000"),
        ["gal"] = ("gal", "L", GallonToLiter_, "0.0000"),
        ["gallon"] = ("gal", "L", GallonToLiter_, "0.0000"),
        ["gallons"] = ("gal", "L", GallonToLiter_, "0.0000"),

        // Volume (solid)
        ["cuin"] = ("cu in", "cm³", CubicInchToCubicCentimeter, "0.0000"),
        ["cuft"] = ("cu ft", "m³", CubicFootToCubicMeter_, "0.0000"),
        ["cuyd"] = ("cu yd", "m³", CubicYardToCubicMeter_, "0.0000"),
        // Small SI Volume
        ["ul"] = ("µL", "fl oz", MicroliterToFluidOunce, "0.00000000"),
        ["µl"] = ("µL", "fl oz", MicroliterToFluidOunce, "0.00000000"),
        ["microliter"] = ("µL", "fl oz", MicroliterToFluidOunce, "0.00000000"),
        ["microliters"] = ("µL", "fl oz", MicroliterToFluidOunce, "0.00000000"),
        ["nl"] = ("nL", "fl oz", NanoliterToFluidOunce, "0.00000000"),
        ["nanoliter"] = ("nL", "fl oz", NanoliterToFluidOunce, "0.00000000"),
        ["nanoliters"] = ("nL", "fl oz", NanoliterToFluidOunce, "0.00000000"),
        ["pl"] = ("pL", "fl oz", PicoliterToFluidOunce, "0.00000000"),
        ["picoliter"] = ("pL", "fl oz", PicoliterToFluidOunce, "0.00000000"),
        ["picoliters"] = ("pL", "fl oz", PicoliterToFluidOunce, "0.00000000"),
        ["fl"] = ("fL", "fl oz", FemtoliterToFluidOunce, "0.00000000"),
        ["femtoliter"] = ("fL", "fl oz", FemtoliterToFluidOunce, "0.00000000"),
        ["femtoliters"] = ("fL", "fl oz", FemtoliterToFluidOunce, "0.00000000"),
        ["al"] = ("aL", "fl oz", AttoliterToFluidOunce, "0.00000000"),
        ["attoliter"] = ("aL", "fl oz", AttoliterToFluidOunce, "0.00000000"),
        ["attoliters"] = ("aL", "fl oz", AttoliterToFluidOunce, "0.00000000"),
        ["zl"] = ("zL", "fl oz", ZeptoliterToFluidOunce, "0.00000000"),
        ["zeptoliter"] = ("zL", "fl oz", ZeptoliterToFluidOunce, "0.00000000"),
        ["zeptoliters"] = ("zL", "fl oz", ZeptoliterToFluidOunce, "0.00000000"),
        ["yl"] = ("yL", "fl oz", YoctoliterToFluidOunce, "0.00000000"),
        ["yoctoliter"] = ("yL", "fl oz", YoctoliterToFluidOunce, "0.00000000"),
        ["yoctoliters"] = ("yL", "fl oz", YoctoliterToFluidOunce, "0.00000000"),
        // Large SI Volume (to gallons)
        ["kl"] = ("kL", "gal", KiloliterToGallon, "0.00"),
        ["kiloliter"] = ("kL", "gal", KiloliterToGallon, "0.00"),
        ["kiloliters"] = ("kL", "gal", KiloliterToGallon, "0.00"),
        ["ml2"] = ("ML", "gal", MegaliterToGallon, "0.00"),
        ["megaliter"] = ("ML", "gal", MegaliterToGallon, "0.00"),
        ["megaliters"] = ("ML", "gal", MegaliterToGallon, "0.00"),
        ["gl"] = ("GL", "gal", GigaliterToGallon, "0.00"),
        ["gigaliter"] = ("GL", "gal", GigaliterToGallon, "0.00"),
        ["gigaliters"] = ("GL", "gal", GigaliterToGallon, "0.00"),
        ["tl"] = ("TL", "gal", TeraliterToGallon, "0.00"),
        ["teraliter"] = ("TL", "gal", TeraliterToGallon, "0.00"),
        ["teraliters"] = ("TL", "gal", TeraliterToGallon, "0.00"),
        ["pl2"] = ("PL", "gal", PetaliterToGallon, "0.00"),
        ["petaliter"] = ("PL", "gal", PetaliterToGallon, "0.00"),
        ["petaliters"] = ("PL", "gal", PetaliterToGallon, "0.00"),
        ["el"] = ("EL", "gal", ExaliterToGallon, "0.00"),
        ["exaliter"] = ("EL", "gal", ExaliterToGallon, "0.00"),
        ["exaliters"] = ("EL", "gal", ExaliterToGallon, "0.00"),
        ["zettal"] = ("ZL", "gal", ZettaliterToGallon, "0.00"),
        ["zettaliter"] = ("ZL", "gal", ZettaliterToGallon, "0.00"),
        ["zettaliters"] = ("ZL", "gal", ZettaliterToGallon, "0.00"),
        ["yottal"] = ("YL", "gal", YottaliterToGallon, "0.00"),
        ["yottaliter"] = ("YL", "gal", YottaliterToGallon, "0.00"),
        ["yottaliters"] = ("YL", "gal", YottaliterToGallon, "0.00"),

        // Mass/Weight
        ["oz"] = ("oz", "g", OunceToGram_, "0.0000"),
        ["ounce"] = ("oz", "g", OunceToGram_, "0.0000"),
        ["ounces"] = ("oz", "g", OunceToGram_, "0.0000"),
        ["lb"] = ("lb", "kg", PoundToKilogram, "0.0000"),
        ["lbs"] = ("lb", "kg", PoundToKilogram, "0.0000"),
        ["pound"] = ("lb", "kg", PoundToKilogram, "0.0000"),
        ["pounds"] = ("lb", "kg", PoundToKilogram, "0.0000"),
        ["st"] = ("st", "kg", StoneToKilogram, "0.0000"),
        ["stone"] = ("st", "kg", StoneToKilogram, "0.0000"),
        ["ton"] = ("short ton", "kg", ShortTonToKilogram, "0.0000"),

        // Metric mass (reverse)
        ["g"] = ("g", "oz", GramToOunce, "0.0000"),
        ["gram"] = ("g", "oz", GramToOunce, "0.0000"),
        ["grams"] = ("g", "oz", GramToOunce, "0.0000"),
        ["kg"] = ("kg", "lb", KilogramToPound, "0.0000"),
        // Large SI Mass (to short tons)
        ["gg"] = ("Gg", "short ton", GigagramToShortTon_, "0.00"),
        ["gigagram"] = ("Gg", "short ton", GigagramToShortTon_, "0.00"),
        ["gigagrams"] = ("Gg", "short ton", GigagramToShortTon_, "0.00"),
        ["tg"] = ("Tg", "short ton", TeragramToShortTon_, "0.00"),
        ["teragram"] = ("Tg", "short ton", TeragramToShortTon_, "0.00"),
        ["teragrams"] = ("Tg", "short ton", TeragramToShortTon_, "0.00"),
        ["pg"] = ("Pg", "short ton", PetagramToShortTon_, "0.00"),
        ["petagram"] = ("Pg", "short ton", PetagramToShortTon_, "0.00"),
        ["petagrams"] = ("Pg", "short ton", PetagramToShortTon_, "0.00"),
        ["eg"] = ("Eg", "short ton", ExagramToShortTon_, "0.00"),
        ["exagram"] = ("Eg", "short ton", ExagramToShortTon_, "0.00"),
        ["exagrams"] = ("Eg", "short ton", ExagramToShortTon_, "0.00"),
        ["zettag"] = ("Zg", "short ton", ZettagramToShortTon_, "0.00"),
        ["zettagram"] = ("Zg", "short ton", ZettagramToShortTon_, "0.00"),
        ["zettagrams"] = ("Zg", "short ton", ZettagramToShortTon_, "0.00"),
        ["yottag"] = ("Yg", "short ton", YottagramToShortTon_, "0.00"),
        ["yottagram"] = ("Yg", "short ton", YottagramToShortTon_, "0.00"),
        ["yottagrams"] = ("Yg", "short ton", YottagramToShortTon_, "0.00"),

        // Temperature
        ["f"] = ("°F", "°C", FahrenheitToCelsius, "0.0"),
        ["fahrenheit"] = ("°F", "°C", FahrenheitToCelsius, "0.0"),
        ["c"] = ("°C", "°F", CelsiusToFahrenheit, "0.0"),
        ["celsius"] = ("°C", "°F", CelsiusToFahrenheit, "0.0"),
        ["k"] = ("K", "°C", KelvinToCelsius, "0.0"),
        ["kelvin"] = ("K", "°C", KelvinToCelsius, "0.0"),

        // Speed
        ["mph"] = ("mph", "km/h", MphToKmh_, "0.0000"),
        ["kmh"] = ("km/h", "mph", KmhToMph, "0.0000"),
        ["km/h"] = ("km/h", "mph", KmhToMph, "0.0000"),
        ["fps"] = ("ft/s", "m/s", FpsToMps_, "0.0000"),

        // Pressure
        ["psi"] = ("psi", "kPa", PsiToKilopascal, "0.0000"),
        ["inhg"] = ("inHg", "kPa", InHgToKilopascal, "0.0000"),
        ["pa"] = ("Pa", "psi", PascalToPsi, "0.000000"),
        ["hpa"] = ("hPa", "psi", HpaToPsi, "0.0000"),
        ["kpa"] = ("kPa", "psi", KilopascalToPsi, "0.0000"),
        ["mpa"] = ("MPa", "psi", MpaToPsi, "0.00"),
        ["gpa"] = ("GPa", "psi", GpaToPsi, "0.00"),
        ["tpa"] = ("TPa", "psi", TpaToPsi, "0.00"),
        ["ppa"] = ("PPa", "psi", PpaToPsi, "0.00"),
        ["epa"] = ("EPa", "psi", EpaToPsi, "0.00"),
        ["zpa"] = ("ZPa", "psi", ZpaToPsi, "0.00"),
        ["ypa"] = ("YPa", "psi", YpaToPsi, "0.00"),
        ["bar"] = ("bar", "psi", BarToPsi, "0.0000"),

        // Energy
        ["btu"] = ("BTU", "kJ", BtuToKilojoule, "0.0000"),
        ["ftlb"] = ("ft·lb", "J", FootPoundToJoule_, "0.0000"),
        ["j"] = ("J", "BTU", JouleToBtu, "0.000000"),
        ["kj"] = ("kJ", "BTU", KjToBtu, "0.0000"),
        ["mj"] = ("MJ", "BTU", MjToBtu, "0.00"),
        ["gj"] = ("GJ", "BTU", GjToBtu, "0.00"),
        ["tj"] = ("TJ", "BTU", TjToBtu, "0.00"),
        ["pj"] = ("PJ", "BTU", PjToBtu, "0.00"),
        ["ej"] = ("EJ", "BTU", EjToBtu, "0.00"),
        ["zj"] = ("ZJ", "BTU", ZjToBtu, "0.00"),
        ["yj"] = ("YJ", "BTU", YjToBtu, "0.00"),
        ["rj"] = ("RJ", "BTU", RjToBtu, "0.00"),  // Ronnajoule (2022 SI)
        ["qj"] = ("QJ", "BTU", QjToBtu, "0.00"),  // Quettajoule (2022 SI)

        // Power
        ["hp"] = ("hp", "kW", HorsepowerToKilowatt, "0.0000"),
        ["horsepower"] = ("hp", "kW", HorsepowerToKilowatt, "0.0000"),

        // Speed (metric to imperial)
        ["mm/s"] = ("mm/s", "mph", MmpsToMph_, "0.00000000"),
        ["mmps"] = ("mm/s", "mph", MmpsToMph_, "0.00000000"),
        ["cm/s"] = ("cm/s", "mph", CmpsToMph_, "0.0000000"),
        ["cmps"] = ("cm/s", "mph", CmpsToMph_, "0.0000000"),
        ["m/s"] = ("m/s", "mph", MpsToMph_, "0.0000"),
        ["mps"] = ("m/s", "mph", MpsToMph_, "0.0000"),
        ["km/h"] = ("km/h", "mph", KmhToMph_, "0.0000"),
        ["kmh"] = ("km/h", "mph", KmhToMph_, "0.0000"),
        ["kph"] = ("km/h", "mph", KmhToMph_, "0.0000"),
        ["km/s"] = ("km/s", "mph", KmpsToMph_, "0.00"),
        ["kmps"] = ("km/s", "mph", KmpsToMph_, "0.00"),

        // Force
        ["lbf"] = ("lbf", "N", PoundForceToNewton_, "0.0000"),
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
        string historyEntry = $"{value} {mapping.From} = {FormatNumber(result)} {mapping.To}";

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
        string format = "0.0000")
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
            string historyEntry = $"{value}{symbolFrom} = {FormatNumber(result)}{symbolTo}";

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
        string format = "0.0000")
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
                    Console.WriteLine($"  {num}{symbolFrom} = {FormatNumber(result)}{symbolTo}");
                    Console.ResetColor();
                    AddToHistory($"{num}{symbolFrom} = {FormatNumber(result)}{symbolTo}");
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
    // LENGTH / DISTANCE
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

    // Small SI Length (to inches)
    public static double MicrometerToInch(double v) => v * MicrometerToIn;
    public static double NanometerToInch(double v) => v * NanometerToIn;
    public static double PicometerToInch(double v) => v * PicometerToIn;
    public static double FemtometerToInch(double v) => v * FemtometerToIn;
    public static double AttometerToInch(double v) => v * AttometerToIn;
    public static double ZeptometerToInch(double v) => v * ZeptometerToIn;
    public static double YoctometerToInch(double v) => v * YoctometerToIn;

    // Small SI Volume (to fluid ounces)
    public static double MicroliterToFluidOunce(double v) => v * MicroliterToFlOz;
    public static double NanoliterToFluidOunce(double v) => v * NanoliterToFlOz;
    public static double PicoliterToFluidOunce(double v) => v * PicoliterToFlOz;
    public static double FemtoliterToFluidOunce(double v) => v * FemtoliterToFlOz;
    public static double AttoliterToFluidOunce(double v) => v * AttoliterToFlOz;
    public static double ZeptoliterToFluidOunce(double v) => v * ZeptoliterToFlOz;
    public static double YoctoliterToFluidOunce(double v) => v * YoctoliterToFlOz;

    // Large SI Length (to miles)
    public static double MegameterToMile(double v) => v * MegameterToMi;
    public static double GigameterToMile(double v) => v * GigameterToMi;
    public static double TerameterToMile(double v) => v * TerameterToMi;
    public static double PetameterToMile(double v) => v * PetameterToMi;
    public static double ExameterToMile(double v) => v * ExameterToMi;
    public static double ZettameterToMile(double v) => v * ZettameterToMi;
    public static double YottameterToMile(double v) => v * YottameterToMi;

    // Large SI Volume (to gallons)
    public static double KiloliterToGallon(double v) => v * KiloliterToGal;
    public static double MegaliterToGallon(double v) => v * MegaliterToGal;
    public static double GigaliterToGallon(double v) => v * GigaliterToGal;
    public static double TeraliterToGallon(double v) => v * TeraliterToGal;
    public static double PetaliterToGallon(double v) => v * PetaliterToGal;
    public static double ExaliterToGallon(double v) => v * ExaliterToGal;
    public static double ZettaliterToGallon(double v) => v * ZettaliterToGal;
    public static double YottaliterToGallon(double v) => v * YottaliterToGal;

    // Large SI Mass (to short tons)
    public static double GigagramToShortTon_(double v) => v * GigagramToShortTon;
    public static double TeragramToShortTon_(double v) => v * TeragramToShortTon;
    public static double PetagramToShortTon_(double v) => v * PetagramToShortTon;
    public static double ExagramToShortTon_(double v) => v * ExagramToShortTon;
    public static double ZettagramToShortTon_(double v) => v * ZettagramToShortTon;
    public static double YottagramToShortTon_(double v) => v * YottagramToShortTon;

    // ═══════════════════════════════════════════════════════════════════════════
    // AREA
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
    // VOLUME (LIQUID)
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
    // VOLUME (SOLID / GEOMETRIC)
    // ═══════════════════════════════════════════════════════════════════════════
    public static double CubicInchToCubicCentimeter(double v) => v * CubicInchToCubicCm;
    public static double CubicCentimeterToCubicInch(double v) => v / CubicInchToCubicCm;

    public static double CubicFootToCubicMeter_(double v) => v * CubicFootToCubicMeter;
    public static double CubicMeterToCubicFoot(double v) => v / CubicFootToCubicMeter;

    public static double CubicYardToCubicMeter_(double v) => v * CubicYardToCubicMeter;
    public static double CubicMeterToCubicYard(double v) => v / CubicYardToCubicMeter;

    // ═══════════════════════════════════════════════════════════════════════════
    // MASS / WEIGHT
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
    // TEMPERATURE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double FahrenheitToCelsius(double f) => (f - 32) * 5 / 9;
    public static double CelsiusToFahrenheit(double c) => c * 9 / 5 + 32;
    public static double FahrenheitToKelvin(double f) => (f - 32) * 5 / 9 + 273.15;
    public static double KelvinToFahrenheit(double k) => (k - 273.15) * 9 / 5 + 32;
    public static double CelsiusToKelvin(double c) => c + 273.15;
    public static double KelvinToCelsius(double k) => k - 273.15;

    // ═══════════════════════════════════════════════════════════════════════════
    // SPEED
    // ═══════════════════════════════════════════════════════════════════════════
    public static double MphToKmh_(double v) => v * MphToKmh;
    public static double MphToMps_(double v) => v * MphToMps;
    public static double KmhToMph(double v) => v / MphToKmh;
    public static double MpsToMph(double v) => v / MphToMps;

    public static double FpsToMps_(double v) => v * FpsToMps;
    public static double MpsToFps(double v) => v / FpsToMps;

    // Metric to imperial speed conversions (using new constants)
    public static double MmpsToMph_(double v) => v * MmpsToMph;
    public static double CmpsToMph_(double v) => v * CmpsToMph;
    public static double MpsToMph_(double v) => v * MpsToMphFactor;
    public static double KmhToMph_(double v) => v * KmhToMphFactor;
    public static double KmpsToMph_(double v) => v * KmpsToMph;

    // ═══════════════════════════════════════════════════════════════════════════
    // PRESSURE
    // ═══════════════════════════════════════════════════════════════════════════
    public static double PsiToPascal_(double v) => v * PsiToPascal;
    public static double PsiToKilopascal(double v) => v * PsiToKpa;
    public static double PsiToMegapascal(double v) => v * PsiToMpa;
    public static double PsiToBar_(double v) => v * PsiToBar;
    public static double PascalToPsi(double v) => v / PsiToPascal;
    public static double KilopascalToPsi(double v) => v / PsiToKpa;
    public static double BarToPsi(double v) => v / PsiToBar;
    
    // SI Pressure conversions to psi (using Pascal as intermediate)
    public static double HpaToPsi(double v) => v * HpaToPa / PsiToPascal;
    public static double MpaToPsi(double v) => v * MpaToPa / PsiToPascal;
    public static double GpaToPsi(double v) => v * GpaToPa / PsiToPascal;
    public static double TpaToPsi(double v) => v * TpaToPa / PsiToPascal;
    public static double PpaToPsi(double v) => v * PpaToPa / PsiToPascal;
    public static double EpaToPsi(double v) => v * EpaToPa / PsiToPascal;
    public static double ZpaToPsi(double v) => v * ZpaToPa / PsiToPascal;
    public static double YpaToPsi(double v) => v * YpaToPa / PsiToPascal;

    public static double InHgToPascal_(double v) => v * InHgToPascal;
    public static double InHgToKilopascal(double v) => v * InHgToKpa;
    public static double PascalToInHg(double v) => v / InHgToPascal;
    public static double KilopascalToInHg(double v) => v / InHgToKpa;

    // ═══════════════════════════════════════════════════════════════════════════
    // ENERGY
    // ═══════════════════════════════════════════════════════════════════════════
    public static double BtuToJoule_(double v) => v * BtuToJoule;
    public static double BtuToKilojoule(double v) => v * BtuToKj;
    public static double JouleToBtu(double v) => v / BtuToJoule;
    public static double KilojouleToBtu(double v) => v / BtuToKj;
    
    // SI Energy conversions to BTU
    public static double KjToBtu(double v) => v * KjToJ / BtuToJoule;
    public static double MjToBtu(double v) => v * MjToJ / BtuToJoule;
    public static double GjToBtu(double v) => v * GjToJ / BtuToJoule;
    public static double TjToBtu(double v) => v * TjToJ / BtuToJoule;
    public static double PjToBtu(double v) => v * PjToJ / BtuToJoule;
    public static double EjToBtu(double v) => v * EjToJ * JouleToBtuFactor;
    public static double ZjToBtu(double v) => v * ZjToJ * JouleToBtuFactor;
    public static double YjToBtu(double v) => v * YjToJ * JouleToBtuFactor;
    public static double RjToBtu(double v) => v * RjToJ / BtuToJoule;  // Ronnajoule
    public static double QjToBtu(double v) => v * QjToJ / BtuToJoule;  // Quettajoule

    public static double FootPoundToJoule_(double v) => v * FootPoundToJoule;
    public static double JouleToFootPound(double v) => v / FootPoundToJoule;

    // ═══════════════════════════════════════════════════════════════════════════
    // POWER
    // ═══════════════════════════════════════════════════════════════════════════
    public static double HorsepowerToWatt_(double v) => v * HorsepowerToWatt;
    public static double HorsepowerToKilowatt(double v) => v * HorsepowerToKw;
    public static double WattToHorsepower(double v) => v / HorsepowerToWatt;
    public static double KilowattToHorsepower(double v) => v / HorsepowerToKw;

    // ═══════════════════════════════════════════════════════════════════════════
    // FORCE
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
