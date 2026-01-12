using ItoMcovertor.Converters;

namespace ItoMcovertor.Tests;

public class UnitConverterTests
{
    #region Length Conversions

    [Theory]
    [InlineData(1, 2.54)]
    [InlineData(10, 25.4)]
    public void InchToCentimeter_ReturnsCorrectValue(double inches, double expected)
    {
        var result = UnitConverter.InchToCentimeter(inches);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData(1, 25.4)]
    [InlineData(10, 254)]
    public void InchToMillimeter_ReturnsCorrectValue(double inches, double expected)
    {
        var result = UnitConverter.InchToMillimeter(inches);
        Assert.Equal(expected, result, precision: 1);
    }

    [Theory]
    [InlineData(1, 0.3048)]
    [InlineData(10, 3.048)]
    public void FootToMeter_ReturnsCorrectValue(double feet, double expected)
    {
        var result = UnitConverter.FootToMeter_(feet);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 0.9144)]
    public void YardToMeter_ReturnsCorrectValue(double yards, double expected)
    {
        var result = UnitConverter.YardToMeter_(yards);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 1.60934)]
    [InlineData(100, 160.934)]
    public void MileToKilometer_ReturnsCorrectValue(double miles, double expected)
    {
        var result = UnitConverter.MileToKilometer(miles);
        Assert.Equal(expected, result, precision: 3);
    }

    [Theory]
    [InlineData(1, 1.852)]
    public void NauticalMileToKilometer_ReturnsCorrectValue(double nm, double expected)
    {
        var result = UnitConverter.NauticalMileToKilometer(nm);
        Assert.Equal(expected, result, precision: 3);
    }

    #endregion

    #region Area Conversions

    [Theory]
    [InlineData(1, 6.4516)]
    public void SqInchToSqCentimeter_ReturnsCorrectValue(double sqIn, double expected)
    {
        var result = UnitConverter.SqInchToSqCentimeter(sqIn);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 0.092903)]
    public void SqFootToSqMeter_ReturnsCorrectValue(double sqFt, double expected)
    {
        var result = UnitConverter.SqFootToSqMeter_(sqFt);
        Assert.Equal(expected, result, precision: 6);
    }

    [Theory]
    [InlineData(1, 0.404686)]
    public void AcreToHectare_ReturnsCorrectValue(double acres, double expected)
    {
        var result = UnitConverter.AcreToHectare_(acres);
        Assert.Equal(expected, result, precision: 5);
    }

    #endregion

    #region Volume (Liquid) Conversions

    [Theory]
    [InlineData(1, 3.78541)]
    public void GallonToLiter_ReturnsCorrectValue(double gal, double expected)
    {
        var result = UnitConverter.GallonToLiter_(gal);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 29.5735)]
    public void FluidOunceToMilliliter_ReturnsCorrectValue(double floz, double expected)
    {
        var result = UnitConverter.FluidOunceToMilliliter(floz);
        Assert.Equal(expected, result, precision: 3);
    }

    #endregion

    #region Volume (Solid) Conversions

    [Theory]
    [InlineData(1, 16.3871)]
    public void CubicInchToCubicCentimeter_ReturnsCorrectValue(double cuIn, double expected)
    {
        var result = UnitConverter.CubicInchToCubicCentimeter(cuIn);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 0.0283168)]
    public void CubicFootToCubicMeter_ReturnsCorrectValue(double cuFt, double expected)
    {
        var result = UnitConverter.CubicFootToCubicMeter_(cuFt);
        Assert.Equal(expected, result, precision: 7);
    }

    #endregion

    #region Mass/Weight Conversions

    [Theory]
    [InlineData(1, 28.3495)]
    public void OunceToGram_ReturnsCorrectValue(double oz, double expected)
    {
        var result = UnitConverter.OunceToGram_(oz);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 0.453592)]
    [InlineData(100, 45.3592)]
    public void PoundToKilogram_ReturnsCorrectValue(double lbs, double expected)
    {
        var result = UnitConverter.PoundToKilogram(lbs);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 6.35029)]
    public void StoneToKilogram_ReturnsCorrectValue(double st, double expected)
    {
        var result = UnitConverter.StoneToKilogram(st);
        Assert.Equal(expected, result, precision: 4);
    }

    #endregion

    #region Temperature Conversions

    [Theory]
    [InlineData(32, 0)]
    [InlineData(212, 100)]
    [InlineData(-40, -40)]
    public void FahrenheitToCelsius_ReturnsCorrectValue(double f, double expected)
    {
        var result = UnitConverter.FahrenheitToCelsius(f);
        Assert.Equal(expected, result, precision: 1);
    }

    [Theory]
    [InlineData(0, 32)]
    [InlineData(100, 212)]
    public void CelsiusToFahrenheit_ReturnsCorrectValue(double c, double expected)
    {
        var result = UnitConverter.CelsiusToFahrenheit(c);
        Assert.Equal(expected, result, precision: 1);
    }

    [Theory]
    [InlineData(0, 273.15)]
    [InlineData(100, 373.15)]
    public void CelsiusToKelvin_ReturnsCorrectValue(double c, double expected)
    {
        var result = UnitConverter.CelsiusToKelvin(c);
        Assert.Equal(expected, result, precision: 2);
    }

    #endregion

    #region Speed Conversions

    [Theory]
    [InlineData(60, 96.5604)]
    [InlineData(100, 160.934)]
    public void MphToKmh_ReturnsCorrectValue(double mph, double expected)
    {
        var result = UnitConverter.MphToKmh_(mph);
        Assert.Equal(expected, result, precision: 3);
    }

    [Theory]
    [InlineData(1, 0.44704)]
    public void MphToMps_ReturnsCorrectValue(double mph, double expected)
    {
        var result = UnitConverter.MphToMps_(mph);
        Assert.Equal(expected, result, precision: 5);
    }

    #endregion

    #region Pressure Conversions

    [Theory]
    [InlineData(1, 6.89476)]
    public void PsiToKilopascal_ReturnsCorrectValue(double psi, double expected)
    {
        var result = UnitConverter.PsiToKilopascal(psi);
        Assert.Equal(expected, result, precision: 4);
    }

    [Theory]
    [InlineData(1, 0.0689476)]
    public void PsiToBar_ReturnsCorrectValue(double psi, double expected)
    {
        var result = UnitConverter.PsiToBar_(psi);
        Assert.Equal(expected, result, precision: 6);
    }

    #endregion

    #region Energy Conversions

    [Theory]
    [InlineData(1, 1055.06)]
    public void BtuToJoule_ReturnsCorrectValue(double btu, double expected)
    {
        var result = UnitConverter.BtuToJoule_(btu);
        Assert.Equal(expected, result, precision: 2);
    }

    [Theory]
    [InlineData(1, 1.35582)]
    public void FootPoundToJoule_ReturnsCorrectValue(double ftlb, double expected)
    {
        var result = UnitConverter.FootPoundToJoule_(ftlb);
        Assert.Equal(expected, result, precision: 4);
    }

    #endregion

    #region Power Conversions

    [Theory]
    [InlineData(1, 745.7)]
    public void HorsepowerToWatt_ReturnsCorrectValue(double hp, double expected)
    {
        var result = UnitConverter.HorsepowerToWatt_(hp);
        Assert.Equal(expected, result, precision: 1);
    }

    [Theory]
    [InlineData(1, 0.7457)]
    public void HorsepowerToKilowatt_ReturnsCorrectValue(double hp, double expected)
    {
        var result = UnitConverter.HorsepowerToKilowatt(hp);
        Assert.Equal(expected, result, precision: 4);
    }

    #endregion

    #region Force Conversions

    [Theory]
    [InlineData(1, 4.44822)]
    public void PoundForceToNewton_ReturnsCorrectValue(double lbf, double expected)
    {
        var result = UnitConverter.PoundForceToNewton_(lbf);
        Assert.Equal(expected, result, precision: 4);
    }

    #endregion
}
