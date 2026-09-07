const express = require('express')
const app = express()

app.use(express.json())

app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

const validarInventario = (req, res, next) => {
    const { producto, stock } = req.body
    if (!producto || stock === undefined) {
        return res.status(400).json({ error: "Producto y stock son campos requeridos" })
    }
    if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un número igual o mayor a 0" })
    }
    next()
}
let inventario = [
    { id: 1, 
      producto: "Teclado", 
      stock: 10, 
      stockMinimo: 5 
    }
]
let nextId = 2

app.get('/inventario', (req, res) => {
    res.json(inventario)
})

app.post('/inventario', validarInventario, (req, res) => {
    const { producto, stock, stockMinimo } = req.body
    const nuevoProducto = {
        id: nextId++,
        producto,
        stock,
        stockMinimo: stockMinimo !== undefined ? stockMinimo : 5
    }
    inventario.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

app.post('/inventario/:id/entrada', (req, res) => {
    const item = inventario.find(i => i.id === parseInt(req.params.id))
    if (!item) return res.status(404).json({ error: "Producto no encontrado" })
    const { cantidad } = req.body
    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo mayor a 0" })
    }
    item.stock += cantidad
    res.json({ mensaje: "Stock actualizado correctamente", producto: item })
})

app.post('/inventario/:id/salida', (req, res) => {
    const item = inventario.find(i => i.id === parseInt(req.params.id))
    if (!item) return res.status(404).json({ error: "Producto no encontrado" })
    const { cantidad } = req.body
    if (!cantidad || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo mayor a 0" })
    }
    if (cantidad > item.stock) {
        return res.status(400).json({ error: `Stock insuficiente. Stock actual: ${item.stock}` })
    }
    item.stock -= cantidad
    res.json({ mensaje: "Salida registrada correctamente", producto: item })
})

app.get('/inventario/alertas', (req, res) => {
    let alertas = []
    for (const item of inventario) {
        if (item.stock < item.stockMinimo) {
            const faltaParaMinimo = item.stockMinimo - item.stock
            alertas.push({
                id: item.id,
                producto: item.producto,
                stockActual: item.stock,
                stockMinimo: item.stockMinimo,
                faltaParaMinimo
            })
        }
    }
    res.json(alertas)
})