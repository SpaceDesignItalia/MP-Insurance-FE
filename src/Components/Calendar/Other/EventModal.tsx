import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  User,
  Divider,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import ReactQuill from "react-quill";

interface Policy {
  policyId: number;
  fullName: string;
  email: string;
  typeId: number;
  duration: number;
  amount: string;
  startDate: Date;
  endDate: Date;
  licensePlate: string;
  status: string;
  insuranceType: string;
  paymentStatus: string;
  types: string[];
  note: string;
  clientId: number;
}

interface EventModalProps {
  isOpen: boolean;
  event: Policy | null;
  onClose: () => void;
}

export default function EventModal({
  isOpen,
  event,
  onClose,
}: EventModalProps) {
  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Attiva":
        return "success";
      case "Sospesa":
        return "warning";
      case "Scaduta":
        return "danger";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pagato":
        return "success";
      case "Non Pagato":
        return "danger";
      case "Rate":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <Icon
            icon="solar:shield-keyhole-linear"
            className="text-primary"
            width={24}
          />
          Polizza in scadenza
        </ModalHeader>

        <Divider />

        <ModalBody className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Client Info */}
            <div className="bg-zinc-100 rounded-xl p-4">
              <User
                name={event.fullName}
                description={event.email}
                avatarProps={{
                  radius: "lg",
                  src: `https://api.dicebear.com/6.x/initials/svg?seed=${event.fullName}`,
                  className: "bg-black text-white",
                }}
                className="justify-start"
              />
            </div>

            {/* Policy Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card shadow="sm" className="border border-gray-200">
                <CardBody className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Icon
                      icon="solar:calendar-linear"
                      className="text-primary mb-2"
                      width={24}
                    />
                    <p className="text-sm text-gray-500">Scadenza</p>
                    <p className="text-lg font-semibold">
                      {dayjs(event.endDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="sm" className="border border-gray-200">
                <CardBody className="p-4">
                  <div className="flex flex-col items-center text-center">
                    {event.typeId == 2 ? (
                      <Icon
                        icon="mingcute:car-3-line"
                        className="text-primary mb-2"
                        width={24}
                      />
                    ) : (
                      <Icon
                        icon="mingcute:ebike-line"
                        className="text-primary mb-2"
                        width={24}
                      />
                    )}
                    <p className="text-sm text-gray-500">Veicolo</p>
                    <p className="text-lg font-semibold">
                      {event.licensePlate}
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card shadow="sm" className="border border-gray-200">
                <CardBody className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Icon
                      icon="solar:wallet-money-linear"
                      className="text-primary mb-2"
                      width={24}
                    />
                    <p className="text-sm text-gray-500">Importo</p>
                    <p className="text-lg font-semibold">{event.amount} €</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Policy Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dettagli Polizza</h3>
                <Chip color={getStatusColor(event.status)} variant="flat">
                  {event.status}
                </Chip>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Durata</p>
                    <p className="font-medium">{event.duration} mesi</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stato Pagamento</p>
                    <Chip
                      color={getPaymentStatusColor(event.paymentStatus)}
                      variant="flat"
                      size="sm"
                    >
                      {event.paymentStatus}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data Inizio</p>
                    <p className="font-medium">
                      {dayjs(event.startDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data Fine</p>
                    <p className="font-medium">
                      {dayjs(event.endDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Tipo di Polizza</p>
                  <div className="flex flex-wrap gap-2">
                    {event.types.map((type) => (
                      <Chip
                        key={type}
                        color="primary"
                        variant="bordered"
                        radius="sm"
                      >
                        {type}
                      </Chip>
                    ))}
                  </div>
                </div>

                {event.note && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Note</p>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <ReactQuill
                        value={event.note}
                        readOnly={true}
                        theme="bubble"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <Divider />

        <ModalFooter>
          <Button
            color="primary"
            variant="light"
            radius="full"
            onPress={onClose}
            startContent={<Icon icon="mingcute:close-line" width={18} />}
          >
            Chiudi
          </Button>
          <Button
            color="primary"
            radius="full"
            as="a"
            href={`/customers/view-customer-data/${event.clientId}`}
            startContent={<Icon icon="solar:user-circle-linear" width={18} />}
          >
            Vai al profilo cliente
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
