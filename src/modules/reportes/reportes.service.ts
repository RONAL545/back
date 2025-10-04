import pool from '../../config/database';
import { generateId, getCurrentDate } from '../../core/utils';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_residuo: string;
  cantidad: number;
  fecha_creacion: string;
  usuario_id: string;
}

export class ReportesService {
  async getAllReportes(): Promise<Reporte[]> {
    const query = 'SELECT * FROM reportes ORDER BY fecha_creacion DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  async getReporteById(id: string): Promise<Reporte | null> {
    const query = 'SELECT * FROM reportes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async createReporte(reporteData: Omit<Reporte, 'id' | 'fecha_creacion'>): Promise<Reporte> {
    const id = generateId();
    const fecha_creacion = getCurrentDate();
    
    const query = `
      INSERT INTO reportes (id, titulo, descripcion, tipo_residuo, cantidad, fecha_creacion, usuario_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      id,
      reporteData.titulo,
      reporteData.descripcion,
      reporteData.tipo_residuo,
      reporteData.cantidad,
      fecha_creacion,
      reporteData.usuario_id
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}