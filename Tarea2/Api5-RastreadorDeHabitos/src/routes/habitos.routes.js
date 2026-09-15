import { Router } from "express";
import {
  crearHabito,
  obtenerHabitos,
  registrarHabitoHoy,
  obtenerEstadisticasHabito,
  eliminarHabito
} from "../controllers/habitos.controller.js";
import { validarHabito } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarHabito, crearHabito);
router.get("/", obtenerHabitos);
router.post("/:id/registrar", registrarHabitoHoy);
router.get("/:id/estadisticas", obtenerEstadisticasHabito);
router.delete("/:id", eliminarHabito);

export default router;