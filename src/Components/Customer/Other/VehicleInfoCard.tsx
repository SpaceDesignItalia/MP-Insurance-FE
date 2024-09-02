import { Button } from "@nextui-org/react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

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
}

export default function VehicleInfoCard({
  VehicleData,
  isVisible,
}: VehicleInfoCardProps) {
  return (
    <>
      {isVisible && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-10 sm:flex-row justify-end items-center">
            <Button
              color="danger"
              radius="sm"
              startContent={<DeleteRoundedIcon />}
              className="w-full sm:w-1/6"
            >
              Elimina veicolo
            </Button>
          </div>

          <div className="-mx-4 px-4 py-8 shadow-sm border-1 ring-1 ring-gray-900/5 sm:mx-0 rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Dati veicolo
            </h2>

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
          </div>
        </div>
      )}
    </>
  );
}
