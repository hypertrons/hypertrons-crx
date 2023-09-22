const getNewestMonth = () => {
  const lastDataAvailableMonth = new Date();
  lastDataAvailableMonth.setDate(0);
  return (
    lastDataAvailableMonth.getFullYear() +
    '-' +
    (lastDataAvailableMonth.getMonth() + 1).toString().padStart(2, '0')
  );
};

export default getNewestMonth;
