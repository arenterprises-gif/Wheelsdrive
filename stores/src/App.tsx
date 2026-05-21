import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import CarsList from "./pages/CarsList";
import CarDetail from "./pages/CarDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCarsList from "./pages/admin/AdminCarsList";
import AdminCarEdit from "./pages/admin/AdminCarEdit";
import AdminLayout from "./components/layout/AdminLayout";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      
      <Route path="/admin*">
        <AdminLayout>
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/cars" component={AdminCarsList} />
            <Route path="/admin/cars/add" component={AdminCarEdit} />
            <Route path="/admin/cars/:id/edit" component={AdminCarEdit} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      <Route path="*">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/cars" component={CarsList} />
            <Route path="/cars/:slug" component={CarDetail} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
