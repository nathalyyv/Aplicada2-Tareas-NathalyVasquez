import { prisma } from "../db.js";

export const obtenerInventario = async (req, res) => {
    try {
        const inventario = await prisma.inventario.findMany();
        res.json(inventario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario" });
    }
};

export const crearProducto = async (req, res) => {
    try {
        const { producto, stock, stockMinimo } = req.body;
        const nuevoProducto = await prisma.inventario.create({
            data: {
                producto,
                stock,
                stockMinimo: stockMinimo !== undefined ? stockMinimo : 5
            }
        });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

export const registrarEntrada = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;

        if (!cantidad || typeof cantidad !== "number" || cantidad <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo mayor a 0" });
        }

        const item = await prisma.inventario.findUnique({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const productoActualizado = await prisma.inventario.update({
            where: { id },
            data: { stock: item.stock + cantidad }
        });

        res.json({ mensaje: "Stock actualizado correctamente", producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la entrada" });
    }
};

export const registrarSalida = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { cantidad } = req.body;

        if (!cantidad || typeof cantidad !== "number" || cantidad <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo mayor a 0" });
        }

        const item = await prisma.inventario.findUnique({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (cantidad > item.stock) {
            return res.status(400).json({ error: `Stock insuficiente. Stock actual: ${item.stock}` });
        }

        const productoActualizado = await prisma.inventario.update({
            where: { id },
            data: { stock: item.stock - cantidad }
        });

        res.json({ mensaje: "Salida registrada correctamente", producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la salida" });
    }
};

export const obtenerAlertas = async (req, res) => {
    try {
        const inventario = await prisma.inventario.findMany();
        const alertas = [];

        for (const item of inventario) {
            if (item.stock < item.stockMinimo) {
                alertas.push({
                    id: item.id,
                    producto: item.producto,
                    stockActual: item.stock,
                    stockMinimo: item.stockMinimo,
                    faltaParaMinimo: item.stockMinimo - item.stock
                });
            }
        }

        res.json(alertas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las alertas" });
    }
};