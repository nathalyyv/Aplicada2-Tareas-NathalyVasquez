import { Router } from "express";
import {
    obtenerEncuestas,
    crearEncuesta,
    votarEncuesta,
    obtenerResultadosEncuesta,
    eliminarEncuesta
} from "../controllers/encuestas.controller.js";
import { validarEncuesta } from "../middlewares/validaciones.middleware.js";

const router = Router();

router.get("/", obtenerEncuestas);
router.post("/", validarEncuesta, crearEncuesta);
router.post("/:id/votar", votarEncuesta);
router.get("/:id/resultados", obtenerResultadosEncuesta);
router.delete("/:id", eliminarEncuesta);

export default router;