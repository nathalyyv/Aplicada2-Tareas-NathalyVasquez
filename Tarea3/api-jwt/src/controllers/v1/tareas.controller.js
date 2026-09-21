import { prisma } from "../../db.js"

export const getTareasPublicas = async (req, res, next) => {
  try {
    const tareas = await prisma.tarea.findMany()
    res.json(tareas)
  } catch (err) { next(err) }
}

export const createTareaPublica = async (req, res, next) => {
  try {
    const { titulo, usuarioId } = req.body
    if (!titulo) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }

    const idDelUsuario = req.usuario?.id || usuarioId;

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        usuarioId: usuarioId ? Number(idDelUsuario) : 1
      }
    });

    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
};