export function isNull(object: any) {
  if (
    object === null ||
    typeof object === 'undefined' ||
    object === '' ||
    JSON.stringify(object) === '[]' ||
    JSON.stringify(object) === '{}'
  ) {
    return true;
  }
  return false;
}
