import 'dotenv/config';
import request from 'supertest';
import app from '../src/app.js';

describe('Fase 1', () => {
  const apiKey = process.env.API_KEY;

  describe('GET /v1/tareas', () => {
    it('Con API Key válida (200 + array de tareas)', async () => {
      const res = await request(app)
        .get('/v1/tareas')
        .set('x-api-key', apiKey);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('Sin API Key (401)', async () => {
      const res = await request(app).get('/v1/tareas');
      expect(res.status).toBe(401);
    });

    it('API Key incorrecta (401)', async () => {
      const res = await request(app)
        .get('/v1/tareas')
        .set('x-api-key', 'clave_incorrecta');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /v1/tareas', () => {
    it('Creación exitosa (201 + tarea creada)', async () => {
      const res = await request(app)
        .post('/v1/tareas')
        .set('x-api-key', apiKey)
        .send({
          titulo: 'Tarea de prueba V1',
          usuarioId: 1
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('Sin título (400)', async () => {
      const res = await request(app)
        .post('/v1/tareas')
        .set('x-api-key', apiKey)
        .send({
          usuarioId: 1
        });

      expect(res.status).toBe(400);
    });

    it('Sin API Key (401)', async () => {
      const res = await request(app)
        .post('/v1/tareas')
        .send({
          titulo: 'Tarea sin API Key',
          usuarioId: 1
        });

      expect(res.status).toBe(401);
    });
  });
});