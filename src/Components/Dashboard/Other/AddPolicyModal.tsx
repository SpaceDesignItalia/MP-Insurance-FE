import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  DateInput,
  DateValue,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../API/API";
import { useDateFormatter } from "@react-aria/i18n";
import { getLocalTimeZone } from "@internationalized/date";
import { addYears } from "@progress/kendo-date-math";

interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  phomeNumber: string;
  email: string;
}

interface Vehicle {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  typeId: number;
}

interface company {
  companyId: number;
  name: string;
}

interface insuranceType {
  insuranceTypeId: number;
  name: string;
  description: string;
}

interface policy {
  clientId: number;
  vehicleId: number;
  companyId: number;
  startDate: string;
  endDate: string;
  duration: string;
  amount: number;
  insuranceTypeId: number[];
}

export default function AddPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<company[]>([]);
  const [insuranceTypes, setInsuranceTypes] = useState<insuranceType[]>([]);

  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<
    number[] | null
  >(null);
  const [selectedStartDate, setSelectedStartDate] = useState<DateValue | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<DateValue | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  let formatter = useDateFormatter({ dateStyle: "full" });
  // formatter.format(value.toDate(getLocalTimeZone()))

  const [policy, setPolicy] = useState<policy>({
    clientId: 0,
    vehicleId: 0,
    companyId: 0,
    startDate: "",
    endDate: "",
    duration: "",
    amount: 0,
    insuranceTypeId: [],
  });

  useEffect(() => {
    axios.get(API_URL + "/Client/GET/GetAllClients").then((res) => {
      setClients(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedClient) {
      axios
        .get(API_URL + "/Vehicle/GET/GetClientVehicles", {
          params: {
            clientId: selectedClient,
          },
        })
        .then((res) => {
          setVehicles(res.data);
        });
    }
  }, [selectedClient]);

  useEffect(() => {
    axios.get(API_URL + "/Company/GET/GetAllCompanies").then((res) => {
      setCompanies(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(API_URL + "/Company/GET/GetAllInsuranceTypes").then((res) => {
      setInsuranceTypes(res.data);
    });
  }, []);

  function handlePolicySubmit() {
    if (
      selectedClient &&
      selectedVehicle &&
      selectedCompany &&
      selectedInsuranceType &&
      selectedStartDate &&
      selectedDuration &&
      selectedAmount
    ) {
      setPolicy({
        clientId: selectedClient,
        vehicleId: selectedVehicle,
        companyId: selectedCompany,
        startDate: selectedStartDate.toDate(getLocalTimeZone()).toISOString(),
        endDate: formatter.format(
          addYears(
            selectedStartDate.toDate(getLocalTimeZone()),
            selectedDuration
          )
        ),
        duration: selectedDuration.toString(),
        amount: selectedAmount,
        insuranceTypeId: [],
      });
      selectedInsuranceType.forEach((insuranceTypeId) => {
        policy.insuranceTypeId.push(insuranceTypeId);
      });
      axios.post(API_URL + "/Policy/POST/AddPolicy", policy).then((res) => {
        console.log(res.data);
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Aggiungi Nuova Polizza</ModalHeader>
      <ModalBody>
        <Autocomplete
          label="Email"
          defaultItems={clients}
          selectedKey={selectedClient}
          onSelectionChange={(value: number | string | null) =>
            setSelectedClient(value as number | null)
          }
        >
          {(client) => (
            <AutocompleteItem key={client.clientId} value={client.clientId}>
              {client.email}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          label="Veicolo"
          defaultItems={vehicles}
          selectedKey={selectedVehicle}
          onSelectionChange={(value: number | string | null) =>
            setSelectedVehicle(value as number | null)
          }
        >
          {(vehicle) => (
            <AutocompleteItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
              {vehicle.licensePlate +
                " - " +
                vehicle.brand +
                " " +
                vehicle.model}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          label="Compagnia"
          defaultItems={companies}
          selectedKey={selectedCompany}
          onSelectionChange={(value: number | string | null) =>
            setSelectedCompany(value as number | null)
          }
        >
          {(company) => (
            <AutocompleteItem key={company.companyId} value={company.companyId}>
              {company.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Select
          label="Garanzie Assicurative"
          selectionMode="multiple"
          selectedKeys={selectedInsuranceType ?? []}
          className="max-w-xs"
          onSelectionChange={(value: number[] | null) =>
            setSelectedInsuranceType(value)
          }
        >
          {insuranceTypes.map((insuranceType) => (
            <SelectItem
              key={insuranceType.insuranceTypeId}
              value={insuranceType.insuranceTypeId}
            >
              {insuranceType.name}
            </SelectItem>
          ))}
        </Select>
        <DateInput
          label="Data di inizio della polizza"
          value={selectedStartDate}
          onChange={setSelectedStartDate}
        />
        <Input
          type="number"
          label="Durata"
          value={selectedDuration?.toString()}
          onChange={(event) => setSelectedDuration(Number(event.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">anni</span>
            </div>
          }
        />
        <Input
          type="number"
          label="Importo"
          value={selectedAmount?.toString()}
          onChange={(event) => setSelectedAmount(Number(event.target.value))}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">€</span>
            </div>
          }
        />
      </ModalBody>
      <ModalFooter>
        <Button onPress={onClose}>Annulla</Button>
        <Button color="primary" onClick={handlePolicySubmit}>
          Salva
        </Button>
      </ModalFooter>
    </Modal>
  );
}
