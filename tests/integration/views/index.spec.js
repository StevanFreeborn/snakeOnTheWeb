import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import server from '../../../server.js';
import fs from 'fs';
chai.use(chaiHttp);

describe('index route', function () {
  it('should return the index view', function (done) {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        const indexView = fs.readFileSync(
          process.cwd() + '/views/index.html',
          'utf-8'
        );

        if (err) console.log(err);
        expect(res.status).to.be.equal(200, 'response status code is not 200');
        expect(res.header['content-type']).to.be.equal(
          'text/html; charset=UTF-8',
          'response does not have correct content type header'
        );

        expect(res.text).to.be.equal(
          indexView,
          'response text does not equal index view'
        );
        
        done();
      });
  });
});
