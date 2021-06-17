const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verfy');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}