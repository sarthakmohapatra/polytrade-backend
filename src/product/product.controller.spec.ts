import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  const email = faker.internet.email();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Seed an admin user and get the access token
    await prisma.user.create({
      data: {
        email: email,
        password: await bcrypt.hash('yourAdminPassword', 10),
        role: 'ADMIN',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: email, password: 'yourAdminPassword' })
      .expect(201);

    accessToken = response.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/products (POST) should create a product if user is ADMIN', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Product', price: 10.0 })
      .expect(201);

    expect(response.body).toHaveProperty('name', 'Test Product');
  });

  it('/products (POST) should fail if user is not ADMIN', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: email, password: 'password123' })
      .expect(401);

    const userToken = userResponse.body.access_token;

    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Test Product', price: 10.0 })
      .expect(401);
  });
});
