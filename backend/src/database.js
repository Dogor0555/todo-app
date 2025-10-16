const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'todoapp',
  port: process.env.DB_PORT || 5432,
});

// Función para crear la tabla si no existe
const createTableIfNotExists = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando existencia de la tabla "tasks"...');
    
    // Primero verificar si la tabla existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tasks'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      console.log('📦 Creando tabla "tasks"...');
      
      // Crear la tabla tasks
      await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('✅ Tabla "tasks" creada exitosamente');
      
      // Opcional: Insertar datos de ejemplo
      await client.query(`
        INSERT INTO tasks (title, completed) VALUES 
        ('Aprender Docker', false),
        ('Configurar PostgreSQL', true),
        ('Implementar API REST', false);
      `);
      
      console.log('📝 Datos de ejemplo insertados');
    } else {
      console.log('✅ Tabla "tasks" ya existe, continuando...');
    }
    
  } catch (error) {
    console.error('❌ Error creando/verificando tabla:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Función para probar la conexión a la base de datos
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
};

// Inicializar la base de datos
const initializeDatabase = async () => {
  console.log('🚀 Inicializando base de datos...');
  
  // Esperar a que PostgreSQL esté listo (útil para Docker)
  let retries = 5;
  while (retries > 0) {
    if (await testConnection()) {
      await createTableIfNotExists();
      return;
    }
    
    retries--;
    console.log(`⏳ Esperando a PostgreSQL... reintentos restantes: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
  }
  
  throw new Error('No se pudo conectar a PostgreSQL después de varios intentos');
};

module.exports = {
  pool,
  createTableIfNotExists,
  testConnection,
  initializeDatabase
};