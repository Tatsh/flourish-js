/**
 * Provides date support functions.
 * Copyright (c) 2012 StonerAries.
 * Copyright (c) 2012 Andrew Udvare.
 * License: http://www.opensource.org/licenses/mit-license.php
 * @constructor
 */
var fDate = function (date) {
  /**
   * @type number|boolean
   * @private
   */
  var timestamp;

  /**
   * @type number
   * @private
   */
  this._date = 0;

  if (date === undefined || date === 'CURRENT_TIMESTAMP' || date === 'CURRENT_DATE') {
    timestamp = fDate._now();
  }
  else if (typeof date === 'number' && date.toString().match(/^-?\d+$/)) {
    timestamp = date;
  }
  else if (date.lt) {
    timestamp = date._date;
  }
  else {
    if (date.toString) {
      date = date.toString();
    }

    // TODO
    //date = fTimestamp.callUnformatCallback(date);
    //date = fTimestamp.fixISOWeek(date);
    timestamp = strtotime(date);
  }

  if (timestamp === false) {
    fCore.debug('The date specified, %s,  does not appear to be a valid date.', date && date.toString ? date.toString() : '');
    return this;
  }

  if (timestamp < 9999999999) {
    timestamp *= 1000;
  }

  date = new Date(timestamp);
  // Y-m-d 00:00:00
  var test = parseInt(strtotime(date.getFullYear() + ' ' + (date.getMonth()+1) + ' ' + date.getDate() + ' 00:00:00', timestamp), 10);
  if (!isNaN(test)) {
    this._date = test;
  }
};
/**
 * @const
 * @type Object
 * @private
 */
fDate._breakPoints =  {
  432000:     [86400, 'day', 'days'],
  1814400:    [604800, 'week', 'weeks'],
  23328000:   [2592000, 'month', 'months'],
  2147483647: [31536000, 'year', 'years']
};
/**
 * @returns {number}
 * @private
 */
fDate._now = function () {
  return parseInt((new Date()).getTime() / 1000, 10);
};
/**
 * Composes text.
 * @param {string} message The text string.
 * @returns {string} String.
 * @private
 */
fDate.compose = function (message) {
  return sprintf.apply(fDate, arguments);
};
/**
 * Adjusts the date with the specified adjustment.
 * @param {string} adjustment The adjustment to make.
 * @returns {fDate} The new date if updates are needed.
 */
fDate.prototype.adjust = function (adjustment) {
  var timestamp = strtotime(adjustment, this._date);

  if (timestamp === false || timestamp === -1) {
    fCore.debug('The adjustment specified, %s, does not appear to be a valid relative date measurement.', adjustment);
    return new fDate(fDate._now());
  }

  return new fDate(timestamp);
};
/**
 * Checks if the date is equal to another date.
 * @param {fDate|Object|string|number} [otherDate] The date to compare with.
 * @returns {boolean} If the dates are equal.
 */
fDate.prototype.eq = function (otherDate) {
  otherDate = new fDate(otherDate);
  return this._date === otherDate._date; // The PHP does it this way
};
/**
 * Unlike Flourish, this only compares against 'now'.
 * @return {string} A fuzzy time string in English.
 */
fDate.prototype.getFuzzyDifference = function () {
  return (function (breakPoints, value) {
    var now = fDate._now();
    var diff = now - value;
    var unitDiff = 0, units = 'days';

    if (Math.abs(diff) < 10) {
      return 'right now';
    }

    for (var point in breakPoints) {
      if (breakPoints.hasOwnProperty(point)) {
        if (Math.abs(diff) > point) {
          continue;
        }

        unitDiff = Math.round(Math.abs(diff) / breakPoints[point][0]);
        units = fGrammar.inflectOnQuanity(unitDiff, breakPoints[point][1], breakPoints[point][2]);
        break;
      }
    }

    if (diff < 0) {
      return unitDiff + ' ' + units + ' from now';
    }

    return unitDiff + ' ' + units + ' ago';
  })(fDate._breakPoints, this._date);
};
/**
 * Checks if the date is greater.
 * @param {fDate|Object|string|number} [otherDate] The date to compare with.
 * @returns {boolean} If the dates are greater then
 */
fDate.prototype.gt = function (otherDate) {
  otherDate = new fDate(otherDate);
  return this._date > otherDate._date;
};
/**
 * Checks if our date is greater or equal to.
 * @param {fDate|Object|string|number} [otherDate] The date to compare with.
 * @returns {boolean} If the dates are greater or equal then
 */
fDate.prototype.gte = function (otherDate) {
  otherDate = new fDate(otherDate);
  return this._date >= otherDate._date;
};
/**
 * Checks if our date is less than.
 * @param {fDate|Object|string|number} [otherDate] The date to compare with.
 * @returns {boolean} If the dates are less then
 */
fDate.prototype.lt = function (otherDate) {
  otherDate = new fDate(otherDate);
  return this._date < otherDate._date;
};
/**
 * Checks if our date is less or equal to.
 * @param {fDate|Object|string|number} [otherDate] The date to compare with.
 * @returns {boolean} If the dates are less or equal then
 */
fDate.prototype.lte = function (otherDate) {
  otherDate = new fDate(otherDate);
  return this._date <= otherDate._date;
};
/**
 * Implements toString().
 * @returns {string} The date in Y-m-d format.
 */
fDate.prototype.toString = function () {
  var date = new Date(this._date * 1000);
  var month = date.getMonth()+1;
  if (month < 10) {
    month = '0' + month;
  }
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return date.getFullYear() + '-' + month + '-' + day;
};
// TODO
// /**
//  * Formats the date.
//  * @param {string} Our formatting string.
//  * @returns {string} Our date formatted
//  */
// fDate.prototype.format = function (format) {
  //     var format = fTimestamp.translateFormat(formate);
//     return fTimestamp.callFormatCallback(new Date(formate, this._date));
// };
// /**
//  * Modifies the current date
//  * @param {string} Our formatting string
//  * @returns {fDate} Our modified date
//  */
// fDate.prototype.modify = function (format) {
//   return new fDate(this.format(format));
// };
