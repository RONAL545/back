import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import usuarioRoutes from "../modules/usuarios/usuarios.routes";
import personalRoutes from "../modules/personal/personal.routes";
import voluntariosRoutes from "../modules/voluntarios/voluntarios.routes";
import usuariosRoutes from "../modules/usuarios/usuarios.routes"
import listado_usuariosRoutes from "../modules/listado_usuarios/listado_usuarios.routes"

const router = Router();

// registrar módulos
router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/personal", personalRoutes);
router.use("/voluntarios", voluntariosRoutes);
router.use("/usuarios",usuariosRoutes);
router.use("/listado_usuarios",listado_usuariosRoutes)

export default router;
