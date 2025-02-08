
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockHeightData = [
  { date: "Jan 2024", height: 175 },
  { date: "Feb 2024", height: 175.5 },
  { date: "Mar 2024", height: 176 },
  { date: "Apr 2024", height: 176.2 },
  { date: "May 2024", height: 176.5 },
];

const HeightTracker = () => {
  return (
    <MainLayout>
      <div className="animate-in">
        <h1 className="mb-8 text-3xl font-bold">Height Tracking</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Height Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHeightData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="height"
                      stroke="#9b87f5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Latest Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHeightData.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {record.date}
                    </span>
                    <span className="font-semibold">{record.height} cm</span>
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

export default HeightTracker;
