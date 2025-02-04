import SalesModel from "../model/sales.model"
import { Request, Response } from "express";
import userModel from "../model/user.model";
import productModel from "../model/product.model";
import groupModel from "../model/group.model";

import { FilterQuery } from "mongoose";
import {
  createZipFromFolder,
  groupSalesByClient,
  writeCsvFilesToFolder,
} from "../utils/exportRistourn";
import { getAvarisByRange } from "./avaris.service";
import { getAllStocks } from "./stock.service";
import { getSupplyBoxByRange } from "./supplyBox.service";
import {
  getAllFundExpense,
  getFundExpenseByRange,
} from "./fundExpense.service";
import { getGroupedData } from "../utils/helper";
import { year } from "../utils/constants";
import stockModel from "../model/stock.model";

const PDFDocument = require("pdfkit");
const fs = require("fs-extra");
const archiver = require("archiver");

interface SalesQueryParams {
  pageIndex: number;
  pageSize: number;
  sort?: { key: string; order: "asc" | "desc" };
  query?: string;
  filterData?: Record<string, any>;
}

async function getLowStock() {
  return (await stockModel.find()).filter(
    (item) => Number(item.unitPrice) > Number(item.quantity)
  );
}

async function getSaleAreaChartData() {
  const currentYear = new Date().getFullYear() - 1;
  const startDate = new Date(currentYear, 0, 1).toISOString(); // January 1st of the current year
  const endDate = new Date(currentYear + 1, 0, 1).toISOString(); // January 1st of the next year

  const sales = await getSaleByRange(startDate, endDate);
  const ventes = getGroupedData(sales, `total_with_tax`);
  const d = await getFundExpenseByRange(startDate, endDate);
  const A = await getSupplyBoxByRange(startDate, endDate);
  const d_carburant = d.filter((item) => item.modif === "carburant");
  const d_achats = d.filter((item) => item.modif === "versement en banque");
  const d_courante = d.filter((item) => item.modif === "courante");
  const carburant = getGroupedData(d_carburant, `amount`);
  const achats = getGroupedData(d_achats, `amount`);
  const courante = getGroupedData(d_courante, `amount`);
  const appro = getGroupedData(A, `amount`);

  const result = [
    { name: "Ventes", data: ventes },
    { name: "Depenses Carburant", data: carburant },
    { name: "Achats", data: achats },
    { name: "Depense Courante", data: courante },
    { name: "Caisses", data: appro },
  ];

  return {
    series: result,
    categories: year,
  };
}

function getSalesData(sales: any[]) {
  const ristourn = sales.reduce(
    (acc: any, curr: { ristourne: any }) => acc + Number(curr.ristourne),
    0
  );
  const precompte = sales
    .reduce(
      (acc: any, curr: { withdrawal_amount: any }) =>
        acc + Number(curr.withdrawal_amount),
      0
    )
    .toFixed(2);
  const total_ht = sales
    .reduce(
      (acc: any, curr: { total_without_tax: any }) =>
        acc + Number(curr.total_without_tax),
      0
    )
    .toFixed(2);

  const total_tva = sales
    .reduce(
      (acc: any, curr: { VAT_amount: any }) => acc + Number(curr.VAT_amount),
      0
    )
    .toFixed(2);

  const total_ttc = sales
    .reduce(
      (acc: any, curr: { total_with_tax: any }) =>
        acc + Number(curr.total_with_tax),
      0
    )
    .toFixed(2);

  const total_packs = sales
    .flatMap((item) => item.products)
    .reduce(
      (acc: any, curr: { quantity: any }) => acc + Number(curr.quantity),
      0
    );

  return [
    {
      symbol: "VENTES TTC",
      name: "Total revenue sur les ventes",
      value: total_ttc,
    },
    {
      symbol: "VENTES HT",
      name: "Cummule des ventes Hors Tax",
      value: total_ht,
    },
    {
      symbol: "PACKS",
      name: "Cummule de packs vendu",
      value: total_packs,
    },
    {
      symbol: "RISTOURNE",
      name: "Cummule des ristourne ",
      value: ristourn,
    },
    {
      symbol: "TVA",
      name: "Cummule TVA",
      value: total_tva,
    },
    {
      symbol: "PRECOMPTE",
      name: "Cummule precompte",
      value: precompte,
    },
  ];
}

