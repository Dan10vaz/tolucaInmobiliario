import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
//Creado la app
const app = express()

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))

//Routing
app.use('/auth', usuarioRoutes)

//Definir un puerto y arrancamos el proyecto
const port = 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
