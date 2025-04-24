import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardCards() {
  const [stats, setStats] = useState([
    {
      id: 1,
      name: "Polizze attive",
      stat: "",
      icon: "solar:document-medicine-linear",
      trend: 0,
    },
    {
      id: 2,
      name: "Polizze in scadenza (-10g)",
      stat: "",
      icon: "solar:document-text-linear",
      trend: 0,
    },
    {
      id: 3,
      name: "Polizze sospese",
      stat: "",
      icon: "solar:pause-circle-linear",
      trend: 0,
    },
    {
      id: 4,
      name: "Clienti registrati",
      stat: "",
      icon: "solar:users-group-two-rounded-linear",
      trend: 0,
    },
    {
      id: 5,
      name: "Veicoli registrati",
      stat: "",
      icon: "mingcute:car-3-line",
      trend: 0,
    },
    {
      id: 6,
      name: "Premi incassati / Da incassare",
      stat: "",
      icon: "solar:euro-linear",
      trend: 0,
    },
  ]);

  useEffect(() => {
    axios
      .get("/Policy/GET/GetActivePolicies", { withCredentials: true })
      .then((res) => {
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 1) {
              return { ...item, stat: res.data.length };
            }
            return item;
          });
        });
      });

    axios
      .get("/Policy/GET/GetExpiringPolicies", { withCredentials: true })
      .then((res) => {
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 2) {
              return { ...item, stat: res.data.length };
            }
            return item;
          });
        });
      });

    axios
      .get("/Customer/GET/GetAllCustomers", { withCredentials: true })
      .then((res) => {
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 4) {
              return { ...item, stat: res.data.length };
            }
            return item;
          });
        });
      });

    axios
      .get("/Vehicle/GET/GetAllVehicles", { withCredentials: true })
      .then((res) => {
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 5) {
              return { ...item, stat: res.data.length };
            }
            return item;
          });
        });
      });

    axios
      .get("/Policy/GET/GetAllPolicies", { withCredentials: true })
      .then((res) => {
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 6) {
              return {
                ...item,
                stat:
                  res.data
                    .reduce(
                      (acc: number, curr: any) =>
                        curr.paymentStatus === "Pagato" ||
                        curr.paymentStatus === "Rate"
                          ? acc + Number(curr.amount)
                          : acc,
                      0
                    )
                    .toString() +
                  " € / " +
                  res.data
                    .reduce(
                      (acc: number, curr: any) =>
                        curr.paymentStatus !== "Pagato" &&
                        curr.paymentStatus !== "Rate"
                          ? acc + Number(curr.amount)
                          : acc,
                      0
                    )
                    .toString() +
                  " €",
              };
            }
            if (item.id === 3) {
              return {
                ...item,
                stat: res.data.filter(
                  (policy: any) => policy.status === "Sospesa"
                ).length,
              };
            }
            return item;
          });
        });
      });
  }, []);

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg bg-white">
            <div className="flex p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="text-slate-700" icon={item.icon} width={24} />
              </div>

              <div className="ml-4 flex flex-col">
                <dt className="text-sm font-medium text-slate-500 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">
                  {item.stat}
                </dd>
                {item.trend !== 0 && (
                  <div className="mt-1 flex items-center text-sm">
                    <span className="flex items-center text-slate-700">
                      {item.trend > 0 ? (
                        <Icon
                          icon="heroicons:arrow-trending-up"
                          className="h-4 w-4 mr-1"
                        />
                      ) : (
                        <Icon
                          icon="heroicons:arrow-trending-down"
                          className="h-4 w-4 mr-1"
                        />
                      )}
                      {Math.abs(item.trend)}%
                    </span>
                    <span className="text-slate-500 ml-1">
                      rispetto al mese scorso
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </dl>
  );
}
