/* модуль обработки ошибок */

const HttpError = require('rdi-http-error');
const defaultFormats = require('./formats');

/**
 * Создает middleware для обработки всех ошибок
 *
 * @param   {Object}  formats
 * @param   {Boolean} devMode
 *
 * @returns {Function}
 */
function createAllErrorsHandler(formats, devMode) {
  return (error, req, res, next) => {
    if (!(error instanceof HttpError)) {
      error = new HttpError(500, {message: error.message});
    }

    let {status, body:result} = error;

    if (!Reflect.has(result, 'message')) {
      result.message = error.message;
    }

    if (devMode) {
      result.__error = {
        name: error.name,
        stack: error.stack
      };
    }
    // production hide details
    else if (status >= 500) {
      result = {message: 'Server error!'};
    }

    res.set(error.headers);

    res.format({
      text: () => formats.text(status, result, req, res),
      html: () => formats.html(status, result, req, res),
      json: () => formats.json(status, result, req, res),
      default: () => formats.default(status, result, req, res)
    });
  };
}

/* middleware для обработки 404 ошибки */
const notfound = (req, res, next) => next(new HttpError(404));

const responsePatch = app => {
  app.response.throw = function(...args) {
    const lastArg = args.slice(-1);

    if (typeof lastArg === 'function') {
      const errorArgs = args.slice(0, -1);

      lastArg(new HttpError(...errorArgs));
    }
    else {
      throw new HttpError(...args);
    }
  };
};

module.exports = ({formats=defaultFormats, devMode=false} = {}) => {
  const allErrors = createAllErrorsHandler(formats, devMode);

  return {notfound, allErrors, responsePatch};
};
