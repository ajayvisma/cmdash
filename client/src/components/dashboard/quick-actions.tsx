import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onCreateTask: () => void;
}

export default function QuickActions({ onCreateTask }: QuickActionsProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const actions = [
    {
      title: "Report Absence",
      icon: "iconoir-user-xmark",
      color: "bg-red-500",
      onClick: () => console.log("Report absence"),
    },
    {
      title: "Create Dossier",
      icon: "iconoir-folder-plus",
      color: "bg-blue-500",
      onClick: () => console.log("Create dossier"),
    },
    {
      title: "Schedule Appointment",
      icon: "iconoir-calendar",
      color: "bg-green-500",
      onClick: () => console.log("Schedule appointment"),
    },
    {
      title: "Generate Report",
      icon: "iconoir-page",
      color: "bg-purple-500",
      onClick: () => console.log("Generate report"),
    },
  ];

  if (isMinimized) {
    return (
      <Card className="p-2 w-12 h-12 shadow-lg border border-gray-200 flex items-center justify-center">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="ghost"
          size="sm"
          className="w-full h-full p-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Expand Quick Actions menu"
        >
          <i className="iconoir-plus text-base text-gray-600" aria-hidden="true"></i>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-3 w-56 shadow-lg border border-gray-200" role="region" aria-label="Quick Actions">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
        <div className="flex items-center space-x-1">
          <Button 
            onClick={onCreateTask}
            variant="outline" 
            size="sm"
            className="text-xs h-6 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Create new task"
          >
            <i className="iconoir-plus text-xs" aria-hidden="true"></i>
          </Button>
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="sm"
            className="text-xs h-6 w-6 p-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Minimize Quick Actions menu"
          >
            <i className="iconoir-minus text-xs text-gray-500" aria-hidden="true"></i>
          </Button>
        </div>
      </div>
      
      <div className="space-y-1" role="menu">
        {actions.map((action) => (
          <Button
            key={action.title}
            onClick={action.onClick}
            variant="ghost"
            className="w-full h-auto p-1.5 flex items-center justify-start text-left hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            role="menuitem"
            aria-label={action.title}
          >
            <div className={`w-5 h-5 rounded ${action.color} flex items-center justify-center mr-2 flex-shrink-0`} aria-hidden="true">
              <i className={`${action.icon} text-white text-xs`} aria-hidden="true"></i>
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-xs text-gray-900">{action.title}</h4>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
