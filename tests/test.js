const assert = require('assert');
const request = require('supertest');
const expect = require('chai').expect;
const api = require('../index.js');
const { envelopesDatabase } = require('../db.js');

describe('api_requests', async () => {
    describe('GET', async () => {
        it('returns an array of objects', async () => {
            const expected = 'object';

            const response = await request(api)
            .get('/')
            .send()
            .expect(200);

            assert.strictEqual(typeof response.body, expected);
        });

        it('returns all objects', async () => {
            const expected = envelopesDatabase.length;

            const response = await request(api)
            .get('/')
            .send()
            .expect(200);

            assert.strictEqual(response.body.length, expected);
        });

        it('returns a full envelope object', async () => {
            const response = await request(api)
            .get('/')
            .send()
            .expect(200);

            expect(response.body).hasOwnProperty('title');
            expect(response.body).hasOwnProperty('amount');
            expect(response.body).hasOwnProperty('id');         
        });

        it('returns the correct type of value for each object', async () => {
            const titleExpected = 'string';
            const amountExpected = 'number';
            const idExpected = 'number';

            const response = await request(api)
            .get('/')
            .send()
            .expect(200)

            const titleType = typeof response.body[0].title;
            const amountType = typeof response.body[0].amount;
            const idType = typeof response.body[0].id;

            assert.strictEqual(titleType, titleExpected);
            assert.strictEqual(amountType, amountExpected);
            assert.strictEqual(idType, idExpected);
        });

        it('returns the object with the correct id (/id)', async () => {
            const expected = 1;

            const response = await request(api)
            .get('/1')
            .send()
            .expect(200)

            assert.strictEqual(response.body.id, expected);
        });

        it('returns a 404 error if id is not found (/id)', async () => {
            const response = await request(api)
            .get('/hello')
            .send()
            .expect(404);
        });
    });

    describe('POST', async () => {
        it('creates a new envelope', async () => {
            const expected = envelopesDatabase.length + 1;

            const response = await request(api)
            .post('/')
            .send({"title": "Commuting", "amount": 200})
            .expect(201)

            const newLength = envelopesDatabase.length;
            
            assert.strictEqual(newLength, expected);
        });
 
        it('creates and returns a full envelop object with a new, unique id', async () => {
            const expectedTitle = "Commuting";
            const expectedAmount = 200;
            const expectedId = envelopesDatabase[envelopesDatabase.length - 1].id + 1;

            const response = await request(api)
            .post('/')
            .send({"title": "Commuting", "amount": 200})
            .expect(201)

            const name = response.body.title;
            const amount = response.body.amount;
            const id = response.body.id;

            assert.strictEqual(name, expectedTitle);
            assert.strictEqual(amount, expectedAmount);
            assert.strictEqual(id, expectedId);
        });

        it('returns a 400 status code when title and/or amount is not present', async () => {
            await request(api)
            .post('/')
            .send()
            .expect(400)

            await request(api)
            .post('/')
            .send({"title": "Commuting"})
            .expect(400);

            await request(api)
            .post('/')
            .send({"amount": 200})
            .expect(400); 
        });
    });
});