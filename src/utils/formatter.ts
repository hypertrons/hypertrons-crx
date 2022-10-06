export const formatNum = (num: number, index: number) => {
  let isNegative = false;
  if (num < 0) {
    isNegative = true;
    num = -num;
  }
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  let result = (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
  if (isNegative) {
    result = '-' + result;
  }
  return result;
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
