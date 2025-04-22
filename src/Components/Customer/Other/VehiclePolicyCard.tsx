import {
  Button,
  Select,
  SelectItem,
  User,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
  Divider,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import dayjs from "dayjs";
import { API_URL_IMG } from "../../../API/API";
import DeletePolicyModal from "../../Dashboard/Other/DeletePolicyModal";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Icon } from "@iconify/react";

interface PolicyDataProps {
  policyId: number;
  fullName: string;
  email: string;
  typeId: number;
  duration: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  brand: string;
  model: string;
  licensePlate: string;
  status: string;
  paymentStatus: string;
  companyName: string;
  companyLogo: string;
  types: string[];
  note: string;
  startSuspensionDate: Date | null;
}

interface VehiclePolicyCardProps {
  PolicyData: PolicyDataProps;
  isVisible: boolean;
}

interface DeleteModalData {
  open: boolean;
  Policy: PolicyDataProps;
}

export default function VehiclePolicyCard({
  PolicyData,
  isVisible,
}: VehiclePolicyCardProps) {
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalData>({
    open: false,
    Policy: {} as PolicyDataProps,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "reactivate" | null>(
    null
  );

  const PaymentStatus = [
    { value: 1, label: "Pagato" },
    { value: 2, label: "Non Pagato" },
    { value: 3, label: "Rate" },
  ];

  const [note, setNote] = useState<string>();
  const [selectedTab, setSelectedTab] = useState("details");

  useEffect(() => {
    setNote(PolicyData.note);
  }, [PolicyData.note]);

  async function handlePaymentStatusChange(e: any) {
    const selectedStatus = PaymentStatus.find(
      (status) => status.label === e
    )?.value;
    try {
      const res = await axios.put(
        "/Policy/UPDATE/ChangePolicyPaymentStatus",
        {
          policyId: PolicyData.policyId,
          paymentStatusId: selectedStatus,
        },
        { withCredentials: true }
      );

      if (res.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateNote() {
    try {
      const res = await axios.put(
        "/Policy/UPDATE/UpdateNote",
        {
          policyId: PolicyData.policyId,
          note: note,
        },
        { withCredentials: true }
      );

      if (res.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function suspendPolicy() {
    try {
      const res = await axios.post(
        "/Policy/POST/SuspendPolicy",
        {
          policyId: PolicyData.policyId,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function reactivatePolicy() {
    try {
      const res = await axios.post(
        "/Policy/POST/ReactivatePolicy",
        {
          policyId: PolicyData.policyId,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const confirmAction = () => {
    if (actionType === "suspend") {
      suspendPolicy();
    } else if (actionType === "reactivate") {
      reactivatePolicy();
    }
    setShowConfirmModal(false);
  };

  const handleActionClick = (type: "suspend" | "reactivate") => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  // Calculate days until expiration
  const daysUntilExpiration = dayjs(PolicyData.endDate).diff(dayjs(), "day");

  // Determine status color
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

  if (!isVisible) return null;

  return (
    <>
      <DeletePolicyModal
        isOpen={deleteModalData.open}
        isClosed={() => setDeleteModalData({ ...deleteModalData, open: false })}
        PolicyData={{
          policyId: Number(deleteModalData.Policy.policyId),
          fullName: deleteModalData.Policy.fullName,
        }}
      />

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>
            {actionType === "suspend" ? "Sospendi Polizza" : "Attiva Polizza"}
          </ModalHeader>
          <ModalBody>
            <p>
              {actionType === "suspend"
                ? "Sei sicuro di voler sospendere questa polizza? Il veicolo non sarà più coperto dall'assicurazione."
                : "Sei sicuro di voler riattivare questa polizza?"}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setShowConfirmModal(false)}
            >
              Annulla
            </Button>
            <Button
              color={actionType === "suspend" ? "warning" : "success"}
              onPress={confirmAction}
            >
              Conferma
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Card shadow="sm" className="w-full overflow-visible" isHoverable>
        <CardHeader className="flex justify-between items-center px-6 pt-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {PolicyData.brand} {PolicyData.model}
              </h1>
              <Chip
                size="sm"
                color={getStatusColor(PolicyData.status) as any}
                variant="flat"
              >
                {PolicyData.status}
              </Chip>
            </div>
            <p className="text-sm text-gray-500">
              ID Polizza: {PolicyData.policyId}
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
                  ...deleteModalData,
                  open: true,
                  Policy: PolicyData,
                })
              }
              aria-label="Elimina polizza"
            >
              <Icon icon="solar:trash-bin-trash-linear" width={20} />
            </Button>
          </div>
        </CardHeader>

        <Divider className="my-2" />

        <CardBody className="px-6">
          {PolicyData.status === "Sospesa" &&
            PolicyData.startSuspensionDate !== null && (
              <div className="mb-5 bg-warning-50 rounded-lg p-4 flex items-start gap-3">
                <div className="text-warning">
                  <Icon icon="solar:shield-warning-bold" width={24} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-warning-800">
                    Polizza Sospesa
                  </h3>
                  <p className="mt-1 text-sm text-warning-700">
                    La polizza è stata sospesa a partire dal{" "}
                    <strong>
                      {dayjs(PolicyData.startSuspensionDate).format(
                        "DD/MM/YYYY"
                      )}
                    </strong>
                  </p>
                </div>
              </div>
            )}

          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab as any}
            color="primary"
            variant="underlined"
            classNames={{
              tab: "px-4 py-2",
              tabList: "mb-6",
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <User
                      name={PolicyData.companyName}
                      description="Compagnia assicurativa"
                      avatarProps={{
                        size: "lg",
                        isBordered: true,
                        src:
                          PolicyData.companyLogo &&
                          API_URL_IMG +
                            "/CompanyLogo/" +
                            PolicyData.companyLogo,
                      }}
                    />
                    <Chip
                      color={
                        getPaymentStatusColor(PolicyData.paymentStatus) as any
                      }
                      variant="flat"
                      startContent={
                        <Icon icon="solar:wallet-money-linear" width={16} />
                      }
                    >
                      {PolicyData.paymentStatus}
                    </Chip>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-medium font-semibold">Intestatario</h3>
                    <div className="rounded-lg bg-default-50 p-4">
                      <p className="text-medium font-semibold">
                        {PolicyData.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {PolicyData.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-medium font-semibold">Veicolo</h3>
                    <div className="rounded-lg bg-default-50 p-4">
                      <p className="text-medium font-semibold">
                        {PolicyData.typeId === 2 ? "Auto" : "Moto"}:{" "}
                        {PolicyData.brand} {PolicyData.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        Targa: {PolicyData.licensePlate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg bg-primary-50 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-medium font-semibold">
                        Periodo di copertura
                      </h3>
                      <Tooltip
                        content={`${PolicyData.duration} mesi di durata`}
                      >
                        <Badge
                          content={`${PolicyData.duration}m`}
                          color="primary"
                          placement="top-right"
                        >
                          <Icon icon="solar:calendar-linear" width={24} />
                        </Badge>
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Data inizio</p>
                        <p className="font-medium">
                          {dayjs(PolicyData.startDate).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Data fine</p>
                        <p className="font-medium">
                          {dayjs(PolicyData.endDate).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    {daysUntilExpiration > 0 && (
                      <div className="mt-3 px-3 py-2 bg-white rounded-md border border-gray-200">
                        <p className="text-xs text-gray-500">
                          {daysUntilExpiration < 30 ? (
                            <span className="flex items-center text-danger">
                              <Icon
                                icon="solar:alarm-linear"
                                className="mr-1"
                                width={14}
                              />
                              Scade tra {daysUntilExpiration} giorni
                            </span>
                          ) : (
                            <span>Scade tra {daysUntilExpiration} giorni</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-medium font-semibold">Coperture</h3>
                    <div className="flex flex-wrap gap-2">
                      {PolicyData.types.map((type, index) => (
                        <Chip key={index} color="secondary" variant="flat">
                          {type}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-medium font-semibold">
                      Stato Pagamento
                    </h3>
                    <Select
                      label="Modifica stato pagamento"
                      variant="bordered"
                      radius="sm"
                      placeholder="Seleziona uno stato"
                      selectedKeys={[PolicyData.paymentStatus]}
                      className="w-full"
                      onChange={(e) =>
                        handlePaymentStatusChange(e.target.value)
                      }
                    >
                      {PaymentStatus.map((status) => (
                        <SelectItem key={status.label}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
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
              <div className="space-y-4">
                <ReactQuill
                  theme="snow"
                  value={note}
                  onChange={setNote}
                  className="w-full min-h-[200px]"
                />
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    radius="sm"
                    onClick={handleUpdateNote}
                    isDisabled={PolicyData.note === note}
                    startContent={<Icon icon="solar:pen-linear" width={18} />}
                  >
                    Aggiorna nota
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>

        <Divider />

        <CardFooter className="flex justify-between items-center">
          <div className="font-medium">
            <span className="text-gray-500 mr-2">Totale:</span>
            <span className="text-xl">€ {PolicyData.amount}</span>
          </div>

          {PolicyData.status !== "Scaduta" && (
            <div>
              {PolicyData.status === "Sospesa" ? (
                <Button
                  color="success"
                  variant="solid"
                  radius="full"
                  startContent={<Icon icon="solar:play-linear" width={18} />}
                  onPress={() => handleActionClick("reactivate")}
                >
                  Attiva polizza
                </Button>
              ) : (
                <Button
                  color="warning"
                  variant="solid"
                  radius="full"
                  startContent={<Icon icon="solar:pause-linear" width={18} />}
                  onPress={() => handleActionClick("suspend")}
                >
                  Sospendi polizza
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
