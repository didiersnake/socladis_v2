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
  const grouprdData = data.reduce((acc, curr) => {
    // Get the month and year from the date
    const date = new Date(curr.date);
    const month = date.toLocaleString("fr-Fr", { month: "short" }); // Full month name
    const year = date.getFullYear(); // Get the year
    // Create a key for the month and year
    const key = `${month} ${year}`;
    // Initialize the array for the month if it doesn't exist
    if (!acc[key]) {
      acc[key] = { monthYear: key, sales: [], total: 0 };
    }
    // Add the sale to the corresponding month
    acc[key].sales.push(curr);
    acc[key].total += Number(curr[accumulator]); // Cumulatively add the amount
    return acc;
  }, {});
  // Convert the grouped sales object to an array if needed
  const groupedSalesArray = Object.values(grouprdData).map(
    ({ monthYear, sales, total }) => ({
      monthYear,
      sales,
      total,
    })
  );
  const result = groupedSalesArray.map((item) => item.total.toFixed(2));
  console.log(result);
  return result;
}
