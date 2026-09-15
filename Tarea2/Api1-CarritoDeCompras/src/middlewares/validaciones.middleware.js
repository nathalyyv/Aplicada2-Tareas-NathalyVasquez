export const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Nombre, precio y cantidad son requeridos" });
    }
    if (typeof precio !== 'number' || precio <= 0 || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "El precio y la cantidad deben ser numeros positivos mayor a 0" });
    }
    next();
};