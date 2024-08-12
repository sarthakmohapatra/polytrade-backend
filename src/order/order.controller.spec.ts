import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

describe('OrderController (e2e)', () => {
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

    // Seed a user and get the access token
    await prisma.user.create({
      data: {
        email: email,
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: email, password: 'password123' })
      .expect(201);

    accessToken = response.body.access_token;

    // Seed a product
    await prisma.product.create({
      data: {
        name: 'Test Product',
        price: 10.0,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/orders (POST) should create an order if product exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId: 1 })
      .expect(201);

    expect(response.body).toHaveProperty('productId', 1);
  });

  it('/orders (POST) should fail if product does not exist', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productId: 999 }) // Non-existent productId
      .expect(404);
  });
});
