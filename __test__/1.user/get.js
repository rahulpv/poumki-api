const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../test-server.js');

describe('GET /users', () => {


    it('OK, getting users has no users', (done) => {
        request(app).get('/users')
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('No users found');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });

    it('OK, getting users has 1 user', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Test",
                "lastName" : "User",
                "email" : "test@test.com",
            })
            .then((res) => {
                request(app).get('/users')
                    .then((res) => {
                        const body = res.body;
                        expect(body).to.contain.property("status");
                        expect(body).to.contain.property("message");
                        expect(body).to.contain.property("data");
                        expect(body.status).to.equal(200);
                        expect(body.message).to.equal('Success');
                        expect(body.data).to.contain.property("total");
                        expect(body.data).to.contain.property("limit");
                        expect(body.data).to.contain.property("page");
                        expect(body.data).to.contain.property("pages");
                        expect(body.data.users.length).to.be.above(0)

                        expect(body.data.users[0]).to.contain.property("_id");
                        expect(body.data.users[0]).to.contain.property("firstName");
                        expect(body.data.users[0]).to.contain.property("userName");
                        expect(body.data.users[0]).to.contain.property("lastName");
                        expect(body.data.users[0]).to.contain.property("email");
                        done();
                    })
            })
            .catch((err) => done(err));
    });


})