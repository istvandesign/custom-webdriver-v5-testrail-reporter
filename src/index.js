import WDIOReporter from "@wdio/reporter";
import axios from "axios";

class TestRailReporter extends WDIOReporter {
  constructor(options) {
    options = Object.assign(options, { stdout: false });
    super(options);
    this.obj = {};
    this.projectRoute = "/index.php?/api/v2/get_projects";
    this.testRailUrl = options.testRailUrl;
    this.username = options.username;
    this.password = options.password;
  }

  onSuiteEnd(suite) {
    this.obj.type = suite.type;
    this.obj.start = suite.start;
    this.obj.duration = suite._duration;
    this.obj.uid = suite.uid;
    this.obj.cid = suite.cid;
    this.obj.title = suite.title;
    this.obj.fullTitle = suite.fullTitle;
    this.obj.tests = [];
    this.obj.hooks = [];
    this.obj.suites = [];

    suite.tests.map(test => this.obj.tests.push(test));
    suite.hooks.map(hook => this.obj.hooks.push(hook));
    suite.suites.map(suite => this.obj.suites.push(suite));
  }

  getTicketIds() {
    var ticketIds = [];
    this.obj.tests.map(test => {
      ticketIds.push(test.title.substring(1, 8));
    });
    return ticketIds;
  }

  onRunnerEnd(runnerStats) {
    const ticketIds = this.getTicketIds();
    const testRailUrl = "https://workco.testrail.com";
    const projectRoute = "/index.php?/api/v2/get_projects";
    const instance = axios.create({
      baseURL: testRailUrl,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic bGFsa2FAd29yay5jbzp0aGlzaXNteTFURVNUUkFJTHBhc3NAd29yZA=="
      }
    });

    console.log("making call to testrail...", instance);
    instance
      .get(projectRoute)
      .then((error, resp, body) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log("resp ", resp);
        console.log("body ", body);
      })
      .catch(e => console.log("ERROR ", e));
  }
}

module.exports = TestRailReporter;
