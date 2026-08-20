const fs = require('fs');

const threshold = 70;

function readJson(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`Missing required file: ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const results = readJson('jest-results.json');

if (results.numFailedTestSuites !== 0 || results.numFailedTests !== 0) {
  throw new Error(
    `Jest reported failures: ${results.numFailedTestSuites} suites, ${results.numFailedTests} tests`
  );
}

const coverage = readJson('coverage/coverage-summary.json');
const metrics = {
  statements: coverage.total.statements.pct,
  branches: coverage.total.branches.pct,
  functions: coverage.total.functions.pct,
  lines: coverage.total.lines.pct,
};

for (const [name, value] of Object.entries(metrics)) {
  if (value < threshold) {
    throw new Error(`${name} coverage ${value}% is below ${threshold}%`);
  }
}

console.log(`All tests passed and coverage is above ${threshold}%.`);