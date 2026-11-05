import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const totalTasks = tasks.length;

const completedTasks = tasks.filter(
    task => task.done
).length;

const pendingTasks = totalTasks - completedTasks;

    const API_URL = "http://localhost:5000/api/tasks";

    // Get all tasks
    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError("Cannot connect to backend. Check server.");
        } finally {
            setLoading(false);
        }
    }

    // Add a task
    async function addTask(e) {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error("Unable to add task");
            }

            const newTask = await response.json();

            setTasks([...tasks, newTask]);
            setTitle("");
            setError("");
        } catch (err) {
            setError("Unable to add task");
        }
    }

    // Mark task as completed
    async function toggleTask(task) {
        try {
            const response = await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ done: !task.done })
            });

            if (!response.ok) {
                throw new Error("Unable to update task");
            }

            const updatedTask = await response.json();

            setTasks(tasks.map(t =>
                t.id === updatedTask.id ? updatedTask : t
            ));
        } catch (err) {
            setError("Unable to update task");
        }
    }

    // Delete a task
    async function deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Unable to delete task");
            }

            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            setError("Unable to delete task");
        }
    }

    return (
        <div className="container">
            <h1>Task Manager</h1><br></br>
<div className="stats">
    <div className="stat-card">
        <h2>{totalTasks}</h2>
        <p>Total Tasks</p>
    </div>

    <div className="stat-card">
        <h2>{completedTasks}</h2>
        <p>Completed</p>
    </div>

    <div className="stat-card">
        <h2>{pendingTasks}</h2>
        <p>Pending</p>
    </div>
</div>

            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button type="submit">Add Task</button>
            </form>

            {loading && <p>Loading tasks...</p>}

            {error && <p className="error">{error}</p>}

            {!loading && tasks.length === 0 && (
                <p>No tasks available. Add your first task!</p>
            )}

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <span
                            className={task.done ? "completed" : ""}
                        >
                            {task.title}
                        </span>

                        <button onClick={() => toggleTask(task)}>
                            {task.done ? "Undo" : "Done"}
                        </button>

                        <button onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
