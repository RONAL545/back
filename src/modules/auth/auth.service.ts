import pool from "../../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  id_usuario: number;
  usuario: string;
  contrasena: string;
  id_perfil: number;
}

class AuthService {
  async login(usuario: string, contrasena: string) {
    // Buscar usuario en la BD
    const query = "SELECT * FROM usuarios WHERE usuario = $1 AND estado = 1";
    const result = await pool.query(query, [usuario]);

    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user: User = result.rows[0];

    // Comparar contraseña
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    const historialQuery = "INSERT INTO historial_acceso (id_usuario) VALUES ($1)";
    await pool.query(historialQuery, [user.id_usuario]); 


    // Crear token JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        perfil: user.id_perfil,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { token, usuario: user.usuario, perfil: user.id_perfil };
  }
}

export default new AuthService();
