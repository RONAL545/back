// src/modules/listados/listados.controller.ts
import { Request, Response } from 'express';
import { ListadosService } from './listado_usuarios.service';

const listadosService = new ListadosService();

export class ListadosController {

    async getPersonal(req: Request, res: Response): Promise<void> {
        try {
            const personal = await listadosService.listarPersonalActivo();
            res.status(200).json(personal);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message: 'Error al listar personal.'});
        }
    }

    async getVoluntarios(req: Request, res: Response): Promise<void> {
        try {
            const voluntarios = await listadosService.listarVoluntariosActivos();
            res.status(200).json(voluntarios);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error? error.message: 'Error al listar voluntarios.' });
        }
    }
}