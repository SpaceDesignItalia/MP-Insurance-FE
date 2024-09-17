import { Button, Select, SelectItem, User } from "@nextui-org/react";
import dayjs from "dayjs";
import { API_URL_IMG } from "../../../API/API";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeletePolicyModal from "../../Dashboard/Other/DeletePolicyModal";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import "react-quill/dist/quill.snow.css";

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

  const PaymentStatus = [
    { value: 1, label: "Pagato" },
    { value: 2, label: "Non Pagato" },
    { value: 3, label: "Rate" },
  ];

  const [note, setNote] = useState<string>();

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
      {isVisible && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-10 sm:flex-row justify-between items-center">
            <h1 className="text-xl font-semibold">
              Polizza del veicolo: {PolicyData.brand + " " + PolicyData.model}
            </h1>
            <Button
              color="danger"
              radius="sm"
              startContent={<DeleteRoundedIcon />}
              className="w-full sm:w-1/6"
              onClick={() =>
                setDeleteModalData({
                  ...deleteModalData,
                  open: true,
                  Policy: PolicyData,
                })
              }
            >
              Elimina polizza
            </Button>
          </div>

          <div className="-mx-4 px-4 py-8 shadow-sm border-1 ring-1 ring-gray-900/5 sm:mx-0 rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            {PolicyData.status == "Sospesa" &&
              PolicyData.startSuspensionDate !== null && (
                <div className="rounded-md bg-yellow-50 p-4 mb-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ReportProblemRoundedIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Avviso Importante
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          La polizza è stata sospesa a partire dal{" "}
                          <strong>
                            {dayjs(PolicyData.startSuspensionDate).format(
                              "DD/MM/YYYY"
                            )}
                          </strong>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Polizza assicurativa
            </h2>
            <div className="flex flex-row justify-between">
              <User
                name={PolicyData.companyName}
                avatarProps={{
                  size: "lg",
                  isBordered: true,
                  src:
                    PolicyData.companyLogo &&
                    API_URL_IMG + "/CompanyLogo/" + PolicyData.companyLogo,
                }}
                className="mt-3"
              />
              <Select
                label="Stato del pagamento"
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                placeholder="Seleziona uno stato"
                selectedKeys={[PolicyData.paymentStatus]}
                className="max-w-xs"
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
              >
                {PaymentStatus.map((status) => (
                  <SelectItem key={status.label}>{status.label}</SelectItem>
                ))}
              </Select>
            </div>
            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:pr-4">
                <dt className="inline text-gray-500">Attivata il</dt>{" "}
                <dd className="inline text-gray-700">
                  <time dateTime="2023-23-01">
                    {dayjs(PolicyData.startDate).format("DD/MM/YYYY")}
                  </time>
                </dd>
              </div>
              <div className="mt-2 sm:mt-0 sm:pl-4">
                <dt className="inline text-gray-500">Scade il:</dt>{" "}
                <dd className="inline text-gray-700">
                  {dayjs(PolicyData.endDate).format("DD/MM/YYYY")}
                  <time dateTime="2023-31-01"></time>
                </dd>
              </div>
              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dt className="font-semibold text-gray-900">
                  Dati intestatario:
                </dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">
                    {PolicyData.fullName}
                  </span>
                  <br />
                  {PolicyData.email}
                  <br />
                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                <dt className="font-semibold text-gray-900">Dati veicolo:</dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">
                    {PolicyData.typeId === 2 ? "Auto" : "Moto"}:{" "}
                    {PolicyData.brand + " " + PolicyData.model}
                  </span>
                  <br />
                  Targa: {PolicyData.licensePlate}
                </dd>
              </div>

              <div className="mt-8 sm:mt-6 sm:border-t sm:border-b sm:border-gray-900/5 sm:pl-4 sm:pt-6 col-span-2">
                <dt className="font-semibold text-gray-900">Note:</dt>
                <dd className="mt-2 text-gray-500">
                  <div className="w-full flex flex-col gap-3">
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={setNote}
                      className="w-full"
                    />
                    <div className="flex flex-row justify-end mb-5">
                      <Button
                        color="primary"
                        radius="sm"
                        onClick={handleUpdateNote}
                        isDisabled={PolicyData.note === note}
                      >
                        Aggiorna nota
                      </Button>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>

            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
              <colgroup>
                <col className="w-full" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="border-b border-gray-200 text-gray-900">
                <tr>
                  <th scope="col" className="px-0 py-3 font-semibold">
                    Tipo di polizza
                  </th>
                </tr>
              </thead>
              <tbody>
                {PolicyData.types.map((type, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="max-w-0 px-0 py-5 align-top">
                      <div className="truncate font-medium text-gray-900">
                        {type}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    className="pt-4 font-semibold text-gray-900 sm:hidden"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                  >
                    Totale
                  </th>
                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                    € {PolicyData.amount}
                  </td>
                </tr>
              </tfoot>
            </table>

            {PolicyData.status !== "Terminata" && (
              <div>
                {PolicyData.status == "Sospesa" ? (
                  <Button
                    color="success"
                    radius="sm"
                    className="text-white"
                    startContent={<PlayArrowRoundedIcon />}
                    onClick={reactivatePolicy}
                  >
                    Attiva polizza
                  </Button>
                ) : (
                  <Button
                    color="warning"
                    radius="sm"
                    className="text-white"
                    startContent={<PauseRoundedIcon />}
                    onClick={suspendPolicy}
                  >
                    Sospendi polizza
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
