import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import turnosRoutes from "./routes/turnos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/turnos", turnosRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Control de Turnos en línea" });
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});