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
