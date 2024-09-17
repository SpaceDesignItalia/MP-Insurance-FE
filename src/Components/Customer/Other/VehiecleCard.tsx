import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";
import { Chip } from "@nextui-org/react";
import dayjs from "dayjs";

interface VehiecleCardProps {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  typeId: number;
  companyName: string;
  statusId: number;
  startDate: Date | null;
  endDate: Date | null;
  paymentStatusId: number;
}

interface VehiecleCardComponentProps {
  VehiecleCardProps: VehiecleCardProps;
  variant: "policy" | "edit";
  isSelected: boolean;
  onSelect: (vehicleId: number) => void;
}

const statusColorMap: Record<string, any> = {
  Attiva: "success",
  "In scadenza": "warning",
  "In Scadenza": "warning",
  "In Scadenza 6 mesi": "warning",
  "Terminata 6 mesi": "danger",
  Sospesa: "warning",
  Terminata: "danger",
  Pagato: "success",
  "Non Pagato": "danger",
  Rate: "primary",
};

export default function VehiecleCard({
  VehiecleCardProps,
  variant,
  isSelected,
  onSelect,
}: VehiecleCardComponentProps) {
  function checkPaymentStatus(): string {
    switch (VehiecleCardProps.paymentStatusId) {
      case 1:
        return "Pagato";
      case 2:
        return "Non Pagato";
      case 3:
        return "Rate";
      default:
        return "Sconosciuto"; // Caso predefinito per evitare undefined
    }
  }

  function checkPolicyStatus(): string {
    switch (VehiecleCardProps.statusId) {
      case 1:
        return "Attiva";
      case 2:
        return "In Scadenza";
      case 3:
        return "Terminata";
      case 4:
        return "In Scadenza 6 mesi";
      case 5:
        return "Terminata 6 mesi";
      case 6:
        return "Sospesa";
      default:
        return "Sconosciuto"; // Caso predefinito per evitare undefined
    }
  }

  function checkIsUninsured() {
    return (
      !VehiecleCardProps.companyName &&
      !VehiecleCardProps.startDate &&
      !VehiecleCardProps.endDate
    );
  }

  const isDisabled = checkIsUninsured();

  return (
    <>
      {variant == "policy" && (
        <>
          <div
            className={`max-w-sm rounded-lg overflow-hidden bg-white transition-shadow duration-300 transform ${
              isSelected ? "shadow-xl border-primary border-3" : "border"
            } ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl cursor-pointer"
            }`}
            onClick={() => !isDisabled && onSelect(VehiecleCardProps.vehicleId)}
          >
            <div className="flex justify-between p-6 bg-primary-900 text-white">
              <div>
                <h2 className="text-xl font-bold">
                  {VehiecleCardProps.brand} {VehiecleCardProps.model}
                </h2>
                <p className="mt-1 text-sm opacity-80">
                  Targa: {VehiecleCardProps.licensePlate}
                </p>
              </div>
              <div className="flex items-center">
                {VehiecleCardProps.typeId === 1 ? (
                  <TwoWheelerRoundedIcon fontSize="large" />
                ) : (
                  <DirectionsCarRoundedIcon fontSize="large" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 px-6 py-4">
              <p className="text-gray-700">
                <strong>Tipo:</strong>{" "}
                {VehiecleCardProps.typeId === 1 ? "Moto" : "Auto"}
              </p>
              {!isDisabled ? (
                <>
                  <p className="text-gray-700">
                    <strong> Compagnia assicurativa:</strong>{" "}
                    {VehiecleCardProps.companyName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Data copertura:</strong>{" "}
                    {dayjs(VehiecleCardProps.startDate).format("DD/MM/YYYY")} -{" "}
                    {dayjs(VehiecleCardProps.endDate).format("DD/MM/YYYY")}
                  </p>
                  <div className="flex flex-row gap-2">
                    <Chip
                      className="capitalize"
                      color={statusColorMap[checkPaymentStatus()] || "default"}
                      variant="dot"
                      radius="sm"
                    >
                      {checkPaymentStatus()}
                    </Chip>

                    <Chip
                      className="capitalize"
                      color={statusColorMap[checkPolicyStatus()] || "default"}
                      variant="dot"
                      radius="sm"
                    >
                      {checkPolicyStatus()}
                    </Chip>
                  </div>
                </>
              ) : (
                <p className="text-gray-700">
                  <strong> Veicolo non assicurato</strong>
                </p>
              )}
            </div>
          </div>
        </>
      )}
      {variant == "edit" && (
        <>
          <div
            className={`sm:max-w-sm rounded-lg overflow-hidden bg-white transition-shadow duration-300 transform cursor-pointer ${
              isSelected ? "shadow-xl border-primary border-3" : "border"
            }`}
            onClick={() => onSelect(VehiecleCardProps.vehicleId)}
          >
            <div className="flex justify-between p-6 bg-primary-900 text-white">
              <div>
                <h2 className="text-xl font-bold">
                  {VehiecleCardProps.brand} {VehiecleCardProps.model}
                </h2>
                <p className="mt-1 text-sm opacity-80">
                  Targa: {VehiecleCardProps.licensePlate}
                </p>
              </div>
              <div className="flex items-center">
                {VehiecleCardProps.typeId === 1 ? (
                  <TwoWheelerRoundedIcon fontSize="large" />
                ) : (
                  <DirectionsCarRoundedIcon fontSize="large" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 px-6 py-4">
              <p className="text-gray-700">
                <strong>Tipo:</strong>{" "}
                {VehiecleCardProps.typeId === 1 ? "Moto" : "Auto"}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
