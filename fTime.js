/**
 * Creates a new fTime object.
 * @param {number|string} value Valid timestamp or time string.
 * @return {fTime} The object.
 * @constructor
 */
var fTime = function (value) {
  /**
   * @type {number}
   * @private
   */
  this.value = fTime.parseValue(value);
  return this;
};

/**
 * Implements toString().
 * @return {string} The time value.
 */
fTime.prototype.toString = function () {
  return String(this.value);
};

/**
 * @const
 * @type Object
 * @private
 */
fTime._breakPoints =  {
  '45': [1, 'second', 'seconds'],
  '2700': [60, 'minute', 'minutes'],
  '64800': [3600, 'hour', 'hours'],
  '432000': [86400, 'day', 'days']
};

/**
 * Parses the value. Uses phpjs port of PHP's strtotime() if the time value
 *   is a string.
 * @param {string|number} value Time value as string.
 * @return {number} Time stamp or 0.
 * @see strtotime
 */
fTime.parseValue = function (value) {
  value = parseInt(value, 10);
  var isnan = isNaN(value);

  if (!isnan) {
    if (value > 9999999999) { // Handle if the time is in ms
      value /= 1000;
    }
    return value;
  }
  else if (isnan) {
    return 0;
  }

  var ret = parseInt(strtotime(String(value)), 10);
  if (isNaN(ret)) {
    ret = 0;
  }

  return ret;
};

/**
 * Get the time value.
 * @return {number} The time value.
 */
fTime.prototype.getValue = function () {
  return this.value;
};

/**
 * Common functionality for the getFuzzyDifference() method.
 * @param {Object} breakPoints Break points object to use.
 * @returns {string} The fuzzy time in English.
 */
fTime.prototype._getFuzzyDifferenceCommon = function (breakPoints) {
  var now = parseInt((new Date()).getTime() / 1000, 10);
  var diff = now - this.value;
  var unitDiff = 0, units = 'seconds';

  if (Math.abs(diff) < 10) {
    return 'right now';
  }

  for (var point in breakPoints) {
    if (breakPoints.hasOwnProperty(point)) {
      if (Math.abs(diff) > point) {
        continue;
      }

      unitDiff = Math.round(Math.abs(diff) / breakPoints[point][0]);
      units = fGrammar.inflectOnQuantity(unitDiff, breakPoints[point][1], breakPoints[point][2]);
      break;
    }
  }

  if (diff < 0) {
    return unitDiff + ' ' + units + ' from now';
  }

  return unitDiff + ' ' + units + ' ago';
};

/**
 * Unlike Flourish, this only compares against 'now'.
 * @return {string} The fuzzy time in English.
 */
fTime.prototype.getFuzzyDifference = function () {
  return this._getFuzzyDifferenceCommon(fTime._breakPoints);
};
