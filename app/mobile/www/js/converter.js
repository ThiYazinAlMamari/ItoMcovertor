/**
 * Unit Converter - Conversion Engine
 * Ported from C# UnitConverter.cs
 */

const UnitConverter = {
    // =========================================================================
    // CONVERSION CONSTANTS
    // =========================================================================
    
    // Length
    INCH_TO_CM: 2.54,
    INCH_TO_MM: 25.4,
    FOOT_TO_METER: 0.3048,
    FOOT_TO_CM: 30.48,
    YARD_TO_METER: 0.9144,
    MILE_TO_KM: 1.60934,
    NAUTICAL_MILE_TO_KM: 1.852,

    // Area
    SQ_INCH_TO_SQ_CM: 6.4516,
    SQ_FOOT_TO_SQ_METER: 0.092903,
    SQ_YARD_TO_SQ_METER: 0.836127,
    ACRE_TO_SQ_METER: 4046.86,
    ACRE_TO_HECTARE: 0.404686,
    SQ_MILE_TO_SQ_KM: 2.58999,

    // Volume (Liquid)
    TEASPOON_TO_ML: 4.92892,
    TABLESPOON_TO_ML: 14.7868,
    FLUID_OUNCE_TO_ML: 29.5735,
    CUP_TO_ML: 236.588,
    CUP_TO_LITER: 0.236588,
    PINT_TO_ML: 473.176,
    PINT_TO_LITER: 0.473176,
    QUART_TO_LITER: 0.946353,
    GALLON_TO_LITER: 3.78541,

    // Volume (Solid)
    CUBIC_INCH_TO_CUBIC_CM: 16.3871,
    CUBIC_FOOT_TO_CUBIC_METER: 0.0283168,
    CUBIC_YARD_TO_CUBIC_METER: 0.764555,

    // Mass
    OUNCE_TO_GRAM: 28.3495,
    POUND_TO_KG: 0.453592,
    POUND_TO_GRAM: 453.592,
    STONE_TO_KG: 6.35029,
    SHORT_TON_TO_KG: 907.185,
    SHORT_TON_TO_TONNE: 0.907185,
    LONG_TON_TO_KG: 1016.05,

    // Speed
    MPH_TO_KMH: 1.60934,
    MPH_TO_MPS: 0.44704,
    FPS_TO_MPS: 0.3048,

    // Pressure
    PSI_TO_PASCAL: 6894.76,
    PSI_TO_KPA: 6.89476,
    PSI_TO_BAR: 0.0689476,
    INHG_TO_PASCAL: 3386.39,
    INHG_TO_KPA: 3.38639,

    // Energy
    BTU_TO_JOULE: 1055.06,
    BTU_TO_KJ: 1.05506,
    FOOT_POUND_TO_JOULE: 1.35582,

    // Power
    HORSEPOWER_TO_WATT: 745.7,
    HORSEPOWER_TO_KW: 0.7457,

    // Force
    POUND_FORCE_TO_NEWTON: 4.44822,

    // Temperature limits
    ABSOLUTE_ZERO_F: -459.67,
    ABSOLUTE_ZERO_C: -273.15,

    // =========================================================================
    // UNIT DEFINITIONS
    // =========================================================================
    
    units: {
        'length': [
            { id: 'in', name: 'Inches (in)', system: 'imperial' },
            { id: 'ft', name: 'Feet (ft)', system: 'imperial' },
            { id: 'yd', name: 'Yards (yd)', system: 'imperial' },
            { id: 'mi', name: 'Miles (mi)', system: 'imperial' },
            { id: 'ym', name: 'Yoctometers (ym)', system: 'metric' },
            { id: 'zm', name: 'Zeptometers (zm)', system: 'metric' },
            { id: 'am', name: 'Attometers (am)', system: 'metric' },
            { id: 'fm', name: 'Femtometers (fm)', system: 'metric' },
            { id: 'pm', name: 'Picometers (pm)', system: 'metric' },
            { id: 'nm', name: 'Nanometers (nm)', system: 'metric' },
            { id: 'um', name: 'Micrometers (µm)', system: 'metric' },
            { id: 'mm', name: 'Millimeters (mm)', system: 'metric' },
            { id: 'cm', name: 'Centimeters (cm)', system: 'metric' },
            { id: 'm', name: 'Meters (m)', system: 'metric' },
            { id: 'km', name: 'Kilometers (km)', system: 'metric' },
            { id: 'Mm', name: 'Megameters (Mm)', system: 'metric' },
            { id: 'Gm', name: 'Gigameters (Gm)', system: 'metric' },
            { id: 'Tm', name: 'Terameters (Tm)', system: 'metric' },
            { id: 'Pm', name: 'Petameters (Pm)', system: 'metric' },
            { id: 'Em', name: 'Exameters (Em)', system: 'metric' },
            { id: 'Zm', name: 'Zettameters (Zm)', system: 'metric' },
            { id: 'Ym', name: 'Yottameters (Ym)', system: 'metric' }
        ],
        'area': [
            { id: 'sqin', name: 'Square Inches', system: 'imperial' },
            { id: 'sqft', name: 'Square Feet', system: 'imperial' },
            { id: 'sqyd', name: 'Square Yards', system: 'imperial' },
            { id: 'acre', name: 'Acres', system: 'imperial' },
            { id: 'sqmi', name: 'Square Miles', system: 'imperial' },
            { id: 'sqcm', name: 'Square Centimeters', system: 'metric' },
            { id: 'sqm', name: 'Square Meters', system: 'metric' },
            { id: 'ha', name: 'Hectares', system: 'metric' },
            { id: 'sqkm', name: 'Square Kilometers', system: 'metric' }
        ],
        'volume-liquid': [
            { id: 'tsp', name: 'Teaspoons (tsp)', system: 'imperial' },
            { id: 'tbsp', name: 'Tablespoons (tbsp)', system: 'imperial' },
            { id: 'floz', name: 'Fluid Ounces (fl oz)', system: 'imperial' },
            { id: 'cup', name: 'Cups', system: 'imperial' },
            { id: 'pt', name: 'Pints (pt)', system: 'imperial' },
            { id: 'qt', name: 'Quarts (qt)', system: 'imperial' },
            { id: 'gal', name: 'Gallons (gal)', system: 'imperial' },
            { id: 'yL', name: 'Yoctoliters (yL)', system: 'metric' },
            { id: 'zL', name: 'Zeptoliters (zL)', system: 'metric' },
            { id: 'aL', name: 'Attoliters (aL)', system: 'metric' },
            { id: 'fL', name: 'Femtoliters (fL)', system: 'metric' },
            { id: 'pL', name: 'Picoliters (pL)', system: 'metric' },
            { id: 'nL', name: 'Nanoliters (nL)', system: 'metric' },
            { id: 'uL', name: 'Microliters (µL)', system: 'metric' },
            { id: 'ml', name: 'Milliliters (ml)', system: 'metric' },
            { id: 'l', name: 'Liters (L)', system: 'metric' },
            { id: 'kL', name: 'Kiloliters (kL)', system: 'metric' },
            { id: 'ML', name: 'Megaliters (ML)', system: 'metric' },
            { id: 'GL', name: 'Gigaliters (GL)', system: 'metric' },
            { id: 'TL', name: 'Teraliters (TL)', system: 'metric' },
            { id: 'PL', name: 'Petaliters (PL)', system: 'metric' },
            { id: 'EL', name: 'Exaliters (EL)', system: 'metric' },
            { id: 'ZL', name: 'Zettaliters (ZL)', system: 'metric' },
            { id: 'YL', name: 'Yottaliters (YL)', system: 'metric' }
        ],
        'volume-solid': [
            { id: 'cuin', name: 'Cubic Inches', system: 'imperial' },
            { id: 'cuft', name: 'Cubic Feet', system: 'imperial' },
            { id: 'cuyd', name: 'Cubic Yards', system: 'imperial' },
            { id: 'cucm', name: 'Cubic Centimeters', system: 'metric' },
            { id: 'cum', name: 'Cubic Meters', system: 'metric' }
        ],
        'mass': [
            { id: 'oz', name: 'Ounces (oz)', system: 'imperial' },
            { id: 'lb', name: 'Pounds (lb)', system: 'imperial' },
            { id: 'st', name: 'Stone (st)', system: 'imperial' },
            { id: 'ton', name: 'Short Tons', system: 'imperial' },
            { id: 'lton', name: 'Long Tons', system: 'imperial' },
            { id: 'ug', name: 'Micrograms (µg)', system: 'metric' },
            { id: 'mg', name: 'Milligrams (mg)', system: 'metric' },
            { id: 'g', name: 'Grams (g)', system: 'metric' },
            { id: 'kg', name: 'Kilograms (kg)', system: 'metric' },
            { id: 'tonne', name: 'Tonnes/Megagrams (Mg)', system: 'metric' },
            { id: 'Gg', name: 'Gigagrams (Gg)', system: 'metric' },
            { id: 'Tg', name: 'Teragrams (Tg)', system: 'metric' },
            { id: 'Pg', name: 'Petagrams (Pg)', system: 'metric' },
            { id: 'Eg', name: 'Exagrams (Eg)', system: 'metric' },
            { id: 'Zg', name: 'Zettagrams (Zg)', system: 'metric' },
            { id: 'Yg', name: 'Yottagrams (Yg)', system: 'metric' }
        ],
        'temperature': [
            { id: 'f', name: 'Fahrenheit (F)', system: 'imperial' },
            { id: 'c', name: 'Celsius (C)', system: 'metric' },
            { id: 'k', name: 'Kelvin (K)', system: 'metric' }
        ],
        'speed': [
            { id: 'mph', name: 'Miles per Hour (mph)', system: 'imperial' },
            { id: 'fps', name: 'Feet per Second (ft/s)', system: 'imperial' },
            { id: 'mmps', name: 'Millimeters per Second (mm/s)', system: 'metric' },
            { id: 'cmps', name: 'Centimeters per Second (cm/s)', system: 'metric' },
            { id: 'mps', name: 'Meters per Second (m/s)', system: 'metric' },
            { id: 'kmh', name: 'Kilometers per Hour (km/h)', system: 'metric' },
            { id: 'kmps', name: 'Kilometers per Second (km/s)', system: 'metric' }
        ],
        'pressure': [
            { id: 'psi', name: 'PSI', system: 'imperial' },
            { id: 'inhg', name: 'Inches of Mercury (inHg)', system: 'imperial' },
            { id: 'pa', name: 'Pascals (Pa)', system: 'metric' },
            { id: 'hpa', name: 'Hectopascals (hPa)', system: 'metric' },
            { id: 'kpa', name: 'Kilopascals (kPa)', system: 'metric' },
            { id: 'mpa', name: 'Megapascals (MPa)', system: 'metric' },
            { id: 'gpa', name: 'Gigapascals (GPa)', system: 'metric' },
            { id: 'tpa', name: 'Terapascals (TPa)', system: 'metric' },
            { id: 'ppa', name: 'Petapascals (PPa)', system: 'metric' },
            { id: 'epa', name: 'Exapascals (EPa)', system: 'metric' },
            { id: 'zpa', name: 'Zettapascals (ZPa)', system: 'metric' },
            { id: 'ypa', name: 'Yottapascals (YPa)', system: 'metric' },
            { id: 'bar', name: 'Bar', system: 'metric' }
        ],
        'energy': [
            { id: 'btu', name: 'BTU', system: 'imperial' },
            { id: 'ftlb', name: 'Foot-Pounds (ft-lb)', system: 'imperial' },
            { id: 'j', name: 'Joules (J)', system: 'metric' },
            { id: 'kj', name: 'Kilojoules (kJ)', system: 'metric' },
            { id: 'mj', name: 'Megajoules (MJ)', system: 'metric' },
            { id: 'gj', name: 'Gigajoules (GJ)', system: 'metric' },
            { id: 'tj', name: 'Terajoules (TJ)', system: 'metric' },
            { id: 'pj', name: 'Petajoules (PJ)', system: 'metric' },
            { id: 'ej', name: 'Exajoules (EJ)', system: 'metric' },
            { id: 'zj', name: 'Zettajoules (ZJ)', system: 'metric' },
            { id: 'yj', name: 'Yottajoules (YJ)', system: 'metric' },
            { id: 'rj', name: 'Ronnajoules (RJ)', system: 'metric' },
            { id: 'qj', name: 'Quettajoules (QJ)', system: 'metric' }
        ],
        'power': [
            { id: 'hp', name: 'Horsepower (hp)', system: 'imperial' },
            { id: 'w', name: 'Watts (W)', system: 'metric' },
            { id: 'kw', name: 'Kilowatts (kW)', system: 'metric' },
            { id: 'mw', name: 'Megawatts (MW)', system: 'metric' },
            { id: 'gw', name: 'Gigawatts (GW)', system: 'metric' },
            { id: 'tw', name: 'Terawatts (TW)', system: 'metric' },
            { id: 'pw', name: 'Petawatts (PW)', system: 'metric' },
            { id: 'ew', name: 'Exawatts (EW)', system: 'metric' },
            { id: 'zw', name: 'Zettawatts (ZW)', system: 'metric' },
            { id: 'yw', name: 'Yottawatts (YW)', system: 'metric' }
        ],
        'force': [
            { id: 'lbf', name: 'Pound-Force (lbf)', system: 'imperial' },
            { id: 'n', name: 'Newtons (N)', system: 'metric' }
        ],
        'nautical': [
            { id: 'nm', name: 'Nautical Miles (nm)', system: 'imperial' },
            { id: 'km', name: 'Kilometers (km)', system: 'metric' }
        ]
    },

    // =========================================================================
    // CONVERSION ENGINE
    // =========================================================================

    /**
     * Convert a value from one unit to another
     * @param {number} value - The value to convert
     * @param {string} fromUnit - Source unit ID
     * @param {string} toUnit - Target unit ID
     * @param {string} category - The category of conversion
     * @returns {{value: number, error: string|null}}
     */
    convert(value, fromUnit, toUnit, category) {
        if (isNaN(value)) {
            return { value: null, error: 'Please enter a valid number' };
        }

        if (fromUnit === toUnit) {
            return { value: value, error: null };
        }

        // Validate temperature limits
        const tempError = this.validateTemperature(value, fromUnit);
        if (tempError) {
            return { value: null, error: tempError };
        }

        // Convert to base unit first, then to target
        const baseValue = this.toBaseUnit(value, fromUnit, category);
        const result = this.fromBaseUnit(baseValue, toUnit, category);

        return { value: result, error: null };
    },

    /**
     * Validate temperature values
     */
    validateTemperature(value, unit) {
        if (unit === 'f' && value < this.ABSOLUTE_ZERO_F) {
            return `Temperature cannot be below absolute zero (${this.ABSOLUTE_ZERO_F} F)`;
        }
        if (unit === 'c' && value < this.ABSOLUTE_ZERO_C) {
            return `Temperature cannot be below absolute zero (${this.ABSOLUTE_ZERO_C} C)`;
        }
        if (unit === 'k' && value < 0) {
            return 'Kelvin cannot be negative';
        }
        return null;
    },

    /**
     * Convert value to base unit for the category
     */
    toBaseUnit(value, unit, category) {
        switch (category) {
            case 'length':
                // Base: meters
                switch (unit) {
                    case 'in': return value * this.INCH_TO_CM / 100;
                    case 'ft': return value * this.FOOT_TO_METER;
                    case 'yd': return value * this.YARD_TO_METER;
                    case 'mi': return value * this.MILE_TO_KM * 1000;
                    case 'ym': return value * 1e-24;
                    case 'zm': return value * 1e-21;
                    case 'am': return value * 1e-18;
                    case 'fm': return value * 1e-15;
                    case 'pm': return value * 1e-12;
                    case 'nm': return value * 1e-9;
                    case 'um': return value * 1e-6;
                    case 'mm': return value / 1000;
                    case 'cm': return value / 100;
                    case 'm': return value;
                    case 'km': return value * 1000;
                    case 'Mm': return value * 1e6;
                    case 'Gm': return value * 1e9;
                    case 'Tm': return value * 1e12;
                    case 'Pm': return value * 1e15;
                    case 'Em': return value * 1e18;
                    case 'Zm': return value * 1e21;
                    case 'Ym': return value * 1e24;
                }
                break;

            case 'area':
                // Base: square meters
                switch (unit) {
                    case 'sqin': return value * this.SQ_INCH_TO_SQ_CM / 10000;
                    case 'sqft': return value * this.SQ_FOOT_TO_SQ_METER;
                    case 'sqyd': return value * this.SQ_YARD_TO_SQ_METER;
                    case 'acre': return value * this.ACRE_TO_SQ_METER;
                    case 'sqmi': return value * this.SQ_MILE_TO_SQ_KM * 1000000;
                    case 'sqcm': return value / 10000;
                    case 'sqm': return value;
                    case 'ha': return value * 10000;
                    case 'sqkm': return value * 1000000;
                }
                break;

            case 'volume-liquid':
                // Base: milliliters
                switch (unit) {
                    case 'tsp': return value * this.TEASPOON_TO_ML;
                    case 'tbsp': return value * this.TABLESPOON_TO_ML;
                    case 'floz': return value * this.FLUID_OUNCE_TO_ML;
                    case 'cup': return value * this.CUP_TO_ML;
                    case 'pt': return value * this.PINT_TO_ML;
                    case 'qt': return value * this.QUART_TO_LITER * 1000;
                    case 'gal': return value * this.GALLON_TO_LITER * 1000;
                    case 'yL': return value * 1e-24;
                    case 'zL': return value * 1e-21;
                    case 'aL': return value * 1e-18;
                    case 'fL': return value * 1e-15;
                    case 'pL': return value * 1e-12;
                    case 'nL': return value * 1e-9;
                    case 'uL': return value * 1e-6;
                    case 'ml': return value;
                    case 'l': return value * 1000;
                    case 'kL': return value * 1e6;
                    case 'ML': return value * 1e9;
                    case 'GL': return value * 1e12;
                    case 'TL': return value * 1e15;
                    case 'PL': return value * 1e18;
                    case 'EL': return value * 1e21;
                    case 'ZL': return value * 1e24;
                    case 'YL': return value * 1e27;
                }
                break;

            case 'volume-solid':
                // Base: cubic centimeters
                switch (unit) {
                    case 'cuin': return value * this.CUBIC_INCH_TO_CUBIC_CM;
                    case 'cuft': return value * this.CUBIC_FOOT_TO_CUBIC_METER * 1000000;
                    case 'cuyd': return value * this.CUBIC_YARD_TO_CUBIC_METER * 1000000;
                    case 'cucm': return value;
                    case 'cum': return value * 1000000;
                }
                break;

            case 'mass':
                // Base: grams
                switch (unit) {
                    case 'oz': return value * this.OUNCE_TO_GRAM;
                    case 'lb': return value * this.POUND_TO_GRAM;
                    case 'st': return value * this.STONE_TO_KG * 1000;
                    case 'ton': return value * this.SHORT_TON_TO_KG * 1000;
                    case 'lton': return value * this.LONG_TON_TO_KG * 1000;
                    case 'ug': return value / 1e6;
                    case 'mg': return value / 1000;
                    case 'g': return value;
                    case 'kg': return value * 1000;
                    case 'tonne': return value * 1e6;
                    case 'Gg': return value * 1e9;
                    case 'Tg': return value * 1e12;
                    case 'Pg': return value * 1e15;
                    case 'Eg': return value * 1e18;
                    case 'Zg': return value * 1e21;
                    case 'Yg': return value * 1e24;
                }
                break;

            case 'temperature':
                // Base: Celsius
                switch (unit) {
                    case 'f': return (value - 32) * 5 / 9;
                    case 'c': return value;
                    case 'k': return value - 273.15;
                }
                break;

            case 'speed':
                // Base: m/s
                switch (unit) {
                    case 'mph': return value * this.MPH_TO_MPS;
                    case 'fps': return value * this.FPS_TO_MPS;
                    case 'mmps': return value / 1000;
                    case 'cmps': return value / 100;
                    case 'mps': return value;
                    case 'kmh': return value / 3.6;
                    case 'kmps': return value * 1000;
                }
                break;

            case 'pressure':
                // Base: Pascals
                switch (unit) {
                    case 'psi': return value * this.PSI_TO_PASCAL;
                    case 'inhg': return value * this.INHG_TO_PASCAL;
                    case 'pa': return value;
                    case 'hpa': return value * 100;
                    case 'kpa': return value * 1000;
                    case 'mpa': return value * 1000000;
                    case 'gpa': return value * 1000000000;
                    case 'tpa': return value * 1000000000000;
                    case 'ppa': return value * 1000000000000000;
                    case 'epa': return value * 1000000000000000000;
                    case 'zpa': return value * 1e21;
                    case 'ypa': return value * 1e24;
                    case 'bar': return value * 100000;
                }
                break;

            case 'energy':
                // Base: Joules
                switch (unit) {
                    case 'btu': return value * this.BTU_TO_JOULE;
                    case 'ftlb': return value * this.FOOT_POUND_TO_JOULE;
                    case 'j': return value;
                    case 'kj': return value * 1000;
                    case 'mj': return value * 1e6;
                    case 'gj': return value * 1e9;
                    case 'tj': return value * 1e12;
                    case 'pj': return value * 1e15;
                    case 'ej': return value * 1e18;
                    case 'zj': return value * 1e21;
                    case 'yj': return value * 1e24;
                    case 'rj': return value * 1e27;
                    case 'qj': return value * 1e30;
                }
                break;

            case 'power':
                // Base: Watts
                switch (unit) {
                    case 'hp': return value * this.HORSEPOWER_TO_WATT;
                    case 'w': return value;
                    case 'kw': return value * 1000;
                    case 'mw': return value * 1000000;
                    case 'gw': return value * 1000000000;
                    case 'tw': return value * 1000000000000;
                    case 'pw': return value * 1000000000000000;
                    case 'ew': return value * 1000000000000000000;
                    case 'zw': return value * 1e21;
                    case 'yw': return value * 1e24;
                }
                break;

            case 'force':
                // Base: Newtons
                switch (unit) {
                    case 'lbf': return value * this.POUND_FORCE_TO_NEWTON;
                    case 'n': return value;
                }
                break;

            case 'nautical':
                // Base: kilometers
                switch (unit) {
                    case 'nm': return value * this.NAUTICAL_MILE_TO_KM;
                    case 'km': return value;
                }
                break;
        }
        return value;
    },

    /**
     * Convert from base unit to target unit
     */
    fromBaseUnit(baseValue, unit, category) {
        switch (category) {
            case 'length':
                // Base: meters
                switch (unit) {
                    case 'in': return baseValue * 100 / this.INCH_TO_CM;
                    case 'ft': return baseValue / this.FOOT_TO_METER;
                    case 'yd': return baseValue / this.YARD_TO_METER;
                    case 'mi': return baseValue / 1000 / this.MILE_TO_KM;
                    case 'ym': return baseValue / 1e-24;
                    case 'zm': return baseValue / 1e-21;
                    case 'am': return baseValue / 1e-18;
                    case 'fm': return baseValue / 1e-15;
                    case 'pm': return baseValue / 1e-12;
                    case 'nm': return baseValue / 1e-9;
                    case 'um': return baseValue / 1e-6;
                    case 'mm': return baseValue * 1000;
                    case 'cm': return baseValue * 100;
                    case 'm': return baseValue;
                    case 'km': return baseValue / 1000;
                    case 'Mm': return baseValue / 1e6;
                    case 'Gm': return baseValue / 1e9;
                    case 'Tm': return baseValue / 1e12;
                    case 'Pm': return baseValue / 1e15;
                    case 'Em': return baseValue / 1e18;
                    case 'Zm': return baseValue / 1e21;
                    case 'Ym': return baseValue / 1e24;
                }
                break;

            case 'area':
                // Base: square meters
                switch (unit) {
                    case 'sqin': return baseValue * 10000 / this.SQ_INCH_TO_SQ_CM;
                    case 'sqft': return baseValue / this.SQ_FOOT_TO_SQ_METER;
                    case 'sqyd': return baseValue / this.SQ_YARD_TO_SQ_METER;
                    case 'acre': return baseValue / this.ACRE_TO_SQ_METER;
                    case 'sqmi': return baseValue / 1000000 / this.SQ_MILE_TO_SQ_KM;
                    case 'sqcm': return baseValue * 10000;
                    case 'sqm': return baseValue;
                    case 'ha': return baseValue / 10000;
                    case 'sqkm': return baseValue / 1000000;
                }
                break;

            case 'volume-liquid':
                // Base: milliliters
                switch (unit) {
                    case 'tsp': return baseValue / this.TEASPOON_TO_ML;
                    case 'tbsp': return baseValue / this.TABLESPOON_TO_ML;
                    case 'floz': return baseValue / this.FLUID_OUNCE_TO_ML;
                    case 'cup': return baseValue / this.CUP_TO_ML;
                    case 'pt': return baseValue / this.PINT_TO_ML;
                    case 'qt': return baseValue / 1000 / this.QUART_TO_LITER;
                    case 'gal': return baseValue / 1000 / this.GALLON_TO_LITER;
                    case 'yL': return baseValue / 1e-24;
                    case 'zL': return baseValue / 1e-21;
                    case 'aL': return baseValue / 1e-18;
                    case 'fL': return baseValue / 1e-15;
                    case 'pL': return baseValue / 1e-12;
                    case 'nL': return baseValue / 1e-9;
                    case 'uL': return baseValue / 1e-6;
                    case 'ml': return baseValue;
                    case 'l': return baseValue / 1000;
                    case 'kL': return baseValue / 1e6;
                    case 'ML': return baseValue / 1e9;
                    case 'GL': return baseValue / 1e12;
                    case 'TL': return baseValue / 1e15;
                    case 'PL': return baseValue / 1e18;
                    case 'EL': return baseValue / 1e21;
                    case 'ZL': return baseValue / 1e24;
                    case 'YL': return baseValue / 1e27;
                }
                break;

            case 'volume-solid':
                // Base: cubic centimeters
                switch (unit) {
                    case 'cuin': return baseValue / this.CUBIC_INCH_TO_CUBIC_CM;
                    case 'cuft': return baseValue / 1000000 / this.CUBIC_FOOT_TO_CUBIC_METER;
                    case 'cuyd': return baseValue / 1000000 / this.CUBIC_YARD_TO_CUBIC_METER;
                    case 'cucm': return baseValue;
                    case 'cum': return baseValue / 1000000;
                }
                break;

            case 'mass':
                // Base: grams
                switch (unit) {
                    case 'oz': return baseValue / this.OUNCE_TO_GRAM;
                    case 'lb': return baseValue / this.POUND_TO_GRAM;
                    case 'st': return baseValue / 1000 / this.STONE_TO_KG;
                    case 'ton': return baseValue / 1000 / this.SHORT_TON_TO_KG;
                    case 'lton': return baseValue / 1000 / this.LONG_TON_TO_KG;
                    case 'ug': return baseValue * 1e6;
                    case 'mg': return baseValue * 1000;
                    case 'g': return baseValue;
                    case 'kg': return baseValue / 1000;
                    case 'tonne': return baseValue / 1e6;
                    case 'Gg': return baseValue / 1e9;
                    case 'Tg': return baseValue / 1e12;
                    case 'Pg': return baseValue / 1e15;
                    case 'Eg': return baseValue / 1e18;
                    case 'Zg': return baseValue / 1e21;
                    case 'Yg': return baseValue / 1e24;
                }
                break;

            case 'temperature':
                // Base: Celsius
                switch (unit) {
                    case 'f': return baseValue * 9 / 5 + 32;
                    case 'c': return baseValue;
                    case 'k': return baseValue + 273.15;
                }
                break;

            case 'speed':
                // Base: m/s
                switch (unit) {
                    case 'mph': return baseValue / this.MPH_TO_MPS;
                    case 'fps': return baseValue / this.FPS_TO_MPS;
                    case 'mmps': return baseValue * 1000;
                    case 'cmps': return baseValue * 100;
                    case 'mps': return baseValue;
                    case 'kmh': return baseValue * 3.6;
                    case 'kmps': return baseValue / 1000;
                }
                break;

            case 'pressure':
                // Base: Pascals
                switch (unit) {
                    case 'psi': return baseValue / this.PSI_TO_PASCAL;
                    case 'inhg': return baseValue / this.INHG_TO_PASCAL;
                    case 'pa': return baseValue;
                    case 'hpa': return baseValue / 100;
                    case 'kpa': return baseValue / 1000;
                    case 'mpa': return baseValue / 1000000;
                    case 'gpa': return baseValue / 1000000000;
                    case 'tpa': return baseValue / 1000000000000;
                    case 'ppa': return baseValue / 1000000000000000;
                    case 'epa': return baseValue / 1000000000000000000;
                    case 'zpa': return baseValue / 1e21;
                    case 'ypa': return baseValue / 1e24;
                    case 'bar': return baseValue / 100000;
                }
                break;

            case 'energy':
                // Base: Joules
                switch (unit) {
                    case 'btu': return baseValue / this.BTU_TO_JOULE;
                    case 'ftlb': return baseValue / this.FOOT_POUND_TO_JOULE;
                    case 'j': return baseValue;
                    case 'kj': return baseValue / 1000;
                    case 'mj': return baseValue / 1e6;
                    case 'gj': return baseValue / 1e9;
                    case 'tj': return baseValue / 1e12;
                    case 'pj': return baseValue / 1e15;
                    case 'ej': return baseValue / 1e18;
                    case 'zj': return baseValue / 1e21;
                    case 'yj': return baseValue / 1e24;
                    case 'rj': return baseValue / 1e27;
                    case 'qj': return baseValue / 1e30;
                }
                break;

            case 'power':
                // Base: Watts
                switch (unit) {
                    case 'hp': return baseValue / this.HORSEPOWER_TO_WATT;
                    case 'w': return baseValue;
                    case 'kw': return baseValue / 1000;
                    case 'mw': return baseValue / 1000000;
                    case 'gw': return baseValue / 1000000000;
                    case 'tw': return baseValue / 1000000000000;
                    case 'pw': return baseValue / 1000000000000000;
                    case 'ew': return baseValue / 1000000000000000000;
                    case 'zw': return baseValue / 1e21;
                    case 'yw': return baseValue / 1e24;
                }
                break;

            case 'force':
                // Base: Newtons
                switch (unit) {
                    case 'lbf': return baseValue / this.POUND_FORCE_TO_NEWTON;
                    case 'n': return baseValue;
                }
                break;

            case 'nautical':
                // Base: kilometers
                switch (unit) {
                    case 'nm': return baseValue / this.NAUTICAL_MILE_TO_KM;
                    case 'km': return baseValue;
                }
                break;
        }
        return baseValue;
    },

    /**
     * Format a number for display
     * @param {number} value - The value to format
     * @param {Object} settings - Settings object with precision, numberGrouping, scientificNotation, rounding
     */
    formatResult(value, settings = {}) {
        const decimals = settings.precision || 4;
        const useGrouping = settings.numberGrouping !== false;
        const useScientific = settings.scientificNotation !== false;
        const roundingMode = settings.rounding || 'round';

        if (value === null || isNaN(value)) return '';
        
        // Apply rounding mode
        let rounded;
        const multiplier = Math.pow(10, decimals);
        switch (roundingMode) {
            case 'floor':
                rounded = Math.floor(value * multiplier) / multiplier;
                break;
            case 'ceiling':
                rounded = Math.ceil(value * multiplier) / multiplier;
                break;
            default:
                rounded = Math.round(value * multiplier) / multiplier;
        }
        
        // Handle very small/large numbers with scientific notation
        if (useScientific && rounded !== 0 && (Math.abs(rounded) < 0.0001 || Math.abs(rounded) > 999999999)) {
            return rounded.toExponential(decimals);
        }
        
        if (useGrouping) {
            return rounded.toLocaleString('en-US', { 
                maximumFractionDigits: decimals,
                minimumFractionDigits: 0 
            });
        } else {
            return String(rounded);
        }
    },

    /**
     * Get unit symbol for display
     */
    getUnitSymbol(unitId) {
        const symbols = {
            'in': 'in', 'ft': 'ft', 'yd': 'yd', 'mi': 'mi',
            'mm': 'mm', 'cm': 'cm', 'm': 'm', 'km': 'km',
            'sqin': 'sq in', 'sqft': 'sq ft', 'sqyd': 'sq yd', 'acre': 'acre', 'sqmi': 'sq mi',
            'sqcm': 'cm2', 'sqm': 'm2', 'ha': 'ha', 'sqkm': 'km2',
            'tsp': 'tsp', 'tbsp': 'tbsp', 'floz': 'fl oz', 'cup': 'cup', 
            'pt': 'pt', 'qt': 'qt', 'gal': 'gal', 'ml': 'ml', 'l': 'L',
            'cuin': 'cu in', 'cuft': 'cu ft', 'cuyd': 'cu yd', 'cucm': 'cm3', 'cum': 'm3',
            'oz': 'oz', 'lb': 'lb', 'st': 'st', 'ton': 'short ton', 'lton': 'long ton', 'g': 'g', 'kg': 'kg', 'tonne': 't',
            'f': 'F', 'c': 'C', 'k': 'K',
            'mph': 'mph', 'fps': 'ft/s', 'kmh': 'km/h', 'mps': 'm/s',
            'psi': 'psi', 'inhg': 'inHg', 'pa': 'Pa', 'kpa': 'kPa', 'bar': 'bar',
            'btu': 'BTU', 'ftlb': 'ft-lb', 'j': 'J', 'kj': 'kJ',
            'hp': 'hp', 'w': 'W', 'kw': 'kW',
            'lbf': 'lbf', 'n': 'N',
            'nm': 'nm'
        };
        return symbols[unitId] || unitId;
    }
};

// Export for use in app.js
window.UnitConverter = UnitConverter;
