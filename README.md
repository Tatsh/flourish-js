# Documentation
http://tatsh.github.com/flourish-js/

# Contributing

Please read this entire file. To contribute, please follow these rules for new code:

* Never extend a host object other than `window`.
* Functionality must be for use in a browser environment.
  * Another project will host a Flourish class set for use with server-side processors like node.
* JSHint your code (`npm install jshint`) and fix most if not all code that gives warnings.
  * Only these JSHint annotations are allowed to make exceptions for code (will be expanded as the library grows):
      * `expr`
      * `sub`
* Code cannot use large dependencies like jQuery, Prototype, etc.
* Code must work in IE7+, Firefox 3.6+, Chrome public version, Safari 5+
  * Fixes for other browsers such as Opera and Konqueror and older browsers will be accepted.
* Document all parts of your code using JSDoc syntax.
  * Make sure only public methods and properties can appear in the documentation
  * Unlike PHP, if the method returns void (in the PHP documentation), do not document the return value.
  * Use no more than 80 characters per line (code and comments in code may use more than 80 characters).
    * Use 2 space indent on the next line (see example below).
* Do not throw exceptions like in the original code; return null or a safe value and/or use `fCore.debug()`.
  * The return value must be documented properly: `@returns {string|null} Return value description.`.
* Never allow the NaN value to be returned. Instead, return null, 0, or false where appropriate.
* Never allow 'undefined' to be printed or added to a string from an undefined variable.
  * If `a` is supposed to be a string but was not passed and will be added to another string: `a === undefined && (a = '');`
* Dependencies that are non-complex (like functions from phpjs, or your own useful global functions) must go in `00-deps.js` and have a JSDoc block.
  * License must be MIT compatible; no GPL-only or similar licensed code will be accepted
  * Code that requires large and/or complex depencies, such as jQuery, Prototype, etc will not be accepted.
  * Code taken from other sources added to either `00-deps.js` or string functions added to `fUTF8` are immune to these rules except for re-formatting the function naming style.
* Method names must be of the exact same name and type (static/prototype) in Flourish unless not possible to do so.
* Please do not use `function nameOfFunction() {}` style anywhere in your code.
* All parameters and variables should use `camelCaseStyle` and not `underscore_style`.
* Use 2-space 'tabbing': `  `. Do not use real tabs.
* Always leave a new line at the end of the file.
* Use UNIX newlines; other formats will not be accepted (such as Windows CRLF).
* Brackets must be on same line as statement (see example below).
* Do not access another object's private properties from other objects; use the getter method if one is provided.
  * If a getter method is not provided, copy the original method/property from the class until a decision is made to make a public getter method in the original class.
  * The exception to this rule is methods within Flourish that are public in the code and marked @internal in the documentation.
* Test that every public method you have written works correctly when compiled with Closure Compiler with advanced optimisations: http://closure-compiler.appspot.com/home
  * For testing, methods and variables do not have to retain their name. Just make sure that your calling test code returns expected values.
  * Adding to the exports file is optional but would be appreciated.
* If making a new file:
  * Class must be listed at Flourish official documentation http://flourishlib.com/docs
  * No exception classes will be accepted.
  * You do not have to implement every method. However, if a method calls another method even if it is private, it is expected that you will implement that method so the JavaScript code matches the PHP code as much as possible.
    * If a method is called in another class, that other class must be at least partially implemented with that method at minimum.
  * If the class has a parent class, the new class must inherit from the parent class if the parent class would also be useful to have (a blank parent class is acceptable).
  * Do not wrap the code in a self-invoking closure or function.
  * Object extensions must be done in manual style (see example).
  * Update the order.json file to include the new file after all its dependencies.

