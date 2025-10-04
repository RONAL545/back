// src/modules/voluntarios/voluntarios.controller.ts

import { Request, Response } from 'express';
import { VoluntarioService } from './voluntarios.service';

// Instanciamos el Service
const voluntarioService = new VoluntarioService();

export class VoluntarioController {
    
    async crearVoluntario(req: Request, res: Response): Promise<void> {
        const { codigo_mat, nombre, apellido } = req.body;

        // 1. Validaciones básicas
        if (!codigo_mat || !nombre || !apellido) {
            res.status(400).json({ message: 'Faltan el código de matrícula, nombre o apellido.' });
            return;
        }

        try {
            // 2. Llama al Service para ejecutar la lógica en la BD
            await voluntarioService.registrarVoluntario(codigo_mat, nombre, apellido);

            // 3. Respuesta exitosa
            res.status(201).json({ 
                message: 'Voluntario registrado con éxito.',
                usuario: codigo_mat // Devolvemos el usuario creado (que es el código)
            });

        } catch (error) {
            // 4. Respuesta de error
            console.error('Error en controller:', error);
            res.status(500).json({
                error: 'Error interno al registrar voluntario.',
                detalle: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async obtenerTodo(req: Request, res: Response): Promise<void> {
        try {
            const voluntarios = await voluntarioService.obtenerTodo();
            res.status(200).json(voluntarios);
        } catch (error) {
            console.error('Error en controller:', error);
            res.status(500).json({
                error: 'Error al obtener voluntarios.',
                detalle: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}