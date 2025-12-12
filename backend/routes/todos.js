const express = require("express");
const { getDb } = require("../db.js"); // Adjust path based on your db connection file
const { todos } = require("../schema.js"); // Adjust path to your schema file
const { eq } = require("drizzle-orm");

const router = express.Router();

// CREATE - Create a new todo
router.post("/", async (req, res) => {
  const db = getDb();
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const [newTodo] = await db.insert(todos).values({
      title,
      completed: 0,
    });

    // Fetch the created todo
    const [createdTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, newTodo.insertId));

    res.status(201).json(createdTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// READ - Get all todos
router.get("/", async (req, res) => {
  const db = getDb();

  try {
    const allTodos = await db.select().from(todos);
    res.json(allTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// READ - Get a single todo by ID
router.get("/:id", async (req, res) => {
  const db = getDb();

  try {
    const { id } = req.params;

    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)));

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// UPDATE - Update a todo
router.put("/:id", async (req, res) => {
  const db = getDb();

  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Check if todo exists
    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)));

    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed ? 1 : 0;

    // Update todo
    await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, parseInt(id)));

    // Fetch updated todo
    const [updatedTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)));

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE - Delete a todo
router.delete("/:id", async (req, res) => {
  const db = getDb();

  try {
    const { id } = req.params;

    // Check if todo exists
    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)));

    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Delete todo
    await db.delete(todos).where(eq(todos.id, parseInt(id)));

    res.json({ message: "Todo deleted successfully", id: parseInt(id) });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = { router };
