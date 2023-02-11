export const generateDataByMonth = (originalData: any) => {
  if (originalData === null) {
    return [];
  }
  const orderedMonths = Object.keys(originalData).sort((a, b) => {
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
    const date =
      i.getFullYear() + '-' + (i.getMonth() + 1).toString().padStart(2, '0');
    if (!originalData.hasOwnProperty(date)) {
      arrayData.push([date, 0]);
    } else {
      arrayData.push([date, originalData[date]]);
    }
  }
  return arrayData;
};
