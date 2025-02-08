
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/height-tracker" element={<Navigate to="/" />} />
          <Route path="/appointments" element={<Navigate to="/" />} />
          <Route path="/preventive-health" element={<Navigate to="/" />} />
          <Route path="/insurance" element={<Navigate to="/" />} />
          <Route path="/symptoms" element={<Navigate to="/" />} />
          <Route path="/bmi" element={<Navigate to="/" />} />
          <Route path="/medicine" element={<Navigate to="/" />} />
          <Route path="/chat" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
