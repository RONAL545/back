// src/modules/usuarios/usuarios.service.ts (o un archivo similar)

import { query } from "../../config/database"; // Tu función de conexión

export class UsuariosService {
  /**
   * Resetea la contraseña de un usuario a un valor por defecto encriptado.
   * @param usuario El nombre de usuario (DNI o Código de Matrícula).
   */
  async resetearContrasena(usuario: string): Promise<void> {
    const sql = "SELECT fn_resetear_contrasena($1)";
    const values = [usuario];

    try {
      await query(sql, values);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      throw new Error(`Error al resetear contraseña: ${errorMessage}`);
    }
  }

  /**
   * Realiza la eliminación lógica de un usuario (estado = 0).
   * @param idUsuario El ID del usuario a desactivar.
   * @returns El nombre de usuario eliminado.
   */
  async eliminarUsuarioLogico(idUsuario: number): Promise<string> {
    // Primero obtenemos el nombre de usuario
    const sqlGetUsuario = "SELECT usuario FROM usuarios WHERE id_usuario = $1";

    try {
      const result = await query(sqlGetUsuario, [idUsuario]);

      if (result.rows.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      const nombreUsuario = result.rows[0].usuario;

      // Luego eliminamos el usuario
      const sqlEliminar = "SELECT fn_eliminar_usuario($1)";
      await query(sqlEliminar, [idUsuario]);

      return nombreUsuario;
    } catch (error) {
      // El error lanzado desde PostgreSQL será capturado aquí
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      throw new Error(`Error al eliminar usuario: ${errorMessage}`);
    }
  }
}
