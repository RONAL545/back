import { Request, Response } from 'express';
import { ReportesService } from './reportes.service';

export class ReportesController {
  private reportesService = new ReportesService();

  getReportes = async (req: Request, res: Response) => {
    try {
      const reportes = await this.reportesService.getAllReportes();
      res.json(reportes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching reports' });
    }
  };

  getReporteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reporte = await this.reportesService.getReporteById(id);
      if (!reporte) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json(reporte);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching report' });
    }
  };

  createReporte = async (req: Request, res: Response) => {
    try {
      const reporte = await this.reportesService.createReporte(req.body);
      res.status(201).json(reporte);
    } catch (error) {
      res.status(400).json({ error: 'Error creating report' });
    }
  };
}