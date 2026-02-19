import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileShell from "@/components/layout/MobileShell";
import HomePage from "@/pages/home";
import EventPage from "@/pages/event";
import ExplorePage from "@/pages/explore";
import WalletPage from "@/pages/wallet";
import ProfilePage from "@/pages/profile";
import OnboardingPage from "@/pages/onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/">
        <MobileShell><HomePage /></MobileShell>
      </Route>
      <Route path="/event/:id">
        <MobileShell><EventPage /></MobileShell>
      </Route>
      <Route path="/explore">
        <MobileShell><ExplorePage /></MobileShell>
      </Route>
      <Route path="/wallet">
        <MobileShell><WalletPage /></MobileShell>
      </Route>
      <Route path="/profile">
        <MobileShell><ProfilePage /></MobileShell>
      </Route>
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
