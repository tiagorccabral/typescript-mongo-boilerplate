import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import User from '../modules/users/models/user';

function verifyAuthorization(roles: Array<'regular' | 'admin' | null> = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  let rolesArray: Array<string | null>;
  if (typeof roles === 'string') {
    rolesArray = [roles];
  } else {
    rolesArray = roles;
  }

  return [
    // authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Please login' });

      const parts = authHeader.split(' ');

      if (parts.length !== 2) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token error' });

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token malformed' });
      // authenticate JWT token and attach user to request object (req.user)
      return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: any) => {
        if (err) return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Token invalid' });
        const userId = decoded.sub;
        // const userRole = 'admin';
        const userRole = (await User.findById(userId)).role; // find user role by its ID
        //
        if (rolesArray.length && !rolesArray.includes(userRole)) {
          // user's role is not authorized
          return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized role' });
        }
        // authentication and authorization successful
        return next();
      });
    }
  ];
}

export default verifyAuthorization;