# Example

    /*jshint expr:true */
    /**
     * A dependency function added to 00-deps.js. Please fix any function that
     *   uses 'function name() {}' style to 'var name = function () {}'.
     * @param {string|null} arg1 Argument description.
     * @param {string} [arg2] Not required argument.
     * @returns {string} Return value description.
     */
    var dependencyFunction = function (arg1, arg2) {
      // Set the not required argument's value
      // Note that the () for the second part make a difference
      arg2 === undefined && (arg2 = '');

      // Brackets!
      while (condition) {
        condition = false;
      }

      for (var i = 0; i < something.length; i++) {
        something[i] = something[i] + ' ';
      }

      // Only increasing i, so end bracket may be on the same line
      for (var i = 0; i < something.length; i++) {}

      var a = function () {
        // function body
      }; // Do not use function a() {} style

      // If a condition is to be made this way, the end bracket may be on the same line
      if (condition) {}
      else {
        doSomething();
      }

      if (condition) {
        doSomething();
      }
      else if (condition2) {
        doSomethingElse();
      }
      else {
        doSomethingMore();
      }

      // These will not be accepted
      if (condition)
      {
        doSomething();
      } else {
        doSomethingElse();
      }

      if (condition)
      {
        doSomething();
      }
      else
      {
        doSomethingElse();
      }

      // String recommendations
      // - Please default to using single quotes
      // - Use 1 space between the concatenation operator (+)
      var a = ' ' + 'my' + 'string' + ' ';

      return 'something';
    };

    /**
     * A blank parent class. Give the original description however. This lives
     *   in 00-fMyClassOriginal.js.
     * @constructor
     * @returns {fMyClassOriginal} The class.
     */
    var fMyClassOriginal = function () {
      return this;
    };
    /**
     * Static method. Note that JavaScript 'extensions' never inherit static
     *   methods. See below on how to copy the static method to the inheriting
     *   class.
     * @param {string} arg1 A string parameter.
     * @returns {string} The processed string.
     */
    fMyClassOriginal.copyTheStaticMethod = function (arg1) {
      return arg1.replace(/\s+/, '');
    };
    /**
     * Instance method. See below on how to inherit.
     *   This method returns nothing so we are not documenting a return value.
     */
    fMyClassOriginal.prototype.instanceMethod = function () {
      fCore.debug('No return value');
    };

    /**
     * A class description. Should be the same as the description Flourish
     *   documentation has. This lives in 01-fMyClassExtends.js.
     * @augments fMyClassOriginal
     * @constructor
     * @param {string} someParam A parameter description.
     * @returns {fMyClassExtends} The class.
     */
    var fMyClassExtends = function (someParam) {
      // Since this extends, we may want to call the parent constructor to get all the original properties
      // This is like calling parent::__construct() in PHP
      this.parent.constructor.call(this);

      /**
       * @type string
       * @private
       */
      this._someParam = someParam;

      return this;
    };
    /**
     * To inherit the original prototype, we must instantiate the parent class
     *   to this class' prototype.
     * @private
     * @type fMyClassOriginal
     */
    fMyClassExtends.prototype = new fMyClassOriginal();
    /**
     * Gets the someParam property. A public getter.
     * @returns {string} The someParam property.
     */
    fMyClassExtends.prototype.getSomeParam = function () {
      return this._someParam;
    };
    /**
     * Sets the someParam property. A public setter.
     * @returns {fMyClassExtends} The object to allow method chaining.
     */
    fMyClassExtends.prototype.setSomeParam = function (s) {
      this._someParam = s;
      return this;
    };
    /**
     * Access to parent class. Add this only when necessary. Always name it
     *   parent.
     * @type fMyClassOriginal.prototype
     */
    fMyClassExtends.prototype.parent = fMyClassOriginal.prototype;
    /**
     * Documenting a private property/method is generally desired, but not
     *   required.
     * This property must be set for classes that extend or only the original
     *   constructor will be called.
     * @type function
     * @private
     */
    fMyClassExtends.prototype.constructor = fMyClassExtends;
    /**
     * A static method copied from the original class for comformance and
     *   similarity to the PHP class.
     * @param {string} arg1 A string parameter.
     * @returns {string} The processed string.
     */
    fMyClassExtends.copyTheStaticMethod = fMyClassOriginal.copyTheStaticMethod;
