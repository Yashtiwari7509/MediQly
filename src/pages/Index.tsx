
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Activity, Calendar, LineChart, Ruler } from "lucide-react";

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

const Index = () => {
  return (
    <MainLayout>
      <div className="animate-in">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back, John</h1>
        <p className="mb-8 text-muted-foreground">Here's your health overview</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("rounded-lg p-2 ring-1 ring-inset ring-gray-200", stat.color)}>
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
