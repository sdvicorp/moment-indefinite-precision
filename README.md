# moment-indefinite-precision

This is a plugin for the <a href="http://momentjs.com/">moment.js</a> JavaScript library, to display durations more precisely than .humanize does, and still in a human-readable format.

Moment contains some support for formatting durations, however it performs a lot of 'rounding' on the result and yields only an approximate description. This is often great for readability, giving the user a sense of roughly when an event occurred or roughly how long a process took.  This does not work so well if one needs to accurately display the running time of a process, or say, the duration of a movie clip.

In the example below the is 3 days, 6 hours, 12 minutes and 15 seconds exactly, however this is simplified to just '3 days' by the humanize.

    var runTime = moment.duration({days: 3, hours: 6, minutes: 12, seconds: 15});
    runTime.humanize(); // "3 days"

Using the indefinite-precision plugin, a humanized version of the duration can be displayed and still retain (some) precision:

    var runTime = moment.duration({days: 3, hours: 6, minutes: 12, seconds: 15});
    runTime.indefinitePrecision(); // "3 days 6 hours 12 minutes 15 seconds"
    runTime.indefinitePrecision('short'); // "3d 6h 12m 15s"

To obtain the full set of numeric values as an object instead of a string, pass the value `true` to the method:

    runTime.indefinitePrecision(true); // {years: 0, months: 0, days: 3, hours: 6, minutes: 12: seconds: 15}

To obtain only the non-zero values as an object instead of a string, pass the value `false` to the method:

    runTime.indefinitePrecision(false); // {days: 3, hours: 6, minutes: 12: seconds: 15}

Note that the indefinite-precision plugin will redistribute input units to the highest possible units for output. For example:

    var tour = moment.duration(300000, 'seconds');
    tour.humanize(); // '3 days'
    tour.indefinitePrecision(false); // {days: 3, hours: 11, minutes: 20}
    tour.indefinitePrecision(); // "3 days 11 hours 20 minutes"
    tour.indefinitePrecision('short') // "3d 11h 20m"

Note also that the plugin will remove all units with a zero value before processing the output.  For example:

    moment.duration(7903240, 'seconds').indefinitePrecision();
    // "3 months 11 hours 20 minutes 40 seconds"

## Installation
**Node.js**

`npm install moment-indefinite-precision`
-- or --
`yarn add moment-indefinite-precision`

**Bower**

`bower install moment-indefinite-precision`

## Usage

### HTML/Browser

To use the plugin in a web page, add a `<script>` tag referencing the moment-indefinite-precision.js file, ensuring that the it is included after including the moment.js library first:

    <script src="/scripts/moment.js"></script>
    <script src="/scripts/moment-indefinite-precision.js"></script>

### Module

To use the plugin as a module, add the following `require` statement into your code:

    require('moment-indefinite-precision-plugin');

The plugin does not export anything, so there is no need to assign the require output to a variable.

The plugin  depends on `moment.js`, which is specified as a package dependency.

### Basics

The duration `indefinitePrecision` function can format any moment duration. If no parameters are provided, the default will generate a string based on the duration's values using the 'long' format. Parameter values are as follows:

* 'long' - display string output using long format ('4 months 2 days 5 hours 15 minutes')
* 'short' - display string output using single characters appended to the value ('4M 2d 5h 15m')
* false - object with zero values removed ({months: 4, days: 2, hours: 5, minutes: 15})
* true - object with zero values injected ({years: 0, months: 4, days: 2, hours: 5, minutes: 15, seconds: 0})

If the duration is zero indefinitePrecision will immediately return `null` without processing. This leaves the decision on how to handle a zero duration up to the client application.  For example, a zero duration could be invalid, indicate an indefinite or infinite duration.

    moment.duration(0).indefinitePrecision(); // null

### Precision
A precision object can be passed as the second parameter to change the default precision.  Here is the default precision object and what it means - to change the precision pass in a replacement set of properties.

```
{
  years:           5, // zero hours if year >= n
  months:          6, // zero minutes if month >= n
  days:            1, // zero seconds if day >= n
  minutes:         5, // zero milliseconds if minute >= n
}
```
The indefinite-precision plugin always eliminates zero values from the output.  The precision values will zero additional least-significant units based on the magnitude of more significant units.  For example, with the default values shown above milliseconds will be removed (zeroed-out) if the duration is 3 minutes or longer.

### Milliseconds
Milliseconds are included as a fractional part of seconds if milliseconds are non-zero.  This means that when passing `true` or `false` as the format parameter to return an object instead of a string the seconds property may be a "real" number.  All other unit values will always be whole numbers.