export async function getSalesDashboardDataService(data: {
  startDate: string;
  endDate: string;
}) {
  const { startDate, endDate } = data;
  const users = await userModel.countDocuments({ roles: "CLIENT" });
  const products = await productModel.countDocuments();
  const teams = await groupModel.countDocuments();
  const sales = await getSaleByRange(startDate, endDate);
  const salesData = getSalesData(sales);

  const avaris = (await getAvarisByRange(startDate, endDate)).reduce(
    (acc: any, curr: { quantity: any }) => acc + Number(curr.quantity),
    0
  );
  const low_stock = (await getAllStocks()).filter(
    (item) => Number(item.quantity) < Number(item.unitPrice)
  ).length;
  const supply_total = (await getSupplyBoxByRange(startDate, endDate))
    .reduce((acc: any, curr: { amount: any }) => acc + Number(curr.amount), 0)
    .toFixed(2);
  const expenseByrange = await getFundExpenseByRange(startDate, endDate);
  const total_expense = expenseByrange
    .reduce((acc: any, curr: { amount: any }) => acc + Number(curr.amount), 0)
    .toFixed(2);

  const achat_expense = expenseByrange
    .filter((item) => item.modif === "versement en banque")
    .reduce((acc: any, curr: { amount: any }) => acc + Number(curr.amount), 0)
    .toFixed(2);
  // console.log(supply_total, total_expense, achat_expense);
  const salesReportData = await getSaleAreaChartData();
  const lowStockList = await getLowStock();

  const result = {
    statisticData: {
      users: users,
      products: products,
      teams: teams,
    },
    inventory: [
      ...salesData,
      {
        symbol: "CAISSES",
        name: "Cummule des approvisionements",
        value: supply_total,
      },
      {
        symbol: "SORTIES",
        name: "Cummule des depenses",
        value: total_expense,
      },
      {
        symbol: "ACHATS",
        name: "Cummule versement en banque",
        value: achat_expense,
      },
      {
        symbol: "AVARIS",
        name: "Cummule des avaris",
        value: avaris,
      },
      {
        symbol: "STOCK FAIBLES",
        name: "Nombre de produit hors stock",
        value: low_stock,
      },
    ],
    salesReportData: salesReportData,
    lowStockList: lowStockList,
  };
  return result;
}


export async function createSale(input:Partial<any>) {
  const newSale = SalesModel.create(input)
  return newSale;
}

//get all user
export function getAllSales(){
  return SalesModel.find()
}

export async function allSalesPaginated({
  pageIndex,
  pageSize,
  sort,
  query,
  filterData,
  startDate,
  endDate,
}: SalesQueryParams & { startDate?: string; endDate?: string }) {
  const skip = (pageIndex - 1) * pageSize; // Calculate documents to skip based on pageIndex and pageSize
  const limit = pageSize;

  // Base filter with search query if provided
  const filter: Record<string, any> = {};

  if (query) {
    filter.clientName = { $regex: query, $options: "i" }; // Search by name, case-insensitive
  }

  // console.log(startDate, endDate);

  if (startDate || endDate) {
    filter.$expr = {
      $and: [],
    };

    if (startDate) {
      filter.$expr.$and.push({
        $gte: [
          { $dateFromString: { dateString: "$date" } },
          new Date(startDate),
        ],
      });
    }

    if (endDate) {
      filter.$expr.$and.push({
        $lte: [{ $dateFromString: { dateString: "$date" } }, new Date(endDate)],
      });
    }

    // If no conditions, remove $expr
    if (filter.$expr.$and.length === 0) {
      delete filter.$expr;
    }
  }

  // Add additional filters from filterData if provided
  if (filterData) {
    Object.assign(filter, filterData);
  }

  // Sort handling: Default to sorting by 'createdAt' descending if no other sort is provided
  const sortOptions: Record<string, any> =
    sort && sort.key
      ? { [sort.key]: sort.order === "desc" ? -1 : 1 }
      : { date: -1 }; // Default to 'createdAt' descending

  // Query the database
  const [products, total] = await Promise.all([
    SalesModel.find(filter).sort(sortOptions).skip(skip).limit(limit),
    SalesModel.countDocuments(filter),
  ]);

  return {
    data: products,
    pageIndex,
    pageSize,
    totalItems: total,
    totalPages: Math.ceil(total / pageSize),
  };
}

