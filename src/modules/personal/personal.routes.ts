// src/modules/personal/personal.routes.ts

import { Router } from 'express';
import { PersonalController } from './personal.controller';

const router = Router();
const personalController = new PersonalController();

// Define la ruta POST para registrar personal
router.post('/registrar', personalController.crearPersonal.bind(personalController));

// Define la ruta GET para obtener todo el personal
router.get('/', personalController.obtenerTodo.bind(personalController));

export default router;