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

// Include required modules
var head = require("../../../lib/head");
var widgets = require("../../../lib/ui/widgets");

// TEST

function setupModule(aModule) {
  head.setup(aModule);
}

/**
 * Test the stop and reload buttons
 */
var testStopAndReload = function()
{
  const URL = "http://www.mozilla.com/en-US/";

  // Go to the URL without waiting and stop before it can fully load.
  browser.openURL(URL, 0);
  browser.ui.navBar.stopButton.click();

  // Even an element at the top of a page shouldn't exist when we hit the stop
  // button extremely fast. Note use of existsNow, since we don't want to wait.
  var header = new widgets.Element("id", "header", browser.content.activeTab);
  assert.ok(!header.existsNow, "Header does not exist");

  // Reload, wait for it to completely load and test again
  browser.openURL(URL);

  var header = new widgets.Element("id", "header", browser.content.activeTab);
  assert.ok(header.exists, "Header exists");
}

function teardownModule(aModule) {
  head.teardown(aModule);
}

/**
 * Map test functions to litmus tests
 */
// testStopAndReload.meta = {litmusids : [8030]};
