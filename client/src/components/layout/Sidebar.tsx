import { Link } from "react-router-dom";
import {
  Activity,
  AlignCenterVertical,
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
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  {
    icon: AlignCenterVertical,
    label: "Health Tracker",
    path: "/health-tracker",
  },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: HeartPulse, label: "Preventive Health", path: "/preventive-health" },
  { icon: Shield, label: "Insurance", path: "/insurance" },
  { icon: Activity, label: "Symptoms", path: "/symptoms" },
  { icon: LineChart, label: "BMI Index", path: "/bmi" },
  { icon: Pill, label: "Medicine", path: "/medicine" },
];

export function Sidebar() {
  return (
    <div className=" flex  h-screen w-64 flex-col bg-primary/5 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <HeartPulse className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">MediQly</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary",
                window.location.pathname === item.path &&
                  "bg-primary/10 text-primary font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
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
