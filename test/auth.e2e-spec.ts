import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// different server will be created for each end to end test
describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // session is inside appmodule so req.session will be defined
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'khfkjdkhkjhhsf@hotmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'kasdhfkjdhfkj' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user and get the currently logged in user', async () => {
    const email = 'khfkjdkhkjhhsf@hotmail.com';

    // this request is sent by superagent and it does not handle cookies for us
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'somethong' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(email);
  });
});
