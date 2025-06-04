import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertCaseSchema, insertNoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Case routes
  app.get("/api/cases/active/:managerId", async (req, res) => {
    try {
      const managerId = parseInt(req.params.managerId);
      const cases = await storage.getActiveCases(managerId);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active cases" });
    }
  });

  app.get("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const caseData = await storage.getCaseWithEmployee(id);
      if (!caseData) {
        return res.status(404).json({ error: "Case not found" });
      }
      res.json(caseData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case" });
    }
  });

  app.post("/api/cases", async (req, res) => {
    try {
      const caseData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase(caseData);
      res.status(201).json(newCase);
    } catch (error) {
      res.status(400).json({ error: "Invalid case data" });
    }
  });

  app.patch("/api/cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedCase = await storage.updateCase(id, updates);
      if (!updatedCase) {
        return res.status(404).json({ error: "Case not found" });
      }
      res.json(updatedCase);
    } catch (error) {
      res.status(500).json({ error: "Failed to update case" });
    }
  });

  // Task routes
  app.get("/api/tasks/today/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getTodayTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's tasks" });
    }
  });

  app.get("/api/tasks/pending/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getPendingTasks(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending tasks" });
    }
  });

  app.get("/api/tasks/assigned/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tasks = await storage.getTasksByAssignee(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assigned tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTaskWithCase(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(taskData);
      
      // Create activity for task creation
      await storage.createActivity({
        description: `New task created: ${newTask.title}`,
        type: "task_created",
        userId: newTask.createdBy,
        caseId: newTask.caseId || undefined
      });

      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedTask = await storage.updateTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Create activity for task completion
      if (updates.status === "completed") {
        await storage.createActivity({
          description: `Task completed: ${updatedTask.title}`,
          type: "task_completed",
          userId: updatedTask.assignedTo,
          caseId: updatedTask.caseId || undefined
        });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Employee routes
  app.get("/api/employees/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const employees = await storage.searchEmployees(query);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to search employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  // Activity routes
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Note routes
  app.get("/api/cases/:caseId/notes", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const notes = await storage.getCaseNotes(caseId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch case notes" });
    }
  });

  app.post("/api/cases/:caseId/notes", async (req, res) => {
    try {
      const caseId = parseInt(req.params.caseId);
      const noteData = insertNoteSchema.parse({
        ...req.body,
        caseId
      });
      const newNote = await storage.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
