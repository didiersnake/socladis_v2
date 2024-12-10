import { Request, Response } from "express";
import {
CreateChargementInput,
} from "../schema/chargement.schema";
import {
  createCharge,
  deleteChargeById,
  getAllCharges,
  getChargeById,
  updateChargeById
} from "../service/chargement.service";
import StockModel, { IStock } from "../model/stock.model"

export async function createChargeHandler(
  req: Request<{}, {}, CreateChargementInput>,
  res: Response
) {
  const body = req.body;

  try {
    for (const product of body.products) {
      const existingStock = await StockModel.findOne({ name: product.name, format: product.format });

      if (existingStock) {
        if (
          Number(existingStock.quantity) >= Number(product.quantity) 
        ) {
          let decrementedQuantity = Number(existingStock.quantity);
          decrementedQuantity -= Number(product.quantity);
          existingStock.quantity = decrementedQuantity.toString();

          await existingStock.save();
        } else {
          return res.status(400).json([{ message: 'Not enough quantity in the stock to sell ' + existingStock.name }]);
        }
      } else {
        return res.status(404).json([{ message: 'Stock not found' }]);
      }
    }

    const charge = await createCharge(body);
    return res.status(201).json([{ message: 'Chargement Added Successfully', chargeInfo: charge }]);
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while processing the chargement');
  }
}


//get all charge
export async function getAllChargeController(req:Request,res:Response){

  try {
    const charge = await getAllCharges(); 
     res.status(200).json(charge);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//get charge
export async function getChargeByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const charge = await getChargeById(id); // Call the getchargeById function from your service file

    if (!charge) {
      res.status(404).json([{ message: 'charge not found' }]);
    } else {
    const { ...responseWithoutCode } = charge.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update charge
export async function updateChargeByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedCharge = await updateChargeById(id,body);

    if (!updatedCharge) {
      res.status(404).json([{ message: 'Charge not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedCharge.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete charge
export async function deleteChargeByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteCharge = await deleteChargeById(id);

    if (!deleteCharge) {
      res.status(404).json([{ message: 'Charge not found' }]);

    } else {

        res.status(200).json([{ message: 'Charge Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}