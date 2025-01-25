import { Request, Response } from "express";
import {
CreateSupplyBoxInput,
} from "../schema/supplyBox.schema";
import {
  allSupplyBoxPaginated,
  createSupplyBox,
  deleteSupplyBoxById,
  getAllSupplyBoxs,
  getSupplyBoxById,
  getSupplyBoxByRange,
  updateSupplyBoxById,
  getUserStatistic,
} from "../service/supplyBox.service";

export async function createSupplyBoxHandler(
  req: Request<{}, {}, CreateSupplyBoxInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createSupplyBox(body);

    return res
      .status(201)
      .json([{ message: "SupplyBoxs Added Successfully", stockInfo: stock }]);
  } catch (e: any) {
    return res.status(500).send("SupplyBox exists");
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
export async function getAllSupplyBoxsController(req:Request,res:Response){

  try {
    const SupplyBox = await getAllSupplyBoxs();

     res.status(200).json(SupplyBox);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getAllSupplyBoxByRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    const sales = await getSupplyBoxByRange(startDate, endDate);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


export async function getAllSupplyBoxPaginated(req: Request, res: Response) {
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

    const sales = await allSupplyBoxPaginated({
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


//get user
export async function getSupplyBoxsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const SupplyBox = await getSupplyBoxById(id); // Call the getUserById function from your service file

    if (!SupplyBox) {
      res.status(404).json([{ message: 'SupplyBoxs not found' }]);
    } else {
    const { ...responseWithoutCode } = SupplyBox.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateSupplyBoxsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedSupplyBox = await updateSupplyBoxById(id,body);

    if (!updatedSupplyBox) {
      res.status(404).json([{ message: 'SupplyBoxs not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedSupplyBox.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteSupplyBoxsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteSupplyBox = await deleteSupplyBoxById(id);

    if (!deleteSupplyBox) {
      res.status(404).json([{ message: 'SupplyBox not found' }]);

    } else {

        res.status(200).json([{ message: 'SupplyBox Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}