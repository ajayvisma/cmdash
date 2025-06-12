import { useState } from "react";
import { useLocation } from "wouter";
import logoPath from "@assets/Logo white (3).png";
import logoCollapsedPath from "@assets/Logo.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: "iconoir-view-grid", current: true, badge: null },
  { name: "V1: Overview", href: "/v1-overview", icon: "iconoir-home", current: false, badge: null },
  { name: "V2: Workstation", href: "/v2-workstation", icon: "iconoir-desktop", current: false, badge: null },
  { name: "V3: Filter Heavy", href: "/v3-filter-heavy", icon: "iconoir-filter", current: false, badge: null },
  { name: "V4: Statistics", href: "/v4-statistics", icon: "iconoir-bar-chart", current: false, badge: null },
  { name: "Active Cases", href: "/cases", icon: "iconoir-group", current: false, badge: "24" },
  { name: "Tasks", href: "/tasks", icon: "iconoir-list", current: false, badge: "8" },
  { name: "Dossiers", href: "/dossiers", icon: "iconoir-folder", current: false, badge: null },
  { name: "Reports", href: "/reports", icon: "iconoir-bar-chart", current: false, badge: null },
  { name: "Documents", href: "/documents", icon: "iconoir-page", current: false, badge: null },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const [location] = useLocation();

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
      isExpanded ? "w-52" : "w-16"
    }`} style={{ backgroundColor: '#334155' }}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-start px-4 py-4" style={{ backgroundColor: '#334155' }}>
          <div className="flex items-center">
            {isExpanded ? (
              <img src={logoPath} alt="BlueVi" className="h-8 w-auto" />
            ) : (
              <img src={logoCollapsedPath} alt="BlueVi" className="h-8 w-8" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-2" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <div key={item.name} className="relative group">
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center ${isExpanded ? 'px-4' : 'px-3'} py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                    isActive
                      ? "text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  style={isActive ? { backgroundColor: '#0F172A' } : {}}
                  title={!isExpanded ? item.name : undefined}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Navigate to ${item.name}${item.badge ? ` (${item.badge} items)` : ''}`}
                >
                  <i className={`${item.icon} text-sm ${isExpanded ? 'mr-3' : ''}`} aria-hidden="true"></i>
                  {isExpanded && (
                    <>
                      <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.name === "Active Cases" || item.name === "Tasks"
                              ? "bg-blue-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                          aria-label={`${item.badge} ${item.name.toLowerCase()}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!isExpanded && item.badge && (
                    <span 
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      aria-label={`${item.badge} ${item.name.toLowerCase()}`}
                    ></span>
                  )}
                </button>
                {!isExpanded && (
                  <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                    {item.badge && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        item.name === "Active Cases" || item.name === "Tasks"
                          ? "bg-blue-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Toggle Button at Bottom */}
        <div className="px-2 pb-4">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`iconoir-arrow-${isExpanded ? 'left' : 'right'} text-lg`}></i>
          </button>
        </div>
      </div>
    </aside>
  );
}