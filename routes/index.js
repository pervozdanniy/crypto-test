const allRouters = {
    authRoute: require('./authRoute'),
};

const initializeApplicationRoutes = (app) => {
    for (const property in allRouters) {
        app.use(allRouters[property].basePrefix, allRouters[property].router);
    }
};

module.exports = {
    initializeApplicationRoutes
};