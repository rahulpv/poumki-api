const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../test-server.js');

describe('POST /users', () => {

    it('OK, creating a new user', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Test",
                "lastName" : "User",
                "email" : "test1@test.com",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(200);
                expect(body.message).to.equal('Success');
                expect(body.data).to.contain.property("_id");
                expect(body.data).to.contain.property("firstName");
                expect(body.data).to.contain.property("lastName");
                expect(body.data).to.contain.property("email");
                done();
            })
            .catch((err) => done(err));
    });

    it('OK, creating a duplicate user', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Member",
                "lastName" : "Test",
                "email" : "membertet@test.com",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(200);
                expect(body.message).to.equal('Success');
                expect(body.data).to.contain.property("_id");
                expect(body.data).to.contain.property("firstName");
                expect(body.data).to.contain.property("lastName");
                expect(body.data).to.contain.property("email");
                done();
            })
            .catch((err) => done(err));
    });


    it('Fail,empty firstName', (done) => {
        request(app).post('/users')
            .send({
                "lastName" : "User",
                "userName" : "test22",
                "email" : "test22@test.com",
                "password": "123456",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('First Name required');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail,empty lastName', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Test",
                "userName" : "test22",
                "email" : "test22@test.com",
                "password": "123456",
            })
            .then((res) => {
                const body = res.body;

                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('Last Name required');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail,empty email', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Test",
                "lastName" : "User",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('Email required');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });

    it('Fail, first Name required minimum 3 character', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Te",
                "lastName" : "User",
                "email" : "test122@test.com",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('First Name required minimum 3 character');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail, first Name allowed only maximum 15 character', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Testtesttesttesttest",
                "lastName" : "User",
                "email" : "test122@test.com"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('First Name allowed only maximum 15 character');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail, first Name Special Characters not allowed', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "e$%sttest",
                "lastName" : "User",
                "email" : "test122@test.com"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('First Name Special Characters not allowed');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail, last Name allowed only maximum 15 character', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "test",
                "lastName" : "Useruseruseruseruseruser",
                "email" : "test122@test.com"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('Last Name allowed only maximum 15 character');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });
    it('Fail, last Name Special Characters not allowed', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "test",
                "lastName" : "User#$34",
                "email" : "test122@test.com"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('Last Name Special Characters not allowed');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });

    it('Fail, Invalid Email', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "test",
                "lastName" : "User34",
                "email" : "test122test.com"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('Invalid Email');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });

    it('Fail,duplicate email', (done) => {
        request(app).post('/users')
            .send({
                "firstName" : "Test",
                "lastName" : "User",
                "email" : "test1@test.com",
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property("status");
                expect(body).to.contain.property("message");
                expect(body).to.contain.property("data");
                expect(body.status).to.equal(400);
                expect(body.message).to.equal('email already exists');
                expect(body.data).to.be.empty
                done();
            })
            .catch((err) => done(err));
    });

})