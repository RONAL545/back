// Asumiendo que tienes un UsuariosController

import { Router } from 'express';
import { UsuariosController } from './usuarios.controller';
                                                                                            
const router = Router();
const usuariosController = new UsuariosController();

// Ruta PUT para el reseteo
router.put('/reset-password/:usuario', usuariosController.resetearContrasena);

// Ruta DELETE para la eliminación lógica
router.delete('/:id', usuariosController.eliminarUsuario);

export default router;  