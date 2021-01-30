import Joi from 'joi';

const loginUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
};

export {
  loginUser
};
