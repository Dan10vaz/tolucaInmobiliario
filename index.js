const express = require('express')

//creado la app
const app = express()

//routing
app.get('/', function (req, res) {
  res.send('Hello World in express')
})

//Definir un puerto y arrancamos el proyecto
const port = 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
