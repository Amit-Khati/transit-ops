"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Bell } from "lucide-react";

type AnalyticsResponse = {
  summary: {
    fuelEfficiency: number;
    fleetUtilization: number;
    operationalCost: number;
    vehicleRoi: number;
  };
  monthlyRevenue: Record<string, number>;
  topVehicleCosts: Array<{ id: string; name: string; cost: number }>;
  totals: {
    vehicles: number;
    trips: number;
    expenses: number;
    fuelLogs: number;
  };
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to load analytics");
        }
        const json = (await response.json()) as AnalyticsResponse;
        setData(json);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load analytics",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  const monthlyEntries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.monthlyRevenue)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([month, revenue]) => ({ month, revenue }));
  }, [data]);

  const maxRevenue = monthlyEntries.reduce(
    (max, entry) => Math.max(max, entry.revenue),
    0,
  );

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-slate-400">
            Fleet performance metrics calculated from the live backend data
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Bell size={20} />
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {isLoading || !data ? (
        <div className="py-10 text-center text-slate-400">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">
                  FUEL EFFICIENCY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-300">
                  {data.summary.fuelEfficiency.toFixed(2)} km/l
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">
                  FLEET UTILIZATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-300">
                  {data.summary.fleetUtilization.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">
                  OPERATIONAL COST
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-300">
                  ₹{data.summary.operationalCost.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">
                  VEHICLE ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-300">
                  {data.summary.vehicleRoi.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">MONTHLY REVENUE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 h-56">
                  {monthlyEntries.length > 0 ? (
                    monthlyEntries.map((entry) => (
                      <div
                        key={entry.month}
                        className="flex flex-1 flex-col items-center"
                      >
                        <div
                          className="w-full rounded-t-lg bg-linear-to-t from-blue-600 to-blue-400"
                          style={{
                            height: `${(entry.revenue / Math.max(1, maxRevenue)) * 100}%`,
                          }}
                        />
                        <div className="mt-2 text-sm text-slate-400">
                          {entry.month}
                        </div>
                        <div className="text-xs text-slate-500">
                          ₹{entry.revenue.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400">
                      No revenue history yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">
                  TOP COSTLY VEHICLES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.topVehicleCosts.length > 0 ? (
                  data.topVehicleCosts.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-lg border border-slate-700 bg-slate-900/70 p-3"
                    >
                      <div className="flex items-center justify-between text-sm text-slate-200">
                        <span>{vehicle.name}</span>
                        <span className="text-orange-300">
                          ₹{vehicle.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">
                    No vehicle cost data yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
