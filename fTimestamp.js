/**
 * Note that this does not do anything different from fTime yet.
 * @augments fTime
 * @constructor
 * @param {string} value The timestamp value.
 * @return {fTimestamp} The timestamp object.
 */
function fTimestamp(value) {
  // TODO Fix this
  // This class is to be independent of fTime and fDate
  // Needs to be more like the original constructor in PHP
  /**
   * @type {number}
   * @private
   */
  this.value = fTime.parseValue(value);
  return this;
}
/**
 * @const
 * @type Object
 * @private
 */
fTimestamp._breakPoints =  {
  45:         [1, 'second', 'seconds'],
  2700:       [60, 'minute', 'minutes'],
  64800:      [3600, 'hour', 'hours'],
  432000:     [86400, 'day', 'days'],
  1814400:    [604800, 'week', 'weeks'],
  23328000:   [2592000, 'month', 'months'],
  2147483647: [31536000, 'year', 'years']
};
/**
 * Unlike Flourish, this only compares against 'now'. Same as
 *   fTime.getFuzzyDifference() but with a few larger intervals.
 * @return {string} The fuzzy time in English.
 */
fTimestamp.prototype.getFuzzyDifference = function () {
  return (function (breakPoints, value) {
    var now = parseInt((new Date()).getTime() / 1000, 10);
    var diff = now - value;
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
        units = fGrammar.inflectOnQuanity(unitDiff, breakPoints[point][1], breakPoints[point][2]);
        break;
      }
    }

    if (diff < 0) {
      return unitDiff + ' ' + units + ' from now';
    }

    return unitDiff + ' ' + units + ' ago';
  })(fTimestamp._breakPoints, this.value);
};
