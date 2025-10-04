// src/modules/listados/listados.service.ts
import { query } from '../../config/database'; // Tu función de conexión

export class ListadosService {

    async listarPersonalActivo(): Promise<any[]> {
        // Consulta SQL Personal (la primera consulta de arriba)
        const sql = `
            SELECT
                u.usuario, u.nombre, u.apellido, u.fecha_creacion,
                p.dni, pf.descripcion AS perfil, s.descripcion AS sede,
                (SELECT MAX(ha.fecha) FROM historial_acceso ha WHERE ha.id_usuario = u.id_usuario) AS fecha_ultimo_acceso
            FROM usuarios u
            INNER JOIN personal p ON u.id_usuario = p.id_usuario
            INNER JOIN perfil pf ON u.id_perfil = pf.id_perfil
            LEFT JOIN sede s ON p.id_sede = s.id_sede
            WHERE u.estado = 1 AND p.estado = 1
            ORDER BY u.apellido, u.nombre;
        `;
        const result = await query(sql, []);
        return result.rows;
    }

    async listarVoluntariosActivos(): Promise<any[]> {
        // Consulta SQL Voluntario (la segunda consulta de arriba)
        const sql = `
            SELECT
                u.usuario, u.nombre, u.apellido, u.fecha_creacion,
                v.codigo_mat AS codigo, pf.descripcion AS perfil,
                (SELECT MAX(ha.fecha) FROM historial_acceso ha WHERE ha.id_usuario = u.id_usuario) AS fecha_ultimo_acceso
            FROM usuarios u
            INNER JOIN voluntario v ON u.id_usuario = v.id_usuario
            INNER JOIN perfil pf ON u.id_perfil = pf.id_perfil
            WHERE u.estado = 1 AND v.estado = 1
            ORDER BY u.apellido, u.nombre;
        `;
        const result = await query(sql, []);
        return result.rows;
    }
}