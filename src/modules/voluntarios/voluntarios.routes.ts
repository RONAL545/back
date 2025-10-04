// src/modules/voluntarios/voluntarios.routes.ts

import { Router } from 'express';
import { VoluntarioController } from './voluntarios.controller';

const router = Router();
const voluntarioController = new VoluntarioController();

// Ruta: POST /api/voluntarios (o el prefijo que uses)
router.post('/registrar', voluntarioController.crearVoluntario.bind(voluntarioController));

// Ruta: GET /api/voluntarios
router.get('/', voluntarioController.obtenerTodo.bind(voluntarioController));

export default router;