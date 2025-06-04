import { 
  users, employees, cases, tasks, notes, activities,
  type User, type InsertUser,
  type Employee, type InsertEmployee,
  type Case, type InsertCase,
  type Task, type InsertTask,
  type Note, type InsertNote,
  type Activity, type InsertActivity,
  type CaseWithEmployee,
  type TaskWithCase,
  type DashboardStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Employees
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  searchEmployees(query: string): Promise<Employee[]>;

  // Cases
  getCase(id: number): Promise<Case | undefined>;
  getCaseWithEmployee(id: number): Promise<CaseWithEmployee | undefined>;
  getCasesByManager(managerId: number): Promise<CaseWithEmployee[]>;
  getActiveCases(managerId: number): Promise<CaseWithEmployee[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined>;

  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getTaskWithCase(id: number): Promise<TaskWithCase | undefined>;
  getTasksByAssignee(userId: number): Promise<TaskWithCase[]>;
  getTodayTasks(userId: number): Promise<TaskWithCase[]>;
  getPendingTasks(userId: number): Promise<TaskWithCase[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;

  // Notes
  getCaseNotes(caseId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Activities
  getRecentActivities(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private employees: Map<number, Employee>;
  private cases: Map<number, Case>;
  private tasks: Map<number, Task>;
  private notes: Map<number, Note>;
  private activities: Map<number, Activity>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.cases = new Map();
    this.tasks = new Map();
    this.notes = new Map();
    this.activities = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample user (case manager)
    const user = await this.createUser({
      username: "geraldine",
      password: "password",
      name: "Geraldine van Hees",
      role: "Case Manager",
      initials: "GH"
    });

    // Create sample employees
    const employee1 = await this.createEmployee({
      employeeId: "EMP001",
      name: "John Smith",
      company: "Rabobank",
      startDate: new Date("2020-01-15")
    });

    const employee2 = await this.createEmployee({
      employeeId: "EMP002", 
      name: "Sarah Johnson",
      company: "KPN",
      startDate: new Date("2019-06-20")
    });

    const employee3 = await this.createEmployee({
      employeeId: "EMP003",
      name: "Michael Brown", 
      company: "Szamen",
      startDate: new Date("2021-03-10")
    });

    const employee4 = await this.createEmployee({
      employeeId: "EMP004",
      name: "Emma Wilson",
      company: "ING Bank",
      startDate: new Date("2020-09-12")
    });

    const employee5 = await this.createEmployee({
      employeeId: "EMP005",
      name: "David Chen",
      company: "Philips",
      startDate: new Date("2019-02-25")
    });

    const employee6 = await this.createEmployee({
      employeeId: "EMP006",
      name: "Lisa Thompson",
      company: "Unilever",
      startDate: new Date("2022-01-08")
    });

    // Create sample cases
    const case1 = await this.createCase({
      employeeId: employee1.id,
      caseManagerId: user.id,
      status: "long-term",
      daysAbsent: 45,
      nextAction: "UWV Evaluation",
      absenceStartDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    });

    const case2 = await this.createCase({
      employeeId: employee2.id,
      caseManagerId: user.id,
      status: "recovery",
      daysAbsent: 12,
      nextAction: "Medical Check",
      absenceStartDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      recoveryPercentage: 50
    });

    const case3 = await this.createCase({
      employeeId: employee3.id,
      caseManagerId: user.id,
      status: "returning",
      daysAbsent: 8,
      nextAction: "Action Plan",
      absenceStartDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      recoveryPercentage: 80
    });

    const case4 = await this.createCase({
      employeeId: employee4.id,
      caseManagerId: user.id,
      status: "active",
      daysAbsent: 3,
      nextAction: "First Assessment",
      absenceStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    const case5 = await this.createCase({
      employeeId: employee5.id,
      caseManagerId: user.id,
      status: "recovery",
      daysAbsent: 35,
      nextAction: "Progress Review",
      absenceStartDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      recoveryPercentage: 70
    });

    const case6 = await this.createCase({
      employeeId: employee6.id,
      caseManagerId: user.id,
      status: "long-term",
      daysAbsent: 67,
      nextAction: "Disability Assessment",
      absenceStartDate: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000)
    });

    // Create sample tasks
    await this.createTask({
      title: "Review UWV Documentation - John Smith",
      description: "Complete periodic evaluation form and submit to UWV before deadline",
      priority: "urgent",
      dueDate: new Date(),
      caseId: case1.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Follow-up Medical Appointment - Sarah Johnson",
      description: "Schedule follow-up with company doctor for assessment",
      priority: "high",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      caseId: case2.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Create Action Plan - Michael Brown",
      description: "Draft return-to-work action plan with employer recommendations",
      priority: "normal",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      caseId: case3.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Contact HR Department - John Smith",
      description: "Discuss workplace adjustments and reintegration timeline",
      priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      caseId: case1.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Process Insurance Claims - Sarah Johnson",
      description: "Submit medical reports and claim documentation to insurance provider",
      priority: "normal",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      caseId: case2.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Schedule Team Meeting",
      description: "Coordinate with case management team for weekly review",
      priority: "low",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Review Medical Reports - Michael Brown",
      description: "Analyze latest medical assessment and update case status",
      priority: "high",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      caseId: case3.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    // Add more tasks for today
    await this.createTask({
      title: "Update Employee Portal - John Smith",
      description: "Log progress notes and update return-to-work timeline",
      priority: "normal",
      dueDate: new Date(),
      caseId: case1.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Call Insurance Provider - Sarah Johnson",
      description: "Follow up on claim status and required documentation",
      priority: "urgent",
      dueDate: new Date(),
      caseId: case2.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Prepare Weekly Report",
      description: "Compile case statistics and progress summaries for management",
      priority: "high",
      dueDate: new Date(),
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Review Workplace Assessment - Michael Brown",
      description: "Evaluate ergonomic recommendations and accommodation requests",
      priority: "normal",
      dueDate: new Date(),
      caseId: case3.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    await this.createTask({
      title: "Schedule Medical Review - John Smith",
      description: "Coordinate appointment with occupational health specialist",
      priority: "high",
      dueDate: new Date(),
      caseId: case1.id,
      assignedTo: user.id,
      createdBy: user.id
    });

    // Create sample activities
    await this.createActivity({
      description: "Task completed for Emma Wilson",
      type: "task_completed",
      userId: user.id
    });

    await this.createActivity({
      description: "New document uploaded by David Chen",
      type: "document_uploaded",
      userId: user.id
    });

    await this.createActivity({
      description: "Evaluation due for Lisa Thompson",
      type: "evaluation_due",
      userId: user.id
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  // Employee methods
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.employeeId === employeeId);
  }

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const id = this.currentId++;
    const employee: Employee = { 
      ...employeeData, 
      id, 
      createdAt: new Date() 
    };
    this.employees.set(id, employee);
    return employee;
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.employees.values()).filter(emp => 
      emp.name.toLowerCase().includes(lowerQuery) ||
      emp.employeeId.toLowerCase().includes(lowerQuery) ||
      emp.company.toLowerCase().includes(lowerQuery)
    );
  }

  // Case methods
  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async getCaseWithEmployee(id: number): Promise<CaseWithEmployee | undefined> {
    const caseData = this.cases.get(id);
    if (!caseData) return undefined;

    const employee = this.employees.get(caseData.employeeId);
    if (!employee) return undefined;

    const taskCount = Array.from(this.tasks.values()).filter(t => t.caseId === id).length;

    return {
      ...caseData,
      employee,
      taskCount
    };
  }

  async getCasesByManager(managerId: number): Promise<CaseWithEmployee[]> {
    const managerCases = Array.from(this.cases.values()).filter(c => c.caseManagerId === managerId);
    const result: CaseWithEmployee[] = [];

    for (const caseData of managerCases) {
      const employee = this.employees.get(caseData.employeeId);
      if (employee) {
        const taskCount = Array.from(this.tasks.values()).filter(t => t.caseId === caseData.id).length;
        result.push({
          ...caseData,
          employee,
          taskCount
        });
      }
    }

    return result;
  }

  async getActiveCases(managerId: number): Promise<CaseWithEmployee[]> {
    const activeCases = Array.from(this.cases.values()).filter(c => 
      c.caseManagerId === managerId && c.status !== "closed"
    );
    const result: CaseWithEmployee[] = [];

    for (const caseData of activeCases) {
      const employee = this.employees.get(caseData.employeeId);
      if (employee) {
        const taskCount = Array.from(this.tasks.values()).filter(t => t.caseId === caseData.id).length;
        result.push({
          ...caseData,
          employee,
          taskCount
        });
      }
    }

    return result;
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const id = this.currentId++;
    const now = new Date();
    const newCase: Case = { 
      ...caseData,
      id, 
      createdAt: now,
      updatedAt: now,
      daysAbsent: caseData.daysAbsent ?? 0,
      nextAction: caseData.nextAction ?? null,
      recoveryPercentage: caseData.recoveryPercentage ?? null
    };
    this.cases.set(id, newCase);
    return newCase;
  }

  async updateCase(id: number, updates: Partial<Case>): Promise<Case | undefined> {
    const existingCase = this.cases.get(id);
    if (!existingCase) return undefined;

    const updatedCase: Case = {
      ...existingCase,
      ...updates,
      updatedAt: new Date()
    };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTaskWithCase(id: number): Promise<TaskWithCase | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    if (task.caseId) {
      const caseWithEmployee = await this.getCaseWithEmployee(task.caseId);
      return {
        ...task,
        case: caseWithEmployee
      };
    }

    return task;
  }

  async getTasksByAssignee(userId: number): Promise<TaskWithCase[]> {
    const userTasks = Array.from(this.tasks.values()).filter(t => t.assignedTo === userId);
    const result: TaskWithCase[] = [];

    for (const task of userTasks) {
      if (task.caseId) {
        const caseWithEmployee = await this.getCaseWithEmployee(task.caseId);
        result.push({
          ...task,
          case: caseWithEmployee
        });
      } else {
        result.push(task);
      }
    }

    return result;
  }

  async getTodayTasks(userId: number): Promise<TaskWithCase[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = Array.from(this.tasks.values()).filter(t => 
      t.assignedTo === userId && 
      t.status === "pending" &&
      t.dueDate && 
      t.dueDate >= today && 
      t.dueDate < tomorrow
    );

    const result: TaskWithCase[] = [];
    for (const task of todayTasks) {
      if (task.caseId) {
        const caseWithEmployee = await this.getCaseWithEmployee(task.caseId);
        result.push({
          ...task,
          case: caseWithEmployee
        });
      } else {
        result.push(task);
      }
    }

    return result;
  }

  async getPendingTasks(userId: number): Promise<TaskWithCase[]> {
    const pendingTasks = Array.from(this.tasks.values()).filter(t => 
      t.assignedTo === userId && t.status === "pending"
    );

    const result: TaskWithCase[] = [];
    for (const task of pendingTasks) {
      if (task.caseId) {
        const caseWithEmployee = await this.getCaseWithEmployee(task.caseId);
        result.push({
          ...task,
          case: caseWithEmployee
        });
      } else {
        result.push(task);
      }
    }

    return result;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const now = new Date();
    const task: Task = { 
      ...taskData, 
      id, 
      createdAt: now,
      updatedAt: now,
      status: taskData.status ?? "pending",
      description: taskData.description ?? null,
      caseId: taskData.caseId ?? null,
      dueDate: taskData.dueDate ?? null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Note methods
  async getCaseNotes(caseId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(n => n.caseId === caseId);
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const id = this.currentId++;
    const note: Note = { 
      ...noteData, 
      id, 
      createdAt: new Date(),
      isInternal: noteData.isInternal ?? false
    };
    this.notes.set(id, note);
    return note;
  }

  // Activity methods
  async getRecentActivities(userId: number, limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...activityData, 
      id, 
      createdAt: new Date(),
      caseId: activityData.caseId ?? null
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Dashboard methods
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const activeCases = Array.from(this.cases.values()).filter(c => 
      c.caseManagerId === userId && c.status !== "closed"
    ).length;

    const pendingTasks = Array.from(this.tasks.values()).filter(t => 
      t.assignedTo === userId && t.status === "pending"
    ).length;

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedTasksThisWeek = Array.from(this.tasks.values()).filter(t => 
      t.assignedTo === userId && 
      t.status === "completed" &&
      t.updatedAt && 
      t.updatedAt >= oneWeekAgo
    ).length;

    // Calculate average resolution days
    const completedCases = Array.from(this.cases.values()).filter(c => 
      c.caseManagerId === userId && c.status === "closed"
    );
    
    let avgResolutionDays = 5.2; // Default value
    if (completedCases.length > 0) {
      const totalDays = completedCases.reduce((sum, c) => sum + c.daysAbsent, 0);
      avgResolutionDays = Math.round((totalDays / completedCases.length) * 10) / 10;
    }

    return {
      activeCases,
      pendingTasks,
      completedTasksThisWeek,
      avgResolutionDays
    };
  }
}

export const storage = new MemStorage();
