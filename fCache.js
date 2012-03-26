/**
 * Front-end to <code>localStorage</code> for browsers that support it. Will
 *   use <code>globalStorage</code> as a fallback if it is available.
 * @constructor
 * @returns {fCache} The object.
 */
var fCache = function () {};
/**
 * @type boolean
 * @private
 */
fCache._isSupported = 'localStorage' in window || 'globalStorage' in window;
/**
 * @type (Storage|StorageObsolete|undefined)
 * @private
 */
fCache.store = (function () {
  if (window.localStorage) {
    return window.localStorage;
  }
  else if (window.globalStorage) {
    return window.globalStorage[location.hostname];
  }
})();
/**
 * Tries to set a value to the cache, but stops if a value already exists.
 * @param {string} key The key store as.
 * @param {Object|Array|string|number|boolean} value The value to store. Will
 *   be serialised into a string. The <code>null</code> literal value will be
 *   ignored.
 * @returns {boolean} If the key/value pair were added successfully.
 */
fCache.add = function (key, value) {
  if (!fCache._isSupported) {
    return false;
  }

  // Block null because globalStorage returns null for non-existant keys
  if (value === null || value === undefined) {
    return false;
  }

  // globalStorage will return null if an item does not exist
  var item = fCache.store.getItem(key);
  if (item !== undefined && item !== null) {
    return false;
  }

  fCache.store.setItem(key, fJSON.encode(value));
  return true;
};
/**
 * Clears the whole cache of every key. Use with caution!
 */
fCache.clear = function () {
  if (!fCache._isSupported) {
    return;
  }

  if (fCache.store.clear) { // globalStorage lacks clear
    fCache.store.clear();
  }

  if (fCache.store.length) {
    for (var key in fCache.store) {
      if (fCache.store.hasOwnProperty(key)) {
        fCache.store.removeItem(key);
      }
    }
  }
};
/**
 * Deletes a value from the cache. Has to be named this because the
 *   <code>delete</code> keyword is reserved.
 * @param {string} key The key to delete.
 * @returns {boolean} If the delete succeeded.
 */
fCache.deleteKey = function (key) {
  if (!fCache._isSupported) {
    return false;
  }

  var item = fCache.store.getItem(key);

  if (item === undefined || item === null) {
    return false;
  }

  fCache.store.removeItem(key);

  return true;
};
/**
 * Returns a value from the cache.
 * @param {string} key The key to return the value for.
 * @param {*} [defaultValue] The default value to return if the key did
 *   not exist.
 * @returns {*} The cached value or the default value if no cached value was
 *   found. Can return <code>undefined</code>.
 */
fCache.get = function (key, defaultValue) {
  if (!fCache._isSupported) {
    return defaultValue || undefined;
  }

  var item = fCache.store.getItem(key);

  if (item === null) {
    // globalStorage
    item = undefined;
  }

  if (item === undefined) {
    return defaultValue;
  }

  // globalStorage has the string value in the 'value' key
  item = item.value ? item.value : item;
  var ret = fJSON.decode(item.toString());

  // The item was probably not handled by this class
  if (ret === null) {
    return item;
  }

  return ret;
};
/**
 * Sets a value to the cache, overriding any previous value.
 * @param {string} key The key to store as.
 * @param {Object|Array|boolean|number|string} value The value to store. Will
 *   be serialised into a string. The <code>null</code> literal value will be
 *   ignored.
 */
fCache.set = function (key, value) {
  if (!fCache._isSupported || value === null) {
    return;
  }

  fCache.store.setItem(key, fJSON.encode(value));
};
