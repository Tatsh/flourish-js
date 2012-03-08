/**
 * Provides functionality to retrieve and manipulate URL information.
 *
 * This classes uses <code>window.location</code> for all operations.
 * @constructor
 */
var fURL = function () {};
/**
 * Returns the current query string.
 * @returns {string} The query string.
 */
fURL.getQueryString = function () {
  return location.search ? location.search.substr(1) : '';
};
/**
 * Returns the requested URL, does not include the domain name or query string.
 * @returns {string} The requested URL without the query string.
 */
fURL.get = function () {
  return location.pathname;
};
/**
 * Returns the current domain name, with protocol prefix.
 * @returns {string} The current domain name, prefixed by <code>http://</code>
 *   or <code>https://</code>.
 */
fURL.getDomain = function () {
  return location.protocol + '//' + location.hostname;
};
/**
 * Redirects to the URL specified, without requiring a fully-qualified URL.
 * @param {string} url The URL to redirect to.
 */
fURL.redirect = function (url) {
  location.href = url;
};
