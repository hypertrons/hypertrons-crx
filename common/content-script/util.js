function elementExists(obj) {
  return Number.isInteger(obj.length) && obj.length > 0;
}

function getMetaContent(index) {
  var ele = document.getElementsByTagName('meta')[index];
  if (ele && ele.content) {
    return ele.content;
  }
  return null;
}

function isEqual(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
      return true;
    }
  }
}

function isNull(object) {
  if (
    object === null ||
    typeof object === 'undefined' ||
    object === '' ||
    JSON.stringify(object) === '[]'
  ) {
    return true;
  }
  return false;
}
