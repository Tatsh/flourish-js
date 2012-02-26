/**
 * Note that this does not do anything different from fTime yet.
 * @augments fTime
 * @constructor
 * @param {string} value The timestamp value.
 * @return {fTimestamp} The timestamp object.
 */
function fTimestamp(value) {
  this.parent.constructor.call(this, value);
  return this;
}
/**
 * @const
 * @type Object
 * @private
 */
fTimestamp._breakPoints = fTime._breakPoints;
fTimestamp._breakPoints[1814400] = [604800, 'week', 'weeks'];
fTimestamp._breakPoints[23328000] = [2592000, 'month', 'months'];
fTimestamp._breakPoints[2147483647] = [31536000, 'year', 'years'];
/**
 * @private
 * @type fTime
 */
fTimestamp.prototype = new fTime(0);
/**
 * @private
 * @type function()
 */
fTimestamp.prototype.constructor = fTimestamp;
/**
 * Access to the parent class.
 * @type fTime
 */
fTimestamp.prototype.parent = fTime.prototype;
/**
 * Unlike Flourish, this only compares against 'now'. Same as
 *   fTime.getFuzzyDifference() but with a few larger intervals.
 * @return {string} The fuzzy time in English.
 */
fTimestamp.prototype.getFuzzyDifference = function () {
  return this._getFuzzyDifferenceCommon(fTimestamp._breakPoints);
};
