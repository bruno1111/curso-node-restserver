const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
                auth: '/api/auth',
                buscar: '/api/buscar',
                categorias: '/api/categorias',
                productos: '/api/productos',
                uploads: '/api/uploads',
                usuarios: '/api/usuarios'
            }
            //Conectar a base de datos
        this.conectarDB();

        // MIDDELWARES
        this.middelwares();
        // RUTAS
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middelwares() {
        // CORS
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());
        // Durectorio Público
        this.app.use(express.static('public'));
        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.route'));
        this.app.use(this.paths.buscar, require('../routes/buscar.route'));
        this.app.use(this.paths.categorias, require('../routes/categorias.route'));
        this.app.use(this.paths.productos, require('../routes/productos.route'));
        this.app.use(this.paths.uploads, require('../routes/uploads.route'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios.route'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Tuto bein :: ${this.port}`);
        })
    }
}

module.exports = Server;