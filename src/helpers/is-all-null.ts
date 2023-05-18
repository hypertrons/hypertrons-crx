export function isAllNull(obj: Object) {
  return Object.values(obj).every((value) => value === null);
}
