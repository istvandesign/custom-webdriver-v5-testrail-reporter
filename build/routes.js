"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  getProjects: "index.php?/api/v2/get_projects",
  getSuites: projectId => `index.php?/api/v2/get_suites/${projectId}`,
  getRuns: projectId => `index.php?/api/v2/get_runs/${projectId}`,
  getRun: runId => `index.php?/api/v2/get_run/${runId}`,
  addRun: projectId => `index.php?/api/v2/add_run/${projectId}`,
  getTests: runId => `index.php?/api/v2/get_tests/${runId}`,
  addResultsForCases: runId => `index.php?/api/v2/add_results_for_cases/${runId}`
};
exports.default = _default;