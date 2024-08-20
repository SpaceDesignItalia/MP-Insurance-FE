import { useEffect, useState } from "react";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Link } from "@nextui-org/react";
import VehiecleCard from "./VehiecleCard";

interface CustomerDataProps {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export default function ViewCustomerModel() {
  const [customerData, setCustomerData] = useState<CustomerDataProps>({
    clientId: 0,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // Stato per tracciare il veicolo selezionato
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );

  const handleVehicleSelect = (vehicleId: number) => {
    // Se il veicolo cliccato è già selezionato, deseleziona
    if (selectedVehicleId === vehicleId) {
      setSelectedVehicleId(null);
    } else {
      // Altrimenti seleziona il veicolo cliccato
      setSelectedVehicleId(vehicleId);
    }
  };

  return (
    <main>
      <header className="relative isolate border-b-2">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
            <div className="flex items-center gap-x-6">
              <h1>
                <div className="flex flex-row gap-2 items-center mt-1 text-xl font-semibold leading-6 text-gray-900">
                  <InsertEmoticonOutlinedIcon />
                  Andrea Braia
                </div>
                <div className="flex flex-row gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                  <EmailOutlinedIcon />
                  andrix.braia@gmail.com
                </div>
                <div className="flex flex-row gap-2 items-center mt-1 text-normal leading-6 text-gray-500">
                  <PhoneAndroidOutlinedIcon />
                  3669826344
                </div>
              </h1>
            </div>
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              <Button
                as={Link}
                href="#"
                color="warning"
                radius="sm"
                className="text-white"
                startContent={<EditRoundedIcon />}
              >
                Modifica
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-xl font-semibold">Veicoli intestati</h1>
          <Button color="primary" radius="sm" startContent={<AddRoundedIcon />}>
            Aggiungi veicolo
          </Button>
        </div>
        <div className="mt-4 mx-auto grid max-w-2xl  grid-cols-1 sm:grid-cols-2 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <VehiecleCard
            VehiecleCardProps={{
              vehicleId: 1,
              licensePlate: "AA000AA",
              brand: "Audi",
              model: "A3",
              typeId: 2,
            }}
            isSelected={selectedVehicleId === 1}
            onSelect={handleVehicleSelect}
          />
          <VehiecleCard
            VehiecleCardProps={{
              vehicleId: 2,
              licensePlate: "BB000BB",
              brand: "CFMOTO",
              model: "450SR S",
              typeId: 1,
            }}
            isSelected={selectedVehicleId === 2}
            onSelect={handleVehicleSelect}
          />
          <VehiecleCard
            VehiecleCardProps={{
              vehicleId: 3,
              licensePlate: "CC000CC",
              brand: "Honda",
              model: "Civic",
              typeId: 2,
            }}
            isSelected={selectedVehicleId === 3}
            onSelect={handleVehicleSelect}
          />
        </div>
      </div>
    </main>
  );
}
