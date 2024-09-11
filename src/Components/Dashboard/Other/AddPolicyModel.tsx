import {
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
  User,
  DateValue,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL_IMG } from "../../../API/API";
import { getLocalTimeZone } from "@internationalized/date";
import dayjs from "dayjs";
import AlertCard from "../../Layout/AlertCard";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Customer {
  clientId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  typeId: number;
}

interface Company {
  companyId: number;
  companyName: string;
  companyLogo: string;
}

interface InsuranceType {
  insuranceTypeId: number;
  name: string;
  description: string;
}

interface SelectedData {
  clientId: number | null;
  vehicleId: number | null;
  companyId: number | null;
  insuranceTypeIds: number[] | null;
  startDate: DateValue | string | null;
  duration: number | null;
  amount: number | null;
}

interface AlertCardProps {
  isOpen: boolean;
  type: string;
  title: string;
  description: string;
}

export default function AddPolicyModel() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedData>({
    clientId: null,
    vehicleId: null,
    companyId: null,
    insuranceTypeIds: null,
    startDate: null,
    duration: null,
    amount: null,
  });
  const [note, setNote] = useState("");
  console.log(note);

  const [alertCardProps, setAlertCardProps] = useState<AlertCardProps>({
    isOpen: false,
    type: "",
    title: "",
    description: "",
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const dateFormatter = (date: DateValue | string | null): string => {
    if (date instanceof Object && "toDate" in date) {
      return dayjs(date.toDate(getLocalTimeZone())).format("YYYY-MM-DD");
    } else if (typeof date === "string") {
      return dayjs(date).format("YYYY-MM-DD");
    } else {
      return "";
    }
  };

  const handleChange = (field: keyof SelectedData, value: any) => {
    setSelectedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    axios
      .get("/Customer/GET/GetAllCustomers", { withCredentials: true })
      .then((res) => {
        setCustomers(res.data);
      });

    axios
      .get("/Company/GET/GetAllCompanies", { withCredentials: true })
      .then((res) => {
        setCompanies(res.data);
      });

    axios
      .get("/Company/GET/GetAllInsuranceTypes", { withCredentials: true })
      .then((res) => {
        setInsuranceTypes(res.data);
      });
  }, []);

  useEffect(() => {
    if (selectedData.clientId) {
      axios
        .get("/Vehicle/GET/GetClientVehiclesUninsured", {
          params: {
            clientId: selectedData.clientId,
          },
          withCredentials: true,
        })
        .then((res) => {
          setVehicles(res.data);
        });
    }
  }, [selectedData.clientId]);

  async function handleCreateNewPolicy() {
    try {
      setIsSaving(true);
      const formattedStartDate = dateFormatter(selectedData.startDate || null);
      const { duration } = selectedData;

      let endDate = null;
      if (formattedStartDate && duration) {
        endDate = dayjs(formattedStartDate)
          .add(duration, "month")
          .format("YYYY-MM-DD");
      }

      const policyData = {
        ...selectedData,
        startDate: formattedStartDate,
        endDate: endDate,
        note: note,
      };

      console.log(policyData);

      const res = await axios.post(
        "/Policy/POST/AddPolicy",
        { policyData: policyData },
        {
          withCredentials: true,
        }
      );

      if (res.status == 200) {
        setAlertCardProps({
          ...alertCardProps,
          isOpen: true,
          type: "success",
          title: "Polizza aggiunta con successo!",
          description: "<p>La polizza è stata creata correttamente!</p>",
        });

        setTimeout((window.location.href = "/"));
      }
    } catch (error) {
      console.error("Errore durante la creazione della polizza:", error);
      setAlertCardProps({
        ...alertCardProps,
        isOpen: true,
        type: "error",
        title: "Errore nella creazione della polizza",
        description:
          "<p>C'è stato un problema nella creazione della polizza, riprova più tardi!</p>",
      });
      setIsSaving(false);
    }
  }

  return (
    <>
      <AlertCard AlertCardProps={alertCardProps} />
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Polizza
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Inserisci tutte le informazioni necessarie per la polizza.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            {/* Sezione per Cliente */}
            <div className="sm:col-span-full">
              <label
                htmlFor="client"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cliente
              </label>
              <div className="mt-2">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca per email..."
                  defaultItems={customers}
                  selectedKey={selectedData.clientId}
                  onSelectionChange={(value) =>
                    handleChange("clientId", value as number)
                  }
                >
                  {(customer) => (
                    <AutocompleteItem
                      key={customer.clientId}
                      textValue={customer.email}
                      value={customer.clientId}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">
                          {customer.firstName + " " + customer.lastName}
                        </span>
                        <span>{customer.email}</span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Sezione per Veicolo */}
            <div className="col-span-full">
              <label
                htmlFor="vehicle"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Veicolo
              </label>
              <div className="mt-2">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca per targa..."
                  defaultItems={vehicles}
                  selectedKey={selectedData.vehicleId}
                  onSelectionChange={(value) =>
                    handleChange("vehicleId", value as number)
                  }
                  listboxProps={{
                    emptyContent: "Nessun veicolo trovato",
                  }}
                >
                  {(vehicle) => (
                    <AutocompleteItem
                      key={vehicle.vehicleId}
                      textValue={vehicle.licensePlate}
                      value={vehicle.vehicleId}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">
                          {vehicle.brand + " " + vehicle.model}
                        </span>
                        <span>Targa: {vehicle.licensePlate}</span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Sezione per Compagnia */}
            <div className="col-span-full">
              <label
                htmlFor="company"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Compagnia
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Autocomplete
                  variant="bordered"
                  radius="sm"
                  placeholder="Cerca compagnia..."
                  defaultItems={companies}
                  selectedKey={selectedData.companyId}
                  onSelectionChange={(value) =>
                    handleChange("companyId", value as number)
                  }
                >
                  {(company) => (
                    <AutocompleteItem
                      key={company.companyId}
                      textValue={company.companyName}
                      value={company.companyId}
                    >
                      <div className="p-3">
                        <User
                          name={company.companyName}
                          avatarProps={{
                            src:
                              company.companyLogo &&
                              API_URL_IMG +
                                "/CompanyLogo/" +
                                company.companyLogo,
                            isBordered: true,
                          }}
                        />
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>

            {/* Sezione per Garanzie Assicurative */}
            <div className="col-span-full">
              <label
                htmlFor="insuranceTypes"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Garanzie assicurative
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Select
                  placeholder="Seleziona le garanzie assicurative"
                  variant="bordered"
                  radius="sm"
                  selectionMode="multiple"
                  selectedKeys={
                    selectedData.insuranceTypeIds?.map(String) ?? []
                  }
                  onSelectionChange={(value) =>
                    handleChange("insuranceTypeIds", [...value].map(Number))
                  }
                >
                  {insuranceTypes.map((insuranceType) => (
                    <SelectItem
                      key={insuranceType.insuranceTypeId}
                      value={insuranceType.insuranceTypeId.toString()}
                    >
                      {insuranceType.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Sezione per Data di Inizio */}
            <div className="col-span-full">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Data di inizio della polizza
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <DatePicker
                  variant="bordered"
                  radius="sm"
                  onChange={(date: DateValue) =>
                    handleChange("startDate", date)
                  }
                />
              </div>
            </div>

            {/* Sezione per Durata */}
            <div className="col-span-full">
              <label
                htmlFor="duration"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Durata (mesi)
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Input
                  placeholder="Es. 12"
                  type="number"
                  variant="bordered"
                  radius="sm"
                  value={selectedData.duration?.toString() || ""}
                  onChange={(event) =>
                    handleChange(
                      "duration",
                      Math.min(Math.max(Number(event.target.value), 1), 12)
                    )
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">mesi</span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Sezione per Importo */}
            <div className="col-span-full">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Importo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Input
                  placeholder="Es. 500"
                  type="number"
                  variant="bordered"
                  radius="sm"
                  value={selectedData.amount?.toString() || ""}
                  onChange={(event) =>
                    handleChange(
                      "amount",
                      Math.max(Number(event.target.value), 0)
                    )
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">€</span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Sezione per Note */}
            <div className="col-span-full">
              <label
                htmlFor="note"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Note
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <ReactQuill theme="snow" value={note} onChange={setNote} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          radius="sm"
          type="submit"
          color="primary"
          onClick={handleCreateNewPolicy}
          isLoading={isSaving}
        >
          Salva
        </Button>
      </div>
    </>
  );
}
