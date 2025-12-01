const fs = require('fs');
const path = require('path');

const resultsDir = 'test-results';
const resultsFile = 'test-results.xml';
const filePath = path.join(resultsDir, resultsFile);

if (!fs.existsSync(filePath)) {
  console.error(`Test results file not found at ${filePath}`);
  process.exit(1);
}

const xmlContent = fs.readFileSync(filePath, 'utf8');

// Simple regex parsing to avoid external dependencies for this script
// This is sufficient for standard JUnit XML structure
const testSuites = [];
// Match testsuite tag and capture attributes and content
// Note: This regex assumes standard attribute ordering or presence might vary, so we'll parse attributes separately
const suiteTagRegex = /<testsuite([^>]*)>([\s\S]*?)<\/testsuite>/g;
// Regex to match both self-closing and block testcase tags
const caseRegex = /<testcase\s+name="([^"]+)"(?:[^>]*?classname="([^"]+)")?[^>]*?(?:\/>|>(?:[\s\S]*?<failure[^>]*>([\s\S]*?)<\/failure>)?[\s\S]*?<\/testcase>)/g;

let match;
while ((match = suiteTagRegex.exec(xmlContent)) !== null) {
  const [_, attributesStr, content] = match;
  
  const getAttr = (name) => {
    const attrMatch = new RegExp(`${name}="([^"]+)"`).exec(attributesStr);
    return attrMatch ? attrMatch[1] : null;
  };

  const name = getAttr('name') || 'Unnamed Suite';
  const tests = parseInt(getAttr('tests') || '0');
  const failures = parseInt(getAttr('failures') || '0');
  const skipped = parseInt(getAttr('skipped') || '0');

  const suite = {
    name,
    total: tests,
    failed: failures,
    skipped: skipped,
    cases: []
  };

  let caseMatch;
  while ((caseMatch = caseRegex.exec(content)) !== null) {
    const [__, caseName, className, failure] = caseMatch;
    const displayName = className ? `${className} - ${caseName}` : caseName;
    suite.cases.push({
      name: displayName,
      className,
      failed: !!failure,
      failureMessage: failure ? failure.trim() : null
    });
  }
  testSuites.push(suite);
}

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;

let summaryLines = [];
let detailsLines = [];

testSuites.forEach(suite => {
  totalTests += suite.total;
  totalFailed += suite.failed;
  totalSkipped += suite.skipped;
  const passed = suite.total - suite.failed - suite.skipped;
  totalPassed += passed;

  const icon = suite.failed > 0 ? '❌' : '✅';
  summaryLines.push(`- ${icon} **${suite.name}**: ${passed}/${suite.total} passed`);

  if (suite.cases.length > 0) {
    detailsLines.push(`### ${suite.name}`);
    suite.cases.forEach(testCase => {
      const caseIcon = testCase.failed ? '❌' : '✅';
      detailsLines.push(`- ${caseIcon} ${testCase.name}`);
      if (testCase.failed) {
        detailsLines.push(`  \`\`\`\n  ${testCase.failureMessage}\n  \`\`\``);
      }
    });
  }
});

const overallIcon = totalFailed > 0 ? '❌' : '✅';
const summaryHeader = `### Test Results ${overallIcon}\n\n**${totalPassed}/${totalTests} passed** (${totalFailed} failed, ${totalSkipped} skipped)`;

const output = `
${summaryHeader}

${summaryLines.join('\n')}

<details>
<summary>Click to see full test details</summary>

${detailsLines.join('\n')}

</details>
`;

console.log(output);
fs.writeFileSync('test-summary.md', output);

// AI GENERATED