const API_URL = 'http://localhost:3000';

// Elementos del DOM
const tasksContainer = document.getElementById('tasksContainer');
const taskInput = document.getElementById('taskInput');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('errorMessage');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// 1. Cargar todas las tareas
async function loadTasks() {
    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_URL}/tasks`);
        
        if (!response.ok) {
            throw new Error('Error al cargar tareas');
        }

        const tasks = await response.json();
        renderTasks(tasks);
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudieron cargar las tareas. Verifica que el backend esté funcionando.');
    } finally {
        hideLoading();
    }
}

// 2. Agregar nueva tarea
async function addNewTask() {
    const title = taskInput.value.trim();
    
    if (!title) {
        alert('Por favor escribe una tarea');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Error al crear tarea');
        }

        // Limpiar input y recargar lista
        taskInput.value = '';
        await loadTasks();
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo crear la tarea');
    }
}

// 3. Alternar estado de tarea (completada/pendiente)
async function toggleTask(id, currentCompleted) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !currentCompleted })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar tarea');
        }

        await loadTasks();
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo actualizar la tarea');
    }
}

// 4. Eliminar tarea
async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar tarea');
        }

        await loadTasks();
        
    } catch (error) {
        console.error('Error:', error);
        showError('No se pudo eliminar la tarea');
    }
}

// Función para renderizar tareas en el DOM
function renderTasks(tasks) {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="no-tasks">No hay tareas. ¡Agrega una nueva!</p>';
        return;
    }

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content" onclick="toggleTask(${task.id}, ${task.completed})">
                <span class="task-title">${task.title}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
        </div>
    `).join('');
}

// Funciones auxiliares para UI
function showLoading() {
    loadingElement.classList.remove('hidden');
    tasksContainer.innerHTML = '';
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
}

// Permitir agregar tarea con Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask();
    }
});