import { Request, Response } from "express";
import {
CreateStockInput,
} from "../schema/stock.schema";
import {
  allStockPaginated,
  createStock,
  deleteStockById,
  getAllStocks,
  getStockById,
  updateStockById
} from "../service/stock.service";

export async function createStockHandler(
  req: Request<{}, {}, CreateStockInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createStock(body);

    return res.status(201).json([{message:"Stock Added Successfully",stockInfo:stock}]);
  } catch (e: any) {
 
    return res.status(500).send("stock exists");
  }
}


//get all user
export async function getAllStockController(req:Request,res:Response){

  try {
    const stock = await getAllStocks(); // Call the getUserById function from your service file

     res.status(200).json(stock);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getPaginatedStock(req: Request, res: Response) {
  try {
    const { pageIndex = 0, pageSize = 10, sort, query, filterData } = req.body;

    const stock = await allStockPaginated({
      pageIndex,
      pageSize,
      sort,
      query,
      filterData,
    });

    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//get user
export async function getStockByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const stock = await getStockById(id); // Call the getUserById function from your service file

    if (!stock) {
      res.status(404).json([{ message: 'Stock not found' }]);
    } else {
    const { ...responseWithoutCode } = stock.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateStockByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedStock = await updateStockById(id,body);

    if (!updatedStock) {
      res.status(404).json([{ message: 'User not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedStock.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteStockByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteStock = await deleteStockById(id);

    if (!deleteStock) {
      res.status(404).json([{ message: 'Stock not found' }]);

    } else {

        res.status(200).json([{ message: 'Stock Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}