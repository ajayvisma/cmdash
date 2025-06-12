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
import { Checkbox } from "@/components/ui/checkbox";
import CreateTaskModal from "@/components/modals/create-task-modal";

// Using user ID 1 for the demo case manager
const CURRENT_USER_ID = 1;

export default function DashboardV3FilterHeavy() {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Global filters
  const [dateRange, setDateRange] = useState("30");
  const [department, setDepartment] = useState("all");
  const [employer, setEmployer] = useState("all");
  const [globalStatus, setGlobalStatus] = useState("all");
  
  // Specific filters
  const [caseType, setCaseType] = useState("all");
  const [absenceDuration, setAbsenceDuration] = useState("all");
  const [taskAllocation, setTaskAllocation] = useState("all");
  const [assignedUser, setAssignedUser] = useState("all");

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

  // Apply filters
  const filteredTasks = allTasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.case?.employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = globalStatus === "all" || task.status === globalStatus;
    const matchesEmployer = employer === "all" || task.case?.employee.company === employer;
    return matchesSearch && matchesStatus && matchesEmployer;
  });

  const filteredCases = activeCases?.filter(caseItem => {
    const matchesSearch = caseItem.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.employee.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployer = employer === "all" || caseItem.employee.company === employer;
    const matchesType = caseType === "all" || caseItem.status === caseType;
    const matchesDuration = absenceDuration === "all" || 
      (absenceDuration === "short" && caseItem.daysAbsent <= 14) ||
      (absenceDuration === "medium" && caseItem.daysAbsent > 14 && caseItem.daysAbsent <= 42) ||
      (absenceDuration === "long" && caseItem.daysAbsent > 42);
    return matchesSearch && matchesEmployer && matchesType && matchesDuration;
  });

  const selectedCount = Math.max(filteredTasks?.length || 0, filteredCases?.length || 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isExpanded={sidebarExpanded} onToggle={toggleSidebar} />
      
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarExpanded ? "ml-52" : "ml-16"
      }`}>
        <TopBar onCreateTask={handleCreateTask} sidebarExpanded={sidebarExpanded} onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Power Dashboard</h1>
            <Button onClick={handleCreateTask}>
              <i className="iconoir-plus mr-2"></i>
              Add Task
            </Button>
          </div>

          {/* Global Filters */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Global Filters</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
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

                <Select value={globalStatus} onValueChange={setGlobalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Advanced Filters</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Case Type</h4>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                        <SelectItem value="returning">Returning</SelectItem>
                        <SelectItem value="long-term">Long-term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Absence Duration</h4>
                    <Select value={absenceDuration} onValueChange={setAbsenceDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Durations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="short">Short (≤ 2 weeks)</SelectItem>
                        <SelectItem value="medium">Medium (2-6 weeks)</SelectItem>
                        <SelectItem value="long">Long (> 6 weeks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Task Allocation</h4>
                    <Select value={taskAllocation} onValueChange={setTaskAllocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Allocations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Allocations</SelectItem>
                        <SelectItem value="me">Assigned to me</SelectItem>
                        <SelectItem value="team">Team tasks</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Assigned User</h4>
                    <Select value={assignedUser} onValueChange={setAssignedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="geraldine">Geraldine van Hees</SelectItem>
                        <SelectItem value="other">Other Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mini Statistics */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Current Selection</h4>
                    <p className="text-sm text-gray-600">{selectedCount} items selected</p>
                    {statsLoading ? (
                      <Skeleton className="h-4 w-20 mt-1" />
                    ) : (
                      <p className="text-xs text-gray-500">
                        {stats?.activeCases} total active cases
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
              {/* Smart Search */}
              <div className="mb-4">
                <div className="relative">
                  <i className="iconoir-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    placeholder="Smart search: employee names, task titles..."
                  />
                </div>
              </div>

              <Tabs defaultValue="tasks" className="flex-1 flex flex-col min-h-0">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks ({filteredTasks?.length || 0})</TabsTrigger>
                  <TabsTrigger value="cases">Active Cases ({filteredCases?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="flex-1 min-h-0">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Filtered Tasks</h3>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                      {tasksLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="sticky top-0 bg-white">
                              <tr className="border-b">
                                <th className="text-left p-3">
                                  <Checkbox />
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Task Name <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Employee <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Company <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Due Date <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Overdue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredTasks?.map((task) => {
                                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                                return (
                                  <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                      <Checkbox />
                                    </td>
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
                                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                      </span>
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
                                      {isOverdue && (
                                        <i className="iconoir-warning-triangle text-red-500"></i>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cases" className="flex-1 min-h-0">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Filtered Cases</h3>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                      {casesLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="sticky top-0 bg-white">
                              <tr className="border-b">
                                <th className="text-left p-3">
                                  <Checkbox />
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Employee <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Company <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Type <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3 cursor-pointer hover:bg-gray-50">
                                  Duration <i className="iconoir-sort-up ml-1"></i>
                                </th>
                                <th className="text-left p-3">Recovery %</th>
                                <th className="text-left p-3">Next Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCases?.map((caseItem) => (
                                <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">
                                    <Checkbox />
                                  </td>
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
                                    <span className={`${
                                      caseItem.daysAbsent > 42 ? 'text-red-600 font-medium' :
                                      caseItem.daysAbsent > 14 ? 'text-amber-600' : 'text-green-600'
                                    }`}>
                                      {caseItem.daysAbsent} days
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    {caseItem.recoveryPercentage ? `${caseItem.recoveryPercentage}%` : '-'}
                                  </td>
                                  <td className="p-3">
                                    <span className="text-sm">{caseItem.nextAction || '-'}</span>
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