const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response) => {
    const { id } = req.params;
    // const query = { _id: id, estado: true };
    // const producto = await Producto.findOne(query)
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json(producto);
}

const crearProducto = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoria = req.body.categoria;
    const productoDB = await Producto.findOne({ nombre });
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        categoria,
        usuario: req.usuario._id
    };

    const producto = new Producto(data);
    await producto.save();
    res.status(201).json(producto);
}

const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const nombre = data.nombre;
    const productoDB = await Producto.findOne({ nombre });
    if (productoDB && productoDB._id != id) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json(producto);
}

const borrarProducto = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });
    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}