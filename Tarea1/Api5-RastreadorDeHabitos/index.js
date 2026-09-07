const express = require('express')
const app = express()

app.use(express.json())

app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

const validarHabito = (req, res, next) => {
    const { nombre, meta } = req.body
    if (!nombre || !meta) {
        return res.status(400).json({ error: "Nombre y meta son requeridos" })
    }
    next()
}

let habitos = [
    {
        id: 1,
        nombre: "Leer un libro",
        meta: "25 minutos diario",
        registros: [
            { fecha: "2026-03-01", completado: true },
            { fecha: "2026-03-02", completado: true }
        ]
    }
]
let nextId = 2

app.post('/habitos', validarHabito, (req, res) => {
    const { nombre, meta } = req.body
    const nuevoHabito = {
        id: nextId++,
        nombre,
        meta,
        registros: []
    }
    habitos.push(nuevoHabito)
    res.status(201).json(nuevoHabito)
})

app.get('/habitos', (req, res) => {
    res.json(habitos)
})

app.post('/habitos/:id/registrar', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id))
    if (!habito) return res.status(404).json({ error: "Hábito no encontrado" })
    const hoy = new Date().toISOString().split('T')[0]
    const yaRegistrado = habito.registros.find(r => r.fecha === hoy)
    if (yaRegistrado) {
        return res.status(400).json({ error: "Este hábito ya fue registrado el día de hoy" })
    }
    const nuevoRegistro = { fecha: hoy, completado: true }
    habito.registros.push(nuevoRegistro)
    res.status(201).json({ mensaje: "Hábito registrado como completado", registro: nuevoRegistro })
})

app.get('/habitos/:id/estadisticas', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id))
    if (!habito) return res.status(404).json({ error: "Hábito no encontrado" })
    const totalRegistros = habito.registros.length
    let cumplidos = 0
    for (const r of habito.registros) {
        if (r.completado) cumplidos++
    }
    const porcentajeCumplimiento = totalRegistros === 0 ? "0%" : `${((cumplidos / totalRegistros) * 100).toFixed(1)}%`
    let rachaActual = 0
    let mejorRacha = 0
    for (const r of habito.registros) {
        if (r.completado) {
            rachaActual++
            if (rachaActual > mejorRacha) {
                mejorRacha = rachaActual
            }
        } else {rachaActual = 0}
    }
    res.json({
        nombre: habito.nombre,
        totalDiasRegistrados: totalRegistros,
        porcentajeCumplimiento,
        rachaActual,
        mejorRacha
    })
})

app.delete('/habitos/:id', (req, res) => {
    const index = habitos.findIndex(h => h.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).json({ error: "Hábito no encontrado" })
    habitos.splice(index, 1)
    res.json({ mensaje: "Hábito eliminado" })
})