/**
 * Months with value of 0 are not listed in data file for size optimization
 * purpose, this function inserts those missing zeros.
 * @param originalData
 * @param updatedAt meta file last updated time
 * @returns
 */
const generateDataByMonth = (originalData: any, updatedAt?: number) => {
  if (originalData === null) {
    return [];
  }

  const isNormalMonth = (key: string): boolean => {
    return key.match(/^\d{4}-\d{2}$/) !== null;
  };
  // `originalData` is an object with keys like `2020-01`, `2020-02`, `2022`, `2022-Q1`, `all`.
  // A normal month is a key like `2020-01`(yyyy-mm). They are the keys we handle later in this function.
  // An unnormal month is a key like `2020`, `2020-Q1`, `all`. They are not used in any feature yet.
  const normalMonths = Object.keys(originalData).filter((key) => isNormalMonth(key));
  const orderedMonths = normalMonths.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA < dateB) return -1;
    else if (dateA > dateB) return 1;
    else return 0;
  });

  // get the last month that has data
  const lastDataAvailableMonth = updatedAt ? new Date(updatedAt) : new Date();
  lastDataAvailableMonth.setDate(0);

  const oldestMonth = orderedMonths[0];
  const newestMonth =
    lastDataAvailableMonth.getFullYear() + '-' + (lastDataAvailableMonth.getMonth() + 1).toString().padStart(2, '0');
  // insert no-event months (assigned to 0) and generate final data
  const arrayData: [string, number][] = [];
  const start = new Date(oldestMonth);
  const end = new Date(newestMonth);
  for (let i = start; i <= end; i.setMonth(i.getMonth() + 1)) {
    const date = i.getFullYear() + '-' + (i.getMonth() + 1).toString().padStart(2, '0');
    if (!originalData.hasOwnProperty(date)) {
      arrayData.push([date, 0]);
    } else {
      arrayData.push([date, originalData[date]]);
    }
  }
  return arrayData;
};

export default generateDataByMonth;
