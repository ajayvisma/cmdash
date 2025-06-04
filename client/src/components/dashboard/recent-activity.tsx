import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Activity } from "@shared/schema";

interface RecentActivityProps {
  activities?: Activity[];
  isLoading: boolean;
}

export default function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const getActivityColor = (type: string) => {
    switch (type) {
      case "task_completed":
        return "bg-green-500";
      case "document_uploaded":
        return "bg-blue-500";
      case "evaluation_due":
      case "task_created":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Card className="border border-gray-200 flex flex-col h-full">
      <CardHeader className="px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
      </CardHeader>
      <CardContent className="p-1.5 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start space-x-1.5">
                <Skeleton className="w-1 h-1 rounded-full mt-1" />
                <div className="flex-1 space-y-0.5">
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-2 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {activities && activities.length > 0 ? (
              activities.slice(0, 12).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-1.5">
                  <div 
                    className={`w-1 h-1 ${getActivityColor(activity.type)} rounded-full mt-1 flex-shrink-0`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900 leading-tight">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatTimestamp(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <i className="iconoir-activity text-lg text-gray-300 mb-1"></i>
                <p className="text-xs text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
