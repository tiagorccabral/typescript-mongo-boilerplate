import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import User from '../modules/users/models/user';

function requireCurrentUser() {
  return [
    // authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {
      if (
        req.headers === undefined
        || req.headers.authorization === undefined
        || !req.headers.authorization
      ) {
        return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Please login' });
      }

      const authHeader = req.headers.authorization;

      const parts = authHeader.split(' ');

      if (parts.length !== 2) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token error' });

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token malformed' });
      // authenticate JWT token and attach user to request object (req.user)
      return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: any) => {
        if (err) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token invalid' });
        const userId = decoded.sub;
        const { params } = req;
        const user = await User.findById(userId); // find user by its ID

        if (user === null || user === undefined) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ error: 'Invalid User ID' });

        if (user.id !== params.id) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'You cannot access this content' });

        // authentication and authorization successful
        return next();
      });
    }
  ];
}

export default requireCurrentUser;
