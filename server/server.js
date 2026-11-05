const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// GET: View all tasks
app.get("/api/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// In-memory tasks array
let tasks = [];

// GET: View one task by ID
app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json(task);
});

// POST: Add a new task
app.post("/api/tasks", (req, res) => {
    const { title } = req.body || {};

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const newTask = {
        id: Date.now(),
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PUT: Update a task
app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    const body = req.body || {};

    if (body.title !== undefined) {
        if (typeof req.body.title !== "string" ||
            !req.body.title.trim()) {
            return res.status(400).json({
                message: "Task title cannot be empty"
            });
        }

        if (body.done !== undefined) {
            task.done = body.done;
        }
    }

    if (req.body.done !== undefined) {
        task.done = req.body.done;
    }

    res.status(200).json(task);
});

// DELETE: Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(204).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
