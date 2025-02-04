import { Request, Response } from "express";
import {
CreateSalesInput,
} from "../schema/sales.schema";
import {
  allSalesPaginated,
  createSale,
  deleteSaleById,
  exportRistourn,
  getSaleById,
  getSaleByRange,
  getSalesDashboardDataService,
  updateSaleById,
} from "../service/sales.service";
const fs = require("fs-extra");
import StockModel, { IStock } from "../model/stock.model";

export async function createSaleHandler(
  req: Request<{}, {}, CreateSalesInput>,
  res: Response
) {
  const body = req.body;

  try {
    // for (const product of body.products) {
    //   const existingStock = await StockModel.findOne({ name: product.name });

    //   if (existingStock) {
    //     if (
    //       Number(existingStock.quantity) >= Number(product.quantity)
    //     ) {
    //       let decrementedQuantity = Number(existingStock.quantity);
    //       decrementedQuantity -= Number(product.quantity);
    //       existingStock.quantity = decrementedQuantity.toString();

    //       await existingStock.save();
    //     } else {
    //       return res.status(400).json([{ message: 'Not enough quantity in the stock to sell ' + product.name }]);
    //     }
    //   } else {
    //     return res.status(404).json([{ message: 'Stock not found' }]);
    //   }
    // }

    const sale = await createSale(body);
    return res
      .status(201)
      .json([{ message: "Sales Added Successfully", saleInfo: sale }]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while processing the sale");
  }
}

export async function createSaleSecondHandler(
  req: Request<{}, {}, CreateSalesInput>,
  res: Response
) {
  const body = req.body;

  try {
    const sale = await createSale(body);

    return res
      .status(201)
      .json([{ message: "Sales Added Successfully", saleInfo: sale }]);
  } catch (e: any) {
    return res.status(500).send("Sales exists");
  }
}

export async function getSalesDashboardData(req: Request, res: Response) {
  const { startDate, endDate } = req.body;
  try {
    const salesDashboardData = await getSalesDashboardDataService({
      startDate,
      endDate,
    });
    res.status(200).json(salesDashboardData);
  } catch (error) {
    console.log(error);

    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


//get all user
export async function getAllSaleController(req:Request,res:Response){

  try {
    const { pageIndex = 0, pageSize = 10, sort, query, filterData, startDate, endDate } = req.body;

    const sales = await allSalesPaginated({
      pageIndex,
      pageSize,
      sort,
      query,
      filterData,
      startDate,
      endDate
    }); 
     res.status(200).json(sales);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getAllSalesByRange(req:Request, res:Response) {
  try {
    const {startDate, endDate} = req.body
    const sales = await getSaleByRange(startDate, endDate)
    res.status(200).json(sales)
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function generateRistourn(req:Request, res:Response) {
  const { sales, startDate, endDate } = req.body;

  if (!sales || !Array.isArray(sales)) {
    return res.status(400).send("Invalid sales data");
  }
  try {
    // const zipFilePath =
    await exportRistourn(req, res, sales, startDate, endDate);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating the ZIP file.");
  }
}

//get user
export async function getSaleByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const sale = await getSaleById(id); // Call the getUserById function from your service file

    if (!sale) {
      res.status(404).json([{ message: 'Sale not found' }]);
    } else {
    const { ...responseWithoutCode } = sale.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateSaleByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedSale = await updateSaleById(id,body);

    if (!updatedSale) {
      res.status(404).json([{ message: 'Sale not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedSale.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteSaleByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteSale = await deleteSaleById(id);

    if (!deleteSale) {
      res.status(404).json([{ message: 'Sale not found' }]);

    } else {

        res.status(200).json([{ message: 'Sale Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}