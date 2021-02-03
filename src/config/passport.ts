import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../modules/users/models/user';

import config from '../config/config';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload: any, next: any) => {
  try {
    const user = await User.findOne({ where: { id: payload.sub } });
    if (!user) {
      return next(null, false);
    }
    return next(null, user);
  } catch (error) {
    return next(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export {
  jwtStrategy
};
