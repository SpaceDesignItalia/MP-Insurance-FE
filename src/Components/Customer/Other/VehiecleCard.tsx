import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { API_URL_IMG } from "../../../API/API";

interface VehiecleCardProps {
  vehicleId: number;
  licensePlate: string;
  brand: string;
  model: string;
  typeId: number;
  companyName: string;
  companyLogo?: string;
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
  "Scaduta 6 mesi": "danger",
  Sospesa: "warning",
  Scaduta: "danger",
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
  console.log(VehiecleCardProps);
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
        return "Scaduta";
      case 4:
        return "In Scadenza 6 mesi";
      case 5:
        return "Scaduta 6 mesi";
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

  // Calculate days left in policy if dates are available
  const getDaysLeft = (): number | null => {
    if (!VehiecleCardProps.endDate) return null;
    return dayjs(VehiecleCardProps.endDate).diff(dayjs(), "day");
  };

  const daysLeft = getDaysLeft();

  if (variant === "policy") {
    return (
      <Card
        isPressable={!isDisabled}
        isHoverable
        shadow={isSelected ? "md" : "sm"}
        className={`w-full ${isSelected ? "border-primary border-2" : ""} ${
          isDisabled ? "opacity-70" : ""
        }`}
        onPress={() => !isDisabled && onSelect(VehiecleCardProps.vehicleId)}
        disableRipple={isDisabled}
      >
        <CardHeader className="flex justify-between p-4 bg-gradient-to-r from-zinc-600 to-zinc-800 text-white overflow-hidden">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-left">
              {VehiecleCardProps.brand} {VehiecleCardProps.model}
            </h2>
            <p className="text-xs text-white/80 text-left">
              Targa: {VehiecleCardProps.licensePlate}
            </p>
          </div>
          <div className="flex items-center">
            {VehiecleCardProps.typeId === 2 ? (
              <Icon icon="mingcute:car-3-line" width={42} height={42} />
            ) : (
              <Icon icon="mingcute:ebike-line" width={42} height={42} />
            )}
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="p-4 flex flex-col gap-3">
          {!isDisabled ? (
            <>
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:buildings-3-linear"
                  width={18}
                  className="text-primary"
                />
                <div className="flex justify-between w-full items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Compagnia assicurativa
                    </p>
                    {VehiecleCardProps.companyName && (
                      <div className="h-10 w-10 ml-2">
                        <Image
                          radius="sm"
                          className="h-full w-full object-contain scale-150 -pt-1"
                          src={`${API_URL_IMG}/CompanyLogo/${
                            VehiecleCardProps.companyName.split(" ")[0]
                          }Logo.png`}
                          alt={VehiecleCardProps.companyName}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:calendar-linear"
                  width={18}
                  className="text-primary"
                />
                <div>
                  <p className="text-sm text-gray-500">Periodo copertura</p>
                  <p className="text-medium">
                    {dayjs(VehiecleCardProps.startDate).format("DD/MM/YYYY")} -{" "}
                    {dayjs(VehiecleCardProps.endDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              {daysLeft !== null && daysLeft > 0 && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-md ${
                    daysLeft < 30
                      ? "bg-danger-50 text-danger"
                      : "bg-default-50 text-default-500"
                  }`}
                >
                  {daysLeft < 30 ? (
                    <div className="flex items-center">
                      <Icon
                        icon="solar:alarm-linear"
                        width={14}
                        className="mr-1"
                      />
                      Scade tra {daysLeft} giorni
                    </div>
                  ) : (
                    <div>Scade tra {daysLeft} giorni</div>
                  )}
                </div>
              )}

              <div className="flex flex-row gap-2 mt-1">
                <Tooltip content="Stato pagamento">
                  <Chip
                    className="capitalize"
                    color={statusColorMap[checkPaymentStatus()] || "default"}
                    variant="flat"
                    radius="sm"
                    startContent={
                      <Icon icon="solar:wallet-money-linear" width={14} />
                    }
                  >
                    {checkPaymentStatus()}
                  </Chip>
                </Tooltip>

                <Tooltip content="Stato polizza">
                  <Chip
                    className="capitalize"
                    color={statusColorMap[checkPolicyStatus()] || "default"}
                    variant="flat"
                    radius="sm"
                    startContent={
                      <Icon icon="solar:shield-keyhole-linear" width={14} />
                    }
                  >
                    {checkPolicyStatus()}
                  </Chip>
                </Tooltip>
              </div>
            </>
          ) : (
            <div className="flex items-center py-2 gap-2">
              <Icon
                icon="solar:shield-warning-linear"
                width={20}
                className="text-warning"
              />
              <p className="text-medium text-warning">Veicolo non assicurato</p>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      isPressable
      isHoverable
      shadow={isSelected ? "md" : "sm"}
      className={`w-full ${isSelected ? "border-primary border-2" : ""}`}
      onPress={() => onSelect(VehiecleCardProps.vehicleId)}
    >
      <CardHeader className="flex justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">
            {VehiecleCardProps.brand} {VehiecleCardProps.model}
          </h2>
          <p className="text-xs text-white/80">
            Targa: {VehiecleCardProps.licensePlate}
          </p>
        </div>
        <div className="flex items-center">
          {VehiecleCardProps.typeId === 1 ? (
            <Icon icon="solar:motorbike-linear" width={42} height={42} />
          ) : (
            <Icon icon="solar:car-linear" width={42} height={42} />
          )}
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="p-4">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:info-circle-linear"
            width={18}
            className="text-primary"
          />
          <div>
            <p className="text-sm text-gray-500">Tipo veicolo</p>
            <p className="text-medium font-semibold">
              {VehiecleCardProps.typeId === 1 ? "Moto" : "Auto"}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
