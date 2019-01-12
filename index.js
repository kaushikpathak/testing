'use strict';

const express = require('express');
const config = require('config');
const logger = require('winston');

const routes = require('./routes');
const constants = require('./constants');
const Middleware = require('./middleware');
const apiHandler = require('./apiHandler');

const DBManager = require('./lib/mongo-db-client').create(logger, config.config.db.mongoUrl);
let app = express();

app.set('views', './views')
app.set('view engine', 'pug');

(async ()=>{
  const dbConn = await DBManager.getConnection();
  const {projects} = await apiHandler(logger, constants.PROJECT_END_POINT);
  const {messages} = await apiHandler(logger, constants.MESSAGE_END_POINT);
  const {contacts} = await apiHandler(logger, constants.CONTACT_END_POINT);
  const {companies} = await apiHandler(logger, constants.COMPANY_END_POINT);

  try {
    // await dbConn.collection('projects').drop();
    await dbConn.collection('projects').insertMany(projects);
      // await dbConn.collection('messages').drop();
    await dbConn.collection('messages').insertMany(messages);
    // await dbConn.collection('contacts').drop();
    await dbConn.collection('contacts').insertMany(contacts);
    // await dbConn.collection('companies').drop();
    await dbConn.collection('companies').insertMany(companies);
    logger.info('database seeding to mongoDb completed: successfully');
  } catch (error) {
    console.log(error);
  }
})();


app.get('/health', (request, response) => {
    response.jsonp({
        success: true
    });
});

app.use(Middleware.errorHandler);
app.use('/v1', routes);
app.listen(config.config.common.port, function(){
  logger.info(`Server started listening at port ${config.config.common.port}`)
})

module.exports = app;