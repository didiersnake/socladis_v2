import { Request, Response } from "express";
import {
CreateRetourInput,
} from "../schema/retour.schema";
import {
  createRetour,
  deleteRetourById,
  getAllRetours,
  getRetourById,
  updateRetourById
} from "../service/retour.service";

export async function createRetoursHandler(
  req: Request<{}, {}, CreateRetourInput>,
  res: Response
) {
  const body = req.body;

  try {
    const retour = await createRetour(body);

    return res.status(201).json([{message:"Retours Added Successfully",retourInfo:retour}]);
  } catch (e: any) {
 
    return res.status(500).send("Retour exists");
  }
}


//get all Retour
export async function getAllRetoursController(req:Request,res:Response){

  try {
    const Retour = await getAllRetours();

     res.status(200).json(Retour);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//get Retour
export async function getRetoursByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const Retour = await getRetourById(id); // Call the getRetourById function from your service file

    if (!Retour) {
      res.status(404).json([{ message: 'Retours not found' }]);
    } else {
    const { ...responseWithoutCode } = Retour.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update Retour
export async function updateRetoursByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedRetour = await updateRetourById(id,body);

    if (!updatedRetour) {
      res.status(404).json([{ message: 'Retours not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedRetour.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete Retour
export async function deleteRetoursByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteRetour = await deleteRetourById(id);

    if (!deleteRetour) {
      res.status(404).json([{ message: 'Retour not found' }]);

    } else {

        res.status(200).json([{ message: 'Retour Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}