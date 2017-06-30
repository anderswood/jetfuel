process.env.NODE_ENV = 'testing';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex.js');

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage with html elements', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that doesn\'t exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

});

describe('API Routes', () => {

  // before((done) => {
  //   // Run migrations and seeds for test database
  //   done()
  // });
  //
  beforeEach(done => {
    knex.migrate.rollback()
    .then( () => {
      knex.migrate.latest()
      .then( () => {
        return knex.seed.run()
        .then( () => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/topics', () => {
    it('should return all of the topics', done => {
      chai.request(server)
      .get('/api/v1/topics')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Docs');
        response.body[0].id.should.equal(1);
        done();
      });
    });
  })

  describe('POST /api/v1/topics', () => {
    it('should create a new topic', done => {
      chai.request(server)
      .post('/api/v1/topics')
      .send({
        name: 'the CNN',
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
        chai.request(server)
        .get('/api/v1/topics')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body[2].should.have.property('id');
          response.body[2].should.have.property('name');
          response.body[2].name.should.equal('the CNN');
          response.body[2].id.should.equal(3);
          done();
        })
      });
    });

    it('should not create a topic record with missing data', done => {
      chai.request(server)
      .post('/api/v1/topics')
      .send({animal: 'unicorn'})
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Expected format: { name: <String>}. You are missing the name property.')
        done()
      });
    });

  });

  describe('GET /api/v1/links', () => {
    it('should return all of the links', done => {
      chai.request(server)
      .get('/api/v1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('link_title');
        response.body[0].should.have.property('long_link');
        response.body[0].should.have.property('short_link');
        response.body[0].should.have.property('click_count');
        response.body[0].should.have.property('topic_id');
        response.body[0].id.should.equal(1);
        response.body[0].link_title.should.equal('the google');
        response.body[0].long_link.should.equal('http://www.google.com');
        response.body[0].short_link.should.equal('jet.fuel/5ZvQv');
        response.body[0].click_count.should.equal(3);
        response.body[0].topic_id.should.equal(1);
        done();
      });

    });
  })

  describe('GET /jet.fuel/:short_link', () => {
    it('should redirect the user to the correct \'long\' link', done => {
      chai.request(server)
      .get('/jet.fuel/2H1PG')
      .end((err, response) => {
        response.should.have.status(200);
        response.redirects.should.be.a('array')
        response.redirects[0].should.equal('http://www.twitter.com/')
        done();
      });

    });
  });

}); // end 'API Routes' 'describe'
