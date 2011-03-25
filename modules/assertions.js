/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MozMill Test code.
 *
 * The Initial Developer of the Original Code is the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Henrik Skupin <mail@hskupin.info> (Original Author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * @namespace Defines expect and assert methods to be used for assertions.
 */
var assertions = exports;


// Include necessary modules
const { Class } = require("external/inheritance");
const { AssertionError } = require('errors');
const { findCallerFrame } = require('stack');


// Use the frame module of Mozmill to raise non-fatal failures
var mozmillFrame = {};
Cu.import('resource://mozmill/modules/frame.js', mozmillFrame);


var Expect = Class.create(
/** @lends assertions.Expect.prototype */
{
  /**
   * The Expect class implements non-fatal assertions, and can be used in cases
   * when a failing test shouldn't abort the current test function. That allows
   * to execute multiple tests in a row.
   *
   * @class Base class for non-fatal assertions
   * @constructs
   */
  initialize: function Expect_initialize() {
  },

  /**
   * Log a test as failing by adding a fail frame.
   *
   * @private
   * @param {Object} aResult Test result details used for reporting.
   * @param {String} aResult.fileName Name of the file in which the assertion failed.
   * @param {String} aResult.function Function in which the assertion failed.
   * @param {Number} aResult.lineNumber Line number of the file in which the assertion failed.
   * @param {String} aResult.message Message why the assertion failed.
   */
  _logFail: function Expect__logFail(aResult) {
    mozmillFrame.events.fail({fail: aResult});
  },

  /**
   * Log a test as passing by adding a pass frame.
   *
   * @private
   * @param {Object} aResult Test result details used for reporting.
   * @param {String} aResult.fileName Name of the file in which the assertion failed.
   * @param {String} aResult.function Function in which the assertion failed.
   * @param {Number} aResult.lineNumber Line number of the file in which the assertion failed.
   * @param {String} aResult.message Message why the assertion failed.
   */
  _logPass: function Expect__logPass(aResult) {
    mozmillFrame.events.pass({pass: aResult});
  },

  /**
   * Test the condition and mark test as passed or failed
   *
   * @private
   * @param {Boolean} aCondition Condition to test.
   * @param {String} [aMessage] Message to show for the test result
   * @param {String} [aDiagnosis] Diagnose message to show for the test result
   * @returns {Boolean} Result of the test.
   */
  _test: function Expect__test(aCondition, aMessage, aDiagnosis) {
    let diagnosis = aDiagnosis || "";
    let message = aMessage || "";

    if (diagnosis)
      message = message ? message + " - " + diagnosis : diagnosis;

    // Build result data
    let frame = findCallerFrame(Components.stack);

    let result = {
      'fileName'   : frame.filename.replace(/(.*)-> /, ""),
      'function'   : frame.name,
      'lineNumber' : frame.lineNumber,
      'message'    : message
    };

    // Log test result
    if (aCondition)
      this._logPass(result);
    else
      this._logFail(result);

    return aCondition;
  },

  /**
   * Perform an always passing test
   *
   * @param {String} aMessage Message to show for the test result.
   * @returns {Boolean} Always returns true.
   */
  pass: function Expect_pass(aMessage) {
    return this._test(true, aMessage, undefined);
  },

  /**
   * Perform an always failing test
   *
   * @param {String} aMessage Message to show for the test result.
   * @returns {Boolean} Always returns false.
   */
  fail: function Expect_fail(aMessage) {
    return this._test(false, aMessage, undefined);
  },

  /**
   * Test if the value pass
   *
   * @param {Boolean|String|Number|Object} aValue Value to test.
   * @param {String} aMessage Message to show for the test result.
   * @returns {Boolean} Result of the test.
   */
  ok: function Expect_ok(aValue, aMessage) {
    let condition = !!aValue;
    let diagnosis = "got '" + aValue + "'";
  
    return this._test(condition, aMessage, diagnosis);
  },

  /**
   * Test if both specified values are identical.
   *
   * @param {Boolean|String|Number|Object} aValue Value to test.
   * @param {Boolean|string|number|object} aExpected Value to strictly compare with.
   * @param {String} aMessage Message to show for the test result
   * @returns {Boolean} Result of the test.
   */
  equal: function Expect_equal(aValue, aExpected, aMessage) {
    let condition = (aValue === aExpected);
    let diagnosis = "got '" + aValue + "', expected '" + aExpected + "'";
  
    return this._test(condition, aMessage, diagnosis);
  },

  /**
   * Test if both specified values are not identical.
   *
   * @param {Boolean|String|Number|Object} aValue Value to test.
   * @param {Boolean|string|number|object} aExpected Value to strictly compare with.
   * @param {String} aMessage Message to show for the test result
   * @returns {Boolean} Result of the test.
   */
  notEqual: function Expect_notEqual(aValue, aExpected, aMessage) {
    let condition = (aValue !== aExpected);
    let diagnosis = "got '" + aValue + "', not expected '" + aExpected + "'";

    return this._test(condition, aMessage, diagnosis);
  },

  /**
   * Test if the regular expression matches the string.
   *
   * @param {String} aString String to test.
   * @param {RegEx} aRegex Regular expression to use for testing that a match exists.
   * @param {String} aMessage Message to show for the test result
   * @returns {Boolean} Result of the test.
   */
  match: function Expect_match(aString, aRegex, aMessage) {
    // XXX Bug 634948
    // Regex objects are transformed to strings when evaluated in a sandbox
    // For now lets re-create the regex from its string representation
    let pattern = flags = "";
    try {
      let matches = aRegex.toString().match(/\/(.*)\/(.*)/);

      pattern = matches[1];
      flags = matches[2];
    }
    catch (ex) {
    }

    let regex = new RegExp(pattern, flags);
    let condition = (aString.match(regex) !== null);
    let diagnosis = "'" + regex + "' matches for '" + aString + "'";

    return this._test(condition, aMessage, diagnosis);
  },

  /**
   * Test if the regular expression does not match the string.
   *
   * @param {String} aString String to test.
   * @param {RegEx} aRegex Regular expression to use for testing that a match does not exist.
   * @param {String} aMessage Message to show for the test result
   * @returns {Boolean} Result of the test.
   */
  notMatch: function Expect_notMatch(aString, aRegex, aMessage) {
    // XXX Bug 634948
    // Regex objects are transformed to strings when evaluated in a sandbox
    // For now lets re-create the regex from its string representation
    let pattern = flags = "";
    try {
      let matches = aRegex.toString().match(/\/(.*)\/(.*)/);

      pattern = matches[1];
      flags = matches[2];
    }
    catch (ex) {
    }

    let regex = new RegExp(pattern, flags);
    let condition = (aString.match(regex) === null);
    let diagnosis = "'" + regex + "' doesn't match for '" + aString + "'";

    return this._test(condition, aMessage, diagnosis);
  }
});


var Assert = Class.extend(Expect,
/** @lends assertions.Assert */
{
  /**
   * The Assert class implements fatal assertions, and can be used in cases
   * when a failing test has to directly abort the current test function. All
   * remaining tasks will not be performed.
   *
   * @class Base class for fatal assertions
   * @constructs
   * @extends assertions.Expect
   * @requires errors.AssertionError
   */
  initialize: function Assert() {
    this.parent();
  },

  /**
   * Log a test as failing by throwing an AssertionException.
   *
   * @private
   * @param {Object} aResult Test result details used for reporting.
   * @param {String} aResult.fileName Name of the file in which the assertion failed.
   * @param {String} aResult.function Function in which the assertion failed.
   * @param {Number} aResult.lineNumber Line number of the file in which the assertion failed.
   * @param {String} aResult.message Message why the assertion failed.
   * @throws {AssertionError }
   */
  _logFail: function Assert__logFail(aResult) {
    throw new AssertionError(aResult.message, aResult.fileName,
                             aResult.lineNumber, aResult.function);
  }
});


// Export of classes
assertions.Expect = Expect;
assertions.Assert = Assert;
