import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import CreateTaskModal from "@/components/modals/create-task-modal";

// Using user ID 1 for the demo case manager
const CURRENT_USER_ID = 1;

// Sample chart data
const sickPercentageData = [
  { month: "Jan", percentage: 2.8 },
  { month: "Feb", percentage: 3.1 },
  { month: "Mar", percentage: 2.9 },
  { month: "Apr", percentage: 3.4 },
  { month: "May", percentage: 3.2 },
  { month: "Jun", percentage: 3.0 },
];

const casesByDepartmentData = [
  { department: "Operations", cases: 12 },
  { department: "Finance", cases: 8 },
  { department: "HR", cases: 5 },
  { department: "IT", cases: 7 },
  { department: "Sales", cases: 9 },
];

const taskBacklogData = [
  { status: "Pending", count: 15 },
  { status: "In Progress", count: 8 },
  { status: "Overdue", count: 3 },
];

const absenceTypesData = [
  { type: "Long-term", value: 35, color: "#ef4444" },
  { type: "Recovery", value: 25, color: "#f59e0b" },
  { type: "Returning", value: 20, color: "#10b981" },
  { type: "Active", value: 20, color: "#3b82f6" },
];

const caseTrendsData = [
  { week: "Week 1", opened: 5, closed: 3 },
  { week: "Week 2", opened: 7, closed: 4 },
  { week: "Week 3", opened: 6, closed: 5 },
  { week: "Week 4", opened: 8, closed: 6 },
];

export default function DashboardV4Statistics() {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  // Filters
  const [dateRange, setDateRange] = useState("30");
  const [employer, setEmployer] = useState("all");
  const [caseStatus, setCaseStatus] = useState("all");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/dashboard/stats/${CURRENT_USER_ID}`],
  });

  const { data: activeCases, isLoading: casesLoading } = useQuery({
    queryKey: [`/api/cases/active/${CURRENT_USER_ID}`],
  });

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: [`/api/tasks/assigned/${CURRENT_USER_ID}`],
  });

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isExpanded={sidebarExpanded} onToggle={toggleSidebar} />
      
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarExpanded ? "ml-52" : "ml-16"
      }`}>
        <TopBar onCreateTask={handleCreateTask} sidebarExpanded={sidebarExpanded} onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Statistics & Insights Dashboard</h1>
            <div className="flex space-x-3">
              <Button variant="outline">
                <i className="iconoir-download mr-2"></i>
                Export CSV
              </Button>
              <Button variant="outline">
                <i className="iconoir-page mr-2"></i>
                Monthly Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Analysis Filters</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="180">Last 6 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={employer} onValueChange={setEmployer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Employer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employers</SelectItem>
                    <SelectItem value="Rabobank">Rabobank</SelectItem>
                    <SelectItem value="KPN">KPN</SelectItem>
                    <SelectItem value="Szamen">Szamen</SelectItem>
                    <SelectItem value="ING Bank">ING Bank</SelectItem>
                    <SelectItem value="Philips">Philips</SelectItem>
                    <SelectItem value="Unilever">Unilever</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={caseStatus} onValueChange={setCaseStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Case Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                    <SelectItem value="long-term">Long-term</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Long-term Absences</p>
                    <p className="text-2xl font-bold text-red-600">3 employees</p>
                    <p className="text-xs text-gray-500">absent > 6 weeks</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="iconoir-warning-triangle text-red-600"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                    <p className="text-2xl font-bold text-amber-600">5 tasks</p>
                    <p className="text-xs text-gray-500">this month</p>
                  </div>
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="iconoir-clock text-amber-600"></i>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
                    <p className="text-2xl font-bold text-green-600">78%</p>
                    <p className="text-xs text-gray-500">this quarter</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="iconoir-trending-up text-green-600"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sick Percentage Over Time */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">% Sick Over Time</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sickPercentageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cases by Department */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cases by Department</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={casesByDepartmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cases" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Task Backlog */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Task Backlog by Status</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskBacklogData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Absence Types Breakdown */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Absence Types Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={absenceTypesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ type, value }) => `${type}: ${value}%`}
                      >
                        {absenceTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Case Trends and Task Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Trends */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cases Opened vs Closed</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caseTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="opened" fill="#3b82f6" name="Opened" />
                      <Bar dataKey="closed" fill="#10b981" name="Closed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Task Overview Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">Task Overview</h3>
                <Button variant="outline" size="sm">
                  Full Task Manager
                </Button>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allTasks?.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            {task.case?.employee.name || 'General task'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-600">Total Active Cases</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.activeCases || 0}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                    <p className="text-3xl font-bold text-amber-600">{stats?.pendingTasks || 0}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-600">Completed This Week</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.completedTasksThisWeek || 0}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                    <p className="text-3xl font-bold text-purple-600">{stats?.avgResolutionDays || 0} days</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        userId={CURRENT_USER_ID}
      />
    </div>
  );
}