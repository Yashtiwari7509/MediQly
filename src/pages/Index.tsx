
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Activity, Calendar, LineChart, Ruler, BellDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stats = [
  {
    label: "Next Appointment",
    value: "Tomorrow, 10:00 AM",
    icon: Calendar,
    color: "text-primary",
  },
  {
    label: "Current Height",
    value: "175 cm",
    icon: Ruler,
    color: "text-secondary",
  },
  {
    label: "BMI",
    value: "22.5",
    icon: LineChart,
    color: "text-success",
  },
  {
    label: "Active Symptoms",
    value: "None",
    icon: Activity,
    color: "text-accent",
  },
];

const notifications = [
  {
    id: 1,
    title: "Appointment Reminder",
    message: "You have a check-up tomorrow at 10:00 AM",
  },
  {
    id: 2,
    title: "Medicine Reminder",
    message: "Time to take your evening medication",
  },
];

const Index = () => {
  const { toast } = useToast();

  const showNotification = (notification: typeof notifications[0]) => {
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  return (
    <MainLayout>
      <div className="animate-in">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, John</h1>
              <p className="text-muted-foreground">Here's your health overview</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => notifications.forEach(showNotification)}
          >
            <BellDot className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {notifications.length}
            </span>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "rounded-lg p-2 ring-1 ring-inset ring-gray-200",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
