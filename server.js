require("dotenv").config();
const http = require("http");
const app = require("./app");
const db = require("./model");
const { normalizePort } = require("./util/helper");
const appConfig = require("./config/app.config");

const roleInit = require("./util/init/roleInit");
const appInit = require("./util/init/appInit");

const initializeServer = async () => {
    console.log("::: NODE_ENV: " + appConfig.env + " :::")

    try {
        await db.sequelize.sync({
            alter: true
        });
        console.log("::: SEQUELIZE SYNC COMPLETE :::");
        if(appConfig.rolesTableInit === 1) {
            await roleInit.init();
        }
        await appInit.init();
    } catch (err) {
        console.error(err);
    }

}

const createServer = () => {
    const port = normalizePort(appConfig.port || '3000');
    app.set('port', port);

    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Sample Project Server is running. Details: port =>${port} | process =>${process.pid}`);
    });

    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
}

initializeServer()
    .then(() => createServer());
