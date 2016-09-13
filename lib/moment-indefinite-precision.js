/*! Moment Indefinite Precision v0.3.0
 * https://github.com/sdvi/moment-indefinite-precision
 * Date: 2016-06-09
 *
 * Duration plugin for the Moment.js library
 * http://momentjs.com/
 *
 * Copyright 2016 SDVI
 * Released under the MIT license
 */

(function (root) {
    'use strict';

    // internal moment reference...
    var moment;
    if (typeof require === "function") {
        try { moment = require('moment'); }
        catch (err) {}
    }
    if (!moment && root.moment) {
        moment = root.moment;
    }
    if (!moment) {
        throw "Moment Indefinite Precision cannot find Moment.js";
    }

    var SHORT = {
        years: 'y',
        months: 'M',
        days: 'd',
        hours: 'h',
        minutes: 'm',
        seconds: 's',
        plural: '',
    };

    var LONG = {
        years: ' year',
        months: ' month',
        days: ' day',
        hours: ' hour',
        minutes: ' minute',
        seconds: ' second',
        plural: 's',
    };

    var DEFAULT_CUTOFFS = {
        years:           5, // zero hours if year >= n
        months:          6, // zero minutes if month >= n
        days:            1, // zero seconds if day >= n
        minutes:         3, // zero milliseconds if minute >= n
    };

    // ****
    // moment.duration.indefinitePrecision([format], cutoffs)
    moment.duration.fn.indefinitePrecision = function (format, cutoffs) {
        // First we'll implement a naive solution and improve it later...
        var cut = cutoffs || DEFAULT_CUTOFFS;

        // Early exit for a zero duration
        if (this.asMilliseconds() === 0) { return null; }

        // First get all the possible units
        var units = {
            years:         this.years(),
            months:        this.months(),
            days:          this.days(),
            hours:         this.hours(),
            minutes:       this.minutes(),
            seconds:       this.seconds() + (this.milliseconds() / 1000)
        };

        //To make all response formats consistent, we'll zero-out values we don't want now.
        if (units.years >= cut.years) {
            units.days = units.days + Math.round(units.hours / 24);
            units.hours = units.minutes = units.seconds = 0;
        } else if (units.years > 0 || units.months >= cut.months) {
            units.hours = units.hours + Math.round(units.minutes / 60);
            units.minutes = units.seconds = 0;
        } else if (units.months > 0 || units.days >= cut.days) {
            units.minutes = units.minutes + Math.round(units.seconds / 60);
            units.seconds = 0;
        } else if (units.hours > 0 || units.minutes >= cut.minutes) {
            units.seconds = Math.round(units.seconds);
        }
        if (format === true) { return units; }

        // Delete zero values now - all other options don't need them
        Object.keys(units).forEach(function (key) {
            if (units[key] === 0) { delete units[key]; }
        });
        if (format === false) { return units; }

        // Would like to point this to moments internal string values for units
        // that way we could automatically get different languages supported.
        var strings = format === 'short' ? SHORT : LONG;

        var buffer = [];
        Object.keys(units).forEach(function (key) {
            if (units[key]) {
                buffer.push(units[key].toString() + strings[key] + (units[key] !== 1 ? strings.plural : ''));
            }
        });
        return buffer.join(' ');
    };

    // ****
    // moment.indefiniteFromHuman(humanString)
    moment.duration.indefiniteFromHuman = function (humanString) {
        var durationProperties = {};
        var search = /(\d+)[\s,]*([a-zA-Z]+)/g;
        var matches;
        // jshint -W084
        while (matches = search.exec(humanString)) {
            durationProperties[matches[2]] = matches[1];
        }
        // Now we should have an object formatted like this:
        // {day: 1, hours: 6, minutes: 45}
        console.log('indefiniteFromHuman durationProperties:', durationProperties);
        if (durationProperties.length === 0) { return null; }
        return this(durationProperties);
    };

})(this);
