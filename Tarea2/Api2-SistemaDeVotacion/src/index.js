import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import encuestasRoutes from "./routes/encuestas.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/encuestas", encuestasRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.json({ mensaje: "API de Encuestas en línea" });
});

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});