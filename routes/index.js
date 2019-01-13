'use strict';
const middleWare = require('../middleware');
const Constants = require('../constants');
const service = require('../service');
const logger = require('winston');
const express = require('express');
const config = require('config');
const router = new express.Router();
const DBManager = require('../lib/mongo-db-client').create(logger, config.config.db.mongoUrl);

router.get('/project/:staffId', async (request, response) => {

    try {
        const dbConn = await DBManager.getConnection();
        const serviceObj = service.create(dbConn);

        const data = await serviceObj.getProjects(request.params.staffId);
        response.render('projects',{
            projects:data.projectCompanies,
            staff:data.staff
        });
    } catch (error) {
        logger.error('Error occurred while fetching data from db', { errorData: err });
    }
    
});

/** Invalid URL routes */
router.get('*', invalidUrlResponse);
router.post('*', invalidUrlResponse);
router.put('*', invalidUrlResponse);

function invalidUrlResponse(request, response) {
    const finalResponse = middleWare.formatResponse(404,
        { error: Constants.ERROR_MSG.INVALID_URL });
        logger.info('returned error as', finalResponse );
    return response.status(finalResponse.status).json(finalResponse);
}

module.exports = router;