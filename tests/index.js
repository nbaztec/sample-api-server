/**
 * Created by nisheeth on 25/7/16.
 */

const moment = require('moment');
const request = require('supertest');
const chai = require('chai');
const chaiThings = require('chai-things');

const config = require('../config');
const jwtHelper = require('../helpers/jwt')();

const expect = chai.expect;

chai.use(chaiThings);

// Suppress morgan logging
process.env.NODE_ENV = 'test';

const app = require('../app');

describe('health', () => {

  describe('/', () => {

    it('GET should return 200', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('status', 'OK');
          done(err);
        })
    });

    it('POST should return 200', (done) => {
      request(app)
        .post('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('status', 'OK');
          done(err);
        })
    });
  });

  describe('/auth/token', () => {
    it('POST should not return 404', (done) => {
      request(app)
        .post('/auth/token')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).to.not.equal(404);
          done(err);
        })
    });
  });

  describe('/api', () => {
    it('GET should return 400 without token', (done) => {
      request(app)
        .get('/api')
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('error');
          done(err);
        })
    });
  });
});

var token = null;
describe('Authentication', () => {

  describe('/auth', () => {

    it('POST /token should return 400 on invalid creds', (done) => {
      request(app)
        .post('/auth/token')
        .send({
          username: '-',
          password: '-'
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('error');
          done(err);
        })
    });

    it('POST /token should return 200 on valid creds', (done) => {
      request(app)
        .post('/auth/token')
        .send({
          username: config.user.username,
          password: config.user.password
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done(err);
        })
    });
  });
});

describe('API', () => {

  describe('/api', () => {

    it('POST / should return 200 on valid token', (done) => {
      request(app)
        .post('/api')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('version');
          done(err);
        })
    });

    it('POST / should return 400 on expired token', (done) => {
      const expiredToken = jwtHelper.encode('foo', moment().subtract(1, 'days').unix())
      request(app)
        .post('/api')
        .set('Authorization', expiredToken)
        .expect(400)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body).to.have.property('error');
          done(err);
        })
    });
  });
});