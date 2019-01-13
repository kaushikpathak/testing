'use strict';

const express = require('express');
const config = require('config');
const logger = require('winston');
const _ = require('lodash');
const routes = require('./routes');
const constants = require('./constants');
const Middleware = require('./middleware');
const apiHandler = require('./apiHandler');

let app = express();

app.set('views', './views')
app.set('view engine', 'pug');

const DBManager = require('./lib/mongo-db-client').create(logger, config.config.db.mongoUrl);
(async () => {
  const dbConn = await DBManager.getConnection();
  const existingData = await dbConn.collection('projects').findOne();
  // Seeding Data in Mongo DB from API
  if (_.isEmpty(existingData)) {
  const { contacts } = await apiHandler(logger, constants.CONTACT_END_POINT);
  let projects = [];
  for (const item of contacts) {
    const contactProject = await apiHandler(logger, `contacts/${item.id}/projects`);
    contactProject.projects.forEach((obj) => {
      obj.staffid = item.id;
    });
    projects = projects.concat(contactProject.projects);
  };
  const { companies } = await apiHandler(logger, constants.COMPANY_END_POINT);
//inserting data mongo db
  try {
    projects = _.uniqBy(projects, 'id');
    await dbConn.collection('projects').insertMany(projects);
    await dbConn.collection('contacts').insertMany(contacts);
    await dbConn.collection('companies').insertMany(companies);
    logger.info('database seeding to mongoDb completed: successfully');
  } catch (error) {
    logger.error('Error occurred while inserting data', { errorData: err });
  }
}
})();


app.get('/health', (request, response) => {
    response.jsonp({
        success: true
    });
});

app.use(Middleware.errorHandler);
app.use(routes);
app.listen(config.config.common.port, function(){
  logger.info(`Server started listening at port ${config.config.common.port}`)
})

module.exports = app;