const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => console.log("Servidor en el puerto 3000"));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Nombre, precio y cantidad son requeridos" });
    }
    if (typeof precio !== 'number' || precio <= 0 || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "El precio y la cantidad deben ser numeros positivos mayor a 0" });
    }
    next();
};
let productos = [
    {
        id: 1,
        nombre: "Laptop",
        precio: 200,
        cantidad: 3
    }
];
let nextId = 2;

const calcularTotalCarrito = () => {return productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)};

app.get('/productos', (req, res) => {
    res.json(productos);
});

app.post('/productos', validarProducto, (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    const productoExistente = productos.find( p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (productoExistente) { productoExistente.cantidad += cantidad;
        return res.status(200).json(productoExistente);
    }
    const nuevoProducto = { id: nextId++, nombre, precio, cantidad };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    const { cantidad } = req.body;
    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero positivo mayor a 0" });
    }
    producto.cantidad = cantidad;
    res.json(producto);
});

app.delete('/productos/:id', (req, res) => {
    const index = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
    productos.splice(index, 1);
    res.json({ mensaje: "Producto eliminado" });
});

app.get('/carrito/total', (req, res) => {
    const total = calcularTotalCarrito();
    res.json({ total });
});

app.post('/carrito/aplicar-descuento', (req, res) => {
    const { porcentaje } = req.body;
    if (porcentaje === undefined || typeof porcentaje !== 'number' || porcentaje < 0) {
        return res.status(400).json({ error: "El porcentaje debe ser un numero valido igual o mayor a 0" });
    }
    if (porcentaje > 50) {return res.status(400).json({ error: "El descuento maximo permitido es del 50%" })}
    const totalSinDescuento = calcularTotalCarrito();
    const descuento = (totalSinDescuento * porcentaje) / 100;
    const totalConDescuento = totalSinDescuento - descuento;
    res.json({
        totalSinDescuento,
        porcentajeDescuento: porcentaje,
        totalConDescuento
    });
});