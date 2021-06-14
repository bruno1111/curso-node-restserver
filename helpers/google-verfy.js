const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const googleVerify = async(id_token = '') => {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID
    });
    const {
        email: correo,
        name: nombre,
        picture: img
    } = ticket.getPayload();
    return { nombre, img, correo };
}

module.exports = { googleVerify }