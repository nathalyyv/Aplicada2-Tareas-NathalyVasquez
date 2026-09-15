import { Router } from "express";
import {
    obtenerInventario,
    crearProducto,
    registrarEntrada,
    registrarSalida,
    obtenerAlertas
} from "../controllers/inventario.controller.js";
import { validarInventario } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerInventario);
router.post("/", validarInventario, crearProducto);
router.get("/alertas", obtenerAlertas);
router.post("/:id/entrada", registrarEntrada);
router.post("/:id/salida", registrarSalida);

export default router;