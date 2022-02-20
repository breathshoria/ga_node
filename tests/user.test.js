//During the test the env variable is set to test
process.env.NODE_ENV = 'TEST';

let User = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let {server} = require('../index');
let should = chai.should();
let token = ''

chai.use(chaiHttp);

const activateUser = async (username) => {
    const newUser = await User.findOne({username: username})
    newUser.isActivated = true
    return await newUser.save()
}
//Our parent block
describe('User', () => {
    after((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    describe('Register user', () => {
        it('it should register new user',  (done) => {
            chai.request(server)
                .post('/register')
                .send({username: 'test', password: 'default'})
                .end( (err, res) => {
                    res.should.have.status(200);
                    return activateUser('test').then(() => done())
                });
        });
    });
    describe('Login user', () => {
        it('it should login and give access token', (done) => {
            chai.request(server)
                .post('/login')
                .send({username: 'test', password: 'default'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.a('object')
                    token = res.body.accessToken
                    done();
                });
        });
    });
    describe('Get user', () => {
        it('it should check JWT and give username', (done) => {
            chai.request(server)
                .get('/user')
                .set({Authorization: `bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.a('object')
                    done();
                });
        });

        describe('Refresh access token', () => {
            it('it should refresh JWT and give username',   (done) => {
                chai.request(server)
                    .get('/refresh')
                    .set({Authorization: `bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.to.be.a('object')
                        done()
                    });
            });
        });

    });
});