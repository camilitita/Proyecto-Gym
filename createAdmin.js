///import bcrypt from 'bcryptjs';
//import pool from './src/config/db.js'; // Importa tu pool de la base de datos
//import 'dotenv/config';

/*const createAdminUser = async () => {
    // Define el usuario y la contraseña que usará la administradora
    const name = "Administrador";
    const email = 'camicas0118@gmail.com';
    const password = '1234';
    const role = 'admin';

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const query = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE SET name = $1, password = $3, role = $4;
            `;
        await pool.query(query, [name, email, hashedPassword, role]);
        console.log('Usuario administrador creado o actualizado exitosamente.');
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
};*/

//createAdminUser();