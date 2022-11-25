const Joi = require('joi')

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email().messages({
            "string.empty": `Email cannot be an empty field`,
            "any.required": `Email is a required field`,
        }),
        password: Joi.string().required().messages({
            "string.empty": `Password cannot be an empty field`,
            "any.required": `Password is a required field`,
        })
    })
}

const register = {
    body: Joi.object().keys({
        username: Joi.string().required().messages({
        "string.empty": `username cannot be an empty field`,
        "any.required": `username is a required field`,
      }),
      password: Joi.string().required().messages({
        "string.empty": `Password cannot be an empty field`,
        "any.required": `Password is a required field`,
      }),
      email: Joi.string().email().required().messages({
        "string.empty": `email cannot be an empty field`,
        "any.required": `email is a required field`,
      }),
      phone: Joi.string().required().messages({
        "string.empty": `phone cannot be an empty field`,
        "any.required": `phone is a required field`,
      })
    })
}


module.exports = {
    login,
    register
}