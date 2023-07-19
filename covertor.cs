using System;

class Converter
{
    static void Main()
    {
        Console.WriteLine("Unit Converter");
        Console.WriteLine("-----------------------------");

        while (true)
        {
            Console.WriteLine("\nSelect an option:");
            Console.WriteLine("1. Imperial to Metric Converter");
            Console.WriteLine("2. Metric to Imperial Converter");
            Console.WriteLine("3. Quit");

            string? input = Console.ReadLine();

            if (input == "1")
            {
                ImperialToMetricConverter();
            }
            else if (input == "2")
            {
                MetricToImperialConverter();
            }
            else if (input == "3")
            {
                break;
            }
            else
            {
                Console.WriteLine("Invalid option. Please try again.");
            }
        }
    }

    static void ImperialToMetricConverter()
    {
        Console.WriteLine("\nImperial to Metric Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nSelect an option:");
            Console.WriteLine("1. Inches to Centimeters");
            Console.WriteLine("2. Feet to Meters");
            Console.WriteLine("3. Fahrenheit to Celsius");
            Console.WriteLine("4. Go Back");

            string? input = Console.ReadLine();

            if (input == "1")
            {
                ConvertInchesToCentimeters();
            }
            else if (input == "2")
            {
                ConvertFeetToMeters();
            }
            else if (input == "3")
            {
                ConvertFahrenheitToCelsius();
            }
            else if (input == "4")
            {
                break;
            }
            else
            {
                Console.WriteLine("Invalid option. Please try again.");
            }
        }
    }

    static void MetricToImperialConverter()
    {
        Console.WriteLine("\nMetric to Imperial Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nSelect an option:");
            Console.WriteLine("1. Centimeters to Inches");
            Console.WriteLine("2. Meters to Feet");
            Console.WriteLine("3. Celsius to Fahrenheit");
            Console.WriteLine("4. Go Back");

            string? input = Console.ReadLine();

            if (input == "1")
            {
                ConvertCentimetersToInches();
            }
            else if (input == "2")
            {
                ConvertMetersToFeet();
            }
            else if (input == "3")
            {
                ConvertCelsiusToFahrenheit();
            }
            else if (input == "4")
            {
                break;
            }
            else
            {
                Console.WriteLine("Invalid option. Please try again.");
            }
        }
    }

    static void ConvertInchesToCentimeters()
    {
        Console.WriteLine("\nInches to Centimeters Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a value in inches (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double inches))
            {
                double centimeters = inches * 2.54;
                Console.WriteLine($"{inches} inches is equal to {centimeters.ToString("0.0")} centimeters.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertFeetToMeters()
    {
        Console.WriteLine("\nFeet to Meters Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a value in feet (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double feet))
            {
                double meters = feet * 0.3048;
                Console.WriteLine($"{feet} feet is equal to {meters.ToString("0.00")} meters.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertFahrenheitToCelsius()
    {
        Console.WriteLine("\nFahrenheit to Celsius Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a temperature in Fahrenheit (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double fahrenheit))
            {
                double celsius = (fahrenheit - 32) * 5 / 9;
                Console.WriteLine($"{fahrenheit}°F is equal to {celsius.ToString("0.0")}°C.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertCentimetersToInches()
    {
        Console.WriteLine("\nCentimeters to Inches Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a value in centimeters (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double centimeters))
            {
                double inches = centimeters / 2.54;
                Console.WriteLine($"{centimeters} centimeters is equal to {inches.ToString("0.0")} inches.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertMetersToFeet()
    {
        Console.WriteLine("\nMeters to Feet Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a value in meters (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double meters))
            {
                double feet = meters / 0.3048;
                Console.WriteLine($"{meters} meters is equal to {feet.ToString("0.00")} feet.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertCelsiusToFahrenheit()
    {
        Console.WriteLine("\nCelsius to Fahrenheit Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a temperature in Celsius (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double celsius))
            {
                double fahrenheit = celsius * 9 / 5 + 32;
                Console.WriteLine($"{celsius}°C is equal to {fahrenheit.ToString("0.0")}°F.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }
}
