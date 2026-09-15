export const validarTurno = (req, res, next) => {
    const { cliente, servicio } = req.body
    if (!cliente || !servicio) {
        return res.status(400).json({ error: "El cliente y el servicio son requeridos" })
    }
    next()
}