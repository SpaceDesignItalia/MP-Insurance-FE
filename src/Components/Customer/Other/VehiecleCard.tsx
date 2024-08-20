import React from "react";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";

interface VehiecleCardProps {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  typeId: number;
}

interface VehiecleCardComponentProps {
  VehiecleCardProps: VehiecleCardProps;
  isSelected: boolean;
  onSelect: (vehicleId: number) => void;
}

export default function VehiecleCard({
  VehiecleCardProps,
  isSelected,
  onSelect,
}: VehiecleCardComponentProps) {
  return (
    <div
      key={VehiecleCardProps.vehicleId}
      className={`max-w-sm rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer transform ${
        isSelected ? "scale-105 shadow-xl" : "border"
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

      <div className="px-6 py-4">
        <p className="text-sm font-medium text-gray-700">
          Tipo: {VehiecleCardProps.typeId === 1 ? "Moto" : "Auto"}
        </p>
      </div>
    </div>
  );
}
