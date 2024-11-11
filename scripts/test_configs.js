(async () => {
  const { urlRules } = await import('../public_configs/fast-pr-url-rules.cjs');
  let hasError = false;
  for (const rule of urlRules) {
    const tests = rule.tests;
    if (!tests) continue;
    for (const test of tests) {
      const url = test[0];
      const expected = test[1];
      const result = rule.ruleFunction(url);
      if (result?.filePath !== expected) {
        console.error(`Test failed for ${url}. Expected ${expected}, got ${result?.filePath}`);
        hasError = true;
      }
    }
  }
  if (hasError) {
    process.exit(-1);
  }
})();
