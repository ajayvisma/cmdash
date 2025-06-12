import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTaskModal from "@/components/modals/create-task-modal";

// Using user ID 1 for the demo case manager
const CURRENT_USER_ID = 1;

export default function DashboardV1Overview() {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/dashboard/stats/${CURRENT_USER_ID}`],
  });

  const { data: activeCases, isLoading: casesLoading } = useQuery({
    queryKey: [`/api/cases/active/${CURRENT_USER_ID}`],
  });

  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: [`/api/tasks/today/${CURRENT_USER_ID}`],
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Good morning, Geraldine!</h1>
              <p className="text-gray-600">{currentDate}</p>
            </div>
            <div className="text-sm text-gray-500">Case Manager</div>
          </div>

          {/* Global Search */}
          <div className="max-w-md">
            <div className="relative">
              <i className="iconoir-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                placeholder="Search tasks or employees..."
              />
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Active Cases</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.activeCases || 0}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="iconoir-group text-blue-600"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tasks Due Today</p>
                        <p className="text-2xl font-bold text-gray-900">{todayTasks?.length || 0}</p>
                      </div>
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <i className="iconoir-task-list text-amber-600"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">% Sick (This Week)</p>
                        <p className="text-2xl font-bold text-gray-900">3.2%</p>
                      </div>
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="iconoir-trending-up text-red-600"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open Dossiers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.activeCases || 0}</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="iconoir-folder text-green-600"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="w-2 h-2 rounded-full mt-2" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities?.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">My Tasks</h3>
                <Button variant="outline" size="sm">
                  See all tasks
                </Button>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTasks?.slice(0, 3).map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <p className="text-xs text-gray-500">
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
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

          {/* Active Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Active Cases</h3>
              <Button variant="outline" size="sm">
                See all cases
              </Button>
            </CardHeader>
            <CardContent>
              {casesLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCases?.slice(0, 3).map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {caseItem.employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{caseItem.employee.name}</h4>
                        <p className="text-sm text-gray-600">{caseItem.employee.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{caseItem.status.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(caseItem.absenceStartDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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