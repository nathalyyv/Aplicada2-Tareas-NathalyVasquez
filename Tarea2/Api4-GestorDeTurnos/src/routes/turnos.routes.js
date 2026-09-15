import { Router } from "express";
import {
  crearTurno,
  obtenerTurnos,
  obtenerSiguienteTurno,
  llamarTurno,
  finalizarTurno,
  obtenerTotalEnEspera
} from "../controllers/turnos.controller.js";
import { validarTurno } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.post("/", validarTurno, crearTurno);
router.get("/", obtenerTurnos);
router.get("/siguiente", obtenerSiguienteTurno);
router.put("/llamar", llamarTurno);
router.put("/:id/finalizar", finalizarTurno);
router.get("/espera", obtenerTotalEnEspera);

export default router;