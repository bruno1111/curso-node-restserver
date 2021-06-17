const { response } = require("express");
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const fs = require('fs');
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {


    try {
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

const actualizarArchivo = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó valida esto" })
            break;
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // Borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    try {
        modelo.img = await subirArchivo(req.files, undefined, coleccion);
    } catch (msg) {
        res.status(400).json({ msg });
    }
    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó validar esto" })
            break;
    }

    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    }

    res.json({ msg: "Falta el placeholder" });
}

const actualizarArchivoCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: "Se me olvidó valida esto" })
            break;
    }

    if (modelo.img) {
        // Borrar imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }



    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
    } catch (msg) {
        res.status(400).json({ msg });
    }

    await modelo.save();
    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}