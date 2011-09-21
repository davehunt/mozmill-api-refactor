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
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Anthony Hughes <ahughes@mozilla.com>
 *   Henrik Skupin <hskupin@mozilla.com>
 *   Dave Hunt <dhunt@mozilla.com>
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

var head = require("../../../lib/head");
var prefs = require("../../../lib/prefs");

const LOCAL_TEST_FOLDER = collector.addHttpResource('../../../data/');
const LOCAL_TEST_PAGE = LOCAL_TEST_FOLDER + 'popups/popups_2.html';

const PREF_DISABLE_POPUPS = "dom.disable_open_during_load";

function setupModule(aModule) {
  head.setup(aModule);

  // Set preference to allow pop-ups
  prefs.setPref('boolean', PREF_DISABLE_POPUPS, false);
}


/**
 * Test to make sure pop-ups are not blocked
 */
function testPopUpAllowed() {
  var prePopUpWindowCount = driver.getWindowsByZOrder().length;

  // Open the pop-up test site
  browser.openURL(LOCAL_TEST_PAGE);

  // Check that the window count has changed
  var postPopUpWindowCount = driver.getWindowsByZOrder().length;
  assert.ok(driver.getWindowsByZOrder().length > prePopUpWindowCount);

  // A notification bar always exists, so check for the existance of the close button
  //var closeTabPanelButton = browser.tabbar.currentTab.notificationBar.closeButton;
  //assert.ok(!closeTabPanelButton.exists)
}


function teardownModule(aModule) {
  head.teardown(aModule);

  // Reset the pop-up blocking preference
  prefs.clearUserPref(PREF_DISABLE_POPUPS);

  // Close all windows
  var allWindows = driver.getWindowsByZOrder();
  for (i = 0; i < allWindows.length - 1; i++) {
    allWindows[i].close();
  }
}

/**
 * Map test functions to litmus tests
 */
// testPopUpAllowed.meta = {litmusids : [8367]};
