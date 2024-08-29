import { useState } from "react";
import { Input, Button, cn } from "@nextui-org/react";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import axios from "axios";
import AlertCard from "../../Layout/AlertCard";
import { useParams } from "react-router-dom";

interface VehicleDataProps {
  veichleTypeId: number;
  brand: string;
  model: string;
  licensePlate: string;
}

interface AlertCardProps {
  isOpen: boolean;
  type: string;
  title: string;
  description: string;
}

export default function AddVehicleModel() {
  const { clientId } = useParams();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alertCardProps, setAlertCardProps] = useState<AlertCardProps>({
    isOpen: false,
    type: "",
    title: "",
    description: "",
  });
  const [vehicleData, setVehicleData] = useState<VehicleDataProps>({
    veichleTypeId: 0,
    brand: "",
    model: "",
    licensePlate: "",
  });

  const handleVehicleInputChange = (e: any) => {
    const { name, value } = e;

    if (name === "licensePlate") {
      const licensePlateValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (licensePlateValue.length <= 7) {
        setVehicleData({ ...vehicleData, [name]: licensePlateValue });
      }
    } else {
      setVehicleData({ ...vehicleData, [name]: value });
    }
  };

  const handleVehicleTypeSelect = (typeId: number) => {
    setVehicleData({ ...vehicleData, veichleTypeId: typeId });
  };

  function checkVehicleDataCompleted() {
    return (
      vehicleData.veichleTypeId === 0 ||
      vehicleData.brand === "" ||
      vehicleData.model === "" ||
      vehicleData.licensePlate.length !== 7
    );
  }

  async function handleCreateVehicle() {
    try {
      setIsSaving(true);
      const res = await axios.post(
        "/Vehicle/POST/AddNewVehicle",
        {
          clientId: clientId,
          vehicleData: vehicleData,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        setAlertCardProps({
          ...alertCardProps,
          isOpen: true,
          type: "success",
          title: "Veicolo aggiunto con successo!",
          description: "<p>Il veicolo è stato aggiunto correttamente!</p>",
        });

        setTimeout(
          (window.location.href = "/customers/view-customer-data/" + clientId)
        );
      }
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setAlertCardProps({
        ...alertCardProps,
        isOpen: true,
        type: "error",
        title: "Errore nell'aggiunta del veicolo",
        description:
          "<p>C'è stato un problema nell'aggiunta del veicolo, riprova più tardi!</p>",
      });
    }
  }

  return (
    <>
      <AlertCard AlertCardProps={alertCardProps} />
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Informazioni del veicolo
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Compila tutti i campi necessari con le informazioni del veicolo
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-6">
              <label
                htmlFor="vehicle-make"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tipo di veicolo
              </label>
              <div className="mt-2 flex gap-4 items-center justify-center">
                <button
                  type="button"
                  aria-label="Seleziona Auto"
                  className={cn(
                    "flex flex-col gap-3 justify-center items-center h-56 w-56 border-2 shadow-xl rounded-xl",
                    vehicleData.veichleTypeId === 2
                      ? "bg-primary text-white"
                      : "bg-white text-gray-900"
                  )}
                  onClick={() => handleVehicleTypeSelect(2)}
                >
                  <DirectionsCarRoundedIcon sx={{ fontSize: 50 }} />
                  Auto
                </button>
                <button
                  type="button"
                  aria-label="Seleziona Moto"
                  className={cn(
                    "flex flex-col gap-3 justify-center items-center h-56 w-56 border-2 shadow-xl rounded-xl",
                    vehicleData.veichleTypeId === 1
                      ? "bg-primary text-white"
                      : "bg-white text-gray-900"
                  )}
                  onClick={() => handleVehicleTypeSelect(1)}
                >
                  <TwoWheelerRoundedIcon sx={{ fontSize: 50 }} />
                  Moto
                </button>
              </div>
            </div>
            {vehicleData.veichleTypeId != 0 && (
              <>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="vehicle-make"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Marca del veicolo
                  </label>
                  <div className="mt-2">
                    <Input
                      name="brand"
                      variant="bordered"
                      aria-labelledby="marca veicolo"
                      radius="sm"
                      placeholder="Inserisci la marca"
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.brand}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="vehicle-model"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Modello del veicolo
                  </label>
                  <div className="mt-2">
                    <Input
                      name="model"
                      variant="bordered"
                      aria-labelledby="modello veicolo"
                      radius="sm"
                      placeholder="Inserisci il modello"
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.model}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="vehicle-license-plate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Targa del veicolo
                  </label>
                  <div className="mt-2">
                    <Input
                      name="licensePlate"
                      variant="bordered"
                      aria-labelledby="targa veicolo"
                      radius="sm"
                      placeholder={
                        vehicleData.veichleTypeId == 1 ? "AA000AA" : "AA00000"
                      }
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.licensePlate}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <Button
            radius="sm"
            color="primary"
            isLoading={isSaving}
            isDisabled={checkVehicleDataCompleted()}
            startContent={!isSaving && <SaveRoundedIcon />}
            onClick={handleCreateVehicle}
          >
            Salva
          </Button>
        </div>
      </div>
    </>
  );
}
