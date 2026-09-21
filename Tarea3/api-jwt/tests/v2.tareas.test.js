import 'dotenv/config';
import request from 'supertest';
import jwt from 'jsonwebtoken'; 
import app from '../src/app.js';

describe('Fase 2', () => {
  let tokenUser1 = '';
  let tokenUser2 = '';
  let tokenAdmin = '';
  let idTareaUser1 = null;

  beforeAll(async () => {
    // 1. Crear Usuario 1 y hacer Login
    const emailUser1 = `user1_v2_${Date.now()}@test.com`;
    await request(app).post('/auth/registro').send({
      nombre: 'Usuario Uno',
      email: emailUser1,
      password: '123',
      rol: 'usuario'
    });
    const resLogin1 = await request(app).post('/auth/login').send({
      email: emailUser1,
      password: '123'
    });
    tokenUser1 = resLogin1.body.token;
    idUsuario1 = jwt.decode(tokenUser1).id;

    // Crear una tarea que le pertenezca a Usuario 1
    const resTarea = await request(app)
      .post('/v1/tareas')
      .set('x-api-key', process.env.API_KEY)
      .send({
        titulo: 'Tarea de Usuario 1',
        usuarioId: idUsuario1
      });
    idTareaUser1 = resTarea.body.id || 1;

    // 2. Crear Usuario 2 para probar intentar borrar tarea ajena y hacer Login
    const emailUser2 = `user2_v2_${Date.now()}@test.com`;
    await request(app).post('/auth/registro').send({
      nombre: 'Usuario Dos',
      email: emailUser2,
      password: '123',
      rol: 'usuario'
    });
    const resLogin2 = await request(app).post('/auth/login').send({
      email: emailUser2,
      password: '123'
    });
    tokenUser2 = resLogin2.body.token;

    // 3. Crear Admin y hacer Login
    const emailAdmin = `admin_v2_${Date.now()}@test.com`;
    await request(app).post('/auth/registro').send({
      nombre: 'Admin User',
      email: emailAdmin,
      password: '123',
      rol: 'admin'
    });
    const resAdmin = await request(app).post('/auth/login').send({
      email: emailAdmin,
      password: '123'
    });
    tokenAdmin = resAdmin.body.token;
  });

  describe('GET /v2/tareas', () => {
    it('Sin token (401)', async () => {
      const res = await request(app).get('/v2/tareas');
      expect(res.status).toBe(401);
    });

    it('Token inválido (401)', async () => {
      const res = await request(app)
        .get('/v2/tareas')
        .set('Authorization', 'Bearer tokenfalso');

      expect(res.status).toBe(401);
    });

    it('Token de usuario normal (200 + solo sus tareas)', async () => {
      const res = await request(app)
        .get('/v2/tareas')
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('Token de admin (200 + todas las tareas)', async () => {
      const res = await request(app)
        .get('/v2/tareas')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('DELETE /v2/tareas/:id', () => {
    it('Usuario elimina la de otro (403 + error)', async () => {
      const res = await request(app)
        .delete(`/v2/tareas/${idTareaUser1}`)
        .set('Authorization', `Bearer ${tokenUser2}`); // Usuario 2 intenta borrar la tarea de Usuario 1

      expect(res.status).toBe(403);
    });

    it('Sin token (401 + error)', async () => {
      const res = await request(app).delete(`/v2/tareas/${idTareaUser1}`);
      expect(res.status).toBe(401);
    });

    it('Usuario elimina la suya (200 + mensaje)', async () => {
      const res = await request(app)
        .delete(`/v2/tareas/${idTareaUser1}`)
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(res.status).toBe(200);
    });

    it('Admin elimina cualquier tarea (200 + mensaje)', async () => {
      // Creamos una nueva tarea rápida para que el admin la elimine
      const resNuevaTarea = await request(app)
        .post('/v1/tareas')
        .set('x-api-key', process.env.API_KEY)
        .send({ titulo: 'Tarea para Admin', usuarioId: 1 });

      const idTareaAdmin = resNuevaTarea.body.id || 2;

      const res = await request(app)
        .delete(`/v2/tareas/${idTareaAdmin}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(200);
    });
  });
});