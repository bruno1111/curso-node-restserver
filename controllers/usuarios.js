const { response } = require('express');

const usuariosGet = (req, res = response) => {
    const { q = 'No query' } = req.query;
    res.json({
        msg: 'get API - Controllers',
        q
    });
}

const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    res.json({
        msg: 'post API - Controllers',
        nombre,
        edad
    });
}

const usuariosPut = (req, res = response) => {
    const { id } = req.params;
    res.json({
        msg: 'put API - Controllers',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controllers'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - Controllers'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}