import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Link,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import VehiecleCard from "./VehiecleCard";
import { useParams } from "react-router-dom";
import axios from "axios";
import VehiclePolicyCard from "./VehiclePolicyCard";
import { Icon } from "@iconify/react";

interface CustomerDataProps {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
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
  note: string;
  startSuspensionDate: Date | null;
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
  note: "",
  startSuspensionDate: new Date() || null,
};

const CUSTOMERDEFAULTVALUE: CustomerDataProps = {
  clientId: 0,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
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
  const [activeTab, setActiveTab] = useState("vehicles");
  const [historyData, setHistoryData] = useState<PolicyDataProps[]>([]);

  const [vehicleData, setVehicleData] = useState<VehicleDataProps[]>([]);

  useEffect(() => {
    fetchCustomerData();
    fetchHistoryData();
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
          setVehicleData(
            res2.data.filter(
              (
                vehicle: VehicleDataProps,
                index: number,
                self: VehicleDataProps[]
              ) =>
                index ===
                self.findIndex((v) => v.licensePlate === vehicle.licensePlate)
            )
          );
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

      console.log(res.data);

      if (res.status == 200) {
        setPolicyData(res.data);
        setShowPolicy(true);
        setActiveTab("policy");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchHistoryData() {
    try {
      const res = await axios.get("/Policy/GET/GetPolicyHistoryByClientId", {
        params: { clientId: clientId },
        withCredentials: true,
      });
      console.log(res.data);
      if (res.status == 200) {
        console.log(res.data);
        setHistoryData(res.data);
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
      editingData.phoneNumber !== customerData.phoneNumber ||
      editingData.address !== customerData.address
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

  // Generate initials for avatar
  const getInitials = () => {
    if (!customerData.firstName || !customerData.lastName) return "?";
    return `${customerData.firstName.charAt(0)}${customerData.lastName.charAt(
      0
    )}`;
  };

  console.log(policyData);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8" shadow="sm">
          <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <Skeleton
                isLoaded={loadedAllData}
                className="rounded-full h-16 w-16"
              >
                <Avatar
                  name={getInitials()}
                  size="lg"
                  color="primary"
                  isBordered
                  className="text-lg font-medium"
                />
              </Skeleton>

              {isEditingData ? (
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="Nome"
                      name="firstName"
                      variant="bordered"
                      radius="sm"
                      value={editingData.firstName}
                      onChange={(e) => handleEditCustomerData(e.target)}
                      startContent={
                        <Icon
                          icon="solar:user-linear"
                          width={16}
                          className="text-default-400"
                        />
                      }
                    />
                    <Input
                      label="Cognome"
                      name="lastName"
                      variant="bordered"
                      radius="sm"
                      value={editingData.lastName}
                      onChange={(e) => handleEditCustomerData(e.target)}
                      startContent={
                        <Icon
                          icon="solar:user-linear"
                          width={16}
                          className="text-default-400"
                        />
                      }
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    variant="bordered"
                    radius="sm"
                    value={editingData.email}
                    onChange={(e) => handleEditCustomerData(e.target)}
                    startContent={
                      <Icon
                        icon="solar:mailbox-linear"
                        width={16}
                        className="text-default-400"
                      />
                    }
                  />
                  <Input
                    label="Telefono"
                    name="phoneNumber"
                    variant="bordered"
                    radius="sm"
                    value={editingData.phoneNumber}
                    onChange={(e) => handleEditCustomerData(e.target)}
                    startContent={
                      <Icon
                        icon="solar:smartphone-2-linear"
                        width={16}
                        className="text-default-400"
                      />
                    }
                  />
                  <Input
                    label="Indirizzo"
                    name="address"
                    variant="bordered"
                    radius="sm"
                    value={editingData.address}
                    onChange={(e) => handleEditCustomerData(e.target)}
                    startContent={
                      <Icon
                        icon="solar:map-point-wave-linear"
                        width={16}
                        className="text-default-400"
                      />
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <Skeleton
                    isLoaded={loadedAllData}
                    className="h-7 w-full rounded-lg mb-1"
                  >
                    <h1 className="text-xl font-bold">
                      {customerData.firstName} {customerData.lastName}
                    </h1>
                  </Skeleton>
                  <Skeleton
                    isLoaded={loadedAllData}
                    className="h-5 w-full rounded-lg mb-1"
                  >
                    <div className="flex items-center gap-2 text-default-500">
                      <Icon icon="solar:mailbox-linear" width={16} />
                      <span>{customerData.email}</span>
                    </div>
                  </Skeleton>
                  <Skeleton
                    isLoaded={loadedAllData}
                    className="h-5 w-full rounded-lg mb-1"
                  >
                    <div className="flex items-center gap-2 text-default-500">
                      <Icon icon="solar:smartphone-2-linear" width={16} />
                      <span>{customerData.phoneNumber}</span>
                    </div>
                  </Skeleton>
                  <Skeleton
                    isLoaded={loadedAllData}
                    className="h-5 w-full rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-default-500">
                      <Icon icon="solar:map-point-wave-linear" width={16} />
                      <span>{customerData.address}</span>
                    </div>
                  </Skeleton>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isEditingData ? (
                <>
                  <Button
                    color="danger"
                    radius="full"
                    variant="flat"
                    startContent={
                      <Icon icon="mingcute:close-fill" width={16} />
                    }
                    onPress={clearEditingData}
                  >
                    Annulla
                  </Button>
                  <Button
                    color="success"
                    radius="full"
                    variant="solid"
                    startContent={
                      <Icon icon="mingcute:save-2-line" width={16} />
                    }
                    isDisabled={!checkEditedData()}
                    onPress={updateCustomerData}
                  >
                    Salva
                  </Button>
                </>
              ) : (
                <Skeleton isLoaded={loadedAllData} className="rounded-full">
                  <Button
                    color="primary"
                    radius="full"
                    variant="ghost"
                    startContent={<Icon icon="solar:pen-linear" width={16} />}
                    onPress={() => setIsEditingData(true)}
                  >
                    Modifica
                  </Button>
                </Skeleton>
              )}
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="px-0 py-0">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab as any}
              color="primary"
              variant="solid"
              className="pl-2 pt-2"
            >
              <Tab
                key="vehicles"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:car-bold" width={18} />
                    <span>Veicoli</span>
                    <Chip
                      size="sm"
                      variant="bordered"
                      color={activeTab === "vehicles" ? "secondary" : "default"}
                    >
                      {vehicleData.length}
                    </Chip>
                  </div>
                }
              >
                <div className="p-6 border-t">
                  <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Veicoli intestati</h2>
                    <div className="flex flex-row gap-2">
                      <Skeleton
                        isLoaded={loadedAllData}
                        className="rounded-full"
                      >
                        {vehicleData.length !== 0 ? (
                          <Button
                            as={Link}
                            color="primary"
                            variant="ghost"
                            radius="full"
                            href={`/customers/view-customer-data/${clientId}/edit-vehicles`}
                            startContent={
                              <Icon icon="solar:pen-linear" width={16} />
                            }
                          >
                            Modifica veicoli
                          </Button>
                        ) : (
                          <Button
                            as={Link}
                            color="primary"
                            radius="full"
                            href={`/customers/view-customer-data/${customerData.clientId}/add-vehicle`}
                            startContent={
                              <Icon icon="mingcute:add-fill" width={16} />
                            }
                          >
                            Aggiungi veicolo
                          </Button>
                        )}
                      </Skeleton>
                    </div>
                  </div>

                  {vehicleData.length !== 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vehicleData.map((vehicle: VehicleDataProps) => (
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
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-12 px-4 bg-default-50 rounded-lg">
                      <Icon
                        icon="mingcute:car-3-line"
                        width={64}
                        className="text-default-400 mb-4"
                      />
                      <h3 className="text-lg font-semibold text-center mb-2">
                        Nessun veicolo intestato
                      </h3>
                      <p className="text-sm text-default-500 text-center mb-6 max-w-md">
                        Questo cliente non ha ancora veicoli intestati. Aggiungi
                        un veicolo per continuare.
                      </p>
                      <Button
                        as={Link}
                        href={`/customers/view-customer-data/${customerData.clientId}/add-vehicle`}
                        color="primary"
                        radius="full"
                        startContent={
                          <Icon icon="mingcute:add-fill" width={16} />
                        }
                      >
                        Aggiungi nuovo veicolo
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>

              {historyData.length !== 0 && (
                <Tab
                  key="policy"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:shield-check-outline" width={18} />
                      <span>
                        {historyData.length === 1 ? "Polizza" : "Polizze"}
                      </span>
                      <Chip
                        size="sm"
                        variant="bordered"
                        color={activeTab === "policy" ? "secondary" : "default"}
                      >
                        {
                          historyData.filter((policy: PolicyDataProps) =>
                            selectedVehicleId
                              ? policy.licensePlate ===
                                vehicleData.find(
                                  (v) => v.vehicleId == selectedVehicleId
                                )?.licensePlate
                              : true
                          ).length
                        }
                      </Chip>
                    </div>
                  }
                  isDisabled={historyData.length === 0}
                >
                  <div className="flex flex-col gap-4 p-6 border-t">
                    {historyData.length !== 0 ? (
                      <>
                        {/* Show first policy in full */}
                        <VehiclePolicyCard
                          key={Number(policyData.policyId)}
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
                            note: policyData.note,
                            startSuspensionDate: policyData.startSuspensionDate,
                          }}
                          isVisible={showPolicy}
                        />

                        {historyData.length > 0 &&
                          historyData
                            .slice(selectedVehicleId ? 1 : 0)
                            .filter((policy: PolicyDataProps) =>
                              selectedVehicleId
                                ? policy.licensePlate ===
                                  vehicleData.find(
                                    (v) => v.vehicleId == selectedVehicleId
                                  )?.licensePlate
                                : true
                            ).length > 0 && (
                            <Accordion variant="bordered" className="mt-4">
                              {historyData
                                .filter((policy: PolicyDataProps) =>
                                  selectedVehicleId
                                    ? policy.licensePlate ===
                                      vehicleData.find(
                                        (v) => v.vehicleId == selectedVehicleId
                                      )?.licensePlate
                                    : true
                                )
                                .slice(selectedVehicleId ? 1 : 0)

                                .map((policy: PolicyDataProps) => (
                                  <AccordionItem
                                    key={policy.policyId}
                                    title={
                                      !selectedVehicleId
                                        ? policy.brand +
                                          " " +
                                          policy.model +
                                          " - " +
                                          policy.licensePlate
                                        : policy.companyName
                                    }
                                    subtitle={
                                      <div className="flex items-center gap-4 text-default-500">
                                        <span>
                                          {new Date(
                                            policy.startDate
                                          ).toLocaleDateString()}{" "}
                                          -{" "}
                                          {new Date(
                                            policy.endDate
                                          ).toLocaleDateString()}
                                        </span>
                                        <Chip
                                          color="primary"
                                          variant="bordered"
                                          radius="sm"
                                        >
                                          {policy.amount} €
                                        </Chip>
                                      </div>
                                    }
                                  >
                                    <VehiclePolicyCard
                                      PolicyData={{
                                        policyId: Number(policy.policyId),
                                        fullName: policy.fullName,
                                        email: policy.email,
                                        typeId: Number(policy.typeId),
                                        duration: Number(policy.duration),
                                        amount: Number(policy.amount),
                                        startDate: policy.startDate,
                                        endDate: policy.endDate,
                                        brand: policy.brand,
                                        model: policy.model,
                                        licensePlate: policy.licensePlate,
                                        status: policy.status,
                                        paymentStatus: policy.paymentStatus,
                                        companyName: policy.companyName,
                                        companyLogo: policy.companyLogo,
                                        types: policy.types,
                                        note: policy.note,
                                        startSuspensionDate:
                                          policy.startSuspensionDate,
                                      }}
                                      isVisible={true}
                                    />
                                  </AccordionItem>
                                ))}
                            </Accordion>
                          )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center py-12 px-4 bg-default-50 rounded-lg">
                        <Icon icon="mingcute:car-3-line" width={64} />
                      </div>
                    )}
                  </div>
                </Tab>
              )}
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
