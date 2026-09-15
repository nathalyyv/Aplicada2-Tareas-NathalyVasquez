import { prisma } from "../db.js";

export const crearTurno = async (req, res) => {
  try {
    const { cliente, servicio } = req.body;
    const nuevoTurno = await prisma.turno.create({
      data: {
        cliente,
        servicio,
        estado: "esperando"
      }
    });
    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el turno" });
  }
};

export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

export const obtenerSiguienteTurno = async (req, res) => {
  try {
    const siguiente = await prisma.turno.findFirst({
      where: { estado: "esperando" }
    });

    if (!siguiente) {
      return res.status(404).json({ mensaje: "No hay turnos en espera" });
    }

    res.json(siguiente);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el siguiente turno" });
  }
};

export const llamarTurno = async (req, res) => {
  try {
    const siendoAtendido = await prisma.turno.findFirst({
      where: { estado: "atendiendo" }
    });

    if (siendoAtendido) {
      return res.status(400).json({
        error: "No se puede llamar a otro turno mientras haya uno en atención",
        turnoActual: siendoAtendido
      });
    }

    const siguiente = await prisma.turno.findFirst({
      where: { estado: "esperando" }
    });

    if (!siguiente) {
      return res.status(404).json({ error: "No hay turnos pendientes para llamar" });
    }

    const turnoActualizado = await prisma.turno.update({
      where: { id: siguiente.id },
      data: { estado: "atendiendo" }
    });

    res.json({ mensaje: "Llamando al siguiente turno", turno: turnoActualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al llamar al siguiente turno" });
  }
};

export const finalizarTurno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const turnoExistente = await prisma.turno.findUnique({
      where: { id }
    });

    if (!turnoExistente) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    const turnoFinalizado = await prisma.turno.update({
      where: { id },
      data: { estado: "finalizado" }
    });

    res.json({ mensaje: "Turno finalizado exitosamente", turno: turnoFinalizado });
  } catch (error) {
    res.status(500).json({ error: "Error al finalizar el turno" });
  }
};

export const obtenerTotalEnEspera = async (req, res) => {
  try {
    const totalEnEspera = await prisma.turno.count({
      where: { estado: "esperando" }
    });

    res.json({ totalEnEspera });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los turnos en espera" });
  }
};