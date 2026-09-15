import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import productosRoutes from "./routes/productos.routes.js"; // 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(loggerMiddleware);

// Rutas modulares
app.use(productosRoutes);

// Ruta base informativa
app.get("/", (req, res) => {
    res.json({
        mensaje: "API RESTful de Carrito de Compras con Express y Prisma 7",
        estado: "En línea",
        documentacion: {
            "GET /productos": "Listar todos los productos",
            "GET /productos/:id": "Obtener un producto por ID",
            "POST /productos": "Crear un nuevo producto ({ nombre, precio, cantidad })",
            "PUT /productos/:id": "Actualizar cantidad de un producto ({ cantidad })",
            "DELETE /productos/:id": "Eliminar producto por ID",
            "GET /carrito/total": "Obtener el total acumulado del carrito",
            "POST /carrito/aplicar-descuento": "Aplicar un porcentaje de descuento ({ porcentaje })"
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});