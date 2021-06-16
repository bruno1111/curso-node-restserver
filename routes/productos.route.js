const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const router = Router();

// Obtener todas las productos - publico
router.get('/', [validarJWT], obtenerProductos);

// Obtener una producto por id - publico
router.get('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear una producto - privado - cualquier persona con token válido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('categoria', 'No es un ID válido').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        validarCampos
    ],
    crearProducto);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    check('id', 'No es un ID válido').isMongoId(),
    // check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    // check('categoria', 'No es un ID válido').isMongoId(),
    // check('categoria').custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto);

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;