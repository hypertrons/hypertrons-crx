const getNewestMonth = () => {
  const now = new Date();
  if (now.getDate() === 1) {
    // data for last month is not ready in the first day of the month (#595)
    now.setDate(0); // a way to let month - 1
  }
  now.setDate(0); // see issue #632

  return (
    now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0')
  );
};

export default getNewestMonth;
