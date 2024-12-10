import { Request, Response } from "express";
import {customAlphabet }from 'nanoid'
import bcrypt from 'bcryptjs'
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  deleteUserById,
  findUserByName,
  findUserById,
  getUserById,
  updateUserById,
  getAllEmployeeUsers,
  getAllClientUsers
} from "../service/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";
import { allUsersPaginated } from "../service/user.service"



const nanoid = customAlphabet('0123456789', 5)


export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;
  const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(req.body.password, salt);
  
  try {

    const user = await createUser({
      ...body,
      // password:hash
    });

    // await sendEmail({
    //   to: user.email,
    //   from: "xavierlamar17@gmail.com",
    //   subject: "Account created successfully",
    //   text: `Verify your email with verification code: ${user.verificationCode} and Id: ${user._id}`,
    // });

    return res.status(201).json([{message:"User created successfully",userId: user._id}]);
  } catch (e: any) {
 
    return res.status(500).send("User exists");
  }
}


//get all user
export async function getAllUserController(req:Request,res:Response){

  try {
    const { pageIndex = 0, pageSize = 10, sort, query } = req.body;

    const users = await allUsersPaginated({
      pageIndex,
      pageSize,
      sort,
      query,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

export async function getAllEmployeeController(req: Request, res: Response) {
  
  try {
    const stock = await getAllEmployeeUsers();

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}

export async function getAllClientsController(req: Request, res: Response) {
  try {
    const stock = await getAllClientUsers();

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json([{ message: "Internal Server Error" }]);
  }
}


//get user
export async function getUserByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const user = await getUserById(id); // Call the getUserById function from your service file

    if (!user) {
      res.status(404).json([{ message: 'User not found' }]);
    } else {
    const { password, ...responseWithoutCode } = user.toObject();

     res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//update user
export async function updateUserByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const body = req.body;
    const updatedUser = await updateUserById(id,body);

    if (!updatedUser) {
      res.status(404).json([{ message: 'User not found' }]);

    } else {
            // Exclude the verificationCode and passwordResetCode field from the response
            const { password, ...responseWithoutCode } = updatedUser.toObject();

            res.status(200).json(responseWithoutCode);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}

//delete user
export async function deleteUserByIdController(req:Request,res:Response){

  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const deleteUser = await deleteUserById(id);

    if (!deleteUser) {
      res.status(404).json([{ message: 'User not found' }]);

    } else {

        res.status(200).json([{ message: 'User Deleted Successfully' }]);
    }
  } catch (error) {
    res.status(500).json([{ message: 'Internal Server Error' }]);
  }

}