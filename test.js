const assert = require('assert');

const express = require('express');
const request = require('supertest');

const HttpError = require('rdi-http-error');
const expressErrors = require('./index');
const {notfound, allErrors, responsePatch} = expressErrors();

describe('Express Errors', () => {
  it('allErrors (Error)', async () => {
    const server = express();

    server.use((req, res, next) => next(new Error('Error!')));
    server.use(allErrors);

    await request(server).get('/').expect(500).expect('Server error!');
  });

  it('allErrors (HttpError)', async () => {
    const server = express();

    server.use((req, res, next) => next(new HttpError(403)));
    server.use(allErrors);

    await request(server).get('/').expect(403).expect('Forbidden');
  });

  it('allErrors json response', async () => {
    const server = express();

    server.use((req, res, next) => next(new HttpError(403)));
    server.use(allErrors);

    await request(server)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({message: 'Forbidden'});
  });

  it('not found', async () => {
    const server = express();

    server.use(notfound);
    server.use(allErrors);

    await request(server).get('/').expect(404).expect('Not Found');
  });

  it('throw', async () => {
    const server = express();

    responsePatch(server);

    server.use((req, res, next) => res.throw(408, next));
    server.use(allErrors);

    await request(server).get('/').expect(408).expect('Request Timeout');
  });
});
