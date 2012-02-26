/**
 * Not to be used directly.
 * @constructor
 * @returns {fActiveRecord} The active record object.
 */
var fActiveRecord = function () {
  /**
   * The POST URI for storage.
   * @type string
   * @private
   */
  this._postURI = '/';
  return this;
};
/**
 * Stores the record. Any subscribed object can register to receive events:
 * <ul>
 * <li>'validate' - When the object needs to be validated before storing</li>
 * <li>'store' - When the object has been stored (called asynchronously)</li>
 * </ul>
 * @returns {fActiveRecord} The object to allow method chaining.
 */
fActiveRecord.prototype.store = function () {
//   try {
//     sEvent.trigger('validate', this);
//   }
//   catch (e) {
//   }
//
  // Perform the store via AJAX
//   sAJAXRequest.post(this._postURI, this.toObject(), function () {
//     //sEvent.trigger('store', this);
//   });
};
/**
 * Callbacks registered.
 * @type Array
 * @private
 */
fActiveRecord._callbacks = [];
/**
 * Register for an event or events.
 * @param {fActiveRecord[]|fActiveRecord} modelTypes Model types to wait
 *   upon.
 * @param {string[]|string} eventTypes Event types to register for.
 * @param {function (fActiveRecord)} callback Callback function.
 */
fActiveRecord.registerCallback = function (modelTypes, eventTypes, callback) {
  if (!modelTypes.length) { // Should not have a length property
    modelTypes = [modelTypes];
  }
  if (typeof eventTypes === 'string') {
    eventTypes = [eventTypes];
  }

  fActiveRecord._callbacks.push({modelTypes: modelTypes, eventTypes: eventTypes, callback: callback});
};
