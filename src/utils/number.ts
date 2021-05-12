/**
 * Linear mapping a value from domain to range
 * @param  val
 * @param  domain Domain extent domain[0] can be bigger than domain[1]
 * @param  range  Range extent range[0] can be bigger than range[1]
 */
 export function linearMap(
  val: number,
  domain: number[],
  range: number[],
): number {
  const d0 = domain[0];
  const d1 = domain[1];
  const r0 = range[0];
  const r1 = range[1];

  const subDomain = d1 - d0;
  const subRange = r1 - r0;

  if (subDomain === 0) {
    return subRange === 0
      ? r0
      : (r0 + r1) / 2;
  }
  if (subDomain > 0) {
    if (val <= d0) {
      return r0;
    }
    else if (val >= d1) {
      return r1;
    }
  }
  else {
    if (val >= d0) {
      return r0;
    }
    else if (val <= d1) {
      return r1;
    }
  }

  return (val - d0) / subDomain * subRange + r0;
} 