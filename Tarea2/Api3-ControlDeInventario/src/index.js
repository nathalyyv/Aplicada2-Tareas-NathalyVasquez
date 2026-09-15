import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import inventarioRoutes from "./routes/inventario.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use("/inventario", inventarioRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.json({ mensaje: "API de Inventario en línea" });
});

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});