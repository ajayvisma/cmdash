import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import StatsOverview from "@/components/dashboard/stats-overview";
import TasksWidget from "@/components/dashboard/tasks-widget";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import ActiveCasesTable from "@/components/dashboard/active-cases-table";
import CreateTaskModal from "@/components/modals/create-task-modal";

// Using user ID 1 for the demo case manager
const CURRENT_USER_ID = 1;

export default function Dashboard() {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isExpanded={sidebarExpanded} onToggle={toggleSidebar} />
      
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarExpanded ? "ml-52" : "ml-16"
      }`}>
        <TopBar onCreateTask={handleCreateTask} sidebarExpanded={sidebarExpanded} onToggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col p-3 space-y-4 min-h-0">
          {/* Hello Geraldine */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-gray-900">Hello Geraldine!</h1>
          </div>
          
          {/* Compact Statistics */}
          <div className="h-12 flex-shrink-0">
            <StatsOverview stats={stats} isLoading={statsLoading} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <TasksWidget 
                tasks={todayTasks} 
                isLoading={tasksLoading}
                onCreateTask={handleCreateTask}
              />
            </div>
            
            <div className="lg:col-span-1 flex flex-col min-h-0">
              <RecentActivity 
                activities={recentActivities} 
                isLoading={activitiesLoading} 
              />
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <ActiveCasesTable 
              cases={activeCases} 
              isLoading={casesLoading} 
            />
          </div>
        </div>
        
        {/* Sticky Quick Actions - Bottom Left */}
        <div className={`fixed bottom-4 transition-all duration-300 z-50 ${
          sidebarExpanded ? "left-56" : "left-20"
        }`}>
          <QuickActions onCreateTask={handleCreateTask} />
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
