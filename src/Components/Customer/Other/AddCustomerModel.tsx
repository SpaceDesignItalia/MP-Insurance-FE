import { useState } from "react";
import { Input, Progress, Button, cn } from "@nextui-org/react";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import axios from "axios";
import AlertCard from "../../Layout/AlertCard";

interface CustomerDataProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

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

export default function AddCustomerModel() {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [alertCardProps, setAlertCardProps] = useState<AlertCardProps>({
    isOpen: false,
    type: "",
    title: "",
    description: "",
  });
  const [customerData, setCustomerData] = useState<CustomerDataProps>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [vehicleData, setVehicleData] = useState<VehicleDataProps>({
    veichleTypeId: 0,
    brand: "",
    model: "",
    licensePlate: "",
  });

  const handleCustomerInputChange = (e: any) => {
    const { name, value } = e;

    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setCustomerData({ ...customerData, [name]: numericValue });
      }
    } else if (name === "email") {
      const emailValue = value.replace(/\s+/g, "");
      setCustomerData({ ...customerData, [name]: emailValue });
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

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

  async function handleCreateCustomer() {
    try {
      setIsSaving(true);
      const res = await axios.post(
        "/Customer/POST/CreateNewCustomer",
        {
          CustomerData: customerData,
          VehicleData: vehicleData,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        setAlertCardProps({
          ...alertCardProps,
          isOpen: true,
          type: "success",
          title: "Cliente aggiunto con successo!",
          description: "<p>Il cliente è stato creato correttamente!</p>",
        });

        setTimeout((window.location.href = "/customers"));
      }
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      setAlertCardProps({
        ...alertCardProps,
        isOpen: true,
        type: "error",
        title: "Errore nella creazione del cliente",
        description:
          "<p>C'è stato un problema nella creazione del cliente, riprova più tardi!</p>",
      });
    }
  }

  const handleVehicleTypeSelect = (typeId: number) => {
    setVehicleData({ ...vehicleData, veichleTypeId: typeId });
  };

  const progressValue = step === 1 ? 0 : 100;

  function checkCustomerDataCompleted() {
    return (
      customerData.firstName === "" ||
      customerData.lastName === "" ||
      customerData.email === "" ||
      customerData.phoneNumber.length !== 10
    );
  }

  function checkVehicleDataCompleted() {
    return (
      vehicleData.veichleTypeId === 0 ||
      vehicleData.brand === "" ||
      vehicleData.model === "" ||
      vehicleData.licensePlate.length !== 7
    );
  }

  return (
    <>
      <AlertCard AlertCardProps={alertCardProps} />
      <div className="mb-6">
        <Progress
          value={progressValue}
          color="primary"
          className="mb-4"
          size="sm"
        />
        <div className="flex justify-between text-sm font-medium">
          <span
            className={
              "text-primary flex flex-row gap-2 justify-center items-center"
            }
            aria-label="Cliente"
          >
            <PersonRoundedIcon /> Cliente
          </span>
          <span
            className={cn(
              step === 2
                ? "text-primary flex flex-row gap-2 justify-center items-center"
                : "text-gray-400 flex flex-row gap-2 justify-center items-center"
            )}
            aria-label="Veicolo"
          >
            <DirectionsCarRoundedIcon /> Veicolo
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Informazioni del cliente
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Compila tutti i campi necessari con le informazioni del cliente
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nome
                </label>
                <div className="mt-2">
                  <Input
                    name="firstName"
                    variant="bordered"
                    aria-labelledby="nome"
                    radius="sm"
                    placeholder="Mario"
                    onChange={(e) => handleCustomerInputChange(e.target)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cognome
                </label>
                <div className="mt-2">
                  <Input
                    name="lastName"
                    variant="bordered"
                    aria-labelledby="cognome"
                    radius="sm"
                    placeholder="Rossi"
                    onChange={(e) => handleCustomerInputChange(e.target)}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <Input
                    name="email"
                    variant="bordered"
                    aria-labelledby="email"
                    radius="sm"
                    placeholder="example@gmail.com"
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.email}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Numero di telefono
                </label>
                <div className="mt-2">
                  <Input
                    name="phoneNumber"
                    variant="bordered"
                    aria-label="telefono"
                    radius="sm"
                    placeholder="N. telefono"
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.phoneNumber}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
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
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-x-6">
        {step > 1 && (
          <Button
            radius="sm"
            color="primary"
            onClick={() => setStep(1)}
            startContent={<ArrowBackRoundedIcon />}
          >
            Indietro
          </Button>
        )}
        {step < 2 ? (
          <>
            <div />
            <Button
              radius="sm"
              color="primary"
              onClick={() => setStep(2)}
              isDisabled={checkCustomerDataCompleted()}
              endContent={<ArrowForwardRoundedIcon />}
            >
              Avanti
            </Button>
          </>
        ) : (
          <Button
            radius="sm"
            color="primary"
            isLoading={isSaving}
            isDisabled={checkVehicleDataCompleted()}
            startContent={!isSaving && <SaveRoundedIcon />}
            onClick={handleCreateCustomer}
          >
            Salva
          </Button>
        )}
      </div>
    </>
  );
}
