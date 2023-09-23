export interface RepoActivityDetails {
  // e.g. 2020-05: [["frank-zsy", 4.69], ["heming6666", 3.46], ["menbotics[bot]", 2]]
  [key: string]: [string, number][];
}

/**
 * Count the number of unique contributors in the data
 * @returns [number of long term contributors, contributors' names]
 */
export const countLongTermContributors = (
  data: RepoActivityDetails
): [number, string[]] => {
  const contributors = new Map<string, number>();
  Object.keys(data).forEach((month) => {
    data[month].forEach((item) => {
      if (contributors.has(item[0])) {
        contributors.set(item[0], contributors.get(item[0])! + 1);
      } else {
        contributors.set(item[0], 0);
      }
    });
  });
  let count = 0;
  contributors.forEach((value) => {
    // only count contributors who have contributed more than 3 months
    if (value >= 3) {
      count++;
    }
  });
  return [count, [...contributors.keys()]];
};
