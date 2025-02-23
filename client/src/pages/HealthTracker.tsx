import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AddVitalsForm } from "@/components/health/AddVitalsForm";
// import { StatisticsCard } from "@/components/health/StatisticsCard";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Activity, Thermometer, Droplets } from "lucide-react";

// Mock data with multiple vital signs
const initialMockData = [
  {
    date: "2024-03-01",
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 36.6,
    oxygenLevel: 98,
  },
  {
    date: "2024-03-02",
    heartRate: 75,
    bloodPressure: "118/79",
    temperature: 36.7,
    oxygenLevel: 97,
  },
  {
    date: "2024-03-03",
    heartRate: 71,
    bloodPressure: "121/81",
    temperature: 36.5,
    oxygenLevel: 99,
  },
];

const HealthTracker = () => {
  const [vitalsData, setVitalsData] = useState(initialMockData);
  const { toast } = useToast();

  const handleAddVitals = (newVitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenLevel: number;
  }) => {
    const newMeasurement = {
      date: format(new Date(), "yyyy-MM-dd"),
      ...newVitals,
    };
    setVitalsData([...vitalsData, newMeasurement]);
    toast({
      title: "Vitals Updated",
      description: "Your health measurements have been recorded successfully.",
    });
  };

  const latestVitals = vitalsData[vitalsData.length - 1];

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl w-fit font-bold tracking-tight primary-grad">
            Health Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.heartRate} BPM
              </div>
              <p className="text-xs text-muted-foreground">
                Normal range: 60-100 BPM
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Blood Pressure
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.bloodPressure}
              </div>
              <p className="text-xs text-muted-foreground">
                Normal range: 90/60 - 120/80
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.temperature}°C
              </div>
              <p className="text-xs text-muted-foreground">
                Normal range: 36.1-37.2°C
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Oxygen Level
              </CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestVitals.oxygenLevel}%
              </div>
              <p className="text-xs text-muted-foreground">
                Normal range: 95-100%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalsData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Heart Rate
                                  </span>
                                  <span className="font-bold">
                                    {payload[0].value} BPM
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      strokeWidth={2}
                      activeDot={{
                        r: 6,
                        style: { fill: "var(--primary)", opacity: 0.8 },
                      }}
                      style={{
                        stroke: "var(--primary)",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Add New Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <AddVitalsForm onAdd={handleAddVitals} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitalsData
                  .slice()
                  .reverse()
                  .map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-2 last:border-0 transition-colors hover:bg-muted/50 rounded-lg p-2"
                    >
                      <span className="text-sm text-muted-foreground">
                        {record.date}
                      </span>
                      <div className="flex gap-4">
                        <span className="font-semibold">
                          {record.heartRate} BPM
                        </span>
                        <span className="font-semibold">
                          {record.bloodPressure}
                        </span>
                        <span className="font-semibold">
                          {record.temperature}°C
                        </span>
                        <span className="font-semibold">
                          {record.oxygenLevel}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default HealthTracker;
