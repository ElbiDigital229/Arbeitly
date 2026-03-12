import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApplicationsProvider } from "@/context/ApplicationsContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import EmployeeLogin from "./pages/EmployeeLogin";

import CustomerLayout from "./components/customer/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerJobs from "./pages/customer/CustomerJobs";
import CustomerSettings from "./pages/customer/CustomerSettings";

import PortalLayout from "./components/portal/PortalLayout";
import BoardView from "./pages/BoardView";
import Applications from "./pages/dashboard/Applications";
import Documents from "./pages/dashboard/Documents";
import UploadCV from "./pages/dashboard/UploadCV";
import CoverLetter from "./pages/dashboard/CoverLetter";
import Analytics from "./pages/dashboard/Analytics";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import InternalOverview from "./pages/internal/InternalOverview";
import Candidates from "./pages/internal/Candidates";
import Jobs from "./pages/internal/Jobs";
import AdminOverview from "./pages/admin/AdminOverview";
import PromptManager from "./pages/admin/PromptManager";
import AISettings from "./pages/admin/AISettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ApplicationsProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public landing ── */}
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* ── Customer onboarding flow ── */}
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />

          {/* ── Employee login ── */}
          <Route path="/employee/login" element={<EmployeeLogin />} />

          {/* ── Customer portal ── */}
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/jobs" element={<CustomerJobs />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
          </Route>

          {/* ── Employee / Internal portal ── */}
          <Route element={<PortalLayout />}>
            <Route path="/employee/portal" element={<BoardView />} />
            <Route path="/employee/applications" element={<Applications />} />
            <Route path="/employee/documents" element={<Documents />} />
            <Route path="/employee/upload" element={<UploadCV />} />
            <Route path="/employee/cover-letter" element={<CoverLetter />} />
            <Route path="/employee/analytics" element={<Analytics />} />
            <Route path="/employee/settings" element={<DashboardSettings />} />
            <Route path="/employee/internal" element={<InternalOverview />} />
            <Route path="/employee/internal/candidates" element={<Candidates />} />
            <Route path="/employee/internal/jobs" element={<Jobs />} />
            <Route path="/employee/admin" element={<AdminOverview />} />
            <Route path="/employee/admin/cv-prompts" element={<PromptManager type="cv" />} />
            <Route path="/employee/admin/cl-prompts" element={<PromptManager type="cover-letter" />} />
            <Route path="/employee/admin/ai-settings" element={<AISettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </ApplicationsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
