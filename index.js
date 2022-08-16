import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/dataBase.js'
//Creado la app
const app = express()

//habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

//habilitar parseo de cookies
app.use(cookieParser())

//habilitar csrf
app.use(csrf({ cookie: true }))

//Conexión a la base de datos
try {
    await db.authenticate()
    db.sync()
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
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

