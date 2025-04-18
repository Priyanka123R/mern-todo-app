import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editText, setEditText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Fetch error:', err.response?.data || err.message);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      const response = await axios.post('/api/todos', { text });
      setTodos([response.data, ...todos]);
      setText('');
      setError('');
    } catch (err) {
      setError('Failed to add todo');
      console.error('Add error:', err.response?.data || err.message);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`/api/todos/${id}`, {
        completed: !todo.completed,
        text: todo.text
      });
      setTodos(todos.map(t => t._id === id ? response.data : t));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error('Toggle error:', err.response?.data || err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`/api/todos/${id}`, {
        text: editText,
        completed: todo.completed
      });

      setTodos(todos.map(t => t._id === id ? response.data : t));
      setEditingId(null);
      setEditText('');
      setError('');
    } catch (err) {
      setError('Failed to edit todo');
      console.error('Edit error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <div className="todo-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTodo(todo._id)}>
                  {todo.text}
                </span>
                <div className="actions">
                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
