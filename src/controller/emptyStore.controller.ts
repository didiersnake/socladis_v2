import { Request, Response } from "express";
import {
 CreateEmptySoreInput,
} from "../schema/emptyStore.schema";
import {
  allEmptyStorePaginated,
  createEmptyStore,
  deleteEmptyStoreById,
  getAllEmptyStores,
  getEmptyStoreById,
  getUserStatistic,
  getEmptyStoreByRange,
  updateEmptyStoreById,
} from "../service/emptyStore.service";

export async function createEmptyStoreHandler(
  req: Request<{}, {}, CreateEmptySoreInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createEmptyStore(body);

    return res
      .status(201)
      .json([{ message: " Added Successfully", stockInfo: stock }]);
  } catch (e: any) {
    return res.status(500).send("stock exists");
  }
}

//get all store
export async function getAllEmptyStoreController(req: Request, res: Response) {
  try {
    const stock = await getAllEmptyStores(); // Call the getUserById function from your service file

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

//get store
export async function getEmptyStoreByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const stock = await getEmptyStoreById(id); // Call the getUserById function from your service file

    if (!stock) {
      res.status(404).json([{ message: "Store not found" }]);
    } else {
      const { ...responseWithoutCode } = stock.toObject();

      res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getAllEmptyStorePaginated(req: Request, res: Response) {
  try {
    const {
      pageIndex = 0,
      pageSize = 10,
      sort,
      query,
      filterData,
      startDate,
      endDate,
    } = req.body;

    const sales = await allEmptyStorePaginated({
      pageIndex,
      pageSize,
      sort,
      query,
      filterData,
      startDate,
      endDate,
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

//update store
export async function updateEmptyStoreByIdController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedStock = await updateEmptyStoreById(id, body);

    if (!updatedStock) {
      res.status(404).json([{ message: "Store not found" }]);
    } else {
      // Exclude the verificationCode and passwordResetCode field from the response
      const { ...responseWithoutCode } = updatedStock.toObject();

      res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getAllEmptyStoreByRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    const sales = await getEmptyStoreByRange(startDate, endDate);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getUserStatisticData(req: Request, res: Response) {
  try {
    const result = await getUserStatistic();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


//delete store
export async function deleteEmptyStoreByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteStock = await deleteEmptyStoreById(id);

    if (!deleteStock) {
      res.status(404).json([{ message: 'Store not found' }]);

    } else {

        res.status(200).json([{ message: 'Store Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}