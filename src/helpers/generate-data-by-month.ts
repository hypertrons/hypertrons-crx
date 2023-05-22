const generateDataByMonth = (originalData: any) => {
  if (originalData === null) {
    return [];
  }

  const isNormalMonth = (key: string): boolean => {
    return key.match(/^\d{4}-\d{2}$/) !== null;
  };
  // `originalData` is an object with keys like `2020-01`, `2020-02`, `2022`, `2022-Q1`, `all`.
  // A normal month is a key like `2020-01`(yyyy-mm). They are the keys we handle later in this function.
  // An unnormal month is a key like `2020`, `2020-Q1`, `all`. They are not used in any feature yet.
  const normalMonths = Object.keys(originalData).filter((key) =>
    isNormalMonth(key)
  );
  const orderedMonths = normalMonths.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (dateA < dateB) return -1;
    else if (dateA > dateB) return 1;
    else return 0;
  });
  const oldestMonth = orderedMonths[0];
  const now = new Date();
  if (now.getDate() === 1) {
    // data for last month is not ready in the first day of the month (#595)
    now.setDate(0); // a way to let month - 1
  }
  now.setDate(0); // see issue #632
  const newestMonth =
    now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0');
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

export default generateDataByMonth;
