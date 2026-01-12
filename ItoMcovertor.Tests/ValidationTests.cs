using ItoMcovertor.Converters;

namespace ItoMcovertor.Tests;

public class ValidationTests
{
    #region Fahrenheit Validation

    [Fact]
    public void ValidateFahrenheit_ValidTemperature_ReturnsTrue()
    {
        var result = UnitConverter.ValidateFahrenheit(32, out string? error);
        Assert.True(result);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateFahrenheit_BelowAbsoluteZero_ReturnsFalse()
    {
        var result = UnitConverter.ValidateFahrenheit(-500, out string? error);
        Assert.False(result);
        Assert.NotNull(error);
    }

    #endregion

    #region Celsius Validation

    [Fact]
    public void ValidateCelsius_ValidTemperature_ReturnsTrue()
    {
        var result = UnitConverter.ValidateCelsius(0, out string? error);
        Assert.True(result);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateCelsius_BelowAbsoluteZero_ReturnsFalse()
    {
        var result = UnitConverter.ValidateCelsius(-300, out string? error);
        Assert.False(result);
        Assert.NotNull(error);
    }

    #endregion

    #region Kelvin Validation

    [Fact]
    public void ValidateKelvin_ValidTemperature_ReturnsTrue()
    {
        var result = UnitConverter.ValidateKelvin(273.15, out string? error);
        Assert.True(result);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateKelvin_Negative_ReturnsFalse()
    {
        var result = UnitConverter.ValidateKelvin(-1, out string? error);
        Assert.False(result);
        Assert.NotNull(error);
    }

    #endregion

    #region Positive Validation

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(1000)]
    public void ValidatePositive_NonNegativeValue_ReturnsTrue(double value)
    {
        var result = UnitConverter.ValidatePositive(value, out string? error);
        Assert.True(result);
        Assert.Null(error);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-100)]
    public void ValidatePositive_NegativeValue_ReturnsFalse(double value)
    {
        var result = UnitConverter.ValidatePositive(value, out string? error);
        Assert.False(result);
        Assert.NotNull(error);
    }

    #endregion

    #region Direct Conversion Parser

    [Theory]
    [InlineData("5.5 ft")]
    [InlineData("100 mph")]
    [InlineData("32 f")]
    [InlineData("10 km to mi")]
    [InlineData("1 gal")]
    [InlineData("50 hp")]
    public void TryDirectConvert_ValidInput_ReturnsTrue(string input)
    {
        var result = UnitConverter.TryDirectConvert(input);
        Assert.True(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("hello world")]
    [InlineData("5.5 unknownunit")]
    public void TryDirectConvert_InvalidInput_ReturnsFalse(string input)
    {
        var result = UnitConverter.TryDirectConvert(input);
        Assert.False(result);
    }

    #endregion
}
