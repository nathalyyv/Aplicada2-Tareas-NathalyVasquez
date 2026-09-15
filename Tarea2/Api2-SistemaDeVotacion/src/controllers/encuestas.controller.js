import { prisma } from "../db.js";

export const obtenerEncuestas = async (req, res) => {
    try {
        const encuestas = await prisma.encuesta.findMany();
        res.json(encuestas);
    } catch (error) {
        console.error("Error al obtener encuestas:", error);
        res.status(500).json({
            error: "Error interno del servidor al consultar las encuestas"
        });
    }
};

export const crearEncuesta = async (req, res) => {
    try {
        const { pregunta, opciones } = req.body;

        const votos = {};
        for (const opcion of opciones) {
            votos[opcion] = 0;
        }

        const nuevaEncuesta = await prisma.encuesta.create({
            data: {
                pregunta,
                opciones,
                votos
            }
        });

        res.status(201).json(nuevaEncuesta);
    } catch (error) {
        console.error("Error al crear encuesta:", error);
        res.status(500).json({
            error: "Error interno del servidor al crear la encuesta"
        });
    }
};

export const votarEncuesta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const encuesta = await prisma.encuesta.findUnique({
            where: { id }
        });

        if (!encuesta) {
            return res.status(404).json({
                error: "Encuesta no encontrada"
            });
        }

        const { opcion } = req.body;

        if (!opcion || !encuesta.opciones.includes(opcion)) {
            return res.status(400).json({
                error: "La opción seleccionada no existe en la encuesta"
            });
        }

        // Actualizar el conteo de votos en la propiedad JSON/Object
        const nuevosVotos = { ...encuesta.votos };
        nuevosVotos[opcion] = (nuevosVotos[opcion] || 0) + 1;

        const encuestaActualizada = await prisma.encuesta.update({
            where: { id },
            data: {
                votos: nuevosVotos
            }
        });

        res.json({
            mensaje: "Voto registrado exitosamente",
            votos: encuestaActualizada.votos
        });
    } catch (error) {
        console.error("Error al votar en la encuesta:", error);
        res.status(500).json({
            error: "Error interno del servidor al registrar el voto"
        });
    }
};

export const obtenerResultadosEncuesta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const encuesta = await prisma.encuesta.findUnique({
            where: { id }
        });

        if (!encuesta) {
            return res.status(404).json({
                error: "Encuesta no encontrada"
            });
        }

        let totalVotos = 0;
        for (const opcion of encuesta.opciones) {
            totalVotos += encuesta.votos[opcion] || 0;
        }

        let desglosado = [];
        let mayorVotos = -1;
        let ganador = "Empate / Sin votos";

        for (const opcion of encuesta.opciones) {
            const cantidadVotos = encuesta.votos[opcion] || 0;
            const porcentaje = totalVotos === 0 ? "0%" : `${((cantidadVotos / totalVotos) * 100).toFixed(1)}%`;

            desglosado.push({
                opcion,
                votos: cantidadVotos,
                porcentaje
            });

            if (cantidadVotos > mayorVotos && cantidadVotos > 0) {
                mayorVotos = cantidadVotos;
                ganador = opcion;
            }
        }

        res.json({
            pregunta: encuesta.pregunta,
            totalVotos,
            ganador,
            resultados: desglosado
        });
    } catch (error) {
        console.error("Error al calcular resultados de la encuesta:", error);
        res.status(500).json({
            error: "Error interno del servidor al obtener los resultados"
        });
    }
};

export const eliminarEncuesta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const encuesta = await prisma.encuesta.findUnique({
            where: { id }
        });

        if (!encuesta) {
            return res.status(404).json({
                error: "Encuesta no encontrada"
            });
        }

        await prisma.encuesta.delete({
            where: { id }
        });

        res.json({
            mensaje: "Encuesta eliminada"
        });
    } catch (error) {
        console.error("Error al eliminar encuesta:", error);
        res.status(500).json({
            error: "Error interno del servidor al eliminar la encuesta"
        });
    }
};