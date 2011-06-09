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
 * The Original Code is Mozmill Test Code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aakash Desai <adesai@mozilla.com>
 *   Henrik Skupin <hskupin@mozilla.com>
 *   Aaron Train <atrain@mozilla.com>
 *   Geo Mealer <gmealer@mozilla.com>
 *   Owen Coutts <ocoutts@mozilla.com>
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

// GLOBALS

var head = require("../../../lib/head");
var widgets = require("../../../lib/ui/widgets");

const LOCAL_TEST_FOLDER = collector.addHttpResource('../../../data/');

// Using an array because the test is order-based, so indexes are convenient.
// If the test was not order-based separate consts or a key/val dictionary would be
// much more readable in the code. Also note the short constant name.
const PAGES = [{url: LOCAL_TEST_FOLDER + 'layout/mozilla.html', id: 'community'},
               {url: LOCAL_TEST_FOLDER + 'layout/mozilla_mission.html', id: 'mission_statement'},
               {url: LOCAL_TEST_FOLDER + 'layout/mozilla_grants.html', id: 'accessibility'}];

// SETUP/CLEANUP HELPERS

function openPage(page) {
  // Open up the test page and validate that it's the page we expect to be using
  browser.openURL(page.url);
  var element = new widgets.Element("id", page.id, browser.content.activeTab);
  if (!element.exists)
    throw new Error("Could not find element '" + page.id + "' in page '" + page.url + "'");
}

// TEST HELPERS

function clickBackAndVerify(page) {
  // Click on the back button and verify that we landed on the page we expect
  browser.ui.navBar.backButton.click();

  var element = new widgets.Element("id", page.id, browser.content.activeTab);
  driver.waitFor(function () {
    return element.exists;
  });
}

function clickForwardAndVerify(page) {
  // Click on the forward button and verify that we landed on the page we expect
  browser.ui.navBar.forwardButton.click();

  var element = new widgets.Element("id", page.id, browser.content.activeTab);
  driver.sleep(250);
  driver.waitFor(function () {
    return element.exists;
  });
}

// TEST

function setupModule(aModule) {
  head.setup(aModule);

  // Open all the pages in turn. This will leave us on PAGES[3].
  PAGES.forEach(function (page) {
    openPage(page);
  });
}

/**
 * Test the back and forward buttons
 */
function testBackAndForward() {
  // Loops have been unrolled and meat of loops moved into named helpers for clarity.
  // I would only use forEach-type structures with a large array, or in non-test code.

  // Click on the Back button and verify where we land; we start on PAGES[2]
  clickBackAndVerify(PAGES[1]);
  clickBackAndVerify(PAGES[0]);

  // Click on the Forward button and verify where we land; we start on PAGES[0]
  clickForwardAndVerify(PAGES[1]);
  clickForwardAndVerify(PAGES[2]);
}

function teardownModule(module) {
  head.teardown(module);
}

/**
 * Map test functions to litmus tests
 */
// testBackAndForward.meta = {litmusids : [8032]};
