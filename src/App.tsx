import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeometricBackground } from "@/components/ui/geometric-background";
import { AvocadoCursor } from "@/components/ui/avocado-cursor";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { useTheme } from "@/hooks/useTheme";
import { PageGuard } from "@/components/layout/PageGuard";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme();
  return <>{children}</>;
}

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import WhatWeDo from "./pages/WhatWeDo";
import Technology from "./pages/Technology";
import Markets from "./pages/Markets";
import Sustainability from "./pages/Sustainability";
import Investors from "./pages/Investors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminOverview from "./pages/admin/Overview";
import UsersPage from "./pages/admin/Users";
import ContactsPage from "./pages/admin/Contacts";
import EmailsPage from "./pages/admin/Emails";
import ContentPage from "./pages/admin/Content";
import SettingsPage from "./pages/admin/Settings";
import FinancePage from "./pages/admin/Finance";
import InvestorPortal from "./pages/admin/portal/InvestorPortal";
import FinancialProjections from "./pages/admin/portal/FinancialProjections";
import ImpactMetricsPage from "./pages/admin/portal/ImpactMetrics";
import { DocumentSectionPage } from "./pages/admin/portal/DocumentSection";
import { FileText, FolderLock } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            {/* Public website routes */}
            <Route path="/" element={<><GeometricBackground /><AvocadoCursor /><Index /><ChatWidget /></>} />
            <Route path="/about" element={<PageGuard slug="about"><GeometricBackground /><AvocadoCursor /><About /><ChatWidget /></PageGuard>} />
            <Route path="/what-we-do" element={<PageGuard slug="what-we-do"><GeometricBackground /><AvocadoCursor /><WhatWeDo /><ChatWidget /></PageGuard>} />
            <Route path="/technology" element={<PageGuard slug="technology"><GeometricBackground /><AvocadoCursor /><Technology /><ChatWidget /></PageGuard>} />
            <Route path="/markets" element={<PageGuard slug="markets"><GeometricBackground /><AvocadoCursor /><Markets /><ChatWidget /></PageGuard>} />
            <Route path="/sustainability" element={<PageGuard slug="sustainability"><GeometricBackground /><AvocadoCursor /><Sustainability /><ChatWidget /></PageGuard>} />
            <Route path="/investors" element={<PageGuard slug="investors"><GeometricBackground /><AvocadoCursor /><Investors /><ChatWidget /></PageGuard>} />
            <Route path="/contact" element={<PageGuard slug="contact"><GeometricBackground /><AvocadoCursor /><Contact /><ChatWidget /></PageGuard>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<><AdminLogin /><ChatWidget /></>} />
            <Route path="/admin" element={<><AdminOverview /><ChatWidget /></>} />
            <Route path="/admin/users" element={<><UsersPage /><ChatWidget /></>} />
            <Route path="/admin/contacts" element={<><ContactsPage /><ChatWidget /></>} />
            <Route path="/admin/emails" element={<><EmailsPage /><ChatWidget /></>} />
            <Route path="/admin/content" element={<><ContentPage /><ChatWidget /></>} />
            <Route path="/admin/settings" element={<><SettingsPage /><ChatWidget /></>} />
            <Route path="/admin/portal/investor" element={<><InvestorPortal /><ChatWidget /></>} />
            <Route path="/admin/portal/financial-projections" element={<><FinancialProjections /><ChatWidget /></>} />
            <Route path="/admin/portal/impact-metrics" element={<><ImpactMetricsPage /><ChatWidget /></>} />
            <Route path="/admin/portal/reports" element={
              <><DocumentSectionPage section="reports" title="Reports" description="Company reports and publications" portalKey="reports" icon={FileText} /><ChatWidget /></>
            } />
            <Route path="/admin/portal/data-room" element={
              <><DocumentSectionPage section="data_room" title="Data Room" description="Confidential due diligence documents" portalKey="data_room" icon={FolderLock} /><ChatWidget /></>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

