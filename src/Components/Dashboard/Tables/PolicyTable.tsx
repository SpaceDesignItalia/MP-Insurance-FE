import React from "react";
import dayjs from "dayjs";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  Button,
  Input,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from "@nextui-org/react";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TwoWheelerRoundedIcon from "@mui/icons-material/TwoWheelerRounded";

import AddPolicyModal from "../Other/AddPolicyModal";

// Mappa dei colori per i vari stati della polizza
const statusColorMap = {
  attiva: "success",
  interrotta: "danger",
  scadenza: "warning",
  pagato: "success",
  nonPagato: "warning",
  rate: "primary",
};

// Esempi di dati utente arricchiti
const policies = [
  {
    id: 1,
    name: "Tony Reichert",
    status: "attiva",
    vehicleType: "Auto",
    insuranceType: "Kasko",
    duration: "1 anno",
    premium: "€500",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    email: "tony.reichert@example.com",
    paymentStatus: "pagato",
  },
  {
    id: 2,
    name: "Zoey Lang",
    status: "scadenza",
    vehicleType: "Moto",
    insuranceType: "Responsabilità Civile",
    duration: "6 mesi",
    premium: "€300",
    startDate: "2023-05-01",
    endDate: "2023-11-01",
    email: "zoey.lang@example.com",
    paymentStatus: "nonPagato",
  },
  {
    id: 3,
    name: "Jane Fisher",
    status: "interrotta",
    vehicleType: "Auto",
    insuranceType: "Kasko",
    duration: "1 anno",
    premium: "€550",
    startDate: "2022-06-01",
    endDate: "2023-06-01",
    email: "jane.fisher@example.com",
    paymentStatus: "rate",
  },
  // Aggiungi altri dati come necessario
];

const policyTypeFilter = [
  { value: "", label: "Tutti" },
  { value: "Kasko", label: "Kasko" },
  { value: "Responsabilità Civile", label: "Responsabilità Civile" },
  { value: "Furto e Incendio", label: "Furto e Incendio" },
];

