import { Request, Response } from "express";
import {getAllActivity,getActivityById,createActivity} from "../service/activity.service";

export async function createActivityController(
  req: Request<{}, {}>,
  res: Response
) {
  const body = req.body;

  try {
    const stock = await createActivity(body);

    return res.status(201).json([{message:"Activity Added Successfully",stockInfo:stock}]);
  } catch (e: any) {

    return res.status(500).send("Activity exists");
  }
}


//get all activity
export async function getAllActivityController(req:Request,res:Response){
  try {
    const activity = await getAllActivity();

     res.status(200).json(activity);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//get activity
export async function getActivityByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const activity = await getActivityById(id); // Call the getUserById function from your service file

    if (!activity) {
      res.status(404).json([{ message: 'activity not found' }]);
    } else {
    const { ...responseWithoutCode } = activity.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

