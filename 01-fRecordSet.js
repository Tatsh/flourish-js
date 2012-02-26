/**
 * Sets the contents of the set. This is not to be used directly.
 * @constructor
 * @param {fActiveRecord} model The type of records the object will contain.
 * @param {Array|null} [records=null] An array of records.
 * @param {number|null} [limit=null] The number of records the set was limited to.
 * @param {number} [page=1] The page of records that was built.
 * @returns {fRecordSet} The record set object.
 * @see fRecordSet#build
 */
var fRecordSet = function (model, records, limit, page) {
  if (!model) {
    return this;
  }

  records === undefined && (records = null);
  /**
   * @type number|null
   */
  limit === undefined && (limit = null);
  page === undefined && (page = 1);

  /**
   * @type fActiveRecord
   * @private
   */
  this._model = model;
  /**
   * @type fActiveRecord[]
   * @private
   */
  this._records = records;
  /**
   * @type number|null
   * @private
   */
  this._limit = limit;
  /**
   * @type number
   * @private
   */
  this._page = page;

  return this;
};
/**
 * Cache of data received.
 * @type {Object}
 * @private
 */
fRecordSet._cache = {};
/**
 * Build a record set.  Does not return anything. The callback must handle data
 *   retrieval.
 * @param {*} model Model object to use. Must be an object that inherits
 *   from fActiveRecord.
 * @param {function(Object)} callback Callback for when data is retrieved.
 * @param {Object} [whereConditions] Conditions.
 * @param {Object} [orderBys] Order by conditions.
 * @param {number} [limit=null] Limit.
 * @param {number} [page=null] Page number.
 * @param {boolean} [noCache=false] If set to true, force getting new data.
 */
fRecordSet.build = function (model, callback, whereConditions, orderBys, limit, page, noCache) {
  noCache === undefined && (noCache = false);
  whereConditions === undefined && (whereConditions = {});
  orderBys === undefined && (orderBys = {});
  limit === undefined && (limit = null);
  page === undefined && (page = 1);
};
