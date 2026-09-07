const express = require('express')
const app = express()

app.use(express.json())

app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

const validarTurno = (req, res, next) => {
    const { cliente, servicio } = req.body
    if (!cliente || !servicio) {
        return res.status(400).json({ error: "El cliente y el servicio son requeridos" })
    }
    next()
}

let turnos = [
    { 
        id: 1, 
        cliente: "Juan Perez", 
        servicio: "Recursos humanos", 
        estado: "atendiendo" 
    },
    { 
        id: 2, 
        cliente: "Carlos Garcia", 
        servicio: "Servicio al Cliente", 
        estado: "esperando" 
    }
]
let nextId = 3

app.post('/turnos', validarTurno, (req, res) => {
    const { cliente, servicio } = req.body
    const nuevoTurno = {
        id: nextId++,
        cliente,
        servicio,
        estado: "esperando"
    }
    turnos.push(nuevoTurno)
    res.status(201).json(nuevoTurno)
})

app.get('/turnos', (req, res) => {
    res.json(turnos)
})

app.get('/turnos/siguiente', (req, res) => {
    const siguiente = turnos.find(t => t.estado === "esperando")
    if (!siguiente) {
        return res.status(404).json({ mensaje: "No hay turnos en espera" })
    }
    res.json(siguiente)
})

app.put('/turnos/llamar', (req, res) => {
    const siendoAtendido = turnos.find(t => t.estado === "atendiendo")
    if (siendoAtendido) {
        return res.status(400).json({ 
            error: "No se puede llamar a otro turno mientras haya uno en atención", 
            turnoActual: siendoAtendido 
        })
    }
    const siguiente = turnos.find(t => t.estado === "esperando")
    if (!siguiente) {
        return res.status(404).json({ error: "No hay turnos pendientes para llamar" })
    }
    siguiente.estado = "atendiendo"
    res.json({ mensaje: "Llamando al siguiente turno", turno: siguiente })
})

app.put('/turnos/:id/finalizar', (req, res) => {
    const turno = turnos.find(t => t.id === parseInt(req.params.id))
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" })
    turno.estado = "finalizado"
    res.json({ mensaje: "Turno finalizado exitosamente", turno })
})

app.get('/turnos/espera', (req, res) => {
    let enEspera = 0
    for (const t of turnos) {
        if (t.estado === "esperando") {
            enEspera++
        }
    }
    res.json({ totalEnEspera: enEspera })
})