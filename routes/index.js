'use strict';
const middleWare = require('../middleware');
const Constants = require('../constants');
const logger = require('winston');
const express = require('express');
const router = new express.Router();

//router.get('/project/:staffId', Promise.resolve('test'));

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