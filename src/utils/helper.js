export async function getCurrentYearData(model) {
  const currentYear = new Date().getFullYear();

  const startDate = new Date(currentYear, 0, 1); // January 1st of the current year
  const endDate = new Date(currentYear + 1, 0, 1); // January 1st of the next year
  //   const currentYearData = await model.find({
  //     date: {
  //       $gte: startDate,
  //       $lt: endDate,
  //     },
  //   });
  return currentYearData;
}

export function getGroupedData(data, accumulator) {
  // Initialize an array with 12 elements (one for each month) filled with 0
  const monthlyTotals = new Array(12).fill(0);

  data.forEach((curr) => {
    // Get the month and year from the date
    const date = new Date(curr.date);
    const month = date.getMonth(); // Get the month index (0-11)
    const amount = Number(curr[accumulator]); // Get the amount to accumulate

    // Add the amount to the corresponding month
    monthlyTotals[month] += amount;
  });

  // Convert the totals to fixed decimal points if needed
  const result = monthlyTotals.map((total) => total.toFixed(1));
  return result;
}