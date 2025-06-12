import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTaskModal from "@/components/modals/create-task-modal";

// Using user ID 1 for the demo case manager
const CURRENT_USER_ID = 1;

export default function DashboardV2Workstation() {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/dashboard/stats/${CURRENT_USER_ID}`],
  });

  const { data: activeCases, isLoading: casesLoading } = useQuery({
    queryKey: [`/api/cases/active/${CURRENT_USER_ID}`],
  });

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: [`/api/tasks/assigned/${CURRENT_USER_ID}`],
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: [`/api/activities/${CURRENT_USER_ID}`],
  });

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const filteredTasks = allTasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.case?.employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCases = activeCases?.filter(caseItem => 
    caseItem.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.employee.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isExpanded={sidebarExpanded} onToggle={toggleSidebar} />
      
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarExpanded ? "ml-52" : "ml-16"
      }`}>
        <TopBar onCreateTask={handleCreateTask} sidebarExpanded={sidebarExpanded} onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header with Actions */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Workstation Dashboard</h1>
            <div className="flex space-x-3">
              <Button variant="outline">
                <i className="iconoir-page mr-2"></i>
                New Report
              </Button>
              <Button onClick={handleCreateTask}>
                <i className="iconoir-plus mr-2"></i>
                Add Task
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="tasks" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="cases">Active Cases</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="space-y-4">
                  {/* Task Filters */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-64">
                          <Input
                            placeholder="Search tasks or employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Due Date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Dates</SelectItem>
                            <SelectItem value="today">Due Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task List */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">All Tasks</h3>
                    </CardHeader>
                    <CardContent>
                      {tasksLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3">Task Name</th>
                                <th className="text-left p-3">Employee</th>
                                <th className="text-left p-3">Company</th>
                                <th className="text-left p-3">Due Date</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTasks?.map((task) => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">
                                    <div>
                                      <p className="font-medium">{task.title}</p>
                                      <p className="text-sm text-gray-500 capitalize">{task.priority} priority</p>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    {task.case?.employee.name || '-'}
                                  </td>
                                  <td className="p-3">
                                    {task.case?.employee.company || '-'}
                                  </td>
                                  <td className="p-3">
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {task.status.replace('-', ' ')}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">Execute</Button>
                                      <Button size="sm" variant="ghost">
                                        <i className="iconoir-clock"></i>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cases" className="space-y-4">
                  {/* Case List */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Active Cases</h3>
                    </CardHeader>
                    <CardContent>
                      {casesLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3">Employee</th>
                                <th className="text-left p-3">Company</th>
                                <th className="text-left p-3">Type of Absence</th>
                                <th className="text-left p-3">Start Date</th>
                                <th className="text-left p-3">Days Absent</th>
                                <th className="text-left p-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCases?.map((caseItem) => (
                                <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                          {caseItem.employee.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      </div>
                                      <span className="font-medium">{caseItem.employee.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-3">{caseItem.employee.company}</td>
                                  <td className="p-3">
                                    <span className="capitalize">{caseItem.status.replace('-', ' ')}</span>
                                  </td>
                                  <td className="p-3">
                                    {new Date(caseItem.absenceStartDate).toLocaleDateString()}
                                  </td>
                                  <td className="p-3">{caseItem.daysAbsent}</td>
                                  <td className="p-3">
                                    <Button size="sm" variant="outline">View Details</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Statistics Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Key Stats */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Statistics</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statsLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">% Sick</p>
                        <p className="text-xl font-bold text-red-600">3.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Days Absent</p>
                        <p className="text-xl font-bold text-gray-900">{stats?.avgResolutionDays}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Upcoming Deadlines</p>
                        <p className="text-xl font-bold text-amber-600">5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Cases</p>
                        <p className="text-xl font-bold text-blue-600">{stats?.activeCases}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentActivities?.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="text-xs">
                          <p className="text-gray-900">{activity.description}</p>
                          <p className="text-gray-500">
                            {new Date(activity.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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