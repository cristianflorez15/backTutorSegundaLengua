const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config')
const bcrypt = require('bcrypt');
const usuario = require('../models/usuario.model');

class UsuarioController{

    async create(req=request, res=response){
        try {
            var nuevoUsuario = new usuario({...req.body, password: await bcrypt.hash(req.body.password, 10)});
            var usuarioCreado = await nuevoUsuario.save().then(usuario => {
                return usuario._id;
            });
            if(usuarioCreado){
                return res.status(200).json({message: 'Usuario creado exitosamente', status: 200, id: usuarioCreado});
            }else{
                return res.status(400).json({message: 'Problemas para crear usuario', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas en el servidor', status: 500});
        }
    }

    async edit(req=request, res=response){
        try {
            var usuarioActualizado = await usuario.findByIdAndUpdate(req.query.id, req.body).then(usuario => {
                if(usuario){
                    return usuario._id;
                }
            });
            if(usuarioActualizado){
                return res.status(200).json({message: 'Usuario editado exitosamente', status: 200, id: usuarioActualizado});
            }else{
                return res.status(400).json({message: 'Usuario no encontraddo', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas para editar el usuario', status: 500});
        }
    }

    async get(req=request, res=response){
        try {
            var user = await usuario.findOne({_id: req.query.id}).then(us => {
                if(us){
                    return ({
                        nombre : us.nombre,
                        mail : us.mail,
                        nativeLanguage : us.nativeLanguage,
                        age : us.age
                    })
                }
            });
            if(user){
                return res.status(200).json({message: 'Usuario encontrado', data: user, status: 200});
            }else{
                return res.status(400).json({message: 'Usuario no encontrado', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas para consultar el usuario', status: 500});
        }
    }

    async delete(req=request, res=response){
        try {
            var user = await usuario.findByIdAndDelete({_id: req.query.id});
            if(user){
                return res.status(200).json({message: 'Usuario eliminado', status: 200});
            }else{
                return res.status(400).json({message: 'Usuario no encontrado', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas para eliminar el usuario', status: 500});
        }
    }

    async login(req = request, res = response){
        try {
            const password = req.body.password;
            const user = await usuario.findOne({mail: req.body.mail});

            if(user){
                const isMatch = await bcrypt.compare(password, user.password);

                if(isMatch){
                    const payload = {
                        nombre: user.nombre,
                        mail: user.mail
                    };
                    const token = jwt.sign(payload, config.jwtSecret);
                    return res.status(200).json({ token: token, nombre: payload.nombre, status: 200 });
                }else{
                    return res.status(400).json({message: "Contraseña incorrecta", status: 400})
                }
                
            }else{
                return res.status(404).json({message: "Usuario no encontrado", status: 404})
            }       
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Problemas para iniciar sesión', status: 500});
        }
          
    }

}

module.exports = UsuarioController;