import {prisma} from "../db.js";

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({
            error: "Error interno del servidor al consultar los productos"
        });
    }
};

export const obtenerProductoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const producto = await prisma.producto.findUnique({
            where: { id }
        });

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        res.status(500).json({
            error: "Error interno del servidor al buscar el producto"
        });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, cantidad } = req.body;

        const productoExistente = await prisma.producto.findFirst({
            where: {
                nombre: {
                    equals: nombre,
                    mode: 'insensitive'
                }
            }
        });

        if (productoExistente) {
            const actualizado = await prisma.producto.update({
                where: { id: productoExistente.id },
                data: {
                    cantidad: productoExistente.cantidad + cantidad
                }
            });
            return res.status(200).json(actualizado);
        }

        const nuevoProducto = await prisma.producto.create({
            data: {
                nombre,
                precio,
                cantidad
            }
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({
            error: "Error interno del servidor al crear el producto"
        });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const { cantidad } = req.body;

        if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
            return res.status(400).json({
                error: "La cantidad debe ser un numero positivo mayor a 0"
            });
        }

        const productoExiste = await prisma.producto.findUnique({
            where: { id }
        });

        if (!productoExiste) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        const producto = await prisma.producto.update({
            where: { id },
            data: {
                cantidad
            }
        });

        res.json(producto);
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({
            error: "Error interno del servidor al actualizar el producto"
        });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                error: "El parámetro ID debe ser un número entero válido"
            });
        }

        const producto = await prisma.producto.findUnique({
            where: { id }
        });

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        await prisma.producto.delete({
            where: { id }
        });

        res.json({
            mensaje: "Producto eliminado"
        });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({
            error: "Error interno del servidor al eliminar el producto"
        });
    }
};

export const obtenerTotalCarrito = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        const total = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        res.json({ total });
    } catch (error) {
        console.error("Error al calcular total del carrito:", error);
        res.status(500).json({
            error: "Error interno del servidor al calcular el total del carrito"
        });
    }
};

export const aplicarDescuento = async (req, res) => {
    try {
        const { porcentaje } = req.body;

        if (porcentaje === undefined || typeof porcentaje !== 'number' || porcentaje < 0) {
            return res.status(400).json({
                error: "El porcentaje debe ser un numero valido igual o mayor a 0"
            });
        }

        if (porcentaje > 50) {
            return res.status(400).json({
                error: "El descuento maximo permitido es del 50%"
            });
        }

        const productos = await prisma.producto.findMany();
        const totalSinDescuento = productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        const descuento = (totalSinDescuento * porcentaje) / 100;
        const totalConDescuento = totalSinDescuento - descuento;

        res.json({
            totalSinDescuento,
            porcentajeDescuento: porcentaje,
            totalConDescuento
        });
    } catch (error) {
        console.error("Error al aplicar descuento:", error);
        res.status(500).json({
            error: "Error interno del servidor al aplicar el descuento"
        });
    }
};