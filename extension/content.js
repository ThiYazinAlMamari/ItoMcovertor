/**
 * ItoMcovertor Extension - Content Script
 * Auto-detects and converts units on webpages
 * Supports: auto-convert, selection popup, context menu conversion
 */

// Conversion patterns with RegEx
const UNIT_PATTERNS = {
  'imperial-to-metric': {
    'inches': {
      regex: /\b(\d[\d,.]*)(?:\s*)(inches?|in\.?|")(?![a-zA-Z])/gi,
      factor: 2.54,
      toUnit: 'cm',
      toLabel: 'cm'
    },
    'feet': {
      regex: /\b(\d[\d,.]*)[-\s]*(feet|foot|ft\.?|')(?![a-zA-Z])/gi,
      factor: 0.3048,
      toUnit: 'm',
      toLabel: 'm'
    },
    'feetinches': {
      regex: /\b(\d+)\s*(?:ft\.?|feet|foot|')\s*(\d+(?:\.\d+)?)\s*(?:in\.?|inches?|")\b/gi,
      convert: (feet, inches) => (feet * 30.48) + (inches * 2.54),
      toUnit: 'cm',
      toLabel: 'cm',
      multiCapture: true,
      priority: 1
    },
    'miles': {
      regex: /\b(\d[\d,.]*)(?:\s*)(miles?|mi\.?)\b/gi,
      factor: 1.60934,
      toUnit: 'km',
      toLabel: 'km'
    },
    'pounds': {
      regex: /\b(\d[\d,.]*)(?:\s*)(pounds?|lbs?\.?)\b/gi,
      factor: 0.453592,
      toUnit: 'kg',
      toLabel: 'kg'
    },
    'ounces': {
      regex: /\b(\d[\d,.]*)(?:\s*)(ounces?|oz\.?)\b/gi,
      factor: 28.3495,
      toUnit: 'g',
      toLabel: 'g'
    },
    'shorttons': {
      regex: /\b(\d[\d,.]*)[-\s]*(short\s*tons?)\b/gi,
      factor: 0.907185,
      toUnit: 'tonnes',
      toLabel: 'tonnes'
    },
    'longtons': {
      regex: /\b(\d[\d,.]*)[-\s]*(long\s*tons?)\b/gi,
      factor: 1.01605,
      toUnit: 'tonnes',
      toLabel: 'tonnes'
    },
    'gallons': {
      regex: /\b(\d[\d,.]*)(?:\s*)(?:U\.?S\.?\s*)?(gallons?|gal\.?)\b/gi,
      factor: 3.78541,
      toUnit: 'L',
      toLabel: 'L'
    },
    'fahrenheit': {
      regex: /\b(-?\d[\d,.]*)\s*(?:°\s*|degrees?\s*)?(?:F|Fahrenheit)\b/gi,
      convert: (f) => (f - 32) * 5 / 9,
      toUnit: '°C',
      toLabel: '°C'
    },
    // Area units
    'sqfeet': {
      regex: /\b(\d[\d,.]*)(?:\s*)(sq\.?\s*(?:feet|ft|foot)|square\s*(?:feet|ft|foot)|ft2|ft\u00b2)\b/gi,
      factor: 0.092903,
      toUnit: 'm\u00b2',
      toLabel: 'm\u00b2'
    },
    'acres': {
      regex: /\b(\d[\d,.]*)[-\s]*(acres?)\b/gi,
      factor: 0.404686,
      toUnit: 'ha',
      toLabel: 'ha'
    },
    'sqmiles': {
      regex: /\b(\d[\d,.]*)(?:\s*)(sq\.?\s*(?:miles?|mi)|square\s*(?:miles?|mi)|mi2|mi\u00b2)\b/gi,
      factor: 2.58999,
      toUnit: 'km\u00b2',
      toLabel: 'km\u00b2'
    },
    // Volume - solid (cubic)
    'cubicinches': {
      regex: /\b(\d[\d,.]*)\s*(cu\.?\s*in\.?|cubic\s*inch(?:es)?|in\s?3|in³)\b/gi,
      factor: 16.3871,
      toUnit: 'cm\u00b3',
      toLabel: 'cm\u00b3',
      priority: 1
    },
    'cubicfeet': {
      regex: /\b(\d[\d,.]*)\s*(cu\.?\s*ft\.?|cubic\s*f(?:oo|ee)t|ft\s?3|ft³)\b/gi,
      factor: 0.0283168,
      toUnit: 'm\u00b3',
      toLabel: 'm\u00b3',
      priority: 1
    },
    'cubicyards': {
      regex: /\b(\d[\d,.]*)\s*(cu\.?\s*yd\.?|cubic\s*yards?|yd\s?3|yd³)\b/gi,
      factor: 0.764555,
      toUnit: 'm\u00b3',
      toLabel: 'm\u00b3',
      priority: 1
    },
    // Speed units
    'fps': {
      regex: /\b(\d[\d,.]*)\s*(?:ft\/s|feet\/s|ft\/sec|fps)(?![a-zA-Z])/gi,
      factor: 0.3048,
      toUnit: 'm/s',
      toLabel: 'm/s',
      priority: 1
    },
    'mph': {
      regex: /\b(\d[\d,.]*)\s*(?:mph|miles?\s*per\s*hour)\b/gi,
      factor: 1.60934,
      toUnit: 'km/h',
      toLabel: 'km/h',
      priority: 1
    },
    // Length - missing
    'yards': {
      regex: /\b(\d[\d,.]*)[-\s]*(yards?|yd\.?)\b/gi,
      factor: 0.9144,
      toUnit: 'm',
      toLabel: 'm'
    },
    // Volume - liquid
    'teaspoons': {
      regex: /\b(\d[\d,.]*)\s*(teaspoons?|tsp\.?)\b/gi,
      factor: 4.92892,
      toUnit: 'ml',
      toLabel: 'ml'
    },
    'tablespoons': {
      regex: /\b(\d[\d,.]*)\s*(tablespoons?|tbsp\.?)\b/gi,
      factor: 14.7868,
      toUnit: 'ml',
      toLabel: 'ml'
    },
    'fluidounces': {
      regex: /\b(\d[\d,.]*)\s*(fl\.?\s*oz\.?|fluid\s*ounces?)\b/gi,
      factor: 29.5735,
      toUnit: 'ml',
      toLabel: 'ml'
    },
    'cups': {
      regex: /\b(\d[\d,.]*)\s*(cups?)\b/gi,
      factor: 236.588,
      toUnit: 'ml',
      toLabel: 'ml'
    },
    'pints': {
      regex: /\b(\d[\d,.]*)\s*(pints?|pt\.?)\b/gi,
      factor: 473.176,
      toUnit: 'ml',
      toLabel: 'ml'
    },
    'quarts': {
      regex: /\b(\d[\d,.]*)\s*(quarts?|qt\.?)\b/gi,
      factor: 0.946353,
      toUnit: 'L',
      toLabel: 'L'
    },
    // Mass - missing
    'stone': {
      regex: /\b(\d[\d,.]*)\s*(stone|st\.?)\b/gi,
      factor: 6.35029,
      toUnit: 'kg',
      toLabel: 'kg'
    },
    // Pressure
    'psi': {
      regex: /\b(\d[\d,.]*)\s*(psi)\b/gi,
      factor: 6.89476,
      toUnit: 'kPa',
      toLabel: 'kPa'
    },
    'inhg': {
      regex: /\b(\d[\d,.]*)\s*(in\.?\s*hg|inches?\s*(?:of\s*)?mercury)\b/gi,
      factor: 3.38639,
      toUnit: 'kPa',
      toLabel: 'kPa'
    },
    // Energy
    'btu': {
      regex: /\b(\d[\d,.]*)\s*(btu|british\s*thermal\s*units?)\b/gi,
      factor: 1.05506,
      toUnit: 'kJ',
      toLabel: 'kJ'
    },
    'footpounds': {
      regex: /\b(\d[\d,.]*)\s*(ft[\-\s]*lbs?|foot[\-\s]*pounds?)\b/gi,
      factor: 1.35582,
      toUnit: 'J',
      toLabel: 'J'
    },
    // Power
    'horsepower': {
      regex: /\b(\d[\d,.]*)\s*(hp|horsepower)\b/gi,
      factor: 745.7,
      toUnit: 'W',
      toLabel: 'W'
    },
    // Force
    'poundforce': {
      regex: /\b(\d[\d,.]*)\s*(lbf|pound[\-\s]*force)\b/gi,
      factor: 4.44822,
      toUnit: 'N',
      toLabel: 'N'
    },
    // Nautical
    'nauticalmiles': {
      regex: /\b(\d[\d,.]*)\s*(nautical\s*miles?|nm|nmi)\b/gi,
      factor: 1.852,
      toUnit: 'km',
      toLabel: 'km'
    }
  },
  'metric-to-imperial': {
    'centimeters': {
      regex: /\b(\d[\d,.]*)(?:\s*)(centimeters?|cm)\b/gi,
      factor: 1 / 2.54,
      toUnit: 'in',
      toLabel: 'in'
    },
    'meters': {
      regex: /\b(\d[\d,.]*)[-\s]*(meters?|metres?|m)(?![²³\/a-zA-Z0-9]|\s*[3³]|\s*per)/gi,
      factor: 1 / 0.3048,
      toUnit: 'ft',
      toLabel: 'ft'
    },
    'kilometers': {
      regex: /\b(\d[\d,.]*)(?:\s*)(kilometers?|km)\b/gi,
      factor: 1 / 1.60934,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'kilograms': {
      regex: /\b(\d[\d,.]*)(?:\s*)(kilograms?|kg)\b/gi,
      factor: 2.20462,
      toUnit: 'lbs',
      toLabel: 'lbs'
    },
    'grams': {
      regex: /\b(\d[\d,.]*)(?:\s*)(grams?|g)(?!\w)/gi,
      factor: 1 / 28.3495,
      toUnit: 'oz',
      toLabel: 'oz'
    },
    'milligrams': {
      regex: /\b(\d[\d,.]*)\s*(milligrams?|mg)(?![a-zA-Z])/gi,
      factor: 1 / 28349.5,
      toUnit: 'oz',
      toLabel: 'oz'
    },
    'micrograms': {
      regex: /\b(\d[\d,.]*)\s*(micrograms?|µg|ug)(?![a-zA-Z])/gi,
      factor: 1 / 28349500,
      toUnit: 'oz',
      toLabel: 'oz'
    },
    'tonnes': {
      regex: /\b(\d[\d,.]*)[-\s]*(tonnes?|metric\s*tons?|Mg|megagrams?)(?![a-zA-Z])/gi,
      factor: 1.10231,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'gigagrams': {
      regex: /\b(\d[\d,.]*)\s*(gigagrams?|Gg)(?![a-zA-Z])/gi,
      factor: 1102310,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'teragrams': {
      regex: /\b(\d[\d,.]*)\s*(teragrams?|Tg)(?![a-zA-Z])/gi,
      factor: 1102310000,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'petagrams': {
      regex: /\b(\d[\d,.]*)\s*(petagrams?|Pg)(?![a-zA-Z])/gi,
      factor: 1.10231e12,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'exagrams': {
      regex: /\b(\d[\d,.]*)\s*(exagrams?|Eg)(?![a-zA-Z])/gi,
      factor: 1.10231e15,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'zettagrams': {
      regex: /\b(\d[\d,.]*)\s*(zettagrams?|Zg)(?![a-zA-Z])/gi,
      factor: 1.10231e18,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'yottagrams': {
      regex: /\b(\d[\d,.]*)\s*(yottagrams?|Yg)(?![a-zA-Z])/gi,
      factor: 1.10231e21,
      toUnit: 'short tons',
      toLabel: 'short tons'
    },
    'liters': {
      regex: /\b(\d[\d,.]*)(?:\s*)(liters?|litres?|L)\b/gi,
      factor: 0.264172,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'celsius': {
      regex: /\b(-?\d[\d,.]*)\s*(?:°\s*|degrees?\s*)?(?:C|Celsius)\b/gi,
      convert: (c) => c * 9 / 5 + 32,
      toUnit: '°F',
      toLabel: '°F'
    },
    // Area units
    'sqmeters': {
      regex: /\b(\d[\d,.]*)(?:\s*)(sq\.?\s*(?:meters?|m)|square\s*(?:meters?|m)|m2|m\u00b2)(?![\w²³])/gi,
      factor: 10.7639,
      toUnit: 'sq ft',
      toLabel: 'sq ft'
    },
    'hectares': {
      regex: /\b(\d[\d,.]*)[-\s]*(hectares?|ha)\b/gi,
      factor: 2.47105,
      toUnit: 'acres',
      toLabel: 'acres'
    },
    'sqkilometers': {
      regex: /\b(\d[\d,.]*)(?:\s*)(sq\.?\s*(?:kilometers?|km)|square\s*(?:kilometers?|km)|km2|km\u00b2)\b/gi,
      factor: 0.386102,
      toUnit: 'sq mi',
      toLabel: 'sq mi'
    },
    // Speed units
    'mps': {
      regex: /\b(\d[\d,.]*)\s*(?:m\/s|meters?\/s|m\/sec|metres?\/s)(?![a-zA-Z])/gi,
      factor: 3.28084,
      toUnit: 'ft/s',
      toLabel: 'ft/s',
      priority: 1
    },
    'kmh': {
      regex: /\b(\d[\d,.]*)\s*(?:km\/h|kph|kilometers?\s*per\s*hour|kilometres?\s*per\s*hour)\b/gi,
      factor: 0.621371,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    // Length - small SI prefixes
    'micrometers': {
      regex: /\b(\d[\d,.]*)\s*(micrometers?|micrometres?|µm|um)(?![a-zA-Z])/gi,
      factor: 3.93701e-5,
      toUnit: 'in',
      toLabel: 'in'
    },
    'nanometers': {
      regex: /\b(\d[\d,.]*)\s*(nanometers?|nanometres?|nm)(?![a-zA-Z])/gi,
      factor: 3.93701e-8,
      toUnit: 'in',
      toLabel: 'in'
    },
    'picometers': {
      regex: /\b(\d[\d,.]*)\s*(picometers?|picometres?|pm)(?![a-zA-Z])/gi,
      factor: 3.93701e-11,
      toUnit: 'in',
      toLabel: 'in'
    },
    'femtometers': {
      regex: /\b(\d[\d,.]*)\s*(femtometers?|femtometres?|fm)(?![a-zA-Z])/gi,
      factor: 3.93701e-14,
      toUnit: 'in',
      toLabel: 'in'
    },
    'attometers': {
      regex: /\b(\d[\d,.]*)\s*(attometers?|attometres?|am)(?![a-zA-Z])/gi,
      factor: 3.93701e-17,
      toUnit: 'in',
      toLabel: 'in'
    },
    'zeptometers': {
      regex: /\b(\d[\d,.]*)\s*(zeptometers?|zeptometres?|zm)(?![a-zA-Z])/gi,
      factor: 3.93701e-20,
      toUnit: 'in',
      toLabel: 'in'
    },
    'yoctometers': {
      regex: /\b(\d[\d,.]*)\s*(yoctometers?|yoctometres?|ym)(?![a-zA-Z])/gi,
      factor: 3.93701e-23,
      toUnit: 'in',
      toLabel: 'in'
    },
    'millimeters': {
      regex: /\b(\d[\d,.]*)\s*(millimeters?|millimetres?|mm)(?![a-zA-Z])/gi,
      factor: 0.0393701,
      toUnit: 'in',
      toLabel: 'in'
    },
    'megameters': {
      regex: /\b(\d[\d,.]*)\s*(megameters?|megametres?|Mm)(?![a-zA-Z])/gi,
      factor: 621.371,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'gigameters': {
      regex: /\b(\d[\d,.]*)\s*(gigameters?|gigametres?|Gm)(?![a-zA-Z])/gi,
      factor: 621371,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'terameters': {
      regex: /\b(\d[\d,.]*)\s*(terameters?|terametres?|Tm)(?![a-zA-Z])/gi,
      factor: 621371000,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'petameters': {
      regex: /\b(\d[\d,.]*)\s*(petameters?|petametres?|Pm)(?![a-zA-Z])/gi,
      factor: 621371000000,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'exameters': {
      regex: /\b(\d[\d,.]*)\s*(exameters?|exametres?|Em)(?![a-zA-Z])/gi,
      factor: 6.21371e14,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'zettameters': {
      regex: /\b(\d[\d,.]*)\s*(zettameters?|zettametres?|Zm)(?![a-zA-Z])/gi,
      factor: 6.21371e17,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    'yottameters': {
      regex: /\b(\d[\d,.]*)\s*(yottameters?|yottametres?|Ym)(?![a-zA-Z])/gi,
      factor: 6.21371e20,
      toUnit: 'mi',
      toLabel: 'mi'
    },
    // Volume - liquid
    // Volume - small SI prefixes
    'microliters': {
      regex: /\b(\d[\d,.]*)\s*(microliters?|microlitres?|µL|uL)(?![a-zA-Z])/gi,
      factor: 3.3814e-5,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'nanoliters': {
      regex: /\b(\d[\d,.]*)\s*(nanoliters?|nanolitres?|nL)(?![a-zA-Z])/gi,
      factor: 3.3814e-8,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'picoliters': {
      regex: /\b(\d[\d,.]*)\s*(picoliters?|picolitres?|pL)(?![a-zA-Z])/gi,
      factor: 3.3814e-11,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'femtoliters': {
      regex: /\b(\d[\d,.]*)\s*(femtoliters?|femtolitres?|fL)(?![a-zA-Z])/gi,
      factor: 3.3814e-14,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'attoliters': {
      regex: /\b(\d[\d,.]*)\s*(attoliters?|attolitres?|aL)(?![a-zA-Z])/gi,
      factor: 3.3814e-17,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'zeptoliters': {
      regex: /\b(\d[\d,.]*)\s*(zeptoliters?|zeptolitres?|zL)(?![a-zA-Z])/gi,
      factor: 3.3814e-20,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'yoctoliters': {
      regex: /\b(\d[\d,.]*)\s*(yoctoliters?|yoctolitres?|yL)(?![a-zA-Z])/gi,
      factor: 3.3814e-23,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'milliliters': {
      regex: /\b(\d[\d,.]*)\s*(milliliters?|millilitres?|ml)(?![a-zA-Z])/gi,
      factor: 0.033814,
      toUnit: 'fl oz',
      toLabel: 'fl oz'
    },
    'kiloliters': {
      regex: /\b(\d[\d,.]*)\s*(kiloliters?|kilolitres?|kL)(?![a-zA-Z])/gi,
      factor: 264.172,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'megaliters': {
      regex: /\b(\d[\d,.]*)\s*(megaliters?|megalitres?|ML)(?![a-zA-Z])/gi,
      factor: 264172,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'gigaliters': {
      regex: /\b(\d[\d,.]*)\s*(gigaliters?|gigalitres?|GL)(?![a-zA-Z])/gi,
      factor: 264172000,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'teraliters': {
      regex: /\b(\d[\d,.]*)\s*(teraliters?|teralitres?|TL)(?![a-zA-Z])/gi,
      factor: 264172000000,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'petaliters': {
      regex: /\b(\d[\d,.]*)\s*(petaliters?|petalitres?|PL)(?![a-zA-Z])/gi,
      factor: 2.64172e14,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'exaliters': {
      regex: /\b(\d[\d,.]*)\s*(exaliters?|exalitres?|EL)(?![a-zA-Z])/gi,
      factor: 2.64172e17,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'zettaliters': {
      regex: /\b(\d[\d,.]*)\s*(zettaliters?|zettalitres?|ZL)(?![a-zA-Z])/gi,
      factor: 2.64172e20,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    'yottaliters': {
      regex: /\b(\d[\d,.]*)\s*(yottaliters?|yottalitres?|YL)(?![a-zA-Z])/gi,
      factor: 2.64172e23,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    // Volume - solid (cubic)
    'cubicmeters': {
      regex: /\b(\d[\d,.]*)\s*(cubic\s*met(?:er|re)s?|m\s?3|m³)(?![a-zA-Z])/gi,
      factor: 1.30795,
      toUnit: 'cu yd',
      toLabel: 'cu yd',
      priority: 1
    },
    'cubiccentimeters': {
      regex: /\b(\d[\d,.]*)\s*(cubic\s*centim(?:eter|etre)s?|cm\s?3|cm³|cc)\b/gi,
      factor: 0.0610237,
      toUnit: 'cu in',
      toLabel: 'cu in',
      priority: 1
    },
    'liters': {
      regex: /\b(\d[\d,.]*)\s*(liters?|litres?|L)\b/gi,
      factor: 0.264172,
      toUnit: 'gal',
      toLabel: 'gal'
    },
    // Pressure
    'pascals': {
      regex: /\b(\d[\d,.]*)\s*(pascals?|Pa)(?![a-zA-Z])/gi,
      factor: 0.000145038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'hectopascals': {
      regex: /\b(\d[\d,.]*)\s*(hectopascals?|hpa)(?![a-zA-Z])/gi,
      factor: 0.0145038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'kilopascals': {
      regex: /\b(\d[\d,.]*)\s*(kilopascals?|kpa)(?![a-zA-Z])/gi,
      factor: 0.145038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'megapascals': {
      regex: /\b(\d[\d,.]*)\s*(megapascals?|mpa)(?![a-zA-Z])/gi,
      factor: 145.038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'gigapascals': {
      regex: /\b(\d[\d,.]*)\s*(gigapascals?|gpa)(?![a-zA-Z])/gi,
      factor: 145038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'terapascals': {
      regex: /\b(\d[\d,.]*)\s*(terapascals?|tpa)(?![a-zA-Z])/gi,
      factor: 145038000,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'petapascals': {
      regex: /\b(\d[\d,.]*)\s*(petapascals?|ppa)(?![a-zA-Z])/gi,
      factor: 145038000000,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'exapascals': {
      regex: /\b(\d[\d,.]*)\s*(exapascals?|epa)(?![a-zA-Z])/gi,
      factor: 145038000000000,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'zettapascals': {
      regex: /\b(\d[\d,.]*)\s*(zettapascals?|zpa)(?![a-zA-Z])/gi,
      factor: 145038000000000000,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'yottapascals': {
      regex: /\b(\d[\d,.]*)\s*(yottapascals?|ypa)(?![a-zA-Z])/gi,
      factor: 145038000000000000000,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    'bar': {
      regex: /\b(\d[\d,.]*)\s*(bar)(?![a-zA-Z])/gi,
      factor: 14.5038,
      toUnit: 'psi',
      toLabel: 'psi'
    },
    // Energy
    'joules': {
      regex: /\b(\d[\d,.]*)\s*(joules?|J)(?![a-zA-Z])/gi,
      factor: 0.737562,
      toUnit: 'ft-lb',
      toLabel: 'ft-lb'
    },
    'kilojoules': {
      regex: /\b(\d[\d,.]*)\s*(kilojoules?|kj)(?![a-zA-Z])/gi,
      factor: 0.947817,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'megajoules': {
      regex: /\b(\d[\d,.]*)\s*(megajoules?|mj)(?![a-zA-Z])/gi,
      factor: 947.817,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'gigajoules': {
      regex: /\b(\d[\d,.]*)\s*(gigajoules?|gj)(?![a-zA-Z])/gi,
      factor: 947817,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'terajoules': {
      regex: /\b(\d[\d,.]*)\s*(terajoules?|tj)(?![a-zA-Z])/gi,
      factor: 947817000,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'petajoules': {
      regex: /\b(\d[\d,.]*)\s*(petajoules?|pj)(?![a-zA-Z])/gi,
      factor: 947817000000,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'exajoules': {
      regex: /\b(\d[\d,.]*)\s*(exajoules?|ej)(?![a-zA-Z])/gi,
      factor: 947817000000000,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'zettajoules': {
      regex: /\b(\d[\d,.]*)\s*(zettajoules?|zj)(?![a-zA-Z])/gi,
      factor: 9.47817e17,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'yottajoules': {
      regex: /\b(\d[\d,.]*)\s*(yottajoules?|yj)(?![a-zA-Z])/gi,
      factor: 9.47817e20,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'ronnajoules': {
      regex: /\b(\d[\d,.]*)\s*(ronnajoules?|rj)(?![a-zA-Z])/gi,
      factor: 9.47817e23,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    'quettajoules': {
      regex: /\b(\d[\d,.]*)\s*(quettajoules?|qj)(?![a-zA-Z])/gi,
      factor: 9.47817e26,
      toUnit: 'BTU',
      toLabel: 'BTU'
    },
    // Power
    'watts': {
      regex: /\b(\d[\d,.]*)\s*(watts?|W)(?![a-zA-Z])/gi,
      factor: 0.00134102,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'kilowatts': {
      regex: /\b(\d[\d,.]*)\s*(kilowatts?|kw)\b/gi,
      factor: 1.34102,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'megawatts': {
      regex: /\b(\d[\d,.]*)\s*(megawatts?|mw)\b/gi,
      factor: 1341.02,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'gigawatts': {
      regex: /\b(\d[\d,.]*)\s*(gigawatts?|gw)\b/gi,
      factor: 1341020,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'terawatts': {
      regex: /\b(\d[\d,.]*)\s*(terawatts?|tw)\b/gi,
      factor: 1341020000,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'petawatts': {
      regex: /\b(\d[\d,.]*)\s*(petawatts?|pw)\b/gi,
      factor: 1341020000000,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'exawatts': {
      regex: /\b(\d[\d,.]*)\s*(exawatts?|ew)\b/gi,
      factor: 1341020000000000,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'zettawatts': {
      regex: /\b(\d[\d,.]*)\s*(zettawatts?|zw)\b/gi,
      factor: 1341020000000000000,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    'yottawatts': {
      regex: /\b(\d[\d,.]*)\s*(yottawatts?|yw)\b/gi,
      factor: 1341020000000000000000,
      toUnit: 'hp',
      toLabel: 'hp'
    },
    // Speed (metric to imperial)
    'mmps': {
      regex: /\b(\d[\d,.]*)\s*(?:mm\/s|millimeters?\s*per\s*second|millimetres?\s*per\s*second)(?![a-zA-Z])/gi,
      factor: 0.00223694,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    'cmps': {
      regex: /\b(\d[\d,.]*)\s*(?:cm\/s|centimeters?\s*per\s*second|centimetres?\s*per\s*second)(?![a-zA-Z])/gi,
      factor: 0.0223694,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    'mps': {
      regex: /\b(\d[\d,.]*)\s*(?:m\/s|meters?\s*per\s*second|metres?\s*per\s*second)(?![a-zA-Z])/gi,
      factor: 2.23694,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    'kmh': {
      regex: /\b(\d[\d,.]*)\s*(?:km\/h|kph|kilometers?\s*per\s*hour|kilometres?\s*per\s*hour)(?![a-zA-Z])/gi,
      factor: 0.621371,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    'kmps': {
      regex: /\b(\d[\d,.]*)\s*(?:km\/s|kilometers?\s*per\s*second|kilometres?\s*per\s*second)(?![a-zA-Z])/gi,
      factor: 2236.94,
      toUnit: 'mph',
      toLabel: 'mph',
      priority: 1
    },
    // Force
    'newtons': {
      regex: /\b(\d[\d,.]*)\s*(newtons?|N)(?![a-zA-Z])/gi,
      factor: 0.224809,
      toUnit: 'lbf',
      toLabel: 'lbf'
    }
  }
};

// Elements to skip
const SKIP_TAGS = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'SVG', 'CANVAS'];
const PROCESSED_CLASS = 'itom-processed';
const POPUP_CLASS = 'itom-selection-popup';
const DROPDOWN_CLASS = 'itom-dropdown';

// Smart alternatives - grouped by category for units that can convert multiple ways
// Key: unitName, Value: array of alternative conversions (factor from original unit)
// The system automatically skips the primary conversion (defined in UNIT_PATTERNS)
const UNIT_ALTERNATIVES = {
  // === MASS ===
  'tonnes': [
    { factor: 1.10231, toLabel: 'short tons' },
    { factor: 0.984207, toLabel: 'long tons' },
    { factor: 1000, toLabel: 'kg' },
    { factor: 2204.62, toLabel: 'lb' }
  ],
  'shorttons': [
    { factor: 0.907185, toLabel: 'tonnes' },
    { factor: 0.892857, toLabel: 'long tons' },
    { factor: 907.185, toLabel: 'kg' },
    { factor: 2000, toLabel: 'lb' }
  ],
  'longtons': [
    { factor: 1.01605, toLabel: 'tonnes' },
    { factor: 1.12, toLabel: 'short tons' },
    { factor: 1016.05, toLabel: 'kg' },
    { factor: 2240, toLabel: 'lb' }
  ],
  'kilograms': [
    { factor: 2.20462, toLabel: 'lb' },
    { factor: 1000, toLabel: 'g' },
    { factor: 35.274, toLabel: 'oz' },
    { factor: 0.157473, toLabel: 'stone' }
  ],
  'pounds': [
    { factor: 0.453592, toLabel: 'kg' },
    { factor: 453.592, toLabel: 'g' },
    { factor: 16, toLabel: 'oz' }
  ],
  'ounces': [
    { factor: 28.3495, toLabel: 'g' },
    { factor: 0.0625, toLabel: 'lb' },
    { factor: 0.0283495, toLabel: 'kg' }
  ],
  'grams': [
    { factor: 0.035274, toLabel: 'oz' },
    { factor: 0.00220462, toLabel: 'lb' },
    { factor: 0.001, toLabel: 'kg' }
  ],
  'stone': [
    { factor: 6.35029, toLabel: 'kg' },
    { factor: 14, toLabel: 'lb' },
    { factor: 6350.29, toLabel: 'g' }
  ],
  'milligrams': [
    { factor: 0.001, toLabel: 'g' },
    { factor: 0.000001, toLabel: 'kg' },
    { factor: 0.0000353, toLabel: 'oz' }
  ],
  'micrograms': [
    { factor: 0.001, toLabel: 'mg' },
    { factor: 0.000001, toLabel: 'g' },
    { factor: 0.000000001, toLabel: 'kg' }
  ],
  'gigagrams': [
    { factor: 1000, toLabel: 'tonnes' },
    { factor: 1e9, toLabel: 'kg' },
    { factor: 1102310, toLabel: 'short tons' }
  ],
  'teragrams': [
    { factor: 1000, toLabel: 'Gg' },
    { factor: 1e6, toLabel: 'tonnes' },
    { factor: 1.10231e9, toLabel: 'short tons' }
  ],
  'petagrams': [
    { factor: 1000, toLabel: 'Tg' },
    { factor: 1e9, toLabel: 'tonnes' },
    { factor: 1.10231e12, toLabel: 'short tons' }
  ],
  'exagrams': [
    { factor: 1000, toLabel: 'Pg' },
    { factor: 1e12, toLabel: 'tonnes' },
    { factor: 1.10231e15, toLabel: 'short tons' }
  ],
  'zettagrams': [
    { factor: 1000, toLabel: 'Eg' },
    { factor: 1e15, toLabel: 'tonnes' },
    { factor: 1.10231e18, toLabel: 'short tons' }
  ],
  'yottagrams': [
    { factor: 1000, toLabel: 'Zg' },
    { factor: 1e18, toLabel: 'tonnes' },
    { factor: 1.10231e21, toLabel: 'short tons' }
  ],
  
  // === LENGTH ===
  'meters': [
    { factor: 3.28084, toLabel: 'ft' },
    { factor: 39.3701, toLabel: 'in' },
    { factor: 1.09361, toLabel: 'yd' },
    { factor: 100, toLabel: 'cm' }
  ],
  'kilometers': [
    { factor: 0.621371, toLabel: 'mi' },
    { factor: 1000, toLabel: 'm' },
    { factor: 3280.84, toLabel: 'ft' },
    { factor: 0.539957, toLabel: 'nm' }
  ],
  'centimeters': [
    { factor: 0.393701, toLabel: 'in' },
    { factor: 0.0328084, toLabel: 'ft' },
    { factor: 0.01, toLabel: 'm' },
    { factor: 10, toLabel: 'mm' }
  ],
  'millimeters': [
    { factor: 0.0393701, toLabel: 'in' },
    { factor: 0.1, toLabel: 'cm' },
    { factor: 0.001, toLabel: 'm' }
  ],
  'feet': [
    { factor: 0.3048, toLabel: 'm' },
    { factor: 30.48, toLabel: 'cm' },
    { factor: 12, toLabel: 'in' },
    { factor: 0.333333, toLabel: 'yd' }
  ],
  'inches': [
    { factor: 2.54, toLabel: 'cm' },
    { factor: 25.4, toLabel: 'mm' },
    { factor: 0.0833333, toLabel: 'ft' },
    { factor: 0.0254, toLabel: 'm' }
  ],
  'yards': [
    { factor: 0.9144, toLabel: 'm' },
    { factor: 91.44, toLabel: 'cm' },
    { factor: 3, toLabel: 'ft' }
  ],
  'miles': [
    { factor: 1.60934, toLabel: 'km' },
    { factor: 1609.34, toLabel: 'm' },
    { factor: 5280, toLabel: 'ft' },
    { factor: 0.868976, toLabel: 'nm' }
  ],
  'nauticalmiles': [
    { factor: 1.852, toLabel: 'km' },
    { factor: 1.15078, toLabel: 'mi' },
    { factor: 1852, toLabel: 'm' }
  ],
  // Small SI Length
  'micrometers': [
    { factor: 1000, toLabel: 'nm' },
    { factor: 0.001, toLabel: 'mm' },
    { factor: 3.93701e-5, toLabel: 'in' }
  ],
  'nanometers': [
    { factor: 0.001, toLabel: 'µm' },
    { factor: 1000, toLabel: 'pm' },
    { factor: 0.000001, toLabel: 'mm' }
  ],
  'picometers': [
    { factor: 0.001, toLabel: 'nm' },
    { factor: 1000, toLabel: 'fm' },
    { factor: 1e-9, toLabel: 'mm' }
  ],
  'femtometers': [
    { factor: 0.001, toLabel: 'pm' },
    { factor: 1000, toLabel: 'am' },
    { factor: 1e-12, toLabel: 'mm' }
  ],
  'attometers': [
    { factor: 0.001, toLabel: 'fm' },
    { factor: 1000, toLabel: 'zm' },
    { factor: 1e-15, toLabel: 'mm' }
  ],
  'zeptometers': [
    { factor: 0.001, toLabel: 'am' },
    { factor: 1000, toLabel: 'ym' },
    { factor: 1e-18, toLabel: 'mm' }
  ],
  'yoctometers': [
    { factor: 0.001, toLabel: 'zm' },
    { factor: 1e-21, toLabel: 'mm' },
    { factor: 1e-24, toLabel: 'm' }
  ],
  'megameters': [
    { factor: 1000, toLabel: 'km' },
    { factor: 1e6, toLabel: 'm' },
    { factor: 621.371, toLabel: 'mi' }
  ],
  'gigameters': [
    { factor: 1000, toLabel: 'Mm' },
    { factor: 1e6, toLabel: 'km' },
    { factor: 621371, toLabel: 'mi' }
  ],
  'terameters': [
    { factor: 1000, toLabel: 'Gm' },
    { factor: 1e9, toLabel: 'km' },
    { factor: 6.21371e8, toLabel: 'mi' }
  ],
  'petameters': [
    { factor: 1000, toLabel: 'Tm' },
    { factor: 1e12, toLabel: 'km' },
    { factor: 6.21371e11, toLabel: 'mi' }
  ],
  'exameters': [
    { factor: 1000, toLabel: 'Pm' },
    { factor: 1e15, toLabel: 'km' },
    { factor: 6.21371e14, toLabel: 'mi' }
  ],
  'zettameters': [
    { factor: 1000, toLabel: 'Em' },
    { factor: 1e18, toLabel: 'km' },
    { factor: 6.21371e17, toLabel: 'mi' }
  ],
  'yottameters': [
    { factor: 1000, toLabel: 'Zm' },
    { factor: 1e21, toLabel: 'km' },
    { factor: 6.21371e20, toLabel: 'mi' }
  ],
  
  // === AREA ===
  'hectares': [
    { factor: 2.47105, toLabel: 'acres' },
    { factor: 10000, toLabel: 'm²' },
    { factor: 0.01, toLabel: 'km²' }
  ],
  'acres': [
    { factor: 0.404686, toLabel: 'ha' },
    { factor: 4046.86, toLabel: 'm²' },
    { factor: 43560, toLabel: 'sq ft' }
  ],
  'sqkilometers': [
    { factor: 0.386102, toLabel: 'sq mi' },
    { factor: 247.105, toLabel: 'acres' },
    { factor: 100, toLabel: 'ha' }
  ],
  'sqmiles': [
    { factor: 2.58999, toLabel: 'km²' },
    { factor: 640, toLabel: 'acres' },
    { factor: 258.999, toLabel: 'ha' }
  ],
  'sqmeters': [
    { factor: 10.7639, toLabel: 'sq ft' },
    { factor: 0.000247105, toLabel: 'acres' },
    { factor: 0.0001, toLabel: 'ha' }
  ],
  'sqfeet': [
    { factor: 0.092903, toLabel: 'm²' },
    { factor: 0.111111, toLabel: 'sq yd' },
    { factor: 144, toLabel: 'sq in' }
  ],
  
  // === VOLUME SOLID ===
  'cubicmeters': [
    { factor: 1.30795, toLabel: 'cu yd' },
    { factor: 35.3147, toLabel: 'cu ft' },
    { factor: 1000, toLabel: 'L' },
    { factor: 1000000, toLabel: 'cm³' }
  ],
  'cubicyards': [
    { factor: 0.764555, toLabel: 'm³' },
    { factor: 27, toLabel: 'cu ft' },
    { factor: 764.555, toLabel: 'L' }
  ],
  'cubicfeet': [
    { factor: 0.0283168, toLabel: 'm³' },
    { factor: 0.037037, toLabel: 'cu yd' },
    { factor: 28.3168, toLabel: 'L' }
  ],
  'cubicinches': [
    { factor: 16.3871, toLabel: 'cm³' },
    { factor: 0.016387, toLabel: 'L' },
    { factor: 0.0005787, toLabel: 'cu ft' }
  ],
  'cubiccentimeters': [
    { factor: 0.0610237, toLabel: 'cu in' },
    { factor: 0.001, toLabel: 'L' },
    { factor: 0.000001, toLabel: 'm³' }
  ],
  
  // === VOLUME LIQUID ===
  'liters': [
    { factor: 0.264172, toLabel: 'gal' },
    { factor: 33.814, toLabel: 'fl oz' },
    { factor: 4.22675, toLabel: 'cups' },
    { factor: 1000, toLabel: 'ml' }
  ],
  'gallons': [
    { factor: 3.78541, toLabel: 'L' },
    { factor: 128, toLabel: 'fl oz' },
    { factor: 4, toLabel: 'qt' },
    { factor: 8, toLabel: 'pt' }
  ],
  'milliliters': [
    { factor: 0.033814, toLabel: 'fl oz' },
    { factor: 0.001, toLabel: 'L' },
    { factor: 0.202884, toLabel: 'tsp' }
  ],
  // Small SI Volume
  'microliters': [
    { factor: 1000, toLabel: 'nL' },
    { factor: 0.001, toLabel: 'mL' },
    { factor: 3.3814e-5, toLabel: 'fl oz' }
  ],
  'nanoliters': [
    { factor: 0.001, toLabel: 'µL' },
    { factor: 1000, toLabel: 'pL' },
    { factor: 1e-6, toLabel: 'mL' }
  ],
  'picoliters': [
    { factor: 0.001, toLabel: 'nL' },
    { factor: 1000, toLabel: 'fL' },
    { factor: 1e-9, toLabel: 'mL' }
  ],
  'femtoliters': [
    { factor: 0.001, toLabel: 'pL' },
    { factor: 1000, toLabel: 'aL' },
    { factor: 1e-12, toLabel: 'mL' }
  ],
  'attoliters': [
    { factor: 0.001, toLabel: 'fL' },
    { factor: 1000, toLabel: 'zL' },
    { factor: 1e-15, toLabel: 'mL' }
  ],
  'zeptoliters': [
    { factor: 0.001, toLabel: 'aL' },
    { factor: 1000, toLabel: 'yL' },
    { factor: 1e-18, toLabel: 'mL' }
  ],
  'yoctoliters': [
    { factor: 0.001, toLabel: 'zL' },
    { factor: 1e-21, toLabel: 'mL' },
    { factor: 1e-24, toLabel: 'L' }
  ],
  'fluidounces': [
    { factor: 29.5735, toLabel: 'ml' },
    { factor: 0.0295735, toLabel: 'L' },
    { factor: 0.125, toLabel: 'cup' }
  ],
  'cups': [
    { factor: 236.588, toLabel: 'ml' },
    { factor: 8, toLabel: 'fl oz' },
    { factor: 0.5, toLabel: 'pt' }
  ],
  'pints': [
    { factor: 473.176, toLabel: 'ml' },
    { factor: 0.473176, toLabel: 'L' },
    { factor: 2, toLabel: 'cups' }
  ],
  'quarts': [
    { factor: 0.946353, toLabel: 'L' },
    { factor: 946.353, toLabel: 'ml' },
    { factor: 2, toLabel: 'pt' }
  ],
  'kiloliters': [
    { factor: 1000, toLabel: 'L' },
    { factor: 264.172, toLabel: 'gal' },
    { factor: 0.001, toLabel: 'ML' }
  ],
  'megaliters': [
    { factor: 1000, toLabel: 'kL' },
    { factor: 1e6, toLabel: 'L' },
    { factor: 264172, toLabel: 'gal' }
  ],
  'gigaliters': [
    { factor: 1000, toLabel: 'ML' },
    { factor: 1e9, toLabel: 'L' },
    { factor: 2.64172e8, toLabel: 'gal' }
  ],
  'teraliters': [
    { factor: 1000, toLabel: 'GL' },
    { factor: 1e12, toLabel: 'L' },
    { factor: 2.64172e11, toLabel: 'gal' }
  ],
  'petaliters': [
    { factor: 1000, toLabel: 'TL' },
    { factor: 1e15, toLabel: 'L' },
    { factor: 2.64172e14, toLabel: 'gal' }
  ],
  'exaliters': [
    { factor: 1000, toLabel: 'PL' },
    { factor: 1e18, toLabel: 'L' },
    { factor: 2.64172e17, toLabel: 'gal' }
  ],
  'zettaliters': [
    { factor: 1000, toLabel: 'EL' },
    { factor: 1e21, toLabel: 'L' },
    { factor: 2.64172e20, toLabel: 'gal' }
  ],
  'yottaliters': [
    { factor: 1000, toLabel: 'ZL' },
    { factor: 1e24, toLabel: 'L' },
    { factor: 2.64172e23, toLabel: 'gal' }
  ],
 
  // === TEMPERATURE ===
  'celsius': [
    // Note: Temperature uses custom convert functions, so we skip factor-based alts
  ],
  'fahrenheit': [
    // Note: Temperature uses custom convert functions
  ],

  // === SPEED ===
  'mph': [
    { factor: 1.60934, toLabel: 'km/h' },
    { factor: 1.46667, toLabel: 'ft/s' },
    { factor: 0.44704, toLabel: 'm/s' }
  ],
  'kmh': [
    { factor: 0.621371, toLabel: 'mph' },
    { factor: 0.277778, toLabel: 'm/s' },
    { factor: 0.911344, toLabel: 'ft/s' }
  ],
  'mps': [
    { factor: 3.28084, toLabel: 'ft/s' },
    { factor: 2.23694, toLabel: 'mph' },
    { factor: 3.6, toLabel: 'km/h' }
  ],
  'fps': [
    { factor: 0.3048, toLabel: 'm/s' },
    { factor: 0.681818, toLabel: 'mph' },
    { factor: 1.09728, toLabel: 'km/h' }
  ],
  
  // === PRESSURE ===
  'psi': [
    { factor: 6.89476, toLabel: 'kPa' },
    { factor: 0.00689476, toLabel: 'MPa' },
    { factor: 0.0689476, toLabel: 'bar' },
    { factor: 51.7149, toLabel: 'mmHg' }
  ],
  'pascals': [
    { factor: 0.000145038, toLabel: 'psi' },
    { factor: 0.001, toLabel: 'kPa' },
    { factor: 0.00001, toLabel: 'bar' },
    { factor: 0.0075006, toLabel: 'mmHg' }
  ],
  'hectopascals': [
    { factor: 0.0145038, toLabel: 'psi' },
    { factor: 0.1, toLabel: 'kPa' },
    { factor: 0.001, toLabel: 'bar' },
    { factor: 0.750062, toLabel: 'mmHg' }
  ],
  'kilopascals': [
    { factor: 0.145038, toLabel: 'psi' },
    { factor: 0.001, toLabel: 'MPa' },
    { factor: 0.01, toLabel: 'bar' },
    { factor: 7.50062, toLabel: 'mmHg' }
  ],
  'megapascals': [
    { factor: 145.038, toLabel: 'psi' },
    { factor: 1000, toLabel: 'kPa' },
    { factor: 10, toLabel: 'bar' },
    { factor: 7500.62, toLabel: 'mmHg' }
  ],
  'gigapascals': [
    { factor: 145038, toLabel: 'psi' },
    { factor: 1000, toLabel: 'MPa' },
    { factor: 10000, toLabel: 'bar' },
    { factor: 1000000, toLabel: 'kPa' }
  ],
  'terapascals': [
    { factor: 145038000, toLabel: 'psi' },
    { factor: 1000, toLabel: 'GPa' },
    { factor: 1000000, toLabel: 'MPa' },
    { factor: 10000000, toLabel: 'bar' }
  ],
  'petapascals': [
    { factor: 145038000000, toLabel: 'psi' },
    { factor: 1000, toLabel: 'TPa' },
    { factor: 1000000, toLabel: 'GPa' },
    { factor: 10000000000, toLabel: 'bar' }
  ],
  'exapascals': [
    { factor: 145038000000000, toLabel: 'psi' },
    { factor: 1000, toLabel: 'PPa' },
    { factor: 1000000, toLabel: 'TPa' },
    { factor: 1000000000, toLabel: 'GPa' }
  ],
  'zettapascals': [
    { factor: 145038000000000000, toLabel: 'psi' },
    { factor: 1000, toLabel: 'EPa' },
    { factor: 1000000, toLabel: 'PPa' },
    { factor: 1000000000, toLabel: 'TPa' }
  ],
  'yottapascals': [
    { factor: 145038000000000000000, toLabel: 'psi' },
    { factor: 1000, toLabel: 'ZPa' },
    { factor: 1000000, toLabel: 'EPa' },
    { factor: 1000000000, toLabel: 'PPa' }
  ],
  'bar': [
    { factor: 14.5038, toLabel: 'psi' },
    { factor: 100, toLabel: 'kPa' },
    { factor: 750.062, toLabel: 'mmHg' }
  ],
  
  // === ENERGY ===
  'joules': [
    { factor: 0.737562, toLabel: 'ft-lb' },
    { factor: 0.000947817, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'kJ' }
  ],
  'kilojoules': [
    { factor: 0.947817, toLabel: 'BTU' },
    { factor: 737.562, toLabel: 'ft-lb' },
    { factor: 1000, toLabel: 'J' }
  ],
  'megajoules': [
    { factor: 947.817, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'GJ' },
    { factor: 1000, toLabel: 'kJ' }
  ],
  'gigajoules': [
    { factor: 947817, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'TJ' },
    { factor: 1000, toLabel: 'MJ' }
  ],
  'terajoules': [
    { factor: 947817000, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'PJ' },
    { factor: 1000, toLabel: 'GJ' }
  ],
  'petajoules': [
    { factor: 947817000000, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'EJ' },
    { factor: 1000, toLabel: 'TJ' }
  ],
  'exajoules': [
    { factor: 9.47817e14, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'ZJ' },
    { factor: 1000, toLabel: 'PJ' }
  ],
  'zettajoules': [
    { factor: 9.47817e17, toLabel: 'BTU' },
    { factor: 0.001, toLabel: 'YJ' },
    { factor: 1000, toLabel: 'EJ' }
  ],
  'yottajoules': [
    { factor: 9.47817e20, toLabel: 'BTU' },
    { factor: 1000, toLabel: 'ZJ' },
    { factor: 1000000, toLabel: 'EJ' }
  ],
  'btu': [
    { factor: 1.05506, toLabel: 'kJ' },
    { factor: 1055.06, toLabel: 'J' },
    { factor: 778.169, toLabel: 'ft-lb' }
  ],
  'footpounds': [
    { factor: 1.35582, toLabel: 'J' },
    { factor: 0.00135582, toLabel: 'kJ' },
    { factor: 0.001285, toLabel: 'BTU' }
  ],
  
  // === POWER ===
  'watts': [
    { factor: 0.00134102, toLabel: 'hp' },
    { factor: 0.001, toLabel: 'kW' },
    { factor: 3.41214, toLabel: 'BTU/h' }
  ],
  'kilowatts': [
    { factor: 1.34102, toLabel: 'hp' },
    { factor: 1000, toLabel: 'W' },
    { factor: 3412.14, toLabel: 'BTU/h' }
  ],
  'megawatts': [
    { factor: 1341.02, toLabel: 'hp' },
    { factor: 1000, toLabel: 'kW' },
    { factor: 1000000, toLabel: 'W' }
  ],
  'horsepower': [
    { factor: 745.7, toLabel: 'W' },
    { factor: 0.7457, toLabel: 'kW' },
    { factor: 2544.43, toLabel: 'BTU/h' }
  ],
  
  // === FORCE ===
  'newtons': [
    { factor: 0.224809, toLabel: 'lbf' },
    { factor: 0.001, toLabel: 'kN' },
    { factor: 101.972, toLabel: 'gf' }
  ],
  'poundforce': [
    { factor: 4.44822, toLabel: 'N' },
    { factor: 0.00444822, toLabel: 'kN' },
    { factor: 453.592, toLabel: 'gf' }
  ]
};

// Get alternatives for a unit, automatically skipping the primary conversion
function getSmartAlternatives(unitName, primaryLabel, originalValue) {
  const alts = UNIT_ALTERNATIVES[unitName];
  if (!alts) return [];
  
  const result = [];
  for (const alt of alts) {
    // Skip if this is the same as the primary conversion
    if (alt.toLabel === primaryLabel) continue;
    
    const converted = originalValue * alt.factor;
    result.push({
      value: formatNumber(converted),
      label: alt.toLabel,
      display: `${formatNumber(converted)} ${alt.toLabel}`
    });
  }
  return result;
}

// State
let autoConvert = false;
let direction = 'metric-to-imperial';
let observer = null;
let selectionPopup = null;
let conversionCount = 0;
let settings = {
  precision: 4,
  numberGrouping: true,
  scientificNotation: true,
  rounding: 'round',
  badgeStyle: 'badge',
  showTooltip: true,
  showSelectionPopup: true,
  siteRuleMode: 'all',
  siteRules: '',
  scanMode: 'full',
  maxConversions: 100
};

// Initialize
init();

async function init() {
  // Get settings
  try {
    const stored = await chrome.storage.sync.get([
      'autoConvert', 'direction', 
      'precision', 'numberGrouping', 'scientificNotation', 'rounding', 'badgeStyle',
      'showTooltip', 'showSelectionPopup', 'siteRuleMode', 'siteRules', 'scanMode', 'maxConversions'
    ]);
    autoConvert = stored.autoConvert || false;
    direction = stored.direction || 'metric-to-imperial';
    if (stored.precision !== undefined) settings.precision = stored.precision;
    if (stored.numberGrouping !== undefined) settings.numberGrouping = stored.numberGrouping;
    if (stored.scientificNotation !== undefined) settings.scientificNotation = stored.scientificNotation;
    if (stored.rounding !== undefined) settings.rounding = stored.rounding;
    if (stored.badgeStyle !== undefined) settings.badgeStyle = stored.badgeStyle;
    if (stored.showTooltip !== undefined) settings.showTooltip = stored.showTooltip;
    if (stored.showSelectionPopup !== undefined) settings.showSelectionPopup = stored.showSelectionPopup;
    if (stored.siteRuleMode !== undefined) settings.siteRuleMode = stored.siteRuleMode;
    if (stored.siteRules !== undefined) settings.siteRules = stored.siteRules;
    if (stored.scanMode !== undefined) settings.scanMode = stored.scanMode;
    if (stored.maxConversions !== undefined) settings.maxConversions = stored.maxConversions;
  } catch (e) {
    // Use defaults
  }
  
  // Check site rules before proceeding
  if (!isSiteAllowed()) {
    return; // Don't run on this site
  }
  
  // Delayed initial scan if auto-convert is enabled (and not on-demand mode)
  if (autoConvert && settings.scanMode !== 'ondemand') {
    setTimeout(() => {
      scanPage();
      startObserver();
    }, 500);
  }
  
  // Setup selection listener for floating popup (if enabled)
  if (settings.showSelectionPopup) {
    setupSelectionListener();
  }
}

// Check if current site is allowed based on site rules
function isSiteAllowed() {
  const mode = settings.siteRuleMode;
  if (mode === 'all') return true;
  
  const rules = settings.siteRules.split('\n').map(r => r.trim().toLowerCase()).filter(r => r);
  if (rules.length === 0) return mode === 'denylist'; // No rules = allow for denylist, deny for allowlist
  
  const currentHost = window.location.hostname.toLowerCase();
  
  const matchesSomeRule = rules.some(rule => {
    // Handle wildcard patterns
    if (rule.startsWith('*.')) {
      const domain = rule.substring(2);
      return currentHost === domain || currentHost.endsWith('.' + domain);
    }
    return currentHost === rule || currentHost.endsWith('.' + rule);
  });
  
  return mode === 'allowlist' ? matchesSomeRule : !matchesSomeRule;
}

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'UPDATE_SETTINGS':
      handleSettingsUpdate(message);
      break;
    case 'CONVERT_PAGE':
      // One-time conversion (works even if auto-convert is off)
      direction = message.direction || direction;
      scanPage();
      break;
    case 'CLEAR_BADGES':
      removeBadges();
      break;
    case 'CONVERT_SELECTION':
      // From context menu
      convertAndShowPopup(message.text, message.direction);
      break;
  }
});

function handleSettingsUpdate(message) {
  const wasEnabled = autoConvert;
  autoConvert = message.autoConvert;
  direction = message.direction;
  
  if (autoConvert && !wasEnabled) {
    // Just turned on
    scanPage();
    startObserver();
  } else if (!autoConvert && wasEnabled) {
    // Just turned off
    stopObserver();
    removeBadges();
  } else if (autoConvert) {
    // Direction changed while enabled - rescan
    removeBadges();
    scanPage();
  }
}

// ===== SELECTION POPUP FEATURE =====

function setupSelectionListener() {
  let selectionTimeout = null;
  
  document.addEventListener('mouseup', (e) => {
    // Don't trigger on our own popup
    if (e.target.closest(`.${POPUP_CLASS}`)) return;
    
    // Clear any pending timeout
    clearTimeout(selectionTimeout);
    
    // Small delay to ensure selection is complete
    selectionTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText.length > 0 && selectedText.length < 100) {
        // Check if there's a convertible unit in the selection
        const conversions = findConversions(selectedText);
        
        if (conversions.length > 0) {
          showSelectionPopup(conversions, e.clientX, e.clientY);
        } else {
          hideSelectionPopup();
        }
      } else {
        hideSelectionPopup();
      }
    }, 200);
  });
  
  // Hide popup on scroll or click elsewhere
  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest(`.${POPUP_CLASS}`)) {
      hideSelectionPopup();
    }
  });
  
  document.addEventListener('scroll', hideSelectionPopup, true);
}

function findConversions(text) {
  const results = [];
  
  // Only check current direction setting
  const patterns = UNIT_PATTERNS[direction];
    
    for (const [unitName, config] of Object.entries(patterns)) {
      config.regex.lastIndex = 0;
      let match;
      
      while ((match = config.regex.exec(text)) !== null) {
        const numStr = match[1].replace(/,/g, '');
        const value = parseFloat(numStr);
        
        if (isNaN(value)) continue;
        
        let converted;
        if (config.convert) {
          converted = config.convert(value);
        } else {
          converted = value * config.factor;
        }
        
        results.push({
          original: match[0],
          converted: formatNumber(converted),
          toLabel: config.toLabel,
          direction: direction
        });
      }
    }
  
  return results;
}

function showSelectionPopup(conversions, x, y) {
  hideSelectionPopup();
  
  selectionPopup = document.createElement('div');
  selectionPopup.className = POPUP_CLASS;
  
  let html = '<div class="itom-popup-header">Conversions</div>';
  html += '<div class="itom-popup-content">';
  
  conversions.forEach(c => {
    const dirLabel = c.direction === 'imperial-to-metric' ? 'Metric' : 'Imperial';
    html += `<div class="itom-popup-row">
      <span class="itom-popup-original">${escapeHtml(c.original)}</span>
      <span class="itom-popup-arrow">=</span>
      <span class="itom-popup-result">${c.converted} ${c.toLabel}</span>
    </div>`;
  });
  
  html += '</div>';
  selectionPopup.innerHTML = html;
  
  document.body.appendChild(selectionPopup);
  
  // Position popup near cursor but keep in viewport
  const rect = selectionPopup.getBoundingClientRect();
  let left = x + 10;
  let top = y + 10;
  
  if (left + rect.width > window.innerWidth) {
    left = window.innerWidth - rect.width - 10;
  }
  if (top + rect.height > window.innerHeight) {
    top = y - rect.height - 10;
  }
  
  selectionPopup.style.left = `${left}px`;
  selectionPopup.style.top = `${top}px`;
  
  // Auto-hide after 5 seconds
  setTimeout(hideSelectionPopup, 5000);
}

function hideSelectionPopup() {
  if (selectionPopup && selectionPopup.parentNode) {
    selectionPopup.parentNode.removeChild(selectionPopup);
  }
  selectionPopup = null;
}

// Handle context menu conversion
function convertAndShowPopup(text, dir) {
  const patterns = UNIT_PATTERNS[dir];
  const conversions = [];
  
  for (const [unitName, config] of Object.entries(patterns)) {
    config.regex.lastIndex = 0;
    let match;
    
    while ((match = config.regex.exec(text)) !== null) {
      const numStr = match[1].replace(/,/g, '');
      const value = parseFloat(numStr);
      
      if (isNaN(value)) continue;
      
      let converted;
      if (config.convert) {
        converted = config.convert(value);
      } else {
        converted = value * config.factor;
      }
      
      conversions.push({
        original: match[0],
        converted: formatNumber(converted),
        toLabel: config.toLabel,
        direction: dir
      });
    }
  }
  
  if (conversions.length > 0) {
    // Get selection position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      showSelectionPopup(conversions, rect.right, rect.bottom);
    }
  }
}

// ===== AUTO-CONVERT FEATURES =====

// MutationObserver for dynamic content
function startObserver() {
  if (observer) return;
  
  observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && 
              !node.classList?.contains(PROCESSED_CLASS) &&
              !node.classList?.contains('itom-badge') &&
              !node.classList?.contains(POPUP_CLASS)) {
            shouldScan = true;
            break;
          }
        }
      }
      if (shouldScan) break;
    }
    
    if (shouldScan && autoConvert) {
      // Debounce to avoid excessive scanning
      clearTimeout(observer.debounceTimer);
      observer.debounceTimer = setTimeout(() => scanPage(), 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function scanPage() {
  const patterns = UNIT_PATTERNS[direction];
  if (!patterns) return;
  
  // Reset conversion count for this scan
  conversionCount = 0;
  
  // Use TreeWalker for efficient DOM traversal
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Check max conversions limit
        if (conversionCount >= settings.maxConversions) return NodeFilter.FILTER_REJECT;
        
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        // Skip standard elements
        if (SKIP_TAGS.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        
        // Skip already processed
        if (parent.closest(`.${PROCESSED_CLASS}`)) return NodeFilter.FILTER_REJECT;
        if (parent.classList.contains('itom-badge')) return NodeFilter.FILTER_REJECT;
        
        // Skip our popup
        if (parent.closest(`.${POPUP_CLASS}`)) return NodeFilter.FILTER_REJECT;
        
        // Skip contenteditable areas (editors)
        if (parent.closest('[contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
        
        // Visible-only mode: check if element is in viewport
        if (settings.scanMode === 'visible') {
          const rect = parent.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight && rect.bottom > 0 &&
                            rect.left < window.innerWidth && rect.right > 0;
          if (!inViewport) return NodeFilter.FILTER_REJECT;
        }
        
        // Only process nodes with actual text
        if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const nodesToProcess = [];
  let node;
  while (node = walker.nextNode()) {
    if (conversionCount >= settings.maxConversions) break;
    nodesToProcess.push(node);
  }
  
  // Process nodes
  nodesToProcess.forEach(textNode => {
    if (conversionCount < settings.maxConversions) {
      processTextNode(textNode, patterns);
    }
  });
}

function processTextNode(textNode, patterns) {
  let text = textNode.textContent;
  let hasMatch = false;
  const replacements = [];
  
  // Special handling for units with superscripts: "330,000 m" + <sup>3</sup> or <sup>2</sup>
  // Check if text ends with a number + unit and next sibling is superscript 2 or 3
  const superscriptUnitMatch = text.match(/\b(\d[\d,.]*)[\s]*([a-zA-Z]+)\s*$/i);
  let superscriptHandled = false;
  if (superscriptUnitMatch) {
    const nextSibling = textNode.nextSibling;
    if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE && !nextSibling.hasAttribute('data-itom-processed')) {
      const tagName = nextSibling.tagName?.toLowerCase();
      const siblingText = nextSibling.textContent?.trim();
      if ((tagName === 'sup' || tagName === 'span') && (siblingText === '2' || siblingText === '²' || siblingText === '3' || siblingText === '³')) {
        // Combine unit with superscript
        const baseUnit = superscriptUnitMatch[2];
        const superNum = (siblingText === '2' || siblingText === '²') ? '²' : '³';
        const fullUnit = baseUnit + superNum; // e.g., "m³", "km²"
        
        // Try to find matching pattern in current direction only
        let unitConfig = null;
        let unitName = null;
        const testStr = '1 ' + fullUnit;
        
        for (const [name, config] of Object.entries(patterns)) {
          config.regex.lastIndex = 0;
          const match = config.regex.exec(testStr);
          if (match) {
            unitConfig = config;
            unitName = name;
            break;
          }
        }
        
        if (unitConfig) {
          const value = parseFloat(superscriptUnitMatch[1].replace(/,/g, ''));
          if (!isNaN(value)) {
            const converted = unitConfig.convert ? unitConfig.convert(value) : value * unitConfig.factor;
            const formatted = formatNumber(converted);
            const badgeText = `${formatted} ${unitConfig.toLabel}`;
            const tooltip = `${superscriptUnitMatch[1]} ${fullUnit} = ${badgeText}`;
            
            // Calculate alternative conversions using smart alternatives
            const alternatives = [];
            alternatives.push({ value: formatted, label: unitConfig.toLabel, display: `${formatted} ${unitConfig.toLabel}` });
            
            const smartAlts = getSmartAlternatives(unitName, unitConfig.toLabel, value);
            for (const alt of smartAlts) {
              alternatives.push(alt);
            }
            
            // Create and insert badge directly after the superscript
            const badge = document.createElement('span');
            badge.className = 'itom-badge' + (alternatives.length > 1 ? ' itom-clickable' : '');
            badge.textContent = badgeText;
            badge.title = tooltip;
            
            // Store alternatives as data for dropdown (skip primary at index 0)
            if (alternatives.length > 1) {
              badge.dataset.alternatives = JSON.stringify(alternatives.slice(1));
              badge.dataset.original = `${superscriptUnitMatch[1]} ${fullUnit}`;
            }
            
            // Insert a space before the badge
            const space = document.createTextNode(' ');
            nextSibling.parentNode.insertBefore(space, nextSibling.nextSibling);
            // Insert badge after the space
            nextSibling.parentNode.insertBefore(badge, space.nextSibling);
            
            // Mark the superscript as processed (use data attribute to preserve styling)
            nextSibling.setAttribute('data-itom-processed', 'true');
            
            hasMatch = true;
            superscriptHandled = true;
            conversionCount++;
          }
        }
      }
    }
  }
  
  // Special handling for linked units: "120,000 " + <a>any unit</a>
  // Check if text ends with a number and next sibling is a link containing ANY unit
  const linkedUnitMatch = text.match(/\b(\d[\d,.]*)\s*$/);
  if (linkedUnitMatch && !superscriptHandled) {
    const nextSibling = textNode.nextSibling;
    if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE && nextSibling.tagName?.toLowerCase() === 'a') {
      const linkText = nextSibling.textContent?.trim();
      if (linkText && !nextSibling.hasAttribute('data-itom-processed')) {
        
        // Try to match link text against unit patterns in current direction only
        let unitConfig = null;
        let unitName = null;
        
        // Check current direction only
        for (const [name, config] of Object.entries(patterns)) {
          // Create a test string with a fake number prefix
          const testStr = '1 ' + linkText;
          config.regex.lastIndex = 0;
          const match = config.regex.exec(testStr);
          if (match) {
            unitConfig = config;
            unitName = name;
            break;
          }
        }
        
        if (unitConfig) {
          const value = parseFloat(linkedUnitMatch[1].replace(/,/g, ''));
          if (!isNaN(value)) {
            const converted = unitConfig.convert ? unitConfig.convert(value) : value * unitConfig.factor;
            const formatted = formatNumber(converted);
            const badgeText = `${formatted} ${unitConfig.toLabel}`;
            const tooltip = `${linkedUnitMatch[1]} ${linkText} = ${badgeText}`;
            
            // Calculate alternative conversions using smart alternatives
            const alternatives = [];
            alternatives.push({ value: formatted, label: unitConfig.toLabel, display: `${formatted} ${unitConfig.toLabel}` });
            
            const smartAlts = getSmartAlternatives(unitName, unitConfig.toLabel, value);
            for (const alt of smartAlts) {
              alternatives.push(alt);
            }
            
            // Create and insert badge after the link
            const badge = document.createElement('span');
            badge.className = 'itom-badge' + (alternatives.length > 1 ? ' itom-clickable' : '');
            badge.textContent = badgeText;
            badge.title = tooltip;
            
            // Store alternatives as data for dropdown (skip primary at index 0)
            if (alternatives.length > 1) {
              badge.dataset.alternatives = JSON.stringify(alternatives.slice(1));
              badge.dataset.original = `${linkedUnitMatch[1]} ${linkText}`;
            }
            
            // Insert a space before the badge
            const space = document.createTextNode(' ');
            nextSibling.parentNode.insertBefore(space, nextSibling.nextSibling);
            // Insert badge after the space
            nextSibling.parentNode.insertBefore(badge, space.nextSibling);
            
            // Mark the link as processed
            nextSibling.setAttribute('data-itom-processed', 'true');
            
            hasMatch = true;
            conversionCount++;
          }
        }
      }
    }
  }
  
  for (const [unitName, config] of Object.entries(patterns).sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0))) {
    // Reset regex
    config.regex.lastIndex = 0;
    let match;
    
    while ((match = config.regex.exec(text)) !== null) {
      hasMatch = true;
      
      // Special check for 'meters' - skip if next sibling is <sup>3</sup> (Wikipedia-style cubic meters)
      if (unitName === 'meters') {
        const matchEnd = match.index + match[0].length;
        if (matchEnd === text.length) {
          // Match ends at text node boundary - check next sibling
          const nextSibling = textNode.nextSibling;
          if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE) {
            const tagName = nextSibling.tagName?.toLowerCase();
            const siblingText = nextSibling.textContent?.trim();
            if ((tagName === 'sup' || tagName === 'span') && (siblingText === '3' || siblingText === '³')) {
              // This is actually cubic meters, skip this match
              continue;
            }
          }
        }
      }
      
      // Parse number(s) - handle commas and multiCapture
      let value, value2;
      if (config.multiCapture) {
        // Multi-capture pattern (e.g., feet and inches)
        value = parseFloat(match[1].replace(/,/g, ''));
        value2 = parseFloat(match[2].replace(/,/g, ''));
        if (isNaN(value) || isNaN(value2)) continue;
      } else {
        const numStr = match[1].replace(/,/g, '');
        value = parseFloat(numStr);
        if (isNaN(value)) continue;
      }
      
      // Calculate primary conversion
      let converted;
      if (config.convert) {
        converted = config.multiCapture ? config.convert(value, value2) : config.convert(value);
      } else {
        converted = value * config.factor;
      }
      
      // Format result
      const formatted = formatNumber(converted);
      
      // Calculate alternative conversions if available
      const alternatives = [];
      
      // Special handling for multiCapture patterns (e.g., feet+inches)
      if (config.multiCapture && unitName === 'feetinches') {
        // Option 1: Combined in cm
        alternatives.push({
          value: formatted,
          label: 'cm',
          display: `${formatted} cm`
        });
        // Option 2: Combined in m
        const inMeters = formatNumber(converted / 100);
        alternatives.push({
          value: inMeters,
          label: 'm',
          display: `${inMeters} m`
        });
        // Option 3: Separate conversions (ft→m, in→cm)
        const ftToM = formatNumber(value * 0.3048);
        const inToCm = formatNumber(value2 * 2.54);
        alternatives.push({
          value: `${ftToM} m + ${inToCm} cm`,
          label: 'separate',
          display: `${ftToM} m + ${inToCm} cm`
        });
      } else {
        // Add primary conversion first
        alternatives.push({
          value: formatted,
          label: config.toLabel,
          display: `${formatted} ${config.toLabel}`
        });
        
        // Get smart alternatives for this unit (auto-skips primary conversion)
        const smartAlts = getSmartAlternatives(unitName, config.toLabel, value);
        for (const alt of smartAlts) {
          alternatives.push(alt);
        }
      }
      
      // Use first alternative as badge if available, otherwise use primary conversion
      const badgeText = alternatives.length > 0 
        ? `${alternatives[0].value} ${alternatives[0].label}`
        : `${formatted} ${config.toLabel}`;
      
      // Build tooltip with all options
      let tooltip = `${match[0]} = ${badgeText}`;
      if (alternatives.length > 1) {
        tooltip += ' | Click for: ' + alternatives.slice(1).map(a => a.display).join(', ');
      }
      
      replacements.push({
        original: match[0],
        originalValue: match[1],
        numericValue: value,
        unitName: unitName,
        badge: badgeText,
        tooltip: tooltip,
        alternatives: alternatives,
        hasAlternatives: alternatives.length > 1,
        index: match.index
      });
    }
  }
  
  if (!hasMatch) return;
  
  // Create wrapper with badges
  const wrapper = document.createElement('span');
  wrapper.className = PROCESSED_CLASS;
  
  let lastIndex = 0;
  let html = '';
  
  // Sort replacements by index
  replacements.sort((a, b) => a.index - b.index);
  
  // De-duplicate overlapping matches
  const uniqueReplacements = [];
  let lastEnd = 0;
  for (const r of replacements) {
    if (r.index >= lastEnd) {
      uniqueReplacements.push(r);
      lastEnd = r.index + r.original.length;
    }
  }
  
  for (const r of uniqueReplacements) {
    // Escape HTML
    const before = escapeHtml(text.substring(lastIndex, r.index));
    const original = escapeHtml(r.original);
    const tooltip = escapeHtml(r.tooltip);
    
    html += before;
    
    // Increment conversion count
    conversionCount++;
    
    const titleAttr = settings.showTooltip ? `title="${tooltip}"` : '';
    const clickableClass = r.hasAlternatives ? ' itom-clickable' : '';
    // Only store non-primary alternatives (skip index 0 which is the primary)
    const altData = r.hasAlternatives ? ` data-alternatives='${JSON.stringify(r.alternatives.slice(1))}' data-value="${r.numericValue}" data-unit="${r.unitName}"` : '';
    
    if (settings.badgeStyle === 'inline') {
      // Overwrite mode: replace original with converted value
      html += `<span class="itom-unit itom-inline${clickableClass}" ${titleAttr}${altData}>${r.badge}</span>`;
    } else {
      // Badge mode: show original with superscript badge
      html += `<span class="itom-unit">${original}<sup class="itom-badge${clickableClass}" ${titleAttr}${altData}>${r.badge}</sup></span>`;
    }
    
    lastIndex = r.index + r.original.length;
  }
  
  html += escapeHtml(text.substring(lastIndex));
  
  wrapper.innerHTML = html;
  textNode.parentNode.replaceChild(wrapper, textNode);
}

function removeBadges() {
  // Stop observer during removal
  const wasObserving = observer !== null;
  stopObserver();
  
  // Remove standalone badges (created by superscript/link handlers, not inside .itom-unit)
  const standaloneBadges = document.querySelectorAll('.itom-badge:not(.itom-unit .itom-badge)');
  standaloneBadges.forEach(badge => {
    // Remove the preceding space text node if it exists
    const prev = badge.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent.trim() === '') {
      prev.remove();
    }
    badge.remove();
  });
  
  // Reset data-itom-processed attributes on elements (superscript elements etc.)
  const processedElements = document.querySelectorAll('[data-itom-processed]');
  processedElements.forEach(el => {
    el.removeAttribute('data-itom-processed');
  });
  
  // Remove badges inside processed wrappers
  const processed = document.querySelectorAll(`.${PROCESSED_CLASS}`);
  processed.forEach(el => {
    // Get original text (without badges)
    const units = el.querySelectorAll('.itom-unit');
    units.forEach(unit => {
      const badge = unit.querySelector('.itom-badge');
      if (badge) badge.remove();
      
      // Unwrap the span
      const text = unit.textContent;
      unit.replaceWith(text);
    });
    
    // Unwrap the processed wrapper
    const text = el.textContent;
    el.replaceWith(text);
  });
  
  // Restart observer if it was running
  if (wasObserving && autoConvert) {
    startObserver();
  }
}

// ===== UTILITIES =====

function formatNumber(value) {
  const decimals = settings.precision;
  const multiplier = Math.pow(10, decimals);
  
  // Apply rounding mode
  let rounded;
  switch (settings.rounding) {
    case 'floor':
      rounded = Math.floor(value * multiplier) / multiplier;
      break;
    case 'ceiling':
      rounded = Math.ceil(value * multiplier) / multiplier;
      break;
    default:
      rounded = Math.round(value * multiplier) / multiplier;
  }
  
  // Scientific notation for very small/large numbers
  if (settings.scientificNotation && rounded !== 0 && (Math.abs(rounded) < 0.0001 || Math.abs(rounded) > 999999999)) {
    return rounded.toExponential(decimals);
  }
  
  if (settings.numberGrouping) {
    return rounded.toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0
    });
  } else {
    return String(rounded);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== DROPDOWN MENU FOR ALTERNATIVES =====

let activeDropdown = null;

function setupBadgeClickHandler() {
  document.addEventListener('click', (e) => {
    const badge = e.target.closest('.itom-clickable');
    
    // Hide any existing dropdown if clicking elsewhere
    if (!badge && !e.target.closest(`.${DROPDOWN_CLASS}`)) {
      hideDropdown();
      return;
    }
    
    if (badge && badge.dataset.alternatives) {
      e.preventDefault();
      e.stopPropagation();
      showDropdown(badge);
    }
  });
}

function showDropdown(badge) {
  hideDropdown();
  
  const alternatives = JSON.parse(badge.dataset.alternatives);
  if (!alternatives || alternatives.length === 0) return;
  
  const dropdown = document.createElement('div');
  dropdown.className = DROPDOWN_CLASS;
  
  dropdown.innerHTML = `
    <div class="itom-dropdown-header">Select Conversion</div>
    <div class="itom-dropdown-options">
      ${alternatives.map((alt, i) => `
        <div class="itom-dropdown-option" data-index="${i}">
          <span class="itom-dropdown-value">${alt.value}</span>
          <span class="itom-dropdown-label">${alt.label}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Position near badge
  const rect = badge.getBoundingClientRect();
  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 5;
  
  // Keep in viewport
  const dropRect = dropdown.getBoundingClientRect();
  if (left + dropRect.width > window.innerWidth) {
    left = window.innerWidth - dropRect.width - 10;
  }
  if (top + dropRect.height > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - dropRect.height - 5;
  }
  
  dropdown.style.left = `${left}px`;
  dropdown.style.top = `${top}px`;
  
  // Handle option clicks
  dropdown.querySelectorAll('.itom-dropdown-option').forEach(option => {
    option.addEventListener('click', () => {
      const idx = parseInt(option.dataset.index);
      const selected = alternatives[idx];
      
      // Get the current badge value before changing it
      const currentText = badge.textContent.trim();
      const currentParts = currentText.split(' ');
      const currentValue = currentParts.slice(0, -1).join(' ');
      const currentLabel = currentParts[currentParts.length - 1];
      const currentAlt = { value: currentValue, label: currentLabel, display: currentText };
      
      // Update badge to selected value
      badge.textContent = `${selected.value} ${selected.label}`;
      
      // Swap: remove selected from alternatives, add current
      alternatives.splice(idx, 1, currentAlt);
      
      // Update data-alternatives
      badge.dataset.alternatives = JSON.stringify(alternatives);
      
      hideDropdown();
    });
  });
  
  activeDropdown = dropdown;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (activeDropdown === dropdown) {
      hideDropdown();
    }
  }, 5000);
}

function hideDropdown() {
  if (activeDropdown && activeDropdown.parentNode) {
    activeDropdown.parentNode.removeChild(activeDropdown);
  }
  activeDropdown = null;
}

// Initialize click handler
setupBadgeClickHandler();

