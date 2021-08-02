export const radarData = {
  legend: {
    data: ['previous', 'current']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: 'commit', max: 6500},
      { name: 'issue', max: 16000},
      { name: 'pr', max: 30000},
      { name: 'comment', max: 38000},
      { name: 'star', max: 52000},
      { name: 'fork', max: 25000}
    ]
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: 'previous'
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: 'current'
      }
    ]
  }]
};