const mongoose = require('mongoose');
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, dbOptions);
        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión con la base de datos');
    }
}

module.exports = {
    dbConnection
}