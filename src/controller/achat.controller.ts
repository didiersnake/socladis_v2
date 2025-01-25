import { Request, Response } from "express";
import {
CreateAchatInput,
} from "../schema/achat.schema";
import {
  createAchat,
  deleteAchatById,
  getAllAchats,
  getAchatById,
  updateAchatById,
  allAchatPaginated,
  getAchatByRange,
  getUserStatistic,
} from "../service/achat.service";

export async function createAchatsHandler(
  req: Request<{}, {}, CreateAchatInput>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createAchat(body);

    return res
      .status(201)
      .json([{ message: "Achats Added Successfully", stockInfo: stock }]);
  } catch (e: any) {
    return res.status(500).send("Achat exists");
  }
}

//get all achat
export async function getAllAchatsControllerUnpaginated(
  req: Request,
  res: Response
) {
  try {
    const Achat = await getAllAchats();

    res.status(200).json(Achat);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getAllAchatByRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.body;

    const sales = await getAchatByRange(startDate, endDate);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getAllAchatController(req: Request, res: Response) {
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

    const sales = await allAchatPaginated({
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

export async function getUserStatisticData(req: Request, res: Response) {
  try {
    const result = await getUserStatistic();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

//get achat
export async function getAchatsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const Achat = await getAchatById(id); // Call the getachatById function from your service file

    if (!Achat) {
      res.status(404).json([{ message: 'Achats not found' }]);
    } else {
    const { ...responseWithoutCode } = Achat.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update achat
export async function updateAchatsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedAchat = await updateAchatById(id,body);

    if (!updatedAchat) {
      res.status(404).json([{ message: 'Achats not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedAchat.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete achat
export async function deleteAchatsByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteAchat = await deleteAchatById(id);

    if (!deleteAchat) {
      res.status(404).json([{ message: 'Achat not found' }]);

    } else {

        res.status(200).json([{ message: 'Achat Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}