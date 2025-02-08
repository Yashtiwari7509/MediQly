
import { Link } from "react-router-dom";
import {
  Activity,
  Calendar,
  HeartPulse,
  Home,
  LineChart,
  MessageSquare,
  Pill,
  Plus,
  Ruler,
  Shield,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Ruler, label: "Height Tracker", path: "/height-tracker" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: HeartPulse, label: "Preventive Health", path: "/preventive-health" },
  { icon: Shield, label: "Insurance", path: "/insurance" },
  { icon: Activity, label: "Symptoms", path: "/symptoms" },
  { icon: LineChart, label: "BMI Index", path: "/bmi" },
  { icon: Pill, label: "Medicine", path: "/medicine" },
];

export function Sidebar() {
  return (
    <div className="h-screen w-64 border-r bg-card px-3 py-4">
      <div className="flex items-center gap-2 px-3 py-2">
        <HeartPulse className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">HealthCare</span>
      </div>
      
      <div className="mt-8 flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <Button asChild className="w-full" variant="outline">
          <Link to="/chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat with Doctor
          </Link>
        </Button>
      </div>
    </div>
  );
}
