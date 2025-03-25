// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: 'admin' | 'instructor' | 'student';
}

export const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Optionally attach the decoded user info to the request object
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
