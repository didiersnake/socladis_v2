import { Request, Response } from "express";
import {
CreateAvarisInput,
} from "../schema/avaris.schema";
import {
  allAvarisPaginated,
  createAvari,
  deleteAvariById,
  getAllAvaris,
  getAvariById,
  getAvarisByRange,
  updateAvariById,
  getUserStatistic,
} from "../service/avaris.service";
import StockModel, { IStock } from "../model/stock.model";

export async function createAvarisHandler(
  req: Request<{}, {}, CreateAvarisInput>,
  res: Response
) {
  const body = req.body;

  try {
    const existingStock = await StockModel.findOne({ name: body.name });

    if (existingStock) {
      if (Number(existingStock.quantity) >= Number(body.quantity)) {
        let decrementedQuantity = Number(existingStock.quantity);
        decrementedQuantity -= Number(body.quantity);
        existingStock.quantity = decrementedQuantity.toString();

        await existingStock.save();
      } else {
        return res
          .status(400)
          .json([
            { message: "Not enough quantity in the stock to be removed" },
          ]);
      }
    } else {
      return res.status(404).json([{ message: "Stock not found" }]);
    }

    const stock = await createAvari(body);

    return res
      .status(201)
      .json([{ message: "Avaris Added Successfully", stockInfo: stock }]);
  } catch (error) {
    console.error(error);
    return res.status(500).send("avari exists");
  }
}

export async function getAllAvarisController(req: Request, res: Response) {
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

    const sales = await allAvarisPaginated({
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

export async function getAllAvarisByRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    const sales = await getAvarisByRange(startDate, endDate);
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

//get all user
export async function getAllAvarisControllerUnpaginated(req:Request,res:Response){

  try {
    const avari = await getAllAvaris();

     res.status(200).json(avari);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//get user
export async function getAvarisByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const avari = await getAvariById(id); // Call the getUserById function from your service file

    if (!avari) {
      res.status(404).json([{ message: 'Avaris not found' }]);
    } else {
    const { ...responseWithoutCode } = avari.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateAvarisByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedAvari = await updateAvariById(id,body);

    if (!updatedAvari) {
      res.status(404).json([{ message: 'Avaris not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedAvari.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteAvarisByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteAvari = await deleteAvariById(id);

    if (!deleteAvari) {
      res.status(404).json([{ message: 'Avari not found' }]);

    } else {

        res.status(200).json([{ message: 'Avari Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}