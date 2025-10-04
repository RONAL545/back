import { Router } from 'express';
import { ReportesController } from './reportes.controller';

const router = Router();
const reportesController = new ReportesController();

router.get('/', reportesController.getReportes);
router.get('/:id', reportesController.getReporteById);
router.post('/', reportesController.createReporte);

export default router;