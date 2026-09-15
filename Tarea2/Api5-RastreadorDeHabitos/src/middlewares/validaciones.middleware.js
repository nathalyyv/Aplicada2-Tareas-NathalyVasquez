export const validarHabito = (req, res, next) => {
    const { nombre, meta } = req.body
    if (!nombre || !meta) {
        return res.status(400).json({ error: "Nombre y meta son requeridos" })
    }
    next()
}
