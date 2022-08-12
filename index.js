import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
//Creado la app
const app = express()
//Routing
app.use('/', usuarioRoutes)

//Definir un puerto y arrancamos el proyecto
const port = 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
