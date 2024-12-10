import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    decodedUser?: {};
  }

// Middleware to verify the JWT token
export const auth = (req: AuthenticatedRequest, res: Response, next: any) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(403).json({ message: 'You are not authenticate' });
    }
  
    jwt.verify(token, 'secretKey', (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
  
      // Store the decoded user information in the request object for later use
      req.decodedUser = decoded.user;
      next();
    });
  };