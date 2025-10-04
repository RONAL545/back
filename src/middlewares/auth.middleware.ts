import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// 👇 Nuevo middleware para roles
export const verificarRol = (rolesPermitidos: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(user.perfil)) {
      return res.status(403).json({ message: "No tienes permisos suficientes" });
    }

    next();
  };
};
