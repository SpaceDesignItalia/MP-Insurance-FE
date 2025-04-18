import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import DeleteVehicleModal from "./DeleteVehicleModal";

interface VehicleDataProps {
  vehicleId: number;
  brand: string;
  model: string;
  licensePlate: string;
  typeId: number;
}

interface VehicleInfoCardProps {
  VehicleData: VehicleDataProps;
  isVisible: boolean;
  handleUpdateVehicleData: (vehicleData: VehicleDataProps) => void;
}

interface DeleteModalData {
  open: boolean;
  Vehicle: VehicleDataProps;
}

export default function VehicleInfoCard({
  VehicleData,
  isVisible,
  handleUpdateVehicleData,
}: VehicleInfoCardProps) {
  const [editedData, setEditedData] = useState<VehicleDataProps>(VehicleData);
  const [isEditingData, setIsEditingData] = useState<boolean>(false);
  const [DeleteModalData, setDeleteModalData] = useState<DeleteModalData>({
    open: false,
    Vehicle: {} as VehicleDataProps,
  });

  useEffect(() => {
    setEditedData(VehicleData);
  }, [VehicleData]);

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]:
        name === "licensePlate"
          ? value
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, "")
              .slice(0, 7)
          : value,
    }));
  };

  const checkEditedData = () => {
    return (
      editedData.brand !== VehicleData.brand ||
      editedData.model !== VehicleData.model ||
      editedData.licensePlate !== VehicleData.licensePlate
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <DeleteVehicleModal
        isOpen={DeleteModalData.open}
        isClosed={() => setDeleteModalData({ ...DeleteModalData, open: false })}
        VehicleData={DeleteModalData.Vehicle}
      />

      <Card shadow="sm" className="w-full overflow-visible" isHoverable>
        <CardHeader className="flex justify-between items-center px-6 pt-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Dati veicolo</h1>
              <Chip
                size="sm"
                color={VehicleData.typeId === 2 ? "primary" : "secondary"}
                variant="flat"
              >
                {VehicleData.typeId === 2 ? "Auto" : "Moto"}
              </Chip>
            </div>
            <p className="text-sm text-gray-500">
              ID Veicolo: {VehicleData.vehicleId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="danger"
              radius="full"
              variant="flat"
              isIconOnly
              onPress={() =>
                setDeleteModalData({
                  ...DeleteModalData,
                  open: true,
                  Vehicle: VehicleData,
                })
              }
              aria-label="Elimina veicolo"
            >
              <Icon icon="solar:trash-bin-trash-linear" width={20} />
            </Button>
          </div>
        </CardHeader>

        <Divider className="my-2" />

        <CardBody className="px-6 py-4">
          {isEditingData ? (
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <Input
                  label="Marca"
                  labelPlacement="outside"
                  name="brand"
                  value={editedData.brand}
                  placeholder="Marca"
                  variant="bordered"
                  radius="sm"
                  startContent={
                    <Icon
                      icon="solar:car-bold"
                      width={18}
                      className="text-default-400"
                    />
                  }
                  onChange={handleVehicleInputChange}
                />
                <Input
                  label="Modello"
                  labelPlacement="outside"
                  name="model"
                  value={editedData.model}
                  placeholder="Modello"
                  variant="bordered"
                  radius="sm"
                  startContent={
                    <Icon
                      icon="solar:settings-linear"
                      width={18}
                      className="text-default-400"
                    />
                  }
                  onChange={handleVehicleInputChange}
                />
                <Input
                  label="Targa"
                  labelPlacement="outside"
                  name="licensePlate"
                  value={editedData.licensePlate}
                  placeholder="Targa"
                  variant="bordered"
                  radius="sm"
                  startContent={
                    <Icon
                      icon="solar:ticket-linear"
                      width={18}
                      className="text-default-400"
                    />
                  }
                  onChange={handleVehicleInputChange}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-default-50 p-4">
              <div className="flex items-start gap-2 mb-3">
                <Icon
                  icon="solar:car-bold"
                  width={24}
                  className="text-primary mt-1"
                />
                <div>
                  <p className="text-medium font-semibold">
                    {VehicleData.typeId === 2 ? "Auto" : "Moto"}:{" "}
                    {VehicleData.brand} {VehicleData.model}
                  </p>
                  <p className="text-sm text-gray-500">Marca e modello</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Icon
                  icon="solar:ticket-linear"
                  width={24}
                  className="text-primary mt-1"
                />
                <div>
                  <p className="text-medium font-semibold">
                    {VehicleData.licensePlate}
                  </p>
                  <p className="text-sm text-gray-500">Targa</p>
                </div>
              </div>
            </div>
          )}
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-end items-center py-4">
          {isEditingData ? (
            <div className="flex flex-row gap-3">
              <Button
                color="danger"
                radius="full"
                variant="flat"
                startContent={<Icon icon="mingcute:close-fill" width={18} />}
                onPress={() => setIsEditingData(false)}
              >
                Annulla
              </Button>
              <Button
                color="success"
                radius="full"
                variant="solid"
                startContent={<Icon icon="mingcute:save-2-line" width={18} />}
                onPress={() => handleUpdateVehicleData(editedData)}
                isDisabled={!checkEditedData()}
              >
                Salva modifiche
              </Button>
            </div>
          ) : (
            <Button
              color="warning"
              radius="full"
              variant="solid"
              startContent={<Icon icon="solar:pen-linear" width={18} />}
              onPress={() => setIsEditingData(true)}
            >
              Modifica veicolo
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
