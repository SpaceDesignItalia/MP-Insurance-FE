import axios from "axios";
import { useEffect, useState } from "react";

import { Card, cn } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function DashboardCards() {
  const [stats, setStats] = useState([
    {
      id: 1,
      name: "Polizze attive",
      stat: "",
      icon: "solar:document-medicine-linear",
    },
    {
      id: 2,
      name: "Polizze in scadenza (-10g)",
      stat: "",
      icon: "solar:document-text-linear",
    },
    {
      id: 3,
      name: "Polizze sospese",
      stat: "",
      icon: "solar:pause-circle-linear",
    },
    {
      id: 4,
      name: "Clienti registrati",
      stat: "",
      icon: "solar:users-group-two-rounded-linear",
    },
    {
      id: 5,
      name: "Veicoli registrati",
      stat: "",
      icon: "mingcute:car-3-line",
    },
    {
      id: 6,
      name: "Premi incassati",
      stat: "",
      icon: "solar:euro-linear",
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
        console.log(res.data);
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
        console.log(res.data);
        setStats((prev) => {
          return prev.map((item) => {
            if (item.id === 6) {
              return {
                ...item,
                stat:
                  res.data
                    .reduce(
                      (acc: number, curr: any) => acc + Number(curr.amount),
                      0
                    )
                    .toString() + " €",
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
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Card
            key={item.id}
            className="border border-transparent dark:border-default-100"
          >
            <div className="flex p-4">
              <div
                className={cn(
                  "mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-primary"
                )}
              >
                <Icon className="text-white" icon={item.icon} width={20} />
              </div>

              <div className="flex flex-col gap-y-2">
                <dt className="mx-4 text-small font-medium text-default-500">
                  {item.name}
                </dt>
                <dd className="px-4 text-2xl font-semibold text-default-700">
                  {item.stat}
                </dd>
              </div>
            </div>
          </Card>
        ))}
      </dl>
    </div>
  );
}
