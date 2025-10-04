import { query } from '../../config/database'; // Importamos la función de conexión centralizada


export class PersonalService {

    /**
     * Llama a la función de PostgreSQL para registrar un nuevo personal y usuario.
     */
    async registrarPersonal(dni: string, nombre: string, apellido: string, idSede: number): Promise<void> {
        // La consulta SQL llama a la FUNCTION (que actúa como un PROCEDURE)
        const sql = 'SELECT registrar_personal($1, $2, $3, $4)';
        
        // Los valores se pasan como un arreglo, previniendo inyección SQL
        const values = [dni, nombre, apellido, idSede];

        try {
            // Ejecutamos la consulta. El driver pg se encarga de la comunicación.
            await query(sql, values);
           // return { mensaje: 'Personal registrado correctamente' };
            // Si llega aquí, la función SQL fue exitosa y la transacción se completó.
            
        } catch (error: any) {
            // Manejo de errores de la base de datos (ej. DNI duplicado)
            console.error('Error en el registro de personal:', error);

            // Si es un error de clave duplicada (código 23505)
            if (error.code === '23505') {
                throw new Error('El DNI ya está registrado en el sistema.');
            }

            // Re-lanzar un error genérico para otros casos
            throw new Error('No se pudo completar el registro del personal. Verifique los datos.');
        }
    }

    /**
     * Obtiene todo el personal registrado.
     */
    async obtenerTodo(): Promise<any[]> {
        const sql = `
            SELECT
                p.id_usuario,
                p.dni,
                u.nombre,
                u.apellido,
                p.estado,
                s.descripcion AS sede,
                (SELECT MAX(ha.fecha)
                 FROM historial_acceso ha
                 WHERE ha.id_usuario = p.id_usuario) AS ultima_sesion
            FROM personal p
            LEFT JOIN sede s ON p.id_sede = s.id_sede
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            ORDER BY p.id_usuario DESC
        `;

        try {
            const result = await query(sql, []);
            return result.rows;
        } catch (error: any) {
            console.error('Error al obtener personal:', error);
            throw new Error('No se pudo obtener la lista de personal.');
        }
    }
}


