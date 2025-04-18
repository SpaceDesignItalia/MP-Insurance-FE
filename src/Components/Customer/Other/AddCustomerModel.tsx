import { useState } from "react";
import {
  Input,
  Progress,
  Button,
  cn,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
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

        setTimeout(() => {
          window.location.href = "/customers";
        }, 1500);
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

  const progressValue = step === 1 ? 50 : 100;

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

      <Card className="shadow-md border border-gray-200 max-w-4xl mx-auto">
        <CardHeader className="flex flex-col gap-2 pb-0 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 ? "Nuovo Cliente" : "Nuovo Veicolo"}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`h-0.5 w-4 ${
                  step >= 2 ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-full ${
                  step >= 2
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </div>
          </div>

          <Progress
            value={progressValue}
            color="primary"
            className="mb-2"
            size="md"
            radius="full"
            classNames={{
              indicator:
                step === 2 ? "bg-gradient-to-r from-primary to-success" : "",
              base: "bg-gray-100",
            }}
          />

          <div className="flex justify-between text-xs text-gray-500 mb-4 px-1">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>
              Dati Cliente
            </span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>
              Dati Veicolo
            </span>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="py-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Icon icon="solar:user-rounded-bold" width={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Informazioni del cliente
                  </h3>
                  <p className="text-sm leading-5 text-gray-600">
                    Compila tutti i campi necessari con le informazioni del
                    cliente
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Nome
                  </label>
                  <Input
                    name="firstName"
                    variant="bordered"
                    aria-labelledby="nome"
                    radius="sm"
                    placeholder="Mario"
                    startContent={
                      <Icon
                        icon="solar:user-linear"
                        width={18}
                        className="text-gray-400"
                      />
                    }
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.firstName}
                    classNames={{
                      inputWrapper: "shadow-sm border-gray-300",
                      input: "placeholder:text-gray-400",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Cognome
                  </label>
                  <Input
                    name="lastName"
                    variant="bordered"
                    aria-labelledby="cognome"
                    radius="sm"
                    placeholder="Rossi"
                    startContent={
                      <Icon
                        icon="solar:user-linear"
                        width={18}
                        className="text-gray-400"
                      />
                    }
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.lastName}
                    classNames={{
                      inputWrapper: "shadow-sm border-gray-300",
                      input: "placeholder:text-gray-400",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    variant="bordered"
                    aria-labelledby="email"
                    radius="sm"
                    placeholder="example@gmail.com"
                    startContent={
                      <Icon
                        icon="solar:letter-linear"
                        width={18}
                        className="text-gray-400"
                      />
                    }
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.email}
                    classNames={{
                      inputWrapper: "shadow-sm border-gray-300",
                      input: "placeholder:text-gray-400",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Numero di telefono
                  </label>
                  <Input
                    name="phoneNumber"
                    variant="bordered"
                    aria-label="telefono"
                    radius="sm"
                    placeholder="3401234567"
                    startContent={
                      <Icon
                        icon="solar:phone-linear"
                        width={18}
                        className="text-gray-400"
                      />
                    }
                    endContent={
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 font-medium">
                        {customerData.phoneNumber.length}/10
                      </div>
                    }
                    onChange={(e) => handleCustomerInputChange(e.target)}
                    value={customerData.phoneNumber}
                    classNames={{
                      inputWrapper: "shadow-sm border-gray-300",
                      input: "placeholder:text-gray-400",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
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
                      "flex flex-col gap-3 justify-center items-center p-8 border-2 rounded-xl transition-all duration-200",
                      vehicleData.veichleTypeId === 2
                        ? "bg-primary/10 border-primary text-primary shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                    )}
                    onClick={() => handleVehicleTypeSelect(2)}
                  >
                    <Icon
                      icon="solar:car-bold"
                      width={48}
                      className={
                        vehicleData.veichleTypeId === 2
                          ? "text-primary"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-medium">Auto</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Seleziona Moto"
                    className={cn(
                      "flex flex-col gap-3 justify-center items-center p-8 border-2 rounded-xl transition-all duration-200",
                      vehicleData.veichleTypeId === 1
                        ? "bg-primary/10 border-primary text-primary shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                    )}
                    onClick={() => handleVehicleTypeSelect(1)}
                  >
                    <Icon
                      icon="solar:motorbike-bold"
                      width={48}
                      className={
                        vehicleData.veichleTypeId === 1
                          ? "text-primary"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-medium">Moto</span>
                  </button>
                </div>
              </div>

              {vehicleData.veichleTypeId !== 0 && (
                <div className="space-y-6 animate-in fade-in duration-300 pt-2">
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
                        <Icon
                          icon="solar:car-bold-duotone"
                          width={18}
                          className="text-gray-400"
                        />
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
                        <Icon
                          icon="solar:slider-horizontal-minimalistic-linear"
                          width={18}
                          className="text-gray-400"
                        />
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
                        <Icon
                          icon="solar:bookmark-square-linear"
                          width={18}
                          className="text-gray-400"
                        />
                      }
                      onChange={(e) => handleVehicleInputChange(e.target)}
                      value={vehicleData.licensePlate}
                      description={
                        <div className="flex justify-between mt-1">
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
                            {vehicleData.licensePlate.length}/7
                          </span>
                        </div>
                      }
                      classNames={{
                        inputWrapper: "shadow-sm border-gray-300",
                        input: "placeholder:text-gray-400",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-between py-4">
          {step > 1 ? (
            <Button
              radius="full"
              variant="flat"
              color="primary"
              onClick={() => setStep(1)}
              startContent={<Icon icon="solar:arrow-left-linear" width={18} />}
            >
              Indietro
            </Button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <Button
              radius="full"
              color="primary"
              onClick={() => setStep(2)}
              isDisabled={checkCustomerDataCompleted()}
              endContent={<Icon icon="solar:arrow-right-linear" width={18} />}
            >
              Avanti
            </Button>
          ) : (
            <Button
              radius="full"
              color="primary"
              isLoading={isSaving}
              isDisabled={checkVehicleDataCompleted()}
              startContent={
                !isSaving && <Icon icon="solar:diskette-linear" width={18} />
              }
              onClick={handleCreateCustomer}
            >
              Salva Cliente
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
