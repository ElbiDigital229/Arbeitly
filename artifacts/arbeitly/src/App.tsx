import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PricingProvider } from "@/context/PricingContext";
import { CustomersProvider } from "@/context/CustomersContext";
import { EmployeesProvider } from "@/context/EmployeesContext";
import { AuditLogProvider } from "@/context/AuditLogContext";
import { TransactionsProvider } from "@/context/TransactionsContext";
import { AIConfigProvider } from "@/context/AIConfigContext";
import { ScraperConfigProvider } from "@/context/ScraperConfigContext";
import { OnboardingConfigProvider } from "@/context/OnboardingConfigContext";
import { NotificationsProvider } from "@/context/NotificationsContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Onboarding from "./pages/Onboarding";
import SimpleOnboarding from "./pages/SimpleOnboarding";
import UpgradePlan from "./pages/UpgradePlan";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import EmployeeLogin from "./pages/EmployeeLogin";

import CandidateLogin from "./pages/candidate/CandidateLogin";
import ForgotPassword from "./pages/candidate/ForgotPassword";
import ResetPassword from "./pages/candidate/ResetPassword";
import CandidatePortalLayout from "./components/candidate/CandidateLayout";
import CandidateCVBuilder from "./pages/candidate/CandidateCVBuilder";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import CandidateDocuments from "./pages/candidate/CandidateDocuments";
import CandidateUpload from "./pages/candidate/CandidateUpload";
import CandidateAnalytics from "./pages/candidate/CandidateAnalytics";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateOnboarding from "./pages/candidate/CandidateOnboarding";
import CandidateFiles from "./pages/candidate/CandidateFiles";
import CandidateFaqView from "./pages/candidate/CandidateFaqView";
import CandidateBilling from "./pages/candidate/CandidateBilling";

import { Navigate } from "react-router-dom";

import PortalLayout from "./components/portal/PortalLayout";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import InternalOverview from "./pages/internal/InternalOverview";
import PromptManager from "./pages/admin/PromptManager";
import AISettings from "./pages/admin/AISettings";

import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import SuperAdminOverview from "./pages/superadmin/SuperAdminOverview";
import SuperAdminPlans from "./pages/superadmin/SuperAdminPlans";
import SuperAdminCustomers from "./pages/superadmin/SuperAdminCustomers";
import SuperAdminEmployees from "./pages/superadmin/SuperAdminEmployees";
import SuperAdminCandidateDetail from "./pages/superadmin/SuperAdminCandidateDetail";
import SuperAdminAuditLog from "./pages/superadmin/SuperAdminAuditLog";
import SuperAdminTransactions from "./pages/superadmin/SuperAdminTransactions";
import SuperAdminAIConfig from "./pages/superadmin/SuperAdminAIConfig";
import SuperAdminScraper from "./pages/superadmin/SuperAdminScraper";
import SuperAdminOnboarding from "./pages/superadmin/SuperAdminOnboarding";
import SuperAdminAnalytics from "./pages/superadmin/SuperAdminAnalytics";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";
import SuperAdminProfile from "./pages/superadmin/SuperAdminProfile";

