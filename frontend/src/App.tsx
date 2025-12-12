import { useState, useEffect } from "react";
import "./App.css";

const apiUrl =
  (window as any).env?.VITE_API_URL || import.meta.env.VITE_API_URL;

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    if (!todoTitle.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: todoTitle, completed: false }),
      });

      if (response.ok) {
        await fetchTodos();
        setTodoTitle("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTodos();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const updateTodo = async () => {
    if (!todoTitle.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: todoTitle }),
      });

      if (response.ok) {
        await fetchTodos();
        setTodoTitle("");
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      setTodoTitle(value.trim());
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTodoTitle(todo.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setTodoTitle("");
  };

  const handleSubmit = () => {
    if (editingId) {
      updateTodo();
    } else {
      createTodo();
    }
  };

  return (
    <>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Todo List</h1>

        <div style={{ marginBottom: "20px" }}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={todoTitle}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={loading || !todoTitle.trim()}
            >
              {editingId ? "Update Todo" : "Add Todo"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                disabled={loading}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {loading && <div>Loading...</div>}

        <div>
          {todos.length === 0 ? (
            <p>No todos yet. Create one above!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      marginLeft: "10px",
                    }}
                  >
                    {todo.title}
                  </span>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
