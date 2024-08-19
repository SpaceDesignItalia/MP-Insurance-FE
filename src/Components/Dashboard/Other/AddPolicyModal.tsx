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
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../../API/API";

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
  startDate: Date;
  endDate: Date;
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

  const [policy, setPolicy] = useState<policy>({
    clientId: 0,
    vehicleId: 0,
    companyId: 0,
    startDate: new Date(),
    endDate: new Date(),
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

  console.log(selectedVehicle);

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
              {vehicle.licensePlate} - {vehicle.brand + " " + vehicle.model}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Input placeholder="Tipo di polizza" />
        <Input placeholder="Durata (es: 1 anno)" />
        <Input placeholder="Prezzo (€)" />
        <Input type="date" placeholder="Data di inizio" />
        <Input type="date" placeholder="Data di fine" />
      </ModalBody>
      <ModalFooter>
        <Button onPress={onClose}>Annulla</Button>
        <Button color="primary">Salva</Button>
      </ModalFooter>
    </Modal>
  );
}
