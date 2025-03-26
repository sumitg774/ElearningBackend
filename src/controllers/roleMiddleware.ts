import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

export const roleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('No token provided');
      return next();
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (decoded.role) {
      res.setHeader('X-User-Role', decoded.role);
      logger.info(`User role ${decoded.role} set in header`);
    } else {
      logger.warn('User role not found in token');
    }
  } catch (error) {
    logger.error(`Error decoding token: ${error.message}`);
  }

  next();
};
