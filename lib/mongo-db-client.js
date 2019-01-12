'use strict';

const { MongoClient } = require('mongodb');

const connectDatabase = (logger, mongoUrl, { baseTimeout = 1000, maxAttempts = 190 } = {}) => (
  new Promise((resolve, reject) => {
    const tryGetConnection = async attempt => {
      const attempts = attempt + 1;
      const waitTime = baseTimeout * attempts;

      try {
        logger.info('connecting to mongo');
        const connection = await MongoClient.connect(mongoUrl);
        logger.info('connected to mongo');
        const db = await connection.db('proworkflow');
        const collectionArr = await db.listCollections();
        collectionArr.destroy();
        resolve(db);
      } catch (ex) {
        logger.error('failure connecting to mongo', { errorData: ex, attempts, maxAttempts });
        if (attempts >= maxAttempts) {
          reject(new Error('Maximum attempts tried.'));
        } else {
          setTimeout(tryGetConnection, waitTime, attempts);
        }
      }
    };
    tryGetConnection(0);
  })
);

function create(logger, mongoUrl) {
  const connection = connectDatabase(logger, mongoUrl);

  return {
    async getConnection() {
      try {
        const database = await connection;
        return database;
      } catch (ex) {
        log.warn('Error connecting to database', { errorData: ex });
        throw ex;
      }
    }
  };
}

module.exports = { create };
