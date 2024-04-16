const Joi = require('joi');

const nombre = Joi.string();
const apellido = Joi.string();
const correo = Joi.string();
const contrasena = Joi.string();
const idiomaNativo = Joi.string();
const fechaNacimiento = Joi.date();
const id = Joi.string();

const crearUsuario = Joi.object({
    nombre : nombre.required(),
    apellido : apellido.required(),
    correo : correo.required(),
    contrasena : contrasena.required(),
    idiomaNativo : idiomaNativo.required(),
    fechaNacimiento : fechaNacimiento.required(),
})

const editarUsuario = Joi.object({
    nombre : nombre,
    apellido : apellido,
    correo : correo,
    contrasena : contrasena,
    idiomaNativo : idiomaNativo,
    fechaNacimiento : fechaNacimiento,
})

const idUsuario = Joi.object({
    id : id.required(),
})

const loginUsuario = Joi.object({
    correo: correo.required(),
    contrasena: contrasena.required(),
})

module.exports = { crearUsuario, editarUsuario, idUsuario, loginUsuario }