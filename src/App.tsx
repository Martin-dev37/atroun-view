import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeometricBackground } from "@/components/ui/geometric-background";
import { AvocadoCursor } from "@/components/ui/avocado-cursor";
import { ChatWidget } from "@/components/chat/ChatWidget";

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
        <Routes>
          {/* Public website routes */}
          <Route path="/" element={<><GeometricBackground /><AvocadoCursor /><Index /><ChatWidget /></>} />
          <Route path="/about" element={<><GeometricBackground /><AvocadoCursor /><About /><ChatWidget /></>} />
          <Route path="/what-we-do" element={<><GeometricBackground /><AvocadoCursor /><WhatWeDo /><ChatWidget /></>} />
          <Route path="/technology" element={<><GeometricBackground /><AvocadoCursor /><Technology /><ChatWidget /></>} />
          <Route path="/markets" element={<><GeometricBackground /><AvocadoCursor /><Markets /><ChatWidget /></>} />
          <Route path="/sustainability" element={<><GeometricBackground /><AvocadoCursor /><Sustainability /><ChatWidget /></>} />
          <Route path="/investors" element={<><GeometricBackground /><AvocadoCursor /><Investors /><ChatWidget /></>} />
          <Route path="/contact" element={<><GeometricBackground /><AvocadoCursor /><Contact /><ChatWidget /></>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/contacts" element={<ContactsPage />} />
          <Route path="/admin/emails" element={<EmailsPage />} />
          <Route path="/admin/content" element={<ContentPage />} />
          <Route path="/admin/portal/investor" element={<InvestorPortal />} />
          <Route path="/admin/portal/financial-projections" element={<FinancialProjections />} />
          <Route path="/admin/portal/impact-metrics" element={<ImpactMetricsPage />} />
          <Route path="/admin/portal/reports" element={
            <DocumentSectionPage section="reports" title="Reports" description="Company reports and publications" portalKey="reports" icon={FileText} />
          } />
          <Route path="/admin/portal/data-room" element={
            <DocumentSectionPage section="data_room" title="Data Room" description="Confidential due diligence documents" portalKey="data_room" icon={FolderLock} />
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

