import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onCreateTask: () => void;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({ onCreateTask, sidebarExpanded, onToggleSidebar }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-3 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Sidebar Toggle Button - only show when sidebar is collapsed */}
          {!sidebarExpanded && (
            <button
              onClick={onToggleSidebar}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <i className="iconoir-menu text-sm"></i>
            </button>
          )}
        </div>
        
        {/* Centered Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">
              Search employees, cases, and tasks
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <i className="iconoir-search text-gray-400 text-xs" aria-hidden="true"></i>
            </div>
            <Input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-6 pr-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-transparent text-xs h-6"
              placeholder="zoeken"
              aria-label="Search employees, cases, and tasks"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* User Profile */}
          <button 
            className="flex items-center focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-md p-0.5"
            aria-label="User profile menu"
          >
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center" aria-hidden="true">
              <span className="text-white font-medium text-xs">B</span>
            </div>
            <div className="ml-1 flex items-center">
              <span className="text-xs font-medium text-gray-900">B.Arts</span>
              <i className="iconoir-nav-arrow-down ml-0.5 text-gray-400 text-xs" aria-hidden="true"></i>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
