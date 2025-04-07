import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Erro ao carregar tarefas');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Erro ao excluir tarefa');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, {
        ...task,
        status: newStatus
      });
      fetchTasks();
    } catch (err) {
      setError('Erro ao atualizar status');
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4 text-center">Gerenciador de Tarefas</h1>
      
      {error && <Alert variant="danger" className="alert-fixed">{error}</Alert>}

      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Nova Tarefa
        </Button>
      </div>

      <TaskForm
        show={showForm}
        task={currentTask}
        onClose={() => {
          setShowForm(false);
          setCurrentTask(null);
        }}
        onSave={() => {
          fetchTasks();
          setShowForm(false);
        }}
      />

      <TaskList
        tasks={tasks}
        onEdit={(task) => {
          setCurrentTask(task);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
}

export default App;