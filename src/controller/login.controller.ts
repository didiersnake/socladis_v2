import { Request, Response } from "express";
import { nanoid } from "nanoid";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { LoginSessionInput } from "../schema/login.schema";
import { findUserByName } from "../service/user.service";
import { createActivity } from '../service/activity.service';

export async function LoginUserHandler(req: Request<{}, {}, LoginSessionInput>,res: Response) {
    const { name, password} = req.body;

    const user = await findUserByName(name);

    if(!user){
        return res.status(400).json([{message:'User is not registered'}]);
    }
    if(user && password === user.password){

         // Save login activity
    const loginActivity = await createActivity({
      userId: user._id,
      userName: user.name,
      timestamp: new Date(),
      ipAddress: req.ip, // Assuming Express is configured to handle IP address
      activity: "Logged In"
    });

    // console.log("Ip address",req.ip)

    await loginActivity.save();
  

        // res.status(200).json({
        //   user
        // })
  // Generate a JWT token
  jwt.sign(
    { 
      _id:user._id,
      name:user.name,
   }, 'secretKey',{expiresIn:'12h'}, (err:any, token:any) => {
    if (err) {
      res.status(500).json({ error: 'Failed to generate token' });
    } else {
      res.cookie('token', token, { httpOnly: true });
      res.json({ token:token,user:user});
    }
  });

    }else {
        res.json([{message: "Invalid Credentials"}])
    }
  }