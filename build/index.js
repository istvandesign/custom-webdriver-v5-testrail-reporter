"use strict";

var _reporter = _interopRequireDefault(require("@wdio/reporter"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class TestRailReporter extends _reporter.default {
  constructor(options) {
    options = Object.assign(options, {
      stdout: false
    });
    super(options);
    this.obj = {};

    if (!options.testRailUrl || !options.projectId || !options.username || !options.password) {
      throw new Error("The following options are required for this reporter: testRailUrl, username, password, projectId");
    }

    this.isUploaded = false;
    this.newRunId = null;
    this.currentDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 19).replace("T", " ");
    this.testrailRunTests = [];
  }

  get isSynchronised() {
    return this.isUploaded;
  }

  getFullUrl(route) {
    return `https://${this.options.username}:${this.options.password}@${this.options.testRailUrl}/${route}`;
  }

  syncComplete() {
    this.isUploaded = true;
  }

  fail(e) {
    this.syncComplete();
    console.log(e);
  }

  getTestState(state) {
    const testRailStatuses = {
      PASSED: 1,
      FAILED: 5,
      PENDING: 8
    };

    if (state === "passed") {
      return testRailStatuses.PASSED;
    } else if (state === "failed") {
      return testRailStatuses.FAILED;
    } else if (state === "pending") {
      return testRailStatuses.PENDING;
    } else {
      this.fail("Error finding mocha test state");
      return 0;
    }
  }

  async getPostData(url, body) {
    try {
      return (0, _nodeFetch.default)(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      this.fail(e);
    }
  }

  async createNewTestrailRun(url, body) {
    try {
      const response = await this.getPostData(url, body);

      if (response.ok) {
        const data = await response.json();
        this.newRunId = data.id;
        this.newRunName = data.name;
        console.log(`New TestRail Run created. ID: ${this.newRunId} Name: ${this.newRunName}`);
      } else {
        throw new Error(`Unable to create TestRail Run: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      this.fail(e);
    }
  }

  async updateTests() {
    const addResultsForCasesURL = this.getFullUrl(_routes.default.addResultsForCases(this.newRunId));
    let body = {
      results: []
    };
    this.obj.tests.forEach(test => {
      const result = {
        case_id: test.title.substring(2, 8),
        status_id: this.getTestState(test.state),
        elapsed: test.duration
      };

      if (result.status_id === this.getTestState("failed")) {
        Object.assign(result, {
          comment: test.error.message
        });
      }

      body.results.push(result);
    });

    try {
      await this.getPostData(addResultsForCasesURL, body);
      console.log("Testrail has been updated succesfully.");
    } catch (e) {
      this.fail(e);
    }
  }

  onSuiteEnd(suite) {
    const {
      type,
      start,
      duration,
      uid,
      cid,
      title,
      fullTitle
    } = suite;
    Object.assign(this.obj, {
      type,
      start,
      duration,
      uid,
      cid,
      title,
      fullTitle,
      tests: [],
      hooks: [],
      suites: []
    });
    suite.tests.map(test => this.obj.tests.push(test));
    suite.hooks.map(hook => this.obj.hooks.push(hook));
    suite.suites.map(suite => this.obj.suites.push(suite));
  }

  async onRunnerEnd(runnerStats) {
    const addRunUrl = this.getFullUrl(_routes.default.addRun(this.options.projectId));
    const addRunBody = {
      suite_id: 1151,
      name: `Red Robin E2E - ${this.currentDate}`,
      description: `E2E: ${runnerStats.sanitizedCapabilities}`
    };

    try {
      await this.createNewTestrailRun(addRunUrl, addRunBody);
    } catch (e) {
      this.fail(e);
    }

    try {
      await this.updateTests();
    } catch (e) {
      this.fail(e);
    }

    await this.syncComplete(); // End
  }

};