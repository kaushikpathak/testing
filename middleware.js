'use strict';

const logger = require('winston');

const errorHandler = (err, req, res, next) => {
    if (res.statusCode && (res.statusCode === 401 || res.statusCode === 403 || err.status === 403 || err.status === 401)) {
        const statusCode = err.status || res.statusCode;
        logger.warn('Error in security service.', {
            errorData: err
        });
        const securityErrorResponse = formatResponse(statusCode, {
            error: err.message || err
        });
        return res.status(statusCode).json(securityErrorResponse);
    }

    if (err) {
        logger.error('error return as', {
            errorData: err
        });
        const unknownErrorResponse = formatResponse(500, {});
        return res.status(500).json(unknownErrorResponse);
    }
    next();
};
const formatResponse = (statusCode, finalResult) => {
    const returnMsg = getCommonMessages(statusCode);    
    return {
        status: statusCode,
        message: returnMsg,
        result: finalResult
    };
};
const getCommonMessages = (statusCode) => {
    let returnMsg = '';
    switch (statusCode) {
        case 200:
            returnMsg = 'Successful';
            break;
        case 201:
            returnMsg = 'Record created successfully.';
            break;
        case 400:
            returnMsg = 'Bad Request';
            break;
        case 401:
            returnMsg = 'Unauthorized';
            break;
        case 404:
            returnMsg = 'Not Found';
            break;
        case 500:
            returnMsg = 'Internal Server Error';
            break;
        default:
            returnMsg = '';
            break;
    }
    return returnMsg;
};

module.exports = { errorHandler, formatResponse };
