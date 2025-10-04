DROP DATABASE ecoest_db;
CREATE DATABASE ecoest_db
    WITH 
    OWNER = ecoest_user
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;


-- ===============================
-- PERFIL Y OPCIONES
-- ===============================
CREATE TABLE perfil (
    id_perfil SERIAL PRIMARY KEY,
    descripcion VARCHAR(50),
    estado SMALLINT DEFAULT 1
);

CREATE TABLE opcion (
    id_opcion SERIAL PRIMARY KEY,
    descripcion VARCHAR(100),
    icono VARCHAR(50),
    url VARCHAR(255),
    estado SMALLINT DEFAULT 1
);

CREATE TABLE acceso (
    id_perfil INT NOT NULL,
    id_opcion INT NOT NULL,
    estado SMALLINT DEFAULT 1,
    PRIMARY KEY (id_perfil, id_opcion),
    FOREIGN KEY (id_perfil) REFERENCES perfil(id_perfil),
    FOREIGN KEY (id_opcion) REFERENCES opcion(id_opcion)
);

-- ===============================
-- USUARIOS Y SUBTIPOS
-- ===============================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL, 
    contrasena TEXT NOT NULL,           
    nombre VARCHAR(80) NOT NULL,
    apellido VARCHAR(80) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    estado SMALLINT DEFAULT 1,           
    id_perfil INT NOT NULL REFERENCES perfil(id_perfil)
);

-- Subtipo: Personal
CREATE TABLE sede (
    id_sede SERIAL PRIMARY KEY,
    descripcion VARCHAR(100),
    estado SMALLINT DEFAULT 1
);

CREATE TABLE personal (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id_usuario),
    dni VARCHAR(8) UNIQUE NOT NULL,
    id_sede INT REFERENCES sede(id_sede),
	estado SMALLINT DEFAULT 1
);

-- Subtipo: Voluntario
CREATE TABLE voluntario (
    id_usuario INT PRIMARY KEY REFERENCES usuarios(id_usuario),
    codigo_mat VARCHAR(10) UNIQUE NOT NULL,
	estado SMALLINT DEFAULT 1
);

-- ===============================
-- HISTORIAL DE ACCESO
-- ===============================
CREATE TABLE historial_acceso (
    id_historial_acceso SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario)
);

-- ===============================
-- ESTRUCTURA FÍSICA
-- ===============================
CREATE TABLE pabellon (
    id_pabellon SERIAL PRIMARY KEY,
    descripcion VARCHAR(100),
    estado SMALLINT DEFAULT 1,
    id_sede INT NOT NULL REFERENCES sede(id_sede)
);

CREATE TABLE pila_residuo (
    id_pila_residuo SERIAL PRIMARY KEY,
    descripcion VARCHAR(100),
    estado SMALLINT DEFAULT 1,
    id_pabellon INT NOT NULL REFERENCES pabellon(id_pabellon)
);

CREATE TABLE unidad (
    id_unidad SERIAL PRIMARY KEY,
    descripcion VARCHAR(50),
    estado SMALLINT DEFAULT 1
);

-- ===============================
-- REGISTROS DE GESTIÓN
-- ===============================
CREATE TABLE registro_kilos_personal (
    id_registro_kilos_personal SERIAL PRIMARY KEY,
    kilo_papel DECIMAL(8, 2),
    kilo_vidrio DECIMAL(8, 2),
    kilo_plastico DECIMAL(8, 2),
    kilo_organico DECIMAL(8, 2),
    kilo_metal DECIMAL(8, 2),
    kilo_no_aprovechable DECIMAL(8, 2),
    kilo_botella_canastilla DECIMAL(8, 2),
    kilo_papel_tacho_especial DECIMAL(8, 2),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado SMALLINT DEFAULT 1,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    id_sede INT NOT NULL REFERENCES sede(id_sede),
    id_unidad INT NOT NULL REFERENCES unidad(id_unidad)
);

CREATE TABLE registro_segregacion (
    id_registro_segregacion SERIAL PRIMARY KEY,
    papel_bien_segregado BOOLEAN,
    vidrio_bien_segregado BOOLEAN,
    plastico_bien_segregado BOOLEAN,
    organicos_bien_segregado BOOLEAN,
    metal_bien_segregado BOOLEAN,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado SMALLINT DEFAULT 1,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    id_sede INT NOT NULL REFERENCES sede(id_sede)
);

-- Insertar datos en perfil
INSERT INTO perfil (descripcion) VALUES
('Administrador'),
('Personal'),
('Voluntario');

-- Insertar datos en la tabla sede
INSERT INTO sede (id_sede, descripcion)
VALUES
    (1, 'La Capilla - Académico'),
    (2, 'La Capilla - Administrativo'),
    (3, 'Ayabacas'),
    (4, 'Santa Catalina');


CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION registrar_personal(
    p_dni         VARCHAR,
    p_nombre      VARCHAR,
    p_apellido    VARCHAR,
    p_id_sede     INT
) RETURNS VOID AS $$
DECLARE
    v_id_usuario INT;
BEGIN
    -- Insertar en usuarios
    INSERT INTO usuarios (usuario, contrasena, nombre, apellido, id_perfil)
    VALUES (
        p_dni,  -- usuario = DNI
        crypt('123456789', gen_salt('bf')),  -- contraseña fija encriptada
        p_nombre,
        p_apellido,
        2  -- perfil 2 = personal
    )
    RETURNING id_usuario INTO v_id_usuario;

    -- Insertar en personal
    INSERT INTO personal (id_usuario, dni, id_sede)
    VALUES (
        v_id_usuario,
        p_dni,
        p_id_sede
    );
END;
$$ LANGUAGE plpgsql;
-- ------------------------------------------------

-- funcion para registrare voluntario
CREATE OR REPLACE FUNCTION registrar_voluntario(
    p_codigo_mat  VARCHAR,
    p_nombre      VARCHAR,
    p_apellido    VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_id_usuario INT;
BEGIN
    -- Insertar en usuarios
    INSERT INTO usuarios (usuario, contrasena, nombre, apellido, id_perfil)
    VALUES (
        p_codigo_mat,  -- usuario = código matrícula
        crypt('123456789', gen_salt('bf')), -- contraseña fija encriptada
        p_nombre,
        p_apellido,
        3  -- perfil 3 = voluntario
    )
    RETURNING id_usuario INTO v_id_usuario;

    -- Insertar en voluntario
    INSERT INTO voluntario (id_usuario, codigo_mat)
    VALUES (
        v_id_usuario,
        p_codigo_mat
    );
END;
$$ LANGUAGE plpgsql;
-- ------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_eliminar_usuario(
    p_id_usuario INT
) RETURNS VOID AS $$
DECLARE
    v_perfil_id INT;
BEGIN
    -- 1. Obtener el ID del perfil y verificar existencia simultáneamente
    SELECT id_perfil INTO v_perfil_id
    FROM usuarios
    WHERE id_usuario = p_id_usuario;

    -- Si no se encontró el usuario, lanzamos la excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con ID % no encontrado.', p_id_usuario;
    END IF;

    -- 2. Desactivación principal: tabla usuarios
    UPDATE usuarios SET estado = 0 WHERE id_usuario = p_id_usuario;

    -- 3. Desactivación en cascada optimizada (basada en el perfil)
    
    -- Perfil 2 (asumiendo Personal)
    IF v_perfil_id = 2 THEN
        UPDATE personal SET estado = 0 WHERE id_usuario = p_id_usuario;
        
    -- Perfil 3 (asumiendo Voluntario)
    ELSIF v_perfil_id = 3 THEN
        UPDATE voluntario SET estado = 0 WHERE id_usuario = p_id_usuario;
    
    -- Agregar otros perfiles aquí si fuera necesario (ej. Administrador, etc.)
    
    END IF;
    
    -- NOTA: Si v_perfil_id fuera 1 (Admin), solo se desactivaría la cuenta de usuarios.

END;
$$ LANGUAGE plpgsql;

--        ----------------------------------------
CREATE OR REPLACE FUNCTION fn_actualizar_contrasena(
    p_usuario VARCHAR,      -- Nombre de usuario (DNI/codigo_mat)
    p_nueva_contrasena TEXT -- La nueva contraseña enviada desde el frontend
) RETURNS VOID AS $$
BEGIN
    -- 1. Encriptar la nueva contraseña y actualizar el campo
    UPDATE usuarios
    SET contrasena = crypt(p_nueva_contrasena, gen_salt('bf'))
    WHERE usuario = p_usuario;
    
    -- 2. Verificar si se actualizó alguna fila
    IF NOT FOUND THEN
        -- Si no se encuentra el usuario, lanzamos una excepción
        RAISE EXCEPTION 'Usuario % no encontrado o no existe.', p_usuario;
    END IF;

END;
$$ LANGUAGE plpgsql;

-- ----------------------------
CREATE OR REPLACE FUNCTION fn_resetear_contrasena(
    p_usuario_o_dni VARCHAR -- Puede ser el DNI (personal) o el codigo_mat (voluntario)
) RETURNS VOID AS $$
BEGIN
    -- Actualiza la contraseña al valor temporal, encriptado
    UPDATE usuarios
    SET contrasena = crypt('123456789', gen_salt('bf'))
    WHERE usuario = p_usuario_o_dni;
    
    -- Si no se actualizó ninguna fila, lanzamos un error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario % no encontrado o no existe.', p_usuario_o_dni;
    END IF;

END;
$$ LANGUAGE plpgsql;
