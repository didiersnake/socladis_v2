import { Request, Response } from "express";
import { CreateGroupInput } from "../schema/group.shema";
import {
  createGroup,
  deleteGroupById,
  getAllGroups,
  getGroupById,
  updateGroupById
} from "../service/group.service";
import { getUserById } from "../service/user.service";

export async function createGroupHandler(
  req: Request<{}, {}, CreateGroupInput>,
  res: Response
) {
  const body = req.body;

// console.log(body.members)
// //VERIFY IF USER EXIST IN THE SYSTEM

// for (const member of body.members) {
//   const user = await getUserById(member.userId);
//   if (user) {
//     console.log(`User ${user.name} exists in the system.`);
    
//   } else {
//     console.log(`User with user Name ${member.userName} not found in the system.`);
//     const user = await getUserById(member.userId);

//   }
// }

  try {
    const group = await createGroup(body);

    return res.status(201).json([{message:"group Added Successfully",groupInfo:group}]);
  } catch (e: any) {
 
    return res.status(500).send("group exists");
  }
}


//get all group
export async function getAllGroupController(req:Request,res:Response){

  try {
    const group = await getAllGroups(); 

     res.status(200).json(group);
    
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//get group
export async function getGroupByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const group = await getGroupById(id); // Call the getUserById function from your service file

    if (!group) {
      res.status(404).json([{ message: 'group not found' }]);
    } else {
    const { ...responseWithoutCode } = group.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update group
export async function updateGroupByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedGroup = await updateGroupById(id,body);

    if (!updatedGroup) {
      res.status(404).json([{ message: 'Group not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { ...responseWithoutCode } = updatedGroup.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete group
export async function deleteGroupByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteGroup = await deleteGroupById(id);

    if (!deleteGroup) {
      res.status(404).json([{ message: 'Group not found' }]);

    } else {

        res.status(200).json([{ message: 'Group Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}