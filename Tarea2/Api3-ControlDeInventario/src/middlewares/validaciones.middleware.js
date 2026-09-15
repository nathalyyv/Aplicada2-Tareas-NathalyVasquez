export const validarInventario = (req, res, next) => {
    const { producto, stock } = req.body
    if (!producto || stock === undefined) {
        return res.status(400).json({ error: "Producto y stock son campos requeridos" })
    }
    if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número igual o mayor a 0" })
    }
    next()
}