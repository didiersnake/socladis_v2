const fs = require("fs-extra");
const archiver = require("archiver");
const path = require("path");

export const generateCsvForClient = (clientName, sales) => {
  const totalRistourne = sales.reduce(
    (sum, sale) => sum + parseFloat(sale.ristourne || 0),
    0
  );

  const header =
    `Client Name: ${clientName}\n` + `Total Ristourne: ${totalRistourne}\n\n`;

  const orderHeader = "Date,Ristourne,Invoice Number\n";
  const orderRows = sales
    .map(
      ({ date, ristourne, invoice_number }) =>
        `${new Date(date).toISOString().split("T")[0]},${
          ristourne || 0
        },${invoice_number}`
    )
    .join("\n");

  const signatureSpace =
    "\n\nClient Signature: ______________________\n" +
    "Seller Signature: ______________________";

  return header + orderHeader + orderRows + signatureSpace;
};

// Write CSV files into a folder
export const writeCsvFilesToFolder = async (sales, folderName) => {
  const salesByClient = sales.reduce((acc, sale) => {
    if (!acc[sale.clientName]) acc[sale.clientName] = [];
    acc[sale.clientName].push(sale);
    return acc;
  }, {});

  await fs.ensureDir(folderName);

  for (const [clientName, clientSales] of Object.entries(salesByClient)) {
    const csvContent = generateCsvForClient(clientName, clientSales);
    const fileName = `${clientName.replace(/\s+/g, "_")}_orders.csv`;
    const filePath = path.join(folderName, fileName);
    fs.writeFileSync(filePath, csvContent, "utf8");
  }
};

// Create a ZIP archive of the folder
export const createZipFromFolder = async (folderName, zipFileName) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFileName);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve(zipFileName));
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(folderName, false);
    archive.finalize();
  });
};


export function groupSalesByClient(sales) {
  const clientData = {};

  sales.forEach((sale) => {
    if (!clientData[sale.clientName]) {
      clientData[sale.clientName] = {
        clientName: sale.clientName,
        orders: [],
        totalRistourne: 0,
      };
    }

    const ristourne = parseFloat(sale.ristourne || 0);
    clientData[sale.clientName].orders.push({
      invoice_number: sale.invoice_number,
      date: sale.date,
      ristourne,
    });

    clientData[sale.clientName].totalRistourne += ristourne;
  });

  return Object.values(clientData); // Convert object back to an array
}
