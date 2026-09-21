import request from 'supertest';
import app from '../src/app.js';

describe('Rutas de autenticación', () => {
  const emailBase = `user_${Date.now()}@test.com`;
  const passwordValida = '123456';

  describe('POST /auth/registro', () => {
    it('Registro exitoso (201)', async () => {
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Test User',
          email: emailBase,
          password: passwordValida,
          rol: 'usuario'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('Email duplicado (400)', async () => {
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Test User',
          email: emailBase,
          password: passwordValida,
          rol: 'usuario'
        });

      expect(res.status).toBe(400);
    });

    it('Sin email (400)', async () => {
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Test User',
          password: passwordValida
        });

      expect(res.status).toBe(400);
    });

    it('Sin password (400)', async () => {
      const res = await request(app)
        .post('/auth/registro')
        .send({
          nombre: 'Test User',
          email: `no_pass_${Date.now()}@test.com`
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('Login exitoso (200 + token JWT)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: emailBase,
          password: passwordValida
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('Password incorrecta (401)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: emailBase,
          password: 'password_incorrecta'
        });

      expect(res.status).toBe(401);
    });

    it('Email no existe (401)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: `no_existe_${Date.now()}@test.com`,
          password: passwordValida
        });

      expect(res.status).toBe(401);
    });

    it('Sin credenciales (400)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});