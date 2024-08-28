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
  startDate: Date;
  endDate: Date;
  paymentStatusId: number;
}

interface VehiecleCardComponentProps {
  VehiecleCardProps: VehiecleCardProps;
  isSelected: boolean;
  onSelect: (vehicleId: number) => void;
}

const statusColorMap: Record<string, any> = {
  Attiva: "success",
  "In scadenza": "warning",
  Scaduta: "danger",
  Pagato: "success",
  "Non Pagato": "warning",
  Rate: "primary",
};

export default function VehiecleCard({
  VehiecleCardProps,
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
        return "In scadenza";
      case 3:
        return "Scaduta";
      default:
        return "Sconosciuto"; // Caso predefinito per evitare undefined
    }
  }

  return (
    <div
      className={`max-w-sm rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer transform ${
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
            color={statusColorMap[checkPaymentStatus()] || "default"} // Usa "default" o altro colore di fallback
            variant="dot"
            radius="sm"
          >
            {checkPaymentStatus()}
          </Chip>

          <Chip
            className="capitalize"
            color={statusColorMap[checkPolicyStatus()] || "default"} // Usa "default" o altro colore di fallback
            variant="dot"
            radius="sm"
          >
            {checkPolicyStatus()}
          </Chip>
        </div>
      </div>
    </div>
  );
}
