import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";

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
      <BrowserRouter>
        <Routes>
          {/* ── Public / Onboarding flow ── */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />

          {/* ── Customer portal ── */}
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/jobs" element={<CustomerJobs />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
          </Route>

          {/* ── Internal / Employee portal ── */}
          <Route element={<PortalLayout />}>
            <Route path="/" element={<BoardView />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/upload" element={<UploadCV />} />
            <Route path="/cover-letter" element={<CoverLetter />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<DashboardSettings />} />
            <Route path="/internal" element={<InternalOverview />} />
            <Route path="/internal/candidates" element={<Candidates />} />
            <Route path="/internal/jobs" element={<Jobs />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/cv-prompts" element={<PromptManager type="cv" />} />
            <Route path="/admin/cl-prompts" element={<PromptManager type="cover-letter" />} />
            <Route path="/admin/ai-settings" element={<AISettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
