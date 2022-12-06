export function shouldFeatureRun({
  /** Every condition must be true */
  asLongAs = [() => true],

  /** At least one condition must be true */
  include = [() => true],

  /** No conditions must be true */
  exclude = [() => false],
}): boolean {
  return (
    asLongAs.every((c) => c()) &&
    include.some((c) => c()) &&
    exclude.every((c) => !c())
  );
}
