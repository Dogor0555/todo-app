const express = require('express');
const cors = require('cors');
const { initializeDatabase, pool } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint mejorado
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await pool.query('SELECT 1');
    res.status(200).json({ 
      status: 'OK', 
      message: 'Backend y base de datos funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error de conexión a la base de datos',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// 📋 ENDPOINTS DE LA API (los mismos que antes)
// GET /tasks - Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /tasks - Crear nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /tasks/:id - Actualizar tarea
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;

    let query = '';
    let values = [];

    if (typeof completed !== 'undefined') {
      query = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
      values = [completed, id];
    } else if (title) {
      query = 'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *';
      values = [title.trim(), id];
    } else {
      return res.status(400).json({ error: 'Se requiere completed o title en el body' });
    }

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /tasks/:id - Eliminar tarea
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Manejo de errores para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Inicializar base de datos primero
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check disponible en: http://localhost:${PORT}/health`);
      console.log(`📋 API Tasks disponible en: http://localhost:${PORT}/tasks`);
    });
  } catch (error) {
    console.error('❌ Error crítico iniciando servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

module.exports = app;