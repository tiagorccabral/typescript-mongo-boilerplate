import Joi from 'joi';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required()
  })
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
};

export {
  getUser,
  createUser
};
