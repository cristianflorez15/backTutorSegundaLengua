const Joi = require('joi');

const nombre = Joi.string();
const apellido = Joi.string();
const mail = Joi.string();
const password = Joi.string();
const nativeLanguage = Joi.string();
const age = Joi.number();
const id = Joi.string();

const crearUsuario = Joi.object({
    nombre : nombre.required(),
    apellido : apellido.required(),
    mail : mail.required(),
    password : password.required(),
    nativeLanguage : nativeLanguage.required(),
    age : age.required(),
})

const editarUsuario = Joi.object({
    nombre : nombre,
    apellido : apellido,
    mail : mail,
    password : password,
    nativeLanguage : nativeLanguage,
    age : age,
})

const idUsuario = Joi.object({
    id : id.required(),
})

const loginUsuario = Joi.object({
    mail: mail.required(),
    password: password.required(),
})

module.exports = { crearUsuario, editarUsuario, idUsuario, loginUsuario }