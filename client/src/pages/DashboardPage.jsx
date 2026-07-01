import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const defaultForm = {
  title: '',
  description: '',
  status: 'Pending',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState('');
  const [formData, setFormData] = useState(defaultForm);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setError('');

    try {
      const response = await api.get('/api/v1/tasks?page=1&limit=50');
      setTasks(response.data.tasks || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingTaskId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSavingTask(true);
    setError('');
    setMessage('');

    try {
      if (editingTaskId) {
        await api.put(`/api/v1/tasks/${editingTaskId}`, formData);
        setMessage('Task updated successfully');
      } else {
        await api.post('/api/v1/tasks', formData);
        setMessage('Task created successfully');
      }

      resetForm();
      await fetchTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save task');
    } finally {
      setSavingTask(false);
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setMessage('Editing task');
    setError('');
  };

  const handleDeleteTask = async (taskId) => {
    setError('');
    setMessage('');

    try {
      await api.delete(`/api/v1/tasks/${taskId}`);
      setMessage('Task deleted successfully');
      if (editingTaskId === taskId) {
        resetForm();
      }
      await fetchTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header card">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.name || 'User'}</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h2>{editingTaskId ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit} className="form-card">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="row-actions">
            <button type="submit" disabled={savingTask}>
              {savingTask
                ? 'Saving...'
                : editingTaskId
                  ? 'Update Task'
                  : 'Add Task'}
            </button>
            {editingTaskId && (
              <button type="button" onClick={resetForm} className="secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <section className="card">
        <h2>Tasks</h2>
        {loadingTasks ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || 'No description'}</p>
                  <small>Status: {task.status}</small>
                </div>
                <div className="row-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => startEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
