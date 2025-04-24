import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import ViewPolicyModal from "./ViewPolicyModal";

interface Activity {
  brand: string;
  clientId: string;
  fullName: string;
  licensePlate: string;
  model: string;
  policyId: string;
  vehicleId: string;
  createdAt: string;
  email: string;
}

interface ViewModalData {
  open: boolean;
  Policy: {
    policyId: number;
    fullName: string;
    email: string;
    typeId: string;
    duration: number;
    amount: string;
    startDate: string;
    endDate: string;
    licensePlate: string;
    status: string;
    insuranceType: string;
    paymentStatus: string;
    types: string[];
    note: string;
    clientId: number;
  };
}

export default function RecentActivites() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ViewModalData, setViewModalData] = useState<ViewModalData>({
    open: false,
    Policy: {} as ViewModalData["Policy"],
  });

  async function fetchActivities() {
    const response = await axios.get("/Policy/GET/GetRecentActivities", {
      withCredentials: true,
    });

    if (response.status === 200) {
      setActivities(
        response.data.sort(
          (a: Activity, b: Activity) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleActivityClick = async (vehicleId: string) => {
    try {
      const response = await axios.get(`/Policy/GET/GetPolicyByVehicleId`, {
        withCredentials: true,
        params: {
          vehicleId: vehicleId,
        },
      });

      if (response.status === 200) {
        setViewModalData({
          open: true,
          Policy: response.data,
        });
      }
    } catch (error) {
      console.error("Error fetching policy:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 pl-6 pt-6 pb-6 hover:shadow-lg transition-shadow duration-200">
      <ViewPolicyModal
        isOpen={ViewModalData.open}
        isClosed={() => setViewModalData({ ...ViewModalData, open: false })}
        PolicyData={ViewModalData.Policy}
      />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Attività Recenti</h2>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
        {activities.map((activity) => (
          <div
            key={Math.random()}
            className="flex items-center justify-between space-x-4 p-3 hover:bg-zinc-100 rounded-lg transition-colors duration-200 border border-transparent hover:border-slate-200 cursor-pointer"
            onClick={() =>
              activity.policyId
                ? handleActivityClick(activity.vehicleId)
                : activity.clientId &&
                  (window.location.href = `/customers/view-customer-data/${activity.clientId}`)
            }
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {activity.policyId ? (
                  <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center ring-2 ring-emerald-100">
                    <Icon
                      icon="solar:document-text-linear"
                      className="h-5 w-5 text-emerald-600"
                    />
                  </div>
                ) : activity.vehicleId ? (
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-2 ring-blue-100">
                    <Icon
                      icon="mingcute:car-3-line"
                      className="h-5 w-5 text-blue-600"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center ring-2 ring-yellow-100">
                    <Icon
                      icon="solar:user-circle-linear"
                      className="h-5 w-5 text-yellow-600"
                    />
                  </div>
                )}
              </div>
              {activity.policyId ? (
                <div>
                  <p className="text-sm font-semibold text-black">
                    Nuova polizza stipulata
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.brand} {activity.model} - {activity.fullName}
                  </p>
                </div>
              ) : activity.vehicleId ? (
                <div>
                  <p className="text-sm font-semibold text-black">
                    Nuovo veicolo registrato
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.brand} {activity.model} - {activity.licensePlate}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-black">
                    Nuovo cliente registrato
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.fullName} - {activity.email}
                  </p>
                </div>
              )}
            </div>
            <div className="ml-auto">
              <p className="text-sm text-slate-500">
                {new Date(activity.createdAt).toLocaleString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
