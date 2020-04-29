const logger = require('../config/winston')(__filename)
const config = require('../config/env')

const stream = {
  write: message => {
    logger.info(message)
  }
}

const errorHandler = {
  handleError: error => {
    logger.error(`${error.code || 500} - ${error.message}`)
    switch (error.errorType) {
      default:
        return true
    }
  },
  isTrustedError: error => error.isOperational
}

const errorMiddleware = (err, req, res, next) => {
  console.log('asdsadasdsad', req.userId)
  logger.error(
    `${err.code || 500}${
      req.userId ? ` - usuario_id: ${req.userId}` : ''
    } - errMsg: ${err.message} - url: ${req.originalUrl} - method: ${
      req.method
    } - ip: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress} - error: ${JSON.stringify(err, null, 2)}`
  )

  if (!err.isOperational && config.env.local !== 'test') {
    return process.exit(1)
  }

  switch (err.errorType) {
    default:
      return res.status(err.code || 200).json(err)
  }
}

const notFoundHandler = (req, res) => {
  res.status(404).send()
}

module.exports = {
  errorMiddleware,
  errorHandler,
  notFoundHandler,
  stream
}
