const express = require("express");
const app = express();
app.use(express.json());

let tasks = [];

const validateTask = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }
  next();
};

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/tasks", validateTask, (req, res) => {
  try {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
    console.log("task succesfull");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    console.log("task not succesfull");
  }
});

app.put("/tasks/:taskId", validateTask, (req, res) => {
  const taskId = req.params.taskId;
  const { title, description } = req.body;

  if (!tasks[taskId]) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskId] = { title, description };
  res.status(200).json(tasks[taskId]);
});

app.delete("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  if (!tasks[taskId]) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskId, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
