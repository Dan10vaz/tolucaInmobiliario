import express, { Router } from 'express';
import { inicio, categoria, noEncontrado, buscador } from '../controllers/appController.js';

const router = express.Router()

//Pagina de incio;
router.get('/', inicio);

//Categorias 
router.get('/categorias/:id', categoria);

//Pagina 404  
router.get('/404', noEncontrado);

//Busqueda
router.post('/buscador', buscador);


export default router;
