import { Request, Response } from "express";
import authService from "./auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    const { usuario, contrasena } = req.body;

    try {
      const data = await authService.login(usuario, contrasena);
      return res.json(data);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}

export default new AuthController();
