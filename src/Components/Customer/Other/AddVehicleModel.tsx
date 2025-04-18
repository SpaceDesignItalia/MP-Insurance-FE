import { useState } from "react";
import {
  Input,
  Button,
  cn,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import AlertCard from "../../Layout/AlertCard";
import { useParams, Link } from "react-router-dom";

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
    const isValid =
      vehicleData.veichleTypeId !== 0 &&
      vehicleData.brand.trim() !== "" &&
      vehicleData.model.trim() !== "" &&
      vehicleData.licensePlate.length === 7;

    return !isValid;
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

        setTimeout(() => {
          window.location.href = "/customers/view-customer-data/" + clientId;
        }, 1500);
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

      <div className="mb-6">
        <Breadcrumbs size="sm">
          <BreadcrumbItem>
            <Link to="/customers" className="text-gray-500 hover:text-primary">
              <Icon
                icon="solar:users-group-rounded-linear"
                className="mr-1"
                width={16}
              />
              Clienti
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link
              to={`/customers/view-customer-data/${clientId}`}
              className="text-gray-500 hover:text-primary"
            >
              <Icon
                icon="solar:user-rounded-linear"
                className="mr-1"
                width={16}
              />
              Dettaglio Cliente
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span className="text-primary font-medium flex items-center">
              <Icon icon="solar:car-linear" className="mr-1" width={16} />
              Nuovo Veicolo
            </span>
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <Card className="shadow-md border border-gray-200 max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Icon icon="solar:car-bold" width={24} />
              Aggiungi Nuovo Veicolo
            </h2>
          </div>
        </CardHeader>

        <CardBody className="py-6 px-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Icon icon="solar:car-bold" width={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Informazioni del veicolo
                </h3>
                <p className="text-sm leading-5 text-gray-600">
                  Compila tutti i campi necessari con le informazioni del
                  veicolo
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="vehicle-type"
                className="block text-sm font-medium leading-6 text-gray-900 mb-3"
              >
                Tipo di veicolo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  aria-label="Seleziona Auto"
                  className={cn(
                    "relative group overflow-hidden flex flex-col gap-3 justify-center items-center p-8 border-2 rounded-xl transition-all duration-200",
                    vehicleData.veichleTypeId === 2
                      ? "bg-primary text-white border-primary shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/50"
                  )}
                  onClick={() => handleVehicleTypeSelect(2)}
                >
                  {vehicleData.veichleTypeId === 2 && (
                    <div className="absolute top-2 right-2">
                      <Icon icon="solar:check-circle-bold" width={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-full p-4 mb-2 transition-all duration-200",
                      vehicleData.veichleTypeId === 2
                        ? "bg-white/20"
                        : "bg-primary/5 group-hover:bg-primary/10"
                    )}
                  >
                    <Icon
                      icon="solar:car-bold"
                      width={48}
                      className={
                        vehicleData.veichleTypeId === 2
                          ? "text-white"
                          : "text-primary"
                      }
                    />
                  </div>
                  <span className="font-semibold text-lg">Auto</span>
                  <span className="text-xs opacity-80">
                    Automobili, SUV, furgoni...
                  </span>
                </button>

                <button
                  type="button"
                  aria-label="Seleziona Moto"
                  className={cn(
                    "relative group overflow-hidden flex flex-col gap-3 justify-center items-center p-8 border-2 rounded-xl transition-all duration-200",
                    vehicleData.veichleTypeId === 1
                      ? "bg-primary text-white border-primary shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary/50"
                  )}
                  onClick={() => handleVehicleTypeSelect(1)}
                >
                  {vehicleData.veichleTypeId === 1 && (
                    <div className="absolute top-2 right-2">
                      <Icon icon="solar:check-circle-bold" width={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-full p-4 mb-2 transition-all duration-200",
                      vehicleData.veichleTypeId === 1
                        ? "bg-white/20"
                        : "bg-primary/5 group-hover:bg-primary/10"
                    )}
                  >
                    <Icon
                      icon="solar:motorbike-bold"
                      width={48}
                      className={
                        vehicleData.veichleTypeId === 1
                          ? "text-white"
                          : "text-primary"
                      }
                    />
                  </div>
                  <span className="font-semibold text-lg">Moto</span>
                  <span className="text-xs opacity-80">
                    Motociclette, scooter, ciclomotori...
                  </span>
                </button>
              </div>
            </div>

            {vehicleData.veichleTypeId !== 0 && (
              <div className="space-y-6 animate-in fade-in duration-300 pt-4">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                    >
                      Marca del veicolo
                    </label>
                    <Input
                      name="brand"
                      variant="bordered"
                      aria-labelledby="marca veicolo"
                      radius="sm"
                      placeholder="Es. Fiat, BMW, Honda..."
                      startContent={
                        <div className="bg-primary/10 p-1 rounded">
                          <Icon
                            icon="solar:bookmark-square-bold"
                            width={18}
                            className="text-primary"
                          />
                        </div>
                      }
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.brand}
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300",
                        input: "placeholder:text-gray-400",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="model"
                      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                    >
                      Modello del veicolo
                    </label>
                    <Input
                      name="model"
                      variant="bordered"
                      aria-labelledby="modello veicolo"
                      radius="sm"
                      placeholder="Es. Panda, Serie 3, CBR..."
                      startContent={
                        <div className="bg-primary/10 p-1 rounded">
                          <Icon
                            icon="solar:slider-horizontal-bold"
                            width={18}
                            className="text-primary"
                          />
                        </div>
                      }
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.model}
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300",
                        input: "placeholder:text-gray-400",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licensePlate"
                      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                    >
                      Targa del veicolo
                    </label>
                    <Input
                      name="licensePlate"
                      variant="bordered"
                      aria-labelledby="targa veicolo"
                      radius="sm"
                      placeholder={
                        vehicleData.veichleTypeId === 1 ? "AA000AA" : "AA00000"
                      }
                      startContent={
                        <div className="bg-primary/10 p-1 rounded">
                          <Icon
                            icon="solar:licence-bold"
                            width={18}
                            className="text-primary"
                          />
                        </div>
                      }
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.licensePlate}
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300",
                        input: "placeholder:text-gray-400 uppercase",
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Formato:{" "}
                        {vehicleData.veichleTypeId === 1
                          ? "AA000AA"
                          : "AA00000"}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          vehicleData.licensePlate.length === 7
                            ? "text-success"
                            : "text-gray-500"
                        }`}
                      >
                        {vehicleData.licensePlate.length}/7 caratteri
                        {vehicleData.licensePlate.length === 7 && (
                          <Icon
                            icon="solar:check-circle-bold"
                            className="ml-1 text-success"
                            width={14}
                            inline={true}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-between py-4 px-8 bg-gray-50">
          <Button
            radius="full"
            variant="flat"
            color="default"
            as={Link}
            to={`/customers/view-customer-data/${clientId}`}
            startContent={<Icon icon="solar:arrow-left-linear" width={18} />}
          >
            Annulla
          </Button>

          <Button
            radius="full"
            color="primary"
            isLoading={isSaving}
            isDisabled={checkVehicleDataCompleted()}
            startContent={
              !isSaving && <Icon icon="solar:diskette-bold" width={18} />
            }
            onClick={handleCreateVehicle}
            className={!checkVehicleDataCompleted() ? "shadow-lg" : ""}
          >
            {isSaving ? "Salvataggio..." : "Salva Veicolo"}
          </Button>
        </CardFooter>
      </Card>

      {/* Preview panel */}
      {vehicleData.veichleTypeId !== 0 &&
        vehicleData.brand &&
        vehicleData.model && (
          <div className="mt-6 max-w-4xl mx-auto">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Anteprima veicolo
                </h3>
              </CardHeader>
              <CardBody className="py-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon
                      icon={
                        vehicleData.veichleTypeId === 1
                          ? "solar:motorbike-bold"
                          : "solar:car-bold"
                      }
                      width={36}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {vehicleData.brand} {vehicleData.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicleData.licensePlate.length === 7
                        ? vehicleData.licensePlate
                        : "Targa non completa"}
                      <span className="mx-2">•</span>
                      {vehicleData.veichleTypeId === 1 ? "Moto" : "Auto"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
    </>
  );
}