export default function PolicyTable() {
  const columns = [
    { name: "Cliente", uid: "name" },
    { name: "Tipo di veicolo", uid: "vehicleType" },
    { name: "Tipo di polizza", uid: "insuranceType" },
    { name: "Durata", uid: "duration" },
    { name: "Prezzo (€)", uid: "premium" },
    { name: "Data di inizio", uid: "startDate" },
    { name: "Data di fine", uid: "endDate" },
    { name: "Stato", uid: "status" },
    { name: "Stato Pagamento", uid: "paymentStatus" },
    { name: "Azioni", uid: "actions" },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const [vehicleTypeFilter, setVehicleTypeFilter] = React.useState("");
  const [insuranceTypeFilter, setInsuranceTypeFilter] = React.useState("");
  const [durationFilter, setDurationFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState("");

  const filteredpolicies = React.useMemo(() => {
    return policies.filter((user) => {
      return (
        (vehicleTypeFilter === "" || user.vehicleType === vehicleTypeFilter) &&
        (insuranceTypeFilter === "" ||
          user.insuranceType === insuranceTypeFilter) &&
        (durationFilter === "" || user.duration === durationFilter) &&
        (statusFilter === "" || user.status === statusFilter) &&
        (paymentStatusFilter === "" ||
          user.paymentStatus === paymentStatusFilter)
      );
    });
  }, [
    vehicleTypeFilter,
    insuranceTypeFilter,
    durationFilter,
    statusFilter,
    paymentStatusFilter,
  ]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredpolicies.slice(start, end);
  }, [page, filteredpolicies]);

  const pages = Math.ceil(filteredpolicies.length / rowsPerPage);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <div className="flex flex-row gap-5 w-full">
            <Input
              isClearable
              variant="bordered"
              radius="sm"
              className="w-full sm:w-1/3"
              placeholder="Cerca polizza per cliente..."
              startContent={<SearchRoundedIcon />}
            />
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  color="primary"
                  radius="sm"
                  startContent={<FilterListRoundedIcon />}
                >
                  Filtri
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px]">
                <h2 className="font-semibold px-4 pt-3 w-full">Filtri:</h2>
                <div className="p-4 flex flex-col gap-3 w-full">
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Tipologia Veicolo"
                    onChange={(e) => setVehicleTypeFilter(e.target.value)}
                  >
                    <SelectItem key="1" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="2" value="Auto">
                      Auto
                    </SelectItem>
                    <SelectItem key="3" value="Moto">
                      Moto
                    </SelectItem>
                  </Select>
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Assicurazione"
                    onChange={(e) => setInsuranceTypeFilter(e.target.value)}
                  >
                    {policyTypeFilter.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Durata"
                    onChange={(e) => setDurationFilter(e.target.value)}
                  >
                    <SelectItem key="1" value="">
                      Tutte
                    </SelectItem>
                    <SelectItem key="2" value="6 mesi">
                      6 mesi
                    </SelectItem>
                    <SelectItem key="3" value="1 anno">
                      1 anno
                    </SelectItem>
                  </Select>
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Stato"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <SelectItem key="1" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="2" value="attiva">
                      Attiva
                    </SelectItem>
                    <SelectItem key="3" value="scadenza">
                      Scadenza
                    </SelectItem>
                    <SelectItem key="4" value="interrotta">
                      Interrotta
                    </SelectItem>
                  </Select>
                  <Select
                    variant="bordered"
                    radius="sm"
                    placeholder="Stato Pagamento"
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  >
                    <SelectItem key="1" value="">
                      Tutti
                    </SelectItem>
                    <SelectItem key="2" value="pagato">
                      Pagato
                    </SelectItem>
                    <SelectItem key="3" value="nonPagato">
                      Non Pagato
                    </SelectItem>
                    <SelectItem key="4" value="rate">
                      Pagamento a Rate
                    </SelectItem>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              color="primary"
              radius="sm"
              startContent={<SearchRoundedIcon />}
              className="hidden sm:flex"
            >
              Cerca
            </Button>
            <Button
              color="primary"
              radius="sm"
              className="flex sm:hidden"
              isIconOnly
            >
              <SearchRoundedIcon />
            </Button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              color="primary"
              radius="sm"
              endContent={<PostAddRoundedIcon />}
              fullWidth
              onPress={onOpen} // Apre il modal al click
            >
              Crea nuova polizza
            </Button>
          </div>
        </div>
      </div>
    );
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center w-full">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages]);

  const renderCell = React.useCallback((policy, columnKey) => {
    const cellValue = policy[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <div className="font-medium">{cellValue}</div>
            <div className="text-sm text-gray-500">{policy.email}</div>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[policy.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "paymentStatus":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[cellValue]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "vehicleType":
        return (
          <>
            {policy.vehicleType === "Auto" ? (
              <div className="flex flex-row gap-2 justify-center items-center">
                <DirectionsCarRoundedIcon />
                {cellValue}
              </div>
            ) : (
              <div className="flex flex-row gap-2 justify-center items-center">
                <TwoWheelerRoundedIcon />
                {cellValue}
              </div>
            )}
          </>
        );
      case "startDate":
        return dayjs(cellValue).format("DD/MM/YYYY");
      case "endDate":
        return dayjs(cellValue).format("DD/MM/YYYY");
      case "insuranceType":
      case "duration":
      case "premium":
      case "policyNumber":
        return cellValue;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Tooltip content="Dettagli polizza" closeDelay={0} showArrow>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <RemoveRedEyeRoundedIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="warning"
              className="text-white"
              content="Modifica polizza"
              closeDelay={0}
              showArrow
            >
              <span className="text-lg text-warning cursor-pointer active:opacity-50">
                <ModeEditOutlineRoundedIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content="Rimuovi polizza"
              closeDelay={0}
              showArrow
            >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteRoundedIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <AddPolicyModal isOpen={isOpen} onClose={onOpenChange} />
      <div className="flex flex-col gap-5">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Polizze
        </h2>

        <Table
          aria-label="All policies"
          topContent={topContent}
          bottomContent={bottomContent}
          isStriped
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
