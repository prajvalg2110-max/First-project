const request = require('supertest');
const app = require('../src/index');

describe('GET /', () => {
  it('responds with a running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('CI/CD demo app is running');
  });
});

describe('GET /health', () => {
  it('responds ok, for k8s health probes later', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
