const express = require('express');

const bcrypt = require('bcrypt');
//generar token
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => { //autentificacion

    let body = req.body;

    //que email exista, callback(error y usuario)
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { 

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) { //no existe el ususario en la base de datos
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //evaluar contraseña 
        // con bcrypt encripta la contraseña ingresada y verifica si hace match con la de la base de datos.
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        //generamos el token
        let token = jwt.sign({
            usuario: usuarioDB // la infromacion d ela BD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //secret y fecha de expiraciòn 

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });

});







module.exports = app;