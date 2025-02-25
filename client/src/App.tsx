import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HealthTracker from "./pages/HealthTracker";
import Appointments from "./pages/Appointments";
import PreventiveHealth from "./pages/PreventiveHealth";
import Insurance from "./pages/Insurance";
import Symptoms from "./pages/Symptoms";
import BMI from "./pages/BMI";
import Medicine from "./pages/Medicine";
import NotFound from "./pages/NotFound";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { ThemeProvider } from "./utils/theme.provider";
import Profile from "./pages/Profile";
// import ChatPage from "./components/Chat";
import { AuthProvider } from "./auth/AuthProvider";
import ChatCall from "./pages/chat/LatestVideoCall";
import DocRegister from "./auth/DocRegister";
import AiDoctor from "./pages/AiDoctor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doc-register" element={<DocRegister />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/health-tracker" element={<HealthTracker />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/preventive-health" element={<PreventiveHealth />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/bmi" element={<BMI />} />
              <Route path="/medicine" element={<Medicine />} />
              <Route path="/chat" element={<ChatCall />} />
              <Route path="/ai-doctor" element={<AiDoctor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
