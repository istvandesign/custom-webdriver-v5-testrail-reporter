import WDIOReporter from "@wdio/reporter";
import fs from "fs";

module.exports = class MyReporter extends WDIOReporter {
  constructor(options) {
    super(options);
    this.obj = {};
    this.printRunnerStats = options.printRunnerStats || false;
    if (!options.stdout) {
      this.outputDir = options.outputDir || "./";
      this.filename = options.filename;
    }
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

  onRunnerEnd(runnerStats) {
    const filename =
      this.filename || `${this.obj.title}-report-${Date.now()}.json`;

    const printRunnerFile = () => {
      if (this.options.stdout) {
        console.log(JSON.stringify(runnerStats));
      } else {
        try {
          fs.writeFile(
            `${this.outputDir}/${
              runnerStats.sanitizedCapabilities
            }-${filename}`,
            JSON.stringify(runnerStats),
            err => {
              if (err) throw err;
              console.log(`${this.obj.title} runner report done`);
            }
          );
        } catch (e) {
          console.log("There was a problem writing your file. ERROR ", e);
        }
      }
    };

    const printTestFile = () => {
      if (this.options.stdout) {
        console.log(JSON.stringify(runnerStats));
      } else {
        try {
          fs.writeFile(
            `${this.outputDir}/${filename}`,
            JSON.stringify(this.obj),
            err => {
              if (err) throw err;
              console.log(`${this.obj.title} report done`);
            }
          );
        } catch (e) {
          console.log("There was a problem writing your file. ERROR ", e);
        }
      }
    };

    if (this.printRunnerStats) {
      printRunnerFile();
    }
    printTestFile();
  }
};
