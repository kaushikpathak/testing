"use strict";
const RequestPromise = require("request-promise");
const config = require('config');

function callProWorkFlowAPI(log, options) {
  log.info("Requesting ProWorkFlow API with:", { data: options });
  return new RequestPromise(options, err => {
    if (err) {
      log.error("error in calling ProWorkFlow API", { errorData: err });
    }
  });
}
function getAPIDataSettings(log, endPoint) {
  const options = {
    method: "GET",
    uri: `${config.config.common.proWorkFlowAPIUrl}/${endPoint}`,
    headers: {
      username: config.config.common.userName,
      password: config.config.common.password,
      apiKey: config.config.common.apiKey,
      Authorization: "Basic ZzFrSmZTazczaGo6dUg4M005cUs3MTNiY3pEMTg="
    },
    json: true
  };
  return callProWorkFlowAPI(log, options);
}

module.exports = getAPIDataSettings;
