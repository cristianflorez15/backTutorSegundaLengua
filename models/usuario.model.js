const { Schema, model } = require('mongoose');

const Usuario = Schema({
    nombre : {
        type: String,
        required: true,
        unique: true
    },
    apellido : {
        type: String,
        required: true,
        unique: true
    },
    mail : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
        unique: true
    },
    nativeLanguage : {
        type: String,
        required: true,
        unique: true
    },
    age : {
        type: Number,
        required: true,
        unique: true
    },
})

module.exports = model( 'Usuario', Usuario );