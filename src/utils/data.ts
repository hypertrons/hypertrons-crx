export const generateDataByMonth = (originalData: any) => {
  const objectData: any = {};
  // format month string
  Object.keys(originalData).forEach((key) => {
    // e.g. 20204 -> 2020-4
    const date = key.slice(0, 4) + '-' + key.slice(4);
    objectData[date] = originalData[key];
  });
  // get the oldest month and the newest one
  const orderedMonths = Object.keys(objectData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA < dateB) return -1;
    else if (dateA > dateB) return 1;
    else return 0;
  });
  const oldestMonth = orderedMonths[0];
  const newestMonth = orderedMonths[orderedMonths.length - 1];
  // insert no-event months (assigned to 0) and generate final data
  const arrayData: [string, number][] = [];
  const start = new Date(oldestMonth);
  const end = new Date(newestMonth);
  for (let i = start; i <= end; i.setMonth(i.getMonth() + 1)) {
    const date = i.getFullYear() + '-' + (i.getMonth() + 1);
    if (!objectData.hasOwnProperty(date)) {
      arrayData.push([date, 0]);
    } else {
      arrayData.push([date, objectData[date]]);
    }
  }
  return arrayData;
};
