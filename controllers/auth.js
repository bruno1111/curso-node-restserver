const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verfy");

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {
        // Veriicar si el email existe 
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - correo' });
        }
        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - estado:false' });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario / Contraseña no son correctos - password' });
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Algo salió mal" });
    }
}

const googleSignin = async(req, res = response) => {
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: '>:(',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB es false
        if (!usuario.estado) {
            return res.status(401).json({ msg: 'Hable con el administrador, usuario bloqueado' });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({ usuario, token })
    } catch (error) {
        res.status(400).json({ msg: 'El token de Google no es valido' })
    }
}

module.exports = { login, googleSignin };