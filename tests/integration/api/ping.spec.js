import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import setupApp from '../../../startup/setupApp.js';
import setupServer from '../../../startup/setupServer.js';
chai.use(chaiHttp);

describe('ping route', function () {
  let server;

  before(function (done) {
    const app = setupApp();
    server = setupServer(app);
    server = server.listen(process.env.PORT || 8000, done);
  });

  after(function(done) {
    server.close();
    done();
  })

  it("should return i'm alive message", function (done) {
    chai
      .request(server)
      .get('/api/ping')
      .end((err, res) => {
        if (err) console.log(err);
        expect(res.status).to.be.equal(200, 'response status code is not 200');
        expect(res.header['content-type']).to.be.equal(
          'application/json; charset=utf-8',
          'response does not have correct content type header'
        );

        expect(res.body).to.haveOwnProperty(
          'message',
          "i'm alive",
          'response body does not have correct message property'
        );

        done();
      });
  });
});