import EmployeeCandidateView from "./pages/employee/EmployeeCandidateView";
import EmployeeCandidates from "./pages/employee/EmployeeCandidates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PricingProvider>
        <TransactionsProvider>
        <AIConfigProvider>
        <ScraperConfigProvider>
        <OnboardingConfigProvider>
        <NotificationsProvider>
        <AuditLogProvider>
        <CustomersProvider>
          <EmployeesProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public landing ── */}
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* ── Customer onboarding flow ── */}
                <Route path="/register" element={<Register />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/onboarding/simple" element={<SimpleOnboarding />} />
                <Route path="/upgrade" element={<UpgradePlan />} />
                <Route path="/login" element={<Login />} />

                {/* ── Employee login ── */}
                <Route path="/employee/login" element={<EmployeeLogin />} />

                {/* ── Candidate login / auth ── */}
                <Route path="/candidate/login" element={<CandidateLogin />} />
                <Route path="/candidate/forgot-password" element={<ForgotPassword />} />
                <Route path="/candidate/reset-password" element={<ResetPassword />} />

                {/* ── Candidate portal ── */}
                <Route element={<CandidatePortalLayout />}>
                  <Route path="/candidate/portal" element={<Navigate to="/candidate/applications" replace />} />
                  <Route path="/candidate/cv" element={<CandidateCVBuilder />} />
                  <Route path="/candidate/applications" element={<CandidateApplications />} />
                  <Route path="/candidate/documents" element={<CandidateDocuments />} />
                  <Route path="/candidate/upload" element={<CandidateUpload />} />
                  <Route path="/candidate/analytics" element={<CandidateAnalytics />} />
                  <Route path="/candidate/settings" element={<Navigate to="/candidate/profile?tab=settings" replace />} />
                  <Route path="/candidate/profile" element={<CandidateProfile />} />
                  <Route path="/candidate/onboarding" element={<CandidateOnboarding />} />
                  <Route path="/candidate/files" element={<CandidateFiles />} />
                  <Route path="/candidate/faq" element={<CandidateFaqView />} />
                  <Route path="/candidate/billing" element={<CandidateBilling />} />
                </Route>

                {/* ── Customer portal → merged with candidate portal ── */}
                <Route path="/customer" element={<Navigate to="/candidate/portal" replace />} />
                <Route path="/customer/*" element={<Navigate to="/candidate/portal" replace />} />

                {/* ── Employee portal ── */}
                <Route element={<PortalLayout />}>
                  <Route path="/employee/internal" element={<InternalOverview />} />
                  <Route path="/employee/internal/candidates" element={<EmployeeCandidates />} />
                  <Route path="/employee/portal/candidates/:id" element={<EmployeeCandidateView />} />
                  <Route path="/employee/settings" element={<DashboardSettings />} />
                  {/* Redirects for removed routes */}
                  <Route path="/employee/portal" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/analytics" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/applications" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/documents" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/upload" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/cover-letter" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/internal/jobs" element={<Navigate to="/employee/internal/candidates" replace />} />
                  <Route path="/employee/admin" element={<Navigate to="/employee/internal" replace />} />
                  <Route path="/employee/admin/*" element={<Navigate to="/employee/internal" replace />} />
                </Route>

                {/* ── Super Admin ── */}
                <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                <Route element={<SuperAdminLayout />}>
                  <Route path="/superadmin" element={<SuperAdminOverview />} />
                  <Route path="/superadmin/plans" element={<SuperAdminPlans />} />
                  <Route path="/superadmin/customers" element={<SuperAdminCustomers />} />
                  <Route path="/superadmin/customers/:id" element={<SuperAdminCandidateDetail />} />
                  <Route path="/superadmin/employees" element={<SuperAdminEmployees />} />
                  <Route path="/superadmin/cv-prompts" element={<PromptManager type="cv" />} />
                  <Route path="/superadmin/cl-prompts" element={<PromptManager type="cover-letter" />} />
                  <Route path="/superadmin/ai-settings" element={<AISettings />} />
                  <Route path="/superadmin/audit-log" element={<SuperAdminAuditLog />} />
                  <Route path="/superadmin/transactions" element={<SuperAdminTransactions />} />
                  <Route path="/superadmin/ai-config" element={<SuperAdminAIConfig />} />
                  <Route path="/superadmin/scraper" element={<SuperAdminScraper />} />
                  <Route path="/superadmin/onboarding" element={<SuperAdminOnboarding />} />
                  <Route path="/superadmin/analytics" element={<Navigate to="/superadmin" replace />} />
                  <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
                  <Route path="/superadmin/profile" element={<SuperAdminProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </EmployeesProvider>
        </CustomersProvider>
        </AuditLogProvider>
        </NotificationsProvider>
        </OnboardingConfigProvider>
        </ScraperConfigProvider>
        </AIConfigProvider>
        </TransactionsProvider>
      </PricingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
