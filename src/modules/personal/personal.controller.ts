// src/modules/personal/personal.controller.ts

import { Request, Response } from 'express';
import { PersonalService } from './personal.service';

// Instanciamos el Service (en Express puro, sin inyección de dependencia)
const personalService = new PersonalService();

export class PersonalController {
    
    async crearPersonal(req: Request, res: Response): Promise<void> {
        const { dni, nombre, apellido, id_sede } = req.body;


        if (!dni || !nombre || !apellido || isNaN(id_sede)) {
            res.status(400).json({ message: 'Datos incompletos o incorrectos.' });
            return;
        }

        try {
            // 2. Llama al Service para ejecutar la lógica en la BD
            await personalService.registrarPersonal(dni, nombre, apellido, id_sede);

            // 3. Respuesta exitosa
            res.status(201).json({ 
                message: 'Personal y usuario registrados con éxito.',
                usuario: dni // Devolvemos el usuario creado
            });

        } catch (error) {
            // 4. Respuesta de error
            console.error('Error en controller:', error);
            res.status(500).json({
                error: 'Error interno al registrar personal.',
                detalle: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async obtenerTodo(req: Request, res: Response): Promise<void> {
        try {
            const personal = await personalService.obtenerTodo();
            res.status(200).json(personal);
        } catch (error) {
            console.error('Error en controller:', error);
            res.status(500).json({
                error: 'Error al obtener el personal.',
                detalle: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}






