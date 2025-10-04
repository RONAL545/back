// src/modules/voluntarios/voluntarios.service.ts

import { query } from "../../config/database"; // Reutilizamos tu función de conexión centralizada

export class VoluntarioService {
  /**
   * Llama a la función de PostgreSQL para registrar un nuevo voluntario y su usuario.
   */
  async registrarVoluntario(
    codigoMat: string,
    nombre: string,
    apellido: string
  ): Promise<void> {
    // SQL: Llamamos a la FUNCTION registrar_voluntario
    const sql = "SELECT registrar_voluntario($1, $2, $3)";

    // Valores que se mapean a $1, $2, $3...
    const values = [codigoMat, nombre, apellido];

    try {
      // Ejecutamos la consulta a través del driver pg
      await query(sql, values);
    } catch (error: any) {
      console.error("Error en el registro de voluntario:", error);

      if (error.code === "23505") {
        throw new Error("El código de matrícula ya está registrado en el sistema.");
      }
      throw new Error('No se pudo completar el registro del voluntario. Verifique los datos.');
    }
  }

  /**
   * Obtiene todos los voluntarios registrados.
   */
  async obtenerTodo(): Promise<any[]> {
    const sql = `
      SELECT
        v.id_usuario,
        v.codigo_mat,
        u.nombre,
        u.apellido,
        v.estado,
        (SELECT MAX(ha.fecha)
         FROM historial_acceso ha
         WHERE ha.id_usuario = v.id_usuario) AS ultima_sesion
      FROM voluntario v
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      ORDER BY v.id_usuario DESC
    `;

    try {
      const result = await query(sql, []);
      return result.rows;
    } catch (error: any) {
      console.error('Error al obtener voluntarios:', error);
      throw new Error('No se pudo obtener la lista de voluntarios.');
    }
  }
}
