import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CaseWithEmployee } from "@shared/schema";

interface ActiveCasesTableProps {
  cases?: CaseWithEmployee[];
  isLoading: boolean;
}

export default function ActiveCasesTable({ cases, isLoading }: ActiveCasesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "long-term":
        return "bg-red-100 text-red-800";
      case "recovery":
        return "bg-amber-100 text-amber-800";
      case "returning":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredCases = cases?.filter((caseItem) =>
    caseItem.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.employee.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Active Cases</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-6 pr-3 py-1 text-xs h-6"
                placeholder="Search cases..."
              />
              <i className="iconoir-search absolute left-2 top-1.5 text-gray-400 text-xs"></i>
            </div>
            <Button variant="outline" size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs h-6 px-1.5">
              <i className="iconoir-filter text-xs"></i>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-2">
            <div className="space-y-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2 p-1">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2 w-1/6" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Days
                    </th>
                    <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.length > 0 ? (
                    filteredCases.slice(0, 4).map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-1 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1.5">
                              <span className="text-xs font-medium text-gray-700">
                                {getInitials(caseItem.employee.name)}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900 truncate max-w-20">
                                {caseItem.employee.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {caseItem.employee.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900 max-w-16 truncate">
                          {caseItem.employee.company}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap">
                          <span className={`px-1 py-0.5 text-xs rounded-full capitalize ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                          {caseItem.daysAbsent}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-xs font-medium">
                          <button className="text-primary-600 hover:text-primary-700 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-2 py-4 text-center">
                        <p className="text-xs text-gray-500">
                          {searchQuery ? "No matches" : "No cases"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
