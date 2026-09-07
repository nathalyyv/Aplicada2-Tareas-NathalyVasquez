const express = require('express')
const app = express ()

app.use(express.json())

app.listen(3000, () => console.log("Servidor en el puerto 3000"))

app .use((req,res,next) =>{
    console.log(`[${new Date().toISOString()}] ${req.method} $ {req.url}`)
    next()
})

const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body
    if (!pregunta || !opciones || !Array.isArray(opciones)) {
        return res.status(400).json({ error: "La pregunta y las opciones (arreglo) son requeridas" })
    }
    if (opciones.length < 2) {
        return res.status(400).json({ error: "La encuesta debe tener al menos 2 opciones" })
    }
    next()
}
let encuestas = [
    {
        id:1,
        pregunta: "¿Que prefieres?",
        opciones: ["Dulce", "Salado"],
        votos: {"Dulce": 4, "Salado": 2}
    }
]
let nextId = 2

app.post('/encuestas', validarEncuesta, (req,res) => {
    const {pregunta,opciones} = req.body
    const votos ={}
    for(const opcion of opciones){
        votos[opcion]=0
    }
    const nuevaEncuesta ={
        id: nextId++,
        pregunta, 
        opciones, 
        votos
    }
    encuestas.push(nuevaEncuesta)
    res.status(201).json(nuevaEncuesta)
})

app.get('/encuestas', (req, res) => {
    res.json(encuestas)
})

app.post('/encuestas/:id/votar', (req, res) => {
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id))
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" })
    const { opcion } = req.body
    if (!opcion || !encuesta.opciones.includes(opcion)) {
        return res.status(400).json({ error: "La opción seleccionada no existe en la encuesta" })
    }
    encuesta.votos[opcion] += 1
    res.json({ mensaje: "Voto registrado exitosamente", votos: encuesta.votos })
})

app.get('/encuestas/:id/resultados', (req, res) => {
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id))
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" })
    let totalVotos = 0
    for (const opcion of encuesta.opciones) {
        totalVotos += encuesta.votos[opcion]
    }
    let desglosado = []
    let mayorVotos = -1
    let ganador = "Empate / Sin votos"
    for (const opcion of encuesta.opciones) {
        const cantidadVotos = encuesta.votos[opcion]
        const porcentaje = totalVotos === 0 ? "0%" : `${((cantidadVotos / totalVotos) * 100).toFixed(1)}%`
        desglosado.push({
            opcion,
            votos: cantidadVotos,
            porcentaje
        })
        if (cantidadVotos > mayorVotos && cantidadVotos > 0) {
            mayorVotos = cantidadVotos
            ganador = opcion
        }
    }
    res.json({
        pregunta: encuesta.pregunta,
        totalVotos,
        ganador,
        resultados: desglosado
    })
})

app.delete('/encuestas/:id', (req, res) => {
    const index = encuestas.findIndex(e => e.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).json({ error: "Encuesta no encontrada" })
    encuestas.splice(index, 1)
    res.json({ mensaje: "Encuesta eliminada" })
})