/**
 * Заглушка неподдерживаемого типа
 */

const def = (status, result, req, res) =>
  res.status(406).send('Not Acceptable');

const txt = (status, result, req, res) =>
  res.status(status).send(result.message);

const json = (status, result, req, res) =>
  res.status(status).send(result);

module.exports = {default: def, text: txt, html: txt, json};
