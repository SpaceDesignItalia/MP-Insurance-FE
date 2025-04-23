import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Chip,
  DatePicker,
  DateValue,
  Divider,
  Input,
  Select,
  SelectItem,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getLocalTimeZone } from "@internationalized/date";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { API_URL_IMG } from "../../../API/API";
import AlertCard from "../../Layout/AlertCard";

interface FormData {
  step: number;
  clientId: number | null;
  vehicleId: number | null;
  companyId: number | null;
  insuranceTypeIds: number[] | null;
  startDate: DateValue | string | null;
  duration: number | null;
  amount: number | null;
  note: string;
}

interface FormState {
  customers: any[];
  vehicles: any[];
  companies: any[];
  insuranceTypes: any[];
  isSaving: boolean;
  alertCard: {
    isOpen: boolean;
    type: string;
    title: string;
    description: string;
  };
}

export default function AddPolicyModel() {
  const [formData, setFormData] = useState<FormData>({
    step: 1,
    clientId: null,
    vehicleId: null,
    companyId: null,
    insuranceTypeIds: null,
    startDate: null,
    duration: null,
    amount: null,
    note: "",
  });

  const [formState, setFormState] = useState<FormState>({
    customers: [],
    vehicles: [],
    companies: [],
    insuranceTypes: [],
    isSaving: false,
    alertCard: {
      isOpen: false,
      type: "",
      title: "",
      description: "",
    },
  });

  const dateFormatter = (date: DateValue | string | null): string => {
    if (date instanceof Object && "toDate" in date) {
      return dayjs(date.toDate(getLocalTimeZone())).format("YYYY-MM-DD");
    } else if (typeof date === "string") {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return "";
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStepChange = (direction: "next" | "prev") => {
    setFormData((prev) => ({
      ...prev,
      step: direction === "next" ? prev.step + 1 : prev.step - 1,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(
          formData.clientId && formData.vehicleId && formData.companyId
        );
      case 2:
        return Boolean(
          formData.insuranceTypeIds?.length &&
            formData.startDate &&
            formData.duration &&
            formData.amount
        );
      default:
        return true;
    }
  };

  useEffect(() => {
    axios
      .get("/Customer/GET/GetAllCustomers", { withCredentials: true })
      .then((res) => {
        setFormState((prev) => ({ ...prev, customers: res.data }));
      });

    axios
      .get("/Company/GET/GetAllCompanies", { withCredentials: true })
      .then((res) => {
        setFormState((prev) => ({ ...prev, companies: res.data }));
      });

    axios
      .get("/Company/GET/GetAllInsuranceTypes", { withCredentials: true })
      .then((res) => {
        setFormState((prev) => ({ ...prev, insuranceTypes: res.data }));
      });
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      axios
        .get("/Vehicle/GET/GetClientVehiclesUninsured", {
          params: {
            clientId: formData.clientId,
          },
          withCredentials: true,
        })
        .then((res) => {
          setFormState((prev) => ({ ...prev, vehicles: res.data }));
        });
    }
  }, [formData.clientId]);

  const handleCreateNewPolicy = async () => {
    try {
      setFormState((prev) => ({ ...prev, isSaving: true }));
      const formattedStartDate = dateFormatter(formData.startDate);
      const endDate =
        formattedStartDate && formData.duration
          ? dayjs(formattedStartDate)
              .add(formData.duration, "month")
              .format("YYYY-MM-DD")
          : null;

      const policyData = {
        ...formData,
        startDate: formattedStartDate,
        endDate,
      };

      const res = await axios.post(
        "/Policy/POST/AddPolicy",
        { policyData },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setFormState((prev) => ({
          ...prev,
          alertCard: {
            isOpen: true,
            type: "success",
            title: "Polizza aggiunta con successo!",
            description: "<p>La polizza è stata creata correttamente!</p>",
          },
        }));
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch (error) {
      console.error("Errore durante la creazione della polizza:", error);
      setFormState((prev) => ({
        ...prev,
        alertCard: {
          isOpen: true,
          type: "error",
          title: "Errore nella creazione della polizza",
          description:
            "<p>C'è stato un problema nella creazione della polizza, riprova più tardi!</p>",
        },
        isSaving: false,
      }));
    }
  };

  const getSelectedData = () => {
    const customer = formState.customers.find(
      (c) => c.clientId == formData.clientId
    );
    const vehicle = formState.vehicles.find(
      (v) => v.vehicleId == formData.vehicleId
    );
    const selectedTypes = formState.insuranceTypes.filter((t) =>
      formData.insuranceTypeIds?.includes(Number(t.insuranceTypeId))
    );
    const endDate =
      formData.startDate && formData.duration
        ? dayjs(dateFormatter(formData.startDate))
            .add(formData.duration, "month")
            .format("DD/MM/YYYY")
        : null;

    return { customer, vehicle, selectedTypes, endDate };
  };

  const renderRequiredLabel = (label: string) => (
    <div className="flex items-center gap-1">
      <span className="block text-sm font-medium text-gray-900">{label}</span>
      <span className="text-danger">*</span>
    </div>
  );

  const renderStepContent = () => {
    const { customer, vehicle, selectedTypes, endDate } = getSelectedData();

    const stepContents = {
      1: (
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Icon icon="solar:users-group-rounded-linear" width={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Informazioni di Base
              </h3>
              <p className="text-sm leading-5 text-gray-600">
                Seleziona il cliente, il veicolo e la compagnia assicurativa
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              {renderRequiredLabel("Cliente")}
              <div className="mt-2">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca per email..."
                  defaultItems={formState.customers}
                  selectedKey={formData.clientId?.toString()}
                  defaultSelectedKey={formData.clientId?.toString()}
                  onSelectionChange={(value) => {
                    handleChange("clientId", Number(value));
                    handleChange("vehicleId", null);
                  }}
                  startContent={
                    <div className="bg-primary/10 p-1 rounded">
                      <Icon
                        icon="solar:user-linear"
                        className="text-primary"
                        width={18}
                      />
                    </div>
                  }
                  classNames={{
                    base: "shadow-sm border-gray-300",
                  }}
                  className="w-full"
                >
                  {(customer) => (
                    <AutocompleteItem
                      key={customer.clientId.toString()}
                      textValue={`${customer.firstName} ${customer.lastName} - ${customer.email}`}
                      className="data-[selected=true]:bg-primary/10"
                    >
                      <User
                        name={`${customer.firstName} ${customer.lastName}`}
                        description={customer.email}
                        avatarProps={{
                          src: `https://api.dicebear.com/6.x/initials/svg?seed=${customer.firstName} ${customer.lastName}`,
                          className: "bg-primary text-white",
                        }}
                      />
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            <div>
              {renderRequiredLabel("Veicolo")}
              <div className="mt-2">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca per targa..."
                  defaultItems={formState.vehicles}
                  selectedKey={formData.vehicleId?.toString()}
                  defaultSelectedKey={formData.vehicleId?.toString()}
                  onSelectionChange={(value) =>
                    handleChange("vehicleId", Number(value))
                  }
                  startContent={
                    <div className="bg-primary/10 p-1 rounded">
                      <Icon
                        icon="mingcute:car-3-line"
                        className="text-primary"
                        width={18}
                      />
                    </div>
                  }
                  listboxProps={{
                    emptyContent: "Nessun veicolo trovato",
                  }}
                  classNames={{
                    base: "shadow-sm border-gray-300",
                  }}
                  className="w-full"
                >
                  {(vehicle) => (
                    <AutocompleteItem
                      key={vehicle.vehicleId.toString()}
                      textValue={`${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}`}
                      className="data-[selected=true]:bg-primary/10"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {vehicle.brand} {vehicle.model}
                        </span>
                        <span className="text-xs text-default-500">
                          Targa: {vehicle.licensePlate}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            <div>
              {renderRequiredLabel("Compagnia")}
              <div className="mt-2">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca compagnia..."
                  defaultItems={formState.companies}
                  selectedKey={formData.companyId?.toString()}
                  defaultSelectedKey={formData.companyId?.toString()}
                  onSelectionChange={(value) =>
                    handleChange("companyId", Number(value))
                  }
                  startContent={
                    <div className="bg-primary/10 p-1 rounded">
                      <Icon
                        icon="solar:buildings-3-linear"
                        className="text-primary"
                        width={18}
                      />
                    </div>
                  }
                  classNames={{
                    base: "shadow-sm border-gray-300",
                  }}
                  className="w-full"
                >
                  {(company) => (
                    <AutocompleteItem
                      key={company.companyId.toString()}
                      textValue={company.companyName}
                      className="data-[selected=true]:bg-primary/10"
                    >
                      <User
                        name={company.companyName}
                        avatarProps={{
                          src:
                            company.companyLogo &&
                            API_URL_IMG + "/CompanyLogo/" + company.companyLogo,
                          isBordered: true,
                          className: "bg-white",
                        }}
                      />
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>
          </div>
        </div>
      ),
      2: (
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Icon icon="solar:shield-keyhole-linear" width={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Dettagli Polizza
              </h3>
              <p className="text-sm leading-5 text-gray-600">
                Inserisci i dettagli della polizza assicurativa
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              {renderRequiredLabel("Garanzie assicurative")}
              <div className="mt-2">
                <Select
                  placeholder="Seleziona le garanzie assicurative"
                  variant="bordered"
                  radius="sm"
                  selectionMode="multiple"
                  selectedKeys={formData.insuranceTypeIds?.map(String) ?? []}
                  onSelectionChange={(value) =>
                    handleChange("insuranceTypeIds", [...value].map(Number))
                  }
                  startContent={
                    <div className="bg-primary/10 p-1 rounded">
                      <Icon
                        icon="solar:shield-keyhole-linear"
                        className="text-primary"
                        width={18}
                      />
                    </div>
                  }
                  classNames={{
                    base: "shadow-sm border-gray-300",
                  }}
                >
                  {formState.insuranceTypes.map((type) => (
                    <SelectItem key={type.insuranceTypeId.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderRequiredLabel("Data di inizio")}
                <div className="mt-2">
                  <DatePicker
                    variant="bordered"
                    radius="sm"
                    value={formData.startDate as DateValue}
                    onChange={(date) => handleChange("startDate", date)}
                    classNames={{
                      base: "shadow-sm border-gray-300",
                    }}
                  />
                </div>
              </div>

              <div>
                {renderRequiredLabel("Frazionamento")}
                <div className="mt-2">
                  <Select
                    placeholder="Seleziona"
                    variant="bordered"
                    radius="sm"
                    selectedKeys={
                      formData.duration ? [formData.duration.toString()] : []
                    }
                    onSelectionChange={(value) =>
                      handleChange("duration", Number([...value][0]))
                    }
                    startContent={
                      <div className="bg-primary/10 p-1 rounded">
                        <Icon
                          icon="solar:calendar-linear"
                          className="text-primary"
                          width={18}
                        />
                      </div>
                    }
                    classNames={{
                      base: "shadow-sm border-gray-300",
                    }}
                  >
                    <SelectItem key="6">6 mesi</SelectItem>
                    <SelectItem key="12">12 mesi</SelectItem>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              {renderRequiredLabel("Importo")}
              <div className="mt-2">
                <Input
                  type="number"
                  variant="bordered"
                  radius="sm"
                  placeholder="Es. 500"
                  value={formData.amount?.toString() || ""}
                  onChange={(event) =>
                    handleChange(
                      "amount",
                      Math.max(Number(event.target.value), 0)
                    )
                  }
                  startContent={
                    <div className="bg-primary/10 p-1 rounded">
                      <Icon
                        icon="solar:wallet-money-linear"
                        className="text-primary"
                        width={18}
                      />
                    </div>
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">€</span>
                    </div>
                  }
                  classNames={{
                    base: "shadow-sm border-gray-300",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Note (opzionale)
              </label>
              <Card className="border border-gray-200">
                <CardBody>
                  <ReactQuill
                    theme="snow"
                    value={formData.note}
                    onChange={(value) => handleChange("note", value)}
                    className="min-h-[200px]"
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      ),
      3: (
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Icon icon="solar:eye-linear" width={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Anteprima Polizza
              </h3>
              <p className="text-sm leading-5 text-gray-600">
                Verifica i dettagli prima di salvare
              </p>
            </div>
          </div>

          {customer && (
            <div className="bg-zinc-100 rounded-xl p-4">
              <User
                name={`${customer.firstName} ${customer.lastName}`}
                description={customer.email}
                avatarProps={{
                  radius: "lg",
                  src: `https://api.dicebear.com/6.x/initials/svg?seed=${customer.firstName} ${customer.lastName}`,
                  className: "bg-primary text-white",
                }}
                className="justify-start"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card shadow="sm" className="border border-gray-200">
              <CardBody className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Icon
                      icon="solar:calendar-linear"
                      className="text-primary"
                      width={24}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Scadenza</p>
                  <p className="text-lg font-semibold">{endDate}</p>
                </div>
              </CardBody>
            </Card>

            <Card shadow="sm" className="border border-gray-200">
              <CardBody className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Icon
                      icon="mingcute:car-3-line"
                      className="text-primary"
                      width={24}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Veicolo</p>
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {vehicle?.licensePlate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {vehicle?.brand} {vehicle?.model}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card shadow="sm" className="border border-gray-200">
              <CardBody className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Icon
                      icon="solar:wallet-money-linear"
                      className="text-primary"
                      width={24}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Importo</p>
                  <p className="text-lg font-semibold">{formData.amount} €</p>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="border border-gray-200">
            <CardBody className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Dettagli Polizza</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Durata</p>
                    <p className="font-medium">{formData.duration} mesi</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data Inizio</p>
                    <p className="font-medium">
                      {dayjs(dateFormatter(formData.startDate)).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data Fine</p>
                    <p className="font-medium">{endDate}</p>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Garanzie Assicurative
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Chip
                      key={type.insuranceTypeId}
                      color="primary"
                      variant="bordered"
                      radius="sm"
                    >
                      {type.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {formData.note && (
                <>
                  <Divider />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Note</p>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <ReactQuill
                        value={formData.note}
                        readOnly={true}
                        theme="bubble"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      ),
    };

    return stepContents[formData.step as keyof typeof stepContents];
  };

  return (
    <div className="p-6">
      <AlertCard AlertCardProps={formState.alertCard} />

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formData.step >= 1 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${
              formData.step >= 2 ? "bg-primary" : "bg-gray-200"
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formData.step >= 2 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`w-16 h-1 ${
              formData.step >= 3 ? "bg-primary" : "bg-gray-200"
            }`}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              formData.step >= 3 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
        </div>
      </div>

      {renderStepContent()}

      <Divider className="my-6" />

      <div className="flex justify-between gap-3">
        {formData.step > 1 && (
          <Button
            variant="light"
            radius="full"
            startContent={<Icon icon="solar:arrow-left-linear" width={18} />}
            onPress={() => handleStepChange("prev")}
          >
            Indietro
          </Button>
        )}

        {formData.step < 3 && (
          <Button
            color="primary"
            radius="full"
            endContent={<Icon icon="solar:arrow-right-linear" width={18} />}
            isDisabled={!validateStep(formData.step)}
            onPress={() => handleStepChange("next")}
          >
            Avanti
          </Button>
        )}

        {formData.step === 3 && (
          <Button
            color="primary"
            radius="full"
            endContent={<Icon icon="solar:shield-keyhole-bold" width={18} />}
            isLoading={formState.isSaving}
            onPress={handleCreateNewPolicy}
          >
            {formState.isSaving ? "Salvataggio..." : "Salva Polizza"}
          </Button>
        )}
      </div>
    </div>
  );
}
