import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GeometricBackground } from "@/components/ui/geometric-background";
import { AvocadoCursor } from "@/components/ui/avocado-cursor";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { PageGuard } from "@/components/layout/PageGuard";
import Index from "./pages/Index";
import About from "./pages/About";
import WhatWeDo from "./pages/WhatWeDo";
import Technology from "./pages/Technology";
import Markets from "./pages/Markets";
import Sustainability from "./pages/Sustainability";
import Investors from "./pages/Investors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GeometricBackground />
      <AvocadoCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageGuard slug="home"><Index /></PageGuard>} />
          <Route path="/about" element={<PageGuard slug="about"><About /></PageGuard>} />
          <Route path="/what-we-do" element={<PageGuard slug="what-we-do"><WhatWeDo /></PageGuard>} />
          <Route path="/technology" element={<PageGuard slug="technology"><Technology /></PageGuard>} />
          <Route path="/markets" element={<PageGuard slug="markets"><Markets /></PageGuard>} />
          <Route path="/sustainability" element={<PageGuard slug="sustainability"><Sustainability /></PageGuard>} />
          <Route path="/investors" element={<PageGuard slug="investors"><Investors /></PageGuard>} />
          <Route path="/contact" element={<PageGuard slug="contact"><Contact /></PageGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ChatWidget />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
