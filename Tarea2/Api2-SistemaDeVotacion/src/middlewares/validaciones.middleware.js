export const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body
    if (!pregunta || !opciones || !Array.isArray(opciones)) {
        return res.status(400).json({ error: "La pregunta y las opciones (arreglo) son requeridas" })
    }
    if (opciones.length < 2) {
        return res.status(400).json({ error: "La encuesta debe tener al menos 2 opciones" })
    }
    next()
}