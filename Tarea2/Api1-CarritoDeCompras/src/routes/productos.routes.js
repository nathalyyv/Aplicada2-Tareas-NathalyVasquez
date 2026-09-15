import { Router } from "express";
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerTotalCarrito,
    aplicarDescuento
} from "../controllers/productos.controller.js";
import { validarProducto } from "../middlewares/validaciones.middleware.js";

const router = Router();

// Rutas de Productos
router.get("/productos", obtenerProductos);
router.get("/productos/:id", obtenerProductoPorId);
router.post("/productos", validarProducto, crearProducto);
router.put("/productos/:id", actualizarProducto);
router.delete("/productos/:id", eliminarProducto);

// Rutas de Carrito
router.get("/carrito/total", obtenerTotalCarrito);
router.post("/carrito/aplicar-descuento", aplicarDescuento);

export default router;