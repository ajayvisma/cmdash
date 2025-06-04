import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskWithCase } from "@shared/schema";

interface TasksWidgetProps {
  tasks?: TaskWithCase[];
  isLoading: boolean;
  onCreateTask: () => void;
}

export default function TasksWidget({ tasks, isLoading, onCreateTask }: TasksWidgetProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-amber-50 border-amber-200";
      case "normal":
        return "bg-blue-50 border-blue-200";
      case "low":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-amber-500";
      case "normal":
        return "bg-blue-500";
      case "low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-amber-100 text-amber-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return "";
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due: Today";
    if (diffDays === 1) return "Due: Tomorrow";
    if (diffDays === -1) return "Due: Yesterday";
    if (diffDays < 0) return `Due: ${Math.abs(diffDays)} days ago`;
    return `Due: ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  return (
    <Card className="border border-gray-200 flex flex-col h-full">
      <CardHeader className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Today's Tasks</h3>
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs h-6 px-1.5"
            >
              <i className="iconoir-filter text-xs"></i>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs h-6 px-1.5"
            >
              View All
            </Button>
            <Button 
              size="sm"
              onClick={onCreateTask}
              className="bg-primary-600 text-white hover:bg-primary-700 text-xs h-6 px-1.5"
            >
              <i className="iconoir-plus text-xs"></i>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-1.5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {isLoading ? (
          <div className="space-y-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start p-1.5 border rounded-md">
                <Skeleton className="w-1.5 h-1.5 rounded-full mt-1 mr-2" />
                <div className="flex-1 space-y-0.5">
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-start p-1.5 border rounded-md ${getPriorityColor(task.priority)}`}
                  >
                    <div className={`flex-shrink-0 w-1.5 h-1.5 ${getPriorityDotColor(task.priority)} rounded-full mt-1`}></div>
                    <div className="ml-2 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs text-gray-900 truncate">{task.title}</h4>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {task.case && (
                                <span className="truncate">
                                  {task.case.employee.name}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className={`font-medium ${
                                  task.priority === "urgent" ? "text-red-600" : 
                                  task.priority === "high" ? "text-amber-600" : "text-blue-600"
                                }`}>
                                  {formatDueDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <button 
                                className="text-green-600 hover:text-green-700 text-xs px-1 py-0.5 rounded hover:bg-green-50"
                                title="Complete task"
                              >
                                <i className="iconoir-check text-xs"></i>
                              </button>
                              <button 
                                className="text-amber-600 hover:text-amber-700 text-xs px-1 py-0.5 rounded hover:bg-amber-50"
                                title="Postpone task"
                              >
                                <i className="iconoir-clock text-xs"></i>
                              </button>
                              <button 
                                className="text-blue-600 hover:text-blue-700 text-xs px-1 py-0.5 rounded hover:bg-blue-50"
                                title="View details"
                              >
                                <i className="iconoir-eye text-xs"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <span className={`ml-1 px-1 py-0.5 text-xs rounded-full capitalize flex-shrink-0 ${getPriorityBadgeColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="iconoir-task-list text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No tasks due today</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
                View all tasks →
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
