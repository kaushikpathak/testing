'use strict';

const express = require('express');
const config = require('config');
const logger = require('winston');
const mongoose = require('mongoose');
const routes = require('./routes');
const constants = require('./constants');
const Middleware = require('./middleware');
const apiHandler = require('./apiHandler');

let app = express();
mongoose.connect(config.config.db.mongoUrl, async (err) => {
    if (err) {
      return logger.error('Error in connecting to DB.', { errorData: err });
    }
    try {
    const projects = await apiHandler(logger, constants.PROJECT_END_POINT);
    const messages = await apiHandler(logger, constants.MESSAGE_END_POINT);
    const contacts = await apiHandler(logger, constants.CONTACT_END_POINT);
    const companies = await apiHandler(logger, constants.COMPANY_END_POINT);
  } catch(error) {
    console.log(error)
  }

    //insert projects, messages, contacts and companies in mongo db
  });

app.get('/health', (request, response) => {
    response.jsonp({
        success: true
    });
});

app.use(Middleware.errorHandler);
app.use('/v1', routes);

module.exports = app;