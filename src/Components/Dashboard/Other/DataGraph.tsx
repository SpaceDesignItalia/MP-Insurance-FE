import { Tab, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type ActivityData = {
  policyId?: string;
  vehicleId?: string;
  clientId?: string;
  createdAt: string;
};

type TimeRange = "30-days" | "6-months" | "1-year" | "all-time";

export default function DataGraph() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [activeMetric, setActiveMetric] = useState<
    "policies" | "vehicles" | "clients"
  >("vehicles");
  const [timeRange, setTimeRange] = useState<TimeRange>("30-days");

  async function fetchActivities() {
    const response = await axios.get("/Policy/GET/GetAllRecentActivities", {
      withCredentials: true,
    });

    if (response.status === 200) {
      setActivities(response.data);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  const metrics = [
    {
      key: "policies",
      title: "Nuove Polizze",
      color: "success",
      icon: "solar:document-text-linear",
    },
    {
      key: "vehicles",
      title: "Nuovi Veicoli",
      color: "primary",
      icon: "mingcute:car-3-line",
    },
    {
      key: "clients",
      title: "Nuovi Clienti",
      color: "warning",
      icon: "solar:user-circle-linear",
    },
  ];

  const chartData = useMemo(() => {
    const data = new Map<
      string,
      { policies: number; vehicles: number; clients: number }
    >();

    if (activities.length === 0) return [];

    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "30-days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "6-months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1-year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all-time":
        startDate = new Date(
          Math.min(...activities.map((a) => new Date(a.createdAt).getTime()))
        );
        break;
    }

    const filteredActivities = activities.filter(
      (activity) => new Date(activity.createdAt) >= startDate
    );

    const getKey = (date: Date) => {
      switch (timeRange) {
        case "30-days":
          return date.toLocaleString("it-IT", {
            day: "2-digit",
            month: "short",
            timeZone: "Europe/Rome",
          });
        case "6-months":
          const weekNumber = Math.ceil((date.getDate() + date.getDay()) / 7);
          return `Sett ${weekNumber} ${date.toLocaleString("it-IT", {
            month: "short",
            timeZone: "Europe/Rome",
          })}`;
        case "1-year":
          return date.toLocaleString("it-IT", {
            month: "short",
            year: "2-digit",
            timeZone: "Europe/Rome",
          });
        case "all-time":
          return date.getFullYear().toString();
      }
    };

    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const key = getKey(currentDate);
      if (!data.has(key)) {
        data.set(key, { policies: 0, vehicles: 0, clients: 0 });
      }

      switch (timeRange) {
        case "30-days":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "6-months":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "1-year":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "all-time":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    filteredActivities.forEach((activity) => {
      const date = new Date(activity.createdAt);
      const key = getKey(date);
      const periodData = data.get(key);

      if (periodData) {
        if (activity.policyId) periodData.policies++;
        else if (activity.vehicleId) periodData.vehicles++;
        else if (activity.clientId) periodData.clients++;
      }
    });

    return Array.from(data.entries())
      .map(([key, value]) => ({
        period: key,
        ...value,
      }))
      .sort((a, b) => {
        if (timeRange === "all-time") {
          return parseInt(a.period) - parseInt(b.period);
        }

        const dateA = new Date(a.period);
        const dateB = new Date(b.period);
        return dateA.getTime() - dateB.getTime();
      });
  }, [activities, timeRange]);

  const currentPeriodData = useMemo(() => {
    if (chartData.length === 0) {
      return {
        policies: 0,
        vehicles: 0,
        clients: 0,
      };
    }

    // Determina quanti elementi prendere in base al timeRange
    let itemsToSum: number;
    switch (timeRange) {
      case "30-days":
        itemsToSum = 30;
        break;
      case "6-months":
        itemsToSum = 26; // circa 26 settimane
        break;
      case "1-year":
        itemsToSum = 12;
        break;
      case "all-time":
        itemsToSum = chartData.length;
        break;
    }

    // Prendi gli ultimi N elementi e somma i valori
    const periodData = chartData.slice(-itemsToSum);
    return {
      policies: periodData.reduce((sum, data) => sum + data.policies, 0),
      vehicles: periodData.reduce((sum, data) => sum + data.vehicles, 0),
      clients: periodData.reduce((sum, data) => sum + data.clients, 0),
    };
  }, [chartData, timeRange]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <section className="flex flex-col flex-nowrap">
        <div className="flex flex-col justify-between gap-y-2">
          <div className="flex flex-col gap-y-2">
            <dt className="text-medium font-medium text-foreground">
              Analytics
            </dt>
            <Tabs
              color="primary"
              variant="solid"
              size="sm"
              selectedKey={timeRange}
              onSelectionChange={(key) => setTimeRange(key as TimeRange)}
            >
              <Tab key="30-days" title="30 Giorni" />
              <Tab key="6-months" title="6 Mesi" />
              <Tab key="1-year" title="1 Anno" />
              <Tab key="all-time" title="Tutto" />
            </Tabs>
            <div className="mt-2 flex w-full items-center">
              <div className="-my-3 flex w-full max-w-[800px] items-center justify-center gap-x-3 overflow-x-auto py-3">
                {metrics.map(({ key, title, icon }) => (
                  <button
                    key={key}
                    className={`flex w-full flex-col gap-2 rounded-medium p-3 transition-colors border-2 border-zinc-100 ${
                      activeMetric === key ? "bg-default-100" : ""
                    }`}
                    onClick={() =>
                      setActiveMetric(
                        key as "policies" | "vehicles" | "clients"
                      )
                    }
                  >
                    <span
                      className={`text-small font-medium flex items-center gap-x-2 ${
                        activeMetric === key
                          ? "text-primary"
                          : "text-default-500"
                      }`}
                    >
                      <Icon
                        icon={icon}
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                      <span>{title}</span>
                    </span>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-foreground">
                        {
                          currentPeriodData[
                            key as keyof typeof currentPeriodData
                          ]
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveContainer
          className="min-h-[300px] [&_.recharts-surface]:outline-none"
          width="100%"
          height={300}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="10%"
                  stopColor={`hsl(var(--heroui-${
                    metrics.find((m) => m.key === activeMetric)?.color
                  }-500))`}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={`hsl(var(--heroui-${
                    metrics.find((m) => m.key === activeMetric)?.color
                  }-100))`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="hsl(var(--heroui-default-200))"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="period"
              tickLine={false}
              style={{
                fontSize: "var(--heroui-font-size-tiny)",
                transform: "translateX(-40px)",
              }}
            />
            <Tooltip
              content={({ label, payload }) => (
                <div className="flex h-auto min-w-[120px] items-center gap-x-2 rounded-medium bg-foreground p-2 text-tiny shadow-small">
                  <div className="flex w-full flex-col gap-y-0">
                    {payload?.map((p, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center gap-x-2"
                      >
                        <div className="flex w-full items-center gap-x-1 text-small text-background">
                          <span>{p.value}</span>
                          <span>{p.name}</span>
                        </div>
                      </div>
                    ))}
                    <span className="text-small font-medium text-foreground-400">
                      {label}
                    </span>
                  </div>
                </div>
              )}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={`hsl(var(--heroui-${
                metrics.find((m) => m.key === activeMetric)?.color
              }))`}
              fill="url(#colorGradient)"
              strokeWidth={2}
              activeDot={{
                stroke: `hsl(var(--heroui-${
                  metrics.find((m) => m.key === activeMetric)?.color
                }))`,
                strokeWidth: 2,
                fill: "hsl(var(--heroui-background))",
                r: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
