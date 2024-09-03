import { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Link, Skeleton } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VehiecleCard from "./VehiecleCard";
import VehicleInfoCard from "./VehicleInfoCard";

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

interface SelectedVehicleDataProps {
  vehicleId: number;
  brand: string;
  model: string;
  licensePlate: string;
  typeId: number;
}

const SELECTEDVEHICLEDEFAULT = {
  vehicleId: 0,
  brand: "",
  model: "",
  licensePlate: "",
  typeId: 0,
};

export default function EditCustomerVehiclesModel() {
  const { clientId } = useParams();
  const [loadedAllData, setLoadedAllData] = useState<boolean>(false);

  const [vehicleData, setVehicleData] = useState<VehicleDataProps[]>([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<SelectedVehicleDataProps>(SELECTEDVEHICLEDEFAULT);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCustomerVehicles();
  }, []);

  async function fetchCustomerVehicles() {
    try {
      const res = await axios.get("/Vehicle/GET/GetClientVehicles", {
        params: { clientId: clientId },
        withCredentials: true,
      });

      if (res.status == 200) {
        setVehicleData(res.data);
        setLoadedAllData(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getVehicleData(selectedVehicleId: number) {
    try {
      const res = await axios.get("/Vehicle/GET/GetVehicleById", {
        params: { vehicleId: selectedVehicleId },
        withCredentials: true,
      });
      if (res.status == 200) {
        setSelectedVehicle(res.data);
        setIsVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteVehicle(selectedVehicleId: number) {
    try {
      const res = await axios.delete("/Vehicle/DELETE/DeleteVehicle", {
        params: { selectedVehicleId: selectedVehicleId },
        withCredentials: true,
      });

      if (res.status === 200) {
        setLoadedAllData(false);
        setIsVisible(false);
        fetchCustomerVehicles();
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
      setIsVisible(false);
      setSelectedVehicleId(null);
      setSelectedVehicle(SELECTEDVEHICLEDEFAULT);
    } else {
      // Altrimenti seleziona il veicolo cliccato
      setSelectedVehicleId(vehicleId);
      getVehicleData(vehicleId);
    }
  };

  async function handleUpdateVehicleData(editedData: SelectedVehicleDataProps) {
    try {
      const res = await axios.put(
        "/Vehicle/UPDATE/UpdateVehicleData",
        { vehicleData: editedData },
        { withCredentials: true }
      );

      if (res.status == 200) {
        fetchCustomerVehicles();
        setSelectedVehicleId(null);
        setSelectedVehicle(SELECTEDVEHICLEDEFAULT);
        setIsVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <div className="flex flex-col gap-3 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-semibold">Elenco veicoli</h1>
          <div className="flex flex-row gap-5">
            <Skeleton isLoaded={loadedAllData} className="rounded-lg">
              <Button
                as={Link}
                color="primary"
                radius="sm"
                startContent={<AddRoundedIcon />}
                href={
                  "/customers/view-customer-data/" + clientId + "/add-vehicle"
                }
              >
                Aggiungi veicolo
              </Button>
            </Skeleton>
          </div>
        </div>
        <div className="mt-4 sm:mx-auto grid max-w-2xl  grid-cols-1 sm:grid-cols-2 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 justify-center">
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
                    variant="edit"
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
          <VehicleInfoCard
            VehicleData={{
              vehicleId: Number(selectedVehicle.vehicleId),
              brand: selectedVehicle.brand,
              model: selectedVehicle.model,
              licensePlate: selectedVehicle.licensePlate,
              typeId: Number(selectedVehicle.typeId),
            }}
            isVisible={isVisible}
            handleDeleteVehicle={handleDeleteVehicle}
            handleUpdateVehicleData={handleUpdateVehicleData}
          />
        </div>
      </div>
    </main>
  );
}
