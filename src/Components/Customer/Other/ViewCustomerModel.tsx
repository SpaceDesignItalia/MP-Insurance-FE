import { useEffect, useState } from "react";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { Button, Input, Link, Skeleton } from "@nextui-org/react";
import VehiecleCard from "./VehiecleCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import VehiclePolicyCard from "./VehiclePolicyCard";

interface CustomerDataProps {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface VehicleDataProps {
  vehicleId: number;
  brand: string;
  model: string;
  licensePlate: string;
  typeId: number;
  clientId: number;
  companyName: string;
  statusId: number;
  startDate: Date;
  endDate: Date;
  paymentStatusId: number;
}

interface PolicyDataProps {
  policyId: number;
  fullName: string;
  email: string;
  typeId: number;
  duration: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  brand: string;
  model: string;
  licensePlate: string;
  status: string;
  paymentStatus: string;
  companyName: string;
  companyLogo: string;
  types: string[];
}

const POLICYDEFAULTVALUE: PolicyDataProps = {
  policyId: 0,
  fullName: "",
  email: "",
  startDate: new Date(),
  endDate: new Date(),
  brand: "",
  model: "",
  licensePlate: "",
  duration: 0,
  amount: 0,
  typeId: 0,
  paymentStatus: "",
  companyName: "",
  companyLogo: "",
  status: "",
  types: [],
};

const CUSTOMERDEFAULTVALUE: CustomerDataProps = {
  clientId: 0,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

export default function ViewCustomerModel() {
  const { clientId } = useParams();

  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [customerData, setCustomerData] =
    useState<CustomerDataProps>(CUSTOMERDEFAULTVALUE);
  const [showPolicy, setShowPolicy] = useState<boolean>(false);
  const [policyData, setPolicyData] =
    useState<PolicyDataProps>(POLICYDEFAULTVALUE);
  const [editingData, setEditingData] =
    useState<CustomerDataProps>(CUSTOMERDEFAULTVALUE);
  const [loadedAllData, setLoadedAllData] = useState<boolean>(false);

  const [vehicleData, setVehicleData] = useState<VehicleDataProps[]>([]);
  useEffect(() => {
    fetchCustomerData();
  }, []);

  async function fetchCustomerData() {
    try {
      const res = await axios.get("/Customer/GET/GetCustomerById", {
        params: { clientId: clientId },
        withCredentials: true,
      });

      if (res.status == 200) {
        setCustomerData(res.data);
        setEditingData(res.data);

        const res2 = await axios.get("/Vehicle/GET/GetClientVehicles", {
          params: { clientId: clientId },
          withCredentials: true,
        });

        if (res2.status == 200) {
          setVehicleData(res2.data);
          setLoadedAllData(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchPolicyByVehicleId(vehicleId: number) {
    try {
      const res = await axios.get("/Policy/GET/GetPolicyByVehicleId", {
        params: { vehicleId: vehicleId },
        withCredentials: true,
      });

      if (res.status == 200) {
        setPolicyData(res.data);
        setShowPolicy(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Stato per tracciare il veicolo selezionato
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );

  const handleVehicleSelect = (vehicleId: number) => {
    // Trova il veicolo selezionato tra i dati
    const selectedVehicle = vehicleData.find(
      (vehicle) => vehicle.vehicleId === vehicleId
    );

    // Controlla se companyName, startDate o endDate sono null
    if (
      selectedVehicle?.companyName === null ||
      selectedVehicle?.startDate === null ||
      selectedVehicle?.endDate === null
    ) {
      return; // Se uno di questi è null, non selezionare la card
    }

    // Se il veicolo cliccato è già selezionato, deseleziona
    if (selectedVehicleId === vehicleId) {
      setSelectedVehicleId(null);
      setShowPolicy(false);
      setPolicyData(POLICYDEFAULTVALUE);
    } else {
      // Altrimenti seleziona il veicolo cliccato
      setSelectedVehicleId(vehicleId);
      fetchPolicyByVehicleId(vehicleId);
    }
  };

  const clearEditingData = () => {
    setIsEditingData(false);
    fetchCustomerData();
  };

  const handleEditCustomerData = (e: any) => {
    const { name, value } = e;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setEditingData({ ...editingData, [name]: numericValue });
      }
    } else if (name === "email") {
      const emailValue = value.replace(/\s+/g, "");
      setEditingData({ ...editingData, [name]: emailValue });
    } else {
      setEditingData({ ...editingData, [name]: value });
    }
  };

  const checkEditedData = () => {
    return (
      editingData.firstName !== customerData.firstName ||
      editingData.lastName !== customerData.lastName ||
      editingData.email !== customerData.email ||
      editingData.phoneNumber !== customerData.phoneNumber
    );
  };

  async function updateCustomerData() {
    try {
      const res = await axios.put(
        "/Customer/UPDATE/UpdateCustomerData",
        {
          customerData: editingData,
        },
        { withCredentials: true }
      );

      if (res.status == 200) {
        fetchCustomerData();
        setIsEditingData(false);
        setSelectedVehicleId(null);
        setShowPolicy(false);
        setPolicyData(POLICYDEFAULTVALUE);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <main>
      <header className="relative isolate border-b-2">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {isEditingData ? (
            <div className="mx-auto flex flex-col sm:flex-row max-w-2xl sm:items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none gap-5">
              <div className="flex w-full items-center gap-x-6">
                <h1 className="w-full sm:w-1/2 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 items-center mt-1 text-xl font-semibold leading-6 text-gray-900">
                    <Input
                      label="Nome"
                      name="firstName"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={editingData.firstName}
                      onChange={(e) => handleEditCustomerData(e.target)}
                    />
                    <Input
                      label="Cognome"
                      name="lastName"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={editingData.lastName}
                      onChange={(e) => handleEditCustomerData(e.target)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                    <Input
                      label="Email"
                      name="email"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={editingData.email}
                      onChange={(e) => handleEditCustomerData(e.target)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                    <Input
                      label="Telefono"
                      name="phoneNumber"
                      variant="bordered"
                      radius="sm"
                      size="sm"
                      value={editingData.phoneNumber}
                      onChange={(e) => handleEditCustomerData(e.target)}
                    />
                  </div>
                </h1>
              </div>
              <div className="flex flex-row sm:flex-col gap-3 items-center justify-center sm:items-end gap-x-4 sm:gap-x-6">
                <Button
                  color="danger"
                  radius="sm"
                  className="text-white"
                  startContent={<CloseRoundedIcon />}
                  onClick={clearEditingData}
                >
                  Annulla
                </Button>
                <Button
                  color="warning"
                  radius="sm"
                  className="text-white"
                  startContent={<SaveRoundedIcon />}
                  isDisabled={!checkEditedData()}
                  onClick={updateCustomerData}
                >
                  Salva modifiche
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex flex-col sm:flex-row gap-5 max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex w-full items-center gap-x-6">
                <h1 className="w-full flex flex-col gap-2">
                  <Skeleton
                    isLoaded={loadedAllData}
                    className="w-full sm:w-1/3 rounded-lg"
                  >
                    <div className="flex flex-row gap-2 items-center mt-1 text-xl font-semibold leading-6 text-gray-900">
                      <InsertEmoticonOutlinedIcon />
                      {customerData.firstName + " " + customerData.lastName}
                    </div>
                  </Skeleton>

                  <Skeleton
                    isLoaded={loadedAllData}
                    className="w-full sm:w-1/4 rounded-lg"
                  >
                    <div className="flex flex-row gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                      <EmailOutlinedIcon />
                      {customerData.email}
                    </div>
                  </Skeleton>

                  <Skeleton
                    isLoaded={loadedAllData}
                    className="w-full sm:w-1/5 rounded-lg"
                  >
                    <div className="flex flex-row gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                      <PhoneAndroidOutlinedIcon />
                      {customerData.phoneNumber}
                    </div>
                  </Skeleton>
                </h1>
              </div>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                <Skeleton
                  isLoaded={loadedAllData}
                  className="w-full rounded-lg"
                >
                  <Button
                    color="warning"
                    radius="sm"
                    className="text-white"
                    startContent={<EditRoundedIcon />}
                    onClick={() => setIsEditingData(!isEditingData)}
                  >
                    Modifica dati
                  </Button>
                </Skeleton>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-semibold">Veicoli intestati</h1>
          <div className="flex flex-row gap-5">
            <Skeleton isLoaded={loadedAllData} className="rounded-lg">
              <Button
                as={Link}
                color="warning"
                className="text-white"
                radius="sm"
                startContent={<EditRoundedIcon />}
                href={
                  "/customers/view-customer-data/" + clientId + "/edit-vehicles"
                }
              >
                Modifica veicoli
              </Button>
            </Skeleton>
          </div>
        </div>
        <div className="mt-4 mx-auto grid max-w-2xl  grid-cols-1 sm:grid-cols-2 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {vehicleData.length !== 0 ? (
            <>
              {vehicleData.map((vehicle: VehicleDataProps) => {
                return (
                  <VehiecleCard
                    key={Number(vehicle.vehicleId)}
                    VehiecleCardProps={{
                      vehicleId: Number(vehicle.vehicleId),
                      licensePlate: vehicle.licensePlate,
                      brand: vehicle.brand,
                      model: vehicle.model,
                      typeId: Number(vehicle.typeId),
                      companyName: vehicle.companyName,
                      statusId: Number(vehicle.statusId),
                      startDate: vehicle.startDate,
                      endDate: vehicle.endDate,
                      paymentStatusId: Number(vehicle.paymentStatusId),
                    }}
                    variant="policy"
                    isSelected={selectedVehicleId == vehicle.vehicleId}
                    onSelect={handleVehicleSelect}
                  />
                );
              })}
            </>
          ) : (
            <>
              <Skeleton className="h-40 w-96 rounded-lg" />
              <Skeleton className="h-40 w-96 rounded-lg" />
              <Skeleton className="h-40 w-96 rounded-lg" />
            </>
          )}
        </div>
        <div className="mt-3 px-4">
          <VehiclePolicyCard
            PolicyData={{
              policyId: Number(policyData.policyId),
              fullName: policyData.fullName,
              email: policyData.email,
              typeId: Number(policyData.typeId),
              duration: Number(policyData.duration),
              amount: Number(policyData.amount),
              startDate: policyData.startDate,
              endDate: policyData.endDate,
              brand: policyData.brand,
              model: policyData.model,
              licensePlate: policyData.licensePlate,
              status: policyData.status,
              paymentStatus: policyData.paymentStatus,
              companyName: policyData.companyName,
              companyLogo: policyData.companyLogo,
              types: policyData.types,
            }}
            isVisible={showPolicy}
          />
        </div>
      </div>
    </main>
  );
}
