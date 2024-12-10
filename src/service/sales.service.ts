import SalesModel from "../model/sales.model"
import { Request, Response } from "express";
import userModel from "../model/user.model";

import { FilterQuery } from "mongoose";
import { createZipFromFolder, groupSalesByClient, writeCsvFilesToFolder } from "../utils/exportRistourn";

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
  endDate
}: SalesQueryParams & { startDate?: string; endDate?: string }) {
  const skip = (pageIndex - 1) * pageSize; // Calculate documents to skip based on pageIndex and pageSize
  const limit = pageSize;

  // Base filter with search query if provided
  const filter: Record<string, any> = {};

  if (query) {
    filter.invoice_number = { $regex: query, $options: "i" }; // Search by name, case-insensitive
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

export async function getSaleByRange(startDate:string, endDate:string) {

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
  return data
}


export async function exportRistourn(req:Request, res:Response, sales: any, startDate:string, endDate:string ){

  const users = await userModel.find()

  const clients = groupSalesByClient(sales);

  // Set headers for file download
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="ristourne_client.zip"'
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err:any) => {
    console.error("Archiver Error:", err);
    res.status(500).send("Error generating ZIP file");
  });

  archive.pipe(res);

  for (const client of clients) {
    const pdfPath = `${client.clientName.replace(/ /g, "_")}.pdf`;
    const user = users.find((i) => i.name === client.clientName);
    const doc = new PDFDocument({ margin: 50 });

    archive.append(doc, { name: pdfPath });

    // Add header with title and period
    doc.fontSize(16).text("Socladis Sarl", { align: "center" }).moveDown();
    doc
      .fontSize(14)
      .text(
        `État de Ristourne sur la période du ${new Date(
          startDate
        ).toLocaleDateString("en-GB")} au ${new Date(
          endDate
        ).toLocaleDateString("en-GB")}`,
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
        doc
          .fontSize(14)
          .text("#Facture      Date                Ristourne", {
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
