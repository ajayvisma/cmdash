import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@shared/schema";

interface StatsOverviewProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2 h-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-2 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-4 w-6" />
              </div>
              <Skeleton className="w-6 h-6 rounded-md ml-2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      title: "Active Cases",
      value: stats.activeCases,
      change: "+3 from yesterday",
      changeType: "positive",
      icon: "iconoir-group",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      change: "2 due today",
      changeType: "warning",
      icon: "iconoir-task-list",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      title: "This Week",
      value: stats.completedTasksThisWeek,
      change: "Tasks completed",
      changeType: "positive",
      icon: "iconoir-trending-up",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Avg. Resolution",
      value: stats.avgResolutionDays,
      change: "days per case",
      changeType: "neutral",
      icon: "iconoir-clock",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 h-full">
      {statItems.map((item) => (
        <Card key={item.title} className="p-2 border border-gray-200 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate">{item.title}</p>
              <p className="text-base font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`w-6 h-6 ${item.iconBg} rounded-md flex items-center justify-center ml-1 flex-shrink-0`}>
              <i className={`${item.icon} ${item.iconColor} text-xs`}></i>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
