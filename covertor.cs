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
            Console.WriteLine("1. Feet to Centimeters");
            Console.WriteLine("2. Fahrenheit to Celsius");
            Console.WriteLine("3. Celsius to Fahrenheit");
            Console.WriteLine("4. Miles to Kilometers");
            Console.WriteLine("5. Kilometers to Miles");
            Console.WriteLine("6. Quit");

            string? input = Console.ReadLine();

            if (input == "1")
            {
                ConvertFeetToCentimeters();
            }
            else if (input == "2")
            {
                ConvertFahrenheitToCelsius();
            }
            else if (input == "3")
            {
                ConvertCelsiusToFahrenheit();
            }
            else if (input == "4")
            {
                ConvertMilesToKilometers();
            }
            else if (input == "5")
            {
                ConvertKilometersToMiles();
            }
            else if (input == "6")
            {
                break;
            }
            else
            {
                Console.WriteLine("Invalid option. Please try again.");
            }
        }
    }

    static void ConvertFeetToCentimeters()
    {
        Console.WriteLine("\nFeet to Centimeters Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a value in feet (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double feet))
            {
                double centimeters = feet * 30.48;
                Console.WriteLine($"{feet} feet is equal to {centimeters.ToString("0.0")} centimeters.");
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

    static void ConvertMilesToKilometers()
    {
        Console.WriteLine("\nMiles to Kilometers Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a distance in miles (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double miles))
            {
                double kilometers = miles * 1.60934;
                Console.WriteLine($"{miles} miles is equal to {kilometers.ToString("0.0")} kilometers.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }

    static void ConvertKilometersToMiles()
    {
        Console.WriteLine("\nKilometers to Miles Converter");
        Console.WriteLine("------------------------------");

        while (true)
        {
            Console.WriteLine("\nEnter a distance in kilometers (or 'q' to go back):");
            string? input = Console.ReadLine();

            if (input?.ToLower() == "q")
                break;

            if (double.TryParse(input, out double kilometers))
            {
                double miles = kilometers / 1.60934;
                Console.WriteLine($"{kilometers} kilometers is equal to {miles.ToString("0.0")} miles.");
            }
            else
            {
                Console.WriteLine("Invalid input. Please enter a numeric value.");
            }
        }
    }
}
