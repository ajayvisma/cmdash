import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import DashboardV1Overview from "@/pages/dashboard-v1-overview";
import DashboardV2Workstation from "@/pages/dashboard-v2-workstation";
import DashboardV3FilterHeavy from "@/pages/dashboard-v3-filter-heavy";
import DashboardV4Statistics from "@/pages/dashboard-v4-statistics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/v1-overview" component={DashboardV1Overview} />
      <Route path="/v2-workstation" component={DashboardV2Workstation} />
      <Route path="/v3-filter-heavy" component={DashboardV3FilterHeavy} />
      <Route path="/v4-statistics" component={DashboardV4Statistics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;