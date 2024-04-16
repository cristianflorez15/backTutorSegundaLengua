const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config')
const conversacion = require('../models/conversacion.model');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

class ConversacionController{

    async crear(req=request, res=response){

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = req.body.mensajes[0]?.parts[0]?.text;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = {parts: [{text: response.text()}], role: "model"};
        req.body.mensajes.push(text);

        try {
            // const payload = jwt.verify(req.headers.authorization.slice(7,req.headers.authorization.length), config.jwtSecret);
            // let payload = jwt.verify(req.headers.authorization, config.jwtSecret);
            const conver = new conversacion({...req.body});
            const conversacionCreada = await conver.save()
            if(conversacionCreada){
                return res.status(200).json({message: 'Conversación iniciada', status: 200, data: conversacionCreada });
            }else{
                return res.status(400).json({message: 'Problemas para iniciar la conversación', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas con el servidor', status: 500});
        }
    }

    async continuar(req = request, res = response){
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        let conver = await conversacion.findById(req.body._id);

        if(conver){
            try {
                const chat = model.startChat({
                    history: req.body.mensajes.slice(0, req.body.mensajes.length-1)
                })
                const result = await chat.sendMessage(req.body.mensajes[req.body.mensajes?.length -1]?.parts[0]?.text);
                const response = result.response;
                const text = {parts: [{text: response.text()}], role: "model"};

                req.body.mensajes.push(text);

                let conversacionActualizada = await conversacion.findByIdAndUpdate(req.body._id, req.body).then(async rta => {
                    let last = await conversacion.findById(rta._id);
                    return last
                });

                if(conversacionActualizada){
                    return res.status(200).json({message: 'Conversación actualizada', status: 200, data: conversacionActualizada });
                }else{
                    return res.status(500).json({message: 'Problemas para actualizar la conversación', status: 500});
                }
            } catch (error) {
                console.log(error)
                return res.status(500).json({message: 'Problemas con el servidor', status: 500});
            }
        }else{
            return res.status(400).json({message: 'Problemas para encontrar la conversación', status: 400});
        }

        

    }

    async getOne(req = request, res = response){

    }

    async getAll(req = request, res = response){
        try {
            let chats = await conversacion.find({userId: req.body.userId})
            if(chats){
                return res.status(200).json({message: 'Ok', status: 200, data: chats });
            }else{
                return res.status(400).json({message: 'No se encontraron chats', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas en el servidor', status: 500});
        }
    }

}

module.exports = ConversacionController;