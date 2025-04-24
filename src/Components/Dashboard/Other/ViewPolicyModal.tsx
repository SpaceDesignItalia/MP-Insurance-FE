import {
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import ReactQuill from "react-quill";

interface Policy {
  policyId: number;
  fullName: string;
  email: string;
  typeId: string;
  duration: number;
  amount: string;
  startDate: string;
  endDate: string;
  licensePlate: string;
  status: string;
  insuranceType: string;
  paymentStatus: string;
  types: string[];
  note: string;
  clientId: number;
}

interface ViewPolicyModalProps {
  isOpen: boolean;
  isClosed: () => void;
  PolicyData: Policy;
}

export default function ViewPolicyModal({
  isOpen,
  isClosed,
  PolicyData,
}: ViewPolicyModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Attiva":
        return "success";
      case "Sospesa":
        return "warning";
      case "Scaduta":
        return "danger";
      case "Terminata":
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

  // Calculate days until expiration
  const daysUntilExpiration = dayjs(PolicyData.endDate).diff(dayjs(), "day");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={isClosed}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center">
              <Icon
                icon="solar:shield-keyhole-bold"
                className="text-primary"
                width={24}
              />
              Dettagli Polizza
            </ModalHeader>

            <Divider />

            <ModalBody className="p-6">
              <div className="flex flex-col space-y-6">
                {/* Client Info */}
                <div className="bg-zinc-100 rounded-xl p-4">
                  <User
                    name={PolicyData.fullName}
                    description={PolicyData.email}
                    avatarProps={{
                      radius: "lg",
                      src: `https://api.dicebear.com/6.x/initials/svg?seed=${PolicyData.fullName}`,
                      className: "bg-primary text-white",
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
                          {dayjs(PolicyData.endDate).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </CardBody>
                  </Card>

                  <Card shadow="sm" className="border border-gray-200">
                    <CardBody className="p-4">
                      <div className="flex flex-col items-center text-center">
                        {PolicyData.typeId == "2" ? (
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
                          {PolicyData.licensePlate}
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
                        <p className="text-lg font-semibold">
                          {PolicyData.amount} €
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Policy Details */}
                <Tabs
                  aria-label="Policy details"
                  color="primary"
                  variant="solid"
                  classNames={{
                    tab: "px-4 py-2",
                    tabList: "gap-6",
                    cursor: "w-full bg-primary",
                  }}
                >
                  <Tab
                    key="details"
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:document-linear" width={18} />
                        <span>Dettagli</span>
                      </div>
                    }
                  >
                    <div className="py-4 space-y-5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Informazioni Polizza
                        </h3>
                        <Chip
                          color={getStatusColor(PolicyData.status) as any}
                          variant="flat"
                        >
                          {PolicyData.status.replace("Terminata", "Scaduta")}
                        </Chip>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Durata</p>
                          <p className="font-medium">
                            {PolicyData.duration} mesi
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Stato Pagamento
                          </p>
                          <Chip
                            color={
                              getPaymentStatusColor(
                                PolicyData.paymentStatus
                              ) as any
                            }
                            variant="flat"
                            size="sm"
                            startContent={
                              <Icon
                                icon="solar:wallet-money-linear"
                                width={16}
                              />
                            }
                          >
                            {PolicyData.paymentStatus}
                          </Chip>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Data Inizio
                          </p>
                          <p className="font-medium">
                            {dayjs(PolicyData.startDate).format("DD/MM/YYYY")}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Data Fine
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {dayjs(PolicyData.endDate).format("DD/MM/YYYY")}
                            </p>
                            {daysUntilExpiration > 0 &&
                              daysUntilExpiration < 30 && (
                                <Badge color="danger" variant="flat" size="sm">
                                  Scade tra {daysUntilExpiration} giorni
                                </Badge>
                              )}
                          </div>
                        </div>
                      </div>

                      <Divider className="my-2" />

                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Tipo di Polizza
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {PolicyData.types.map((type) => (
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
                    </div>
                  </Tab>

                  <Tab
                    key="notes"
                    title={
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:notebook-linear" width={18} />
                        <span>Note</span>
                      </div>
                    }
                  >
                    <div className="py-4">
                      {PolicyData.note ? (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <ReactQuill
                            value={PolicyData.note}
                            readOnly={true}
                            theme="bubble"
                          />
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <Icon
                            icon="solar:notes-broken"
                            className="mx-auto mb-2"
                            width={40}
                          />
                          <p>Nessuna nota disponibile</p>
                        </div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>

            <Divider />

            <ModalFooter>
              <Button
                color="default"
                variant="light"
                radius="full"
                startContent={<Icon icon="mingcute:close-line" width={18} />}
                onPress={onClose}
              >
                Chiudi
              </Button>
              <Button
                color="primary"
                radius="full"
                as="a"
                href={`/customers/view-customer-data/${PolicyData.clientId}`}
                startContent={
                  <Icon icon="solar:user-circle-linear" width={18} />
                }
              >
                Dettagli Cliente
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
