// TODO To write data, use getConnection/getDatabase to get the IDBDatabase object or use an fActiveRecord model.
// TODO To read data, use getConnection/getDatabase to get the IDBDatabase or use fActiveRecord model/fRecordSet.
// TODO Fallback? Server-side?
/**
 * Front end to IndexedDB. For all methods here, if the browser lacks support,
 *   they will fail silently.
 * @constructor
 * @param {string} name Database name to open.
 * @param {string} [version] Version to open. Recommended but not required.
 * @returns {fDatabase} The database object.
 */
var fDatabase = function (name, version) {
  if (version === undefined) {
    version = '1.0';
  }

  /**
   * Database name.
   * @type string
   * @private
   */
  this._name = name;
  /**
   * Database version.
   * @type string
   * @private
   */
  this._version = version;
  /**
   * If connected.
   * @type boolean
   * @private
   */
  this._isConnected = false;
  /**
   * The indexed database.
   * @type (IDBDatabase|null)
   * @private
   */
  this._database = null;
  /**
   * The error handler.
   * @type function(Error)
   */
  this._errorHandler = fDatabase._defaultErrorHandler;

  return this;
};
/**
 * If the browser supports indexedDB.
 * @type boolean
 * @private
 */
fDatabase._supportsIndexedDB = (function () {
  var possible = ['webkitIndexedDB', 'mozIndexedDB', 'indexedDB'];
  for (var i = 0; i < possible.length; i++) {
    if (possible[i] in window) {
      try {
        window.indexedDB = window[possible[i]];
      }
      catch (e) {}
      return true;
    }
  }
  return false;
})();
/**
 * Default failure handler.
 * @param {Error|Object} [e] The error.
 */
fDatabase._defaultErrorHandler = function (e) {
  if (typeof e !== 'object') {
    e = {value: 'Unknown error'};
  }
  fCore.debug('%s', e.value);
};
/**
 * Set the database.
 * @param {IDBDatabase} database Database.
 * @returns {fDatabase} The object to allow method chaining.
 */
fDatabase.prototype.setDatabase = function (database) {
  if (!fDatabase._supportsIndexedDB) {
    return this;
  }

  this._database = database;
  return this;
};
/**
 * Alias to setDatabase() for compliance.
 * @param {IDBDatabase} database Database.
 * @returns {fDatabase} The object to allow method chaining.
 */
fDatabase.prototype.setConnection = function (database) {
  return this.setDatabase(database);
};
/**
 * Check if the database is opened.
 * @returns {boolean} If the database is opened.
 */
fDatabase.prototype.isConnected = function () {
  return this._isConnected;
};
/**
 * Get the version of this database.
 * @returns {string} The version string.
 */
fDatabase.prototype.getVersion = function () {
  return this._version;
};
/**
 * Get the IDBDatabase object.
 * @returns {IDBDatabase|null} The indexed database object, or null.
 */
fDatabase.prototype.getConnection = function () {
  return this._database;
};
/**
 * Gets the error handler.
 * @returns {function(Error)} The error handler function.
 */
fDatabase.prototype.getErrorHandler = function () {
  return this._errorHandler;
};
/**
 * Gets the database name.
 * @returns {string} The database name.
 */
fDatabase.prototype.getName = function () {
  return this._name;
};
/**
 * Connect to the database. All methods that need to connect will call this,
 *   so calling this before doing anything is not required.
 * @param {function(fDatabase)} cb Callback for when the database is opened.
 * @returns {fDatabase} The object to allow method chaining.
 */
fDatabase.prototype.connect = function (cb) {
  if (!fDatabase._supportsIndexedDB) {
    return this;
  }

  if (!this._isConnected) {
    var request = window.indexedDB.open(this._name);
    var instance = this;

    request.onsuccess = function (event) {
      instance.setDatabase(event.target.result);
      instance._isConnected = true;

      var db = instance.getConnection();
      var version = instance.getVersion();

      if (version !== db.version) {
        var versionRequest = db.setVersion(version);

        versionRequest.onfailure = instance.getErrorHandler();
        versionRequest.onsuccess = function () {
          cb(instance);
        };
      }
      else {
        cb(instance);
      }
    };
    request.onfailure = this._errorHandler;
  }
  else {
    cb(this);
  }

  return this;
};
