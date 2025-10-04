// src/modules/listados/listados.routes.ts
import { Router } from 'express';
import { ListadosController } from './listado_usuarios.controller';

const router = Router();
const listadosController = new ListadosController();

router.get('/personal', listadosController.getPersonal);
router.get('/voluntarios', listadosController.getVoluntarios);

export default router;