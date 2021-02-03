import moment, { Moment } from 'moment';
import jwt from 'jsonwebtoken';
import config from '../../../config/config';

const generateToken = (userId: any, expires: Moment, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user: any) => {
  const accessTokenExpires = moment().add(config.jwt.expDate, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    }
  };
};

export {
  generateAuthTokens
};
