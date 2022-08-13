import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/dataBase.js'
//Creado la app
const app = express()

//Conexión a la base de datos
try {
  await db.authenticate()
  console.log('Conexión a la base de datos establecida')
} catch (error) {
  console.log(error)
}

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
