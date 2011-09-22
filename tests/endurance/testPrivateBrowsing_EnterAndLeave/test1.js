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
 * The Original Code is Mozmill Test code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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

var endurance = require("../../../lib/endurance");
var head = require("../../../lib/head");
var privateBrowsing = require("../../../lib/private-browsing");

const LOCAL_TEST_FOLDER = collector.addHttpResource('../../../data/');
const LOCAL_TEST_PAGES = [LOCAL_TEST_FOLDER + 'layout/mozilla.html',
                          LOCAL_TEST_FOLDER + 'layout/mozilla_community.html',
                          LOCAL_TEST_FOLDER + 'layout/mozilla_contribute.html',
                          LOCAL_TEST_FOLDER + 'layout/mozilla_governance.html',
                          LOCAL_TEST_FOLDER + 'layout/mozilla_grants.html'
];

function setupModule(aModule) {
  head.setup(aModule);

  enduranceManager = new Endurance.EnduranceManager(controller);

  pb = new PrivateBrowsing.privateBrowsing(controller);
  // Make sure we are not in PB mode and do not show a prompt
  pb.enabled = false;
  pb.showPrompt = false;
}


function testEnterAndLeaveWithMutlipleTabsOpen() {

  // Open local pages in separate tabs and wait for each to finish loading
  LOCAL_TEST_PAGES.forEach(function (url) {
    browser.openURL(url);
    tabBrowser.openTab(); //tabBrowser.openTab()
  });
  
  enduranceManager.run(function () {
    pb.start(); //pb.start()
    enduranceManager.addCheckpoint("Entered private browsing mode");
    pb.stop(); //pb.start()
    enduranceManager.addCheckpoint("Left private browsing mode");
  });
}


function teardownModule(aModule) {
  pb.reset();
  head.teardown(aModule);
}