type QueryFilter<T> = FilterQuery<T>;

export async function getSaleByRange(startDate: string, endDate: string) {
  const filter: QueryFilter<any> = { $expr: { $and: [] } };

  if (startDate) {
    filter.$expr.$and.push({
      $gte: [{ $dateFromString: { dateString: "$date" } }, new Date(startDate)],
    });
  }

  if (endDate) {
    filter.$expr.$and.push({
      $lte: [{ $dateFromString: { dateString: "$date" } }, new Date(endDate)],
    });
  }

  if (filter.$expr.$and.length === 0) {
    delete filter.$expr;
  }

  // Execute the query (Mongoose example)
  const data = await SalesModel.find(filter);
  return data;
}

export async function exportRistourn(
  req: Request,
  res: Response,
  sales: any,
  startDate: string,
  endDate: string
) {
  const users = await userModel.find();

  const clients = groupSalesByClient(sales);

  // Set headers for file download
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="ristourne_client.zip"'
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err: any) => {
    console.error("Archiver Error:", err);
    res.status(500).send("Error generating ZIP file");
  });

  archive.pipe(res);

  for (const client of clients) {
    const pdfPath = `${client.clientName.replace(/ /g, "_")}.pdf`;
    const user = users.find((i) => i.name === client.clientName);
    const doc = new PDFDocument({ margin: 50 });

    archive.append(doc, { name: pdfPath });

    let s_date = new Date(startDate);
    let e_date = new Date(endDate);
    s_date.setDate(s_date.getDate() + 1);
    e_date.setDate(e_date.getDate() + 1);

    // Add header with title and period
    doc.fontSize(16).text("Socladis Sarl", { align: "center" }).moveDown();
    doc
      .fontSize(14)
      .text(
        `État de Ristourne sur la période du ${s_date.toLocaleDateString(
          "en-GB"
        )} au ${e_date.toLocaleDateString("en-GB")}`,
        { align: "center" }
      )
      .moveDown();

    // Add client details
    doc
      .fontSize(12)
      .text(`Nom du Client: ${client.clientName}      Equipe: ${user?.group}`, {
        align: "left",
      })
      .moveDown();
    doc
      .fontSize(12)
      .text(`Telephone: ${user?.phone}         NIU: ${user?.uniqueCode}`, {
        align: "left",
      })
      .moveDown();

    // Draw table header
    doc
      .fontSize(14)
      .text("#Facture      Date                Ristourne", { align: "center" });
    doc.moveDown();

    // Set the start Y position
    const startY = doc.y;

    // Draw table rows
    client.orders.forEach((order: any) => {
      const invoice = order.invoice_number.padEnd(15); // Add padding for alignment
      const date = new Date(order.date).toLocaleDateString("en-GB").padEnd(20);
      const ristourne = order.ristourne.toFixed(2).padStart(10); // Right align numbers

      const rowText = `${invoice}${date}${ristourne}`;
      doc.fontSize(12).text(rowText, { align: "center" });

      // Check if we need a new page
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
        doc.fontSize(14).text("#Facture      Date                Ristourne", {
          align: "center",
        });
        doc.moveDown();
      }
    });
    // Move to footer
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    doc.moveDown(2);

    doc
      .fontSize(12)
      .text(`Total Ristourne: ${client.totalRistourne.toFixed(2)}`, {
        align: "left",
      })
      .moveDown();

    // Add signature fields
    const signatureY = doc.y;
    doc
      .fontSize(12)
      .text("Signature Client:", 50, signatureY, { align: "left" });
    doc.fontSize(12).text("Signature :", doc.page.width - 150, signatureY, {
      align: "right",
    });

    // End the PDF document
    doc.end();

    // Wait for PDF stream to finish writing before proceeding
    await new Promise((resolve) => doc.on("end", resolve));
  }

  // Finalize the ZIP archive
  await archive.finalize();
}

//get user by id
export function getSaleById(id: string){
  return SalesModel.findById(id)
}

//update user by id
export function updateSaleById(id: string,updateData:Partial<any>){
  return SalesModel.findByIdAndUpdate(id, updateData, { new: true })
}

//delete user by id
export function deleteSaleById(id:string){
  return SalesModel.findByIdAndDelete(id)
}
