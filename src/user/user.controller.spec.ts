import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import { faker } from '@faker-js/faker';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const email = faker.internet.email();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/users/register (POST) should create a user with role USER', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email: email, password: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('role', 'USER');
  });
});
