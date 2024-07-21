export function getInterval(data: any) {
  const startTime = Number(data[0][0].split('-')[0]);
  const endTime = Number(data[data.length - 1][0].split('-')[0]);
  const timeLength = endTime - startTime;
  const minInterval = timeLength > 2 ? 365 * 24 * 3600 * 1000 : 30 * 3600 * 24 * 1000;
  return { timeLength, minInterval };
}

export function judgeInterval(instance: any, option: any, timeLength: number) {
  if (timeLength > 2) {
    instance.on('dataZoom', (params: any) => {
      let option = instance.getOption() as {
        xAxis: { minInterval?: any }[];
      };
      const startValue = params.batch[0].start;
      const endValue = params.batch[0].end;
      let minInterval: number;
      if (startValue == 0 && endValue == 100) {
        minInterval = 365 * 24 * 3600 * 1000;
      } else {
        minInterval = 30 * 24 * 3600 * 1000;
      }
      option.xAxis[0].minInterval = minInterval;
      instance.setOption(option);
    });
  }
}
