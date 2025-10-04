import { Request, Response } from "express";
import { UsuariosService } from "./usuarios.service";

const usuariosService = new UsuariosService();

export class UsuariosController {
  async resetearContrasena(req: Request, res: Response): Promise<void> {
    const usuario = req.params.usuario; // Obtiene el nombre de usuario de la URL

    if (!usuario) {
      res
        .status(400)
        .json({ message: "Debe proporcionar un nombre de usuario." });
      return;
    }

    try {
      await usuariosService.resetearContrasena(usuario);
      res
        .status(200)
        .json({
          message: `Contraseña de ${usuario} reseteada a valor por defecto.`,
        });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      res
        .status(500)
        .json({ message: errorMessage || "Error al resetear la contraseña." });
    }
  }

  async eliminarUsuario(req: Request<{id:string}>, res: Response): Promise<void> {
    const idUsuario = parseInt(req.params.id); // Obtiene el ID de la URL

    if (isNaN(idUsuario)) {
      res.status(400).json({ message: "ID de usuario inválido." });
      return;
    }

    try {
      const nombreUsuario = await usuariosService.eliminarUsuarioLogico(idUsuario);
      res
        .status(200)
        .json({
          message: `Usuario ${nombreUsuario} eliminado correctamente.`,
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";

      res
        .status(500)
        .json({ message: errorMessage || "Error al eliminar el usuario." });
    }
  }
}
