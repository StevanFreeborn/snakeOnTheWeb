import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import server from '../../../server.js';
chai.use(chaiHttp);

describe('ping route', function () {
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
