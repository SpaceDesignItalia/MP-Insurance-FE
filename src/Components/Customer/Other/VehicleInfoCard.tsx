import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
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

  return (
    <>
      <DeleteVehicleModal
        isOpen={DeleteModalData.open}
        isClosed={() => setDeleteModalData({ ...DeleteModalData, open: false })}
        VehicleData={DeleteModalData.Vehicle}
      />
      {isVisible && (
        <div className="flex flex-col-reverse sm:flex-col gap-4">
          <div className="flex flex-col gap-10 sm:flex-row justify-end items-center">
            <Button
              variant="bordered"
              color="danger"
              radius="sm"
              startContent={<DeleteRoundedIcon />}
              className="w-full sm:w-1/6"
              onClick={() =>
                setDeleteModalData({
                  ...DeleteModalData,
                  open: true,
                  Vehicle: VehicleData,
                })
              }
            >
              Elimina veicolo
            </Button>
          </div>

          <div className="-mx-4 px-4 py-8 shadow-sm border-1 ring-1 ring-gray-900/5 sm:mx-0 rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Dati veicolo
            </h2>

            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 lg:grid-cols-2">
              <div>
                <div className=" sm:border-gray-900/5">
                  {isEditingData ? (
                    <dd className="flex flex-col gap-2  text-gray-500">
                      <Input
                        label="Marca"
                        labelPlacement="outside"
                        name="brand"
                        value={editedData.brand}
                        placeholder="Marca"
                        variant="bordered"
                        radius="sm"
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
                        onChange={handleVehicleInputChange}
                      />
                    </dd>
                  ) : (
                    <dd className="mt-2 text-gray-500">
                      <span className="font-medium text-gray-900">
                        {VehicleData.typeId === 2 ? "Auto" : "Moto"}:{" "}
                        {VehicleData.brand + " " + VehicleData.model}
                      </span>
                      <br />
                      Targa: {VehicleData.licensePlate}
                    </dd>
                  )}
                </div>
              </div>
            </dl>
            <div className="sm:pr-4 flex justify-end items-center mt-5">
              {isEditingData ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-1/3">
                  <Button
                    color="danger"
                    radius="sm"
                    startContent={<CloseRoundedIcon />}
                    className="text-white"
                    onClick={() => setIsEditingData(!isEditingData)}
                    fullWidth
                  >
                    Annulla
                  </Button>
                  <Button
                    color="success"
                    radius="sm"
                    startContent={<SaveRoundedIcon />}
                    className="text-white"
                    onClick={() => handleUpdateVehicleData(editedData)}
                    isDisabled={!checkEditedData()}
                    fullWidth
                  >
                    Salva modifiche
                  </Button>
                </div>
              ) : (
                <Button
                  color="warning"
                  radius="sm"
                  startContent={<EditRoundedIcon />}
                  className="text-white"
                  onClick={() => setIsEditingData(!isEditingData)}
                >
                  Modifica veicolo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
