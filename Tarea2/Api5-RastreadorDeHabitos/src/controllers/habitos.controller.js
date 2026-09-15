import { prisma } from "../db.js";

export const crearHabito = async (req, res) => {
  try {
    const { nombre, meta } = req.body;
    const nuevoHabito = await prisma.habito.create({
      data: {
        nombre,
        meta,
        registros: [] 
      }
    });
    res.status(201).json(nuevoHabito);
  } catch (error) {
    console.error("Error al crear hábito:", error);
    res.status(500).json({ error: "Error al crear el hábito" });
  }
};

export const obtenerHabitos = async (req, res) => {
  try {
    const habitos = await prisma.habito.findMany();
    res.json(habitos);
  } catch (error) {
    console.error("Error al obtener hábitos:", error);
    res.status(500).json({ error: "Error al obtener los hábitos" });
  }
};

export const registrarHabitoHoy = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const habito = await prisma.habito.findUnique({
      where: { id }
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }

    const hoy = new Date().toISOString().split("T")[0];
    const registrosActuales = Array.isArray(habito.registros) ? habito.registros : [];

    const yaRegistrado = registrosActuales.find((r) => r.fecha === hoy);
    if (yaRegistrado) {
      return res.status(400).json({ error: "Este hábito ya fue registrado el día de hoy" });
    }

    const nuevoRegistro = { fecha: hoy, completado: true };
    const registrosActualizados = [...registrosActuales, nuevoRegistro];

    await prisma.habito.update({
      where: { id },
      data: { registros: registrosActualizados }
    });

    res.status(201).json({ mensaje: "Hábito registrado como completado", registro: nuevoRegistro });
  } catch (error) {
    console.error("Error al registrar día:", error);
    res.status(500).json({ error: "Error al registrar el hábito" });
  }
};

export const obtenerEstadisticasHabito = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const habito = await prisma.habito.findUnique({
      where: { id }
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }

    const registros = Array.isArray(habito.registros) ? habito.registros : [];
    const totalRegistros = registros.length;
    let cumplidos = 0;

    for (const r of registros) {
      if (r.completado) cumplidos++;
    }

    const porcentajeCumplimiento =
      totalRegistros === 0 ? "0%" : `${((cumplidos / totalRegistros) * 100).toFixed(1)}%`;

    let rachaActual = 0;
    let mejorRacha = 0;

    for (const r of registros) {
      if (r.completado) {
        rachaActual++;
        if (rachaActual > mejorRacha) {
          mejorRacha = rachaActual;
        }
      } else {
        rachaActual = 0;
      }
    }

    res.json({
      nombre: habito.nombre,
      totalDiasRegistrados: totalRegistros,
      porcentajeCumplimiento,
      rachaActual,
      mejorRacha
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas del hábito" });
  }
};

export const eliminarHabito = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const habito = await prisma.habito.findUnique({
      where: { id }
    });

    if (!habito) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }

    await prisma.habito.delete({
      where: { id }
    });

    res.json({ mensaje: "Hábito eliminado" });
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    res.status(500).json({ error: "Error al eliminar el hábito" });
  }
};